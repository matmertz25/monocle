import { createContext, ReactChild, ReactElement } from 'react'
import { Bee, Data, Reference } from '@ethersphere/bee-js'
import { loadAllNodes } from 'mantaray-js'
import { ManifestJs } from '@ethersphere/manifest-js'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import { BEE_HOSTS, META_FILE_NAME, POSTAGE_STAMP, PREVIEW_FILE_NAME } from '../constants'
import { packageFile } from '../utils/SwarmFile'
import { detectIndexHtml } from '../utils/file'
import { MantarayNode } from 'mantaray-js'
import { loadFunction } from '../utils/mantaray'

const randomIndex = Math.floor(Math.random() * BEE_HOSTS.length)
const randomBee = new Bee(BEE_HOSTS[randomIndex])

interface ContextInterface {
  upload: (files: any[], metadata: any, preview?: Blob) => Promise<Reference>
  getMetadata: (hash: Reference | string) => Promise<{
    metadata: any
    preview?: string
    entries: Record<string, string>
    node: any
  }>
  getChunk: (hash: Reference | string) => Promise<Data>
  getDownloadLink: (hash: Reference | string) => string
  getFolderDownloadLink: (hash: Reference | string, path: string) => string
  download: (hash: Reference | string, entries: Record<string, string>, metadata?: any) => Promise<void>
}

const initialValues: ContextInterface = {
  upload: () => Promise.reject(),
  getMetadata: () => Promise.reject(),
  getChunk: () => Promise.reject(),
  getDownloadLink: () => '',
  getFolderDownloadLink: () => '',
  download: () => Promise.resolve(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

function hashToIndex(hash: Reference | string) {
  const n = parseInt(hash.slice(0, 8), 16)

  return n % BEE_HOSTS.length
}

export function Provider({ children }: Props): ReactElement {
  const upload = async (files: any[], metadata: any, preview?: Blob) => {
    const fls = files.map(packageFile) // Apart from packaging, this is needed to not modify the original files array as it can trigger effects
    const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(files) || undefined
    const lastModified = files[0].lastModified

    // We want to store only some metadata
    const mtd: any = {
      name: metadata.name,
      size: metadata.size,
    }

    // Type of the file only makes sense for a single file
    if (files.length === 1) mtd.type = metadata.type

    fls.push(
      new File([JSON.stringify(mtd)], META_FILE_NAME, {
        type: 'application/json',
        lastModified,
      }),
    )

    if (preview) {
      const previewFile = new File([preview], PREVIEW_FILE_NAME, {
        lastModified,
      })
      fls.push(previewFile)
    }

    const { reference } = await randomBee.uploadFiles(POSTAGE_STAMP, fls, { indexDocument })
    const hashIndex = hashToIndex(reference)

    if (hashIndex !== randomIndex) {
      const bee = new Bee(BEE_HOSTS[hashIndex])
      await bee.uploadFiles(POSTAGE_STAMP, fls, { indexDocument })
    }

    return reference
  }

  const download = async (hash: Reference | string, entries: Record<string, string>, metadata?: any) => {
    const hashIndex = hashToIndex(hash)
    const bee = new Bee(BEE_HOSTS[hashIndex])

    if (Object.keys(entries).length <= 1) {
      window.open(getDownloadLink(hash), '_blank')
    } else {
      const zip = new JSZip()
      for (const [path, hash] of Object.entries(entries)) {
        zip.file(path, await bee.downloadData(hash))
      }
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, metadata?.name + '.zip')
    }
  }

  const getMetadata = async (
    hash: Reference | string,
  ): Promise<{
    metadata: any
    preview?: string
    entries: Record<string, string>
    node: any
  }> => {
    let metadata: any = { size: 0, type: 'unknown', name: hash, isWebsite: false }
    let entries: Record<string, string> = {}
    let preview
    let node

    const hashIndex = hashToIndex(hash)
    const bee = new Bee(BEE_HOSTS[hashIndex])

    try {
      const mtdt = await bee.downloadFile(hash, META_FILE_NAME)
      metadata = { ...metadata, ...(JSON.parse(mtdt.data.text()) as any) }
    } catch (e) {} // eslint-disable-line no-empty

    try {
      const manifestJs = new ManifestJs(bee)

      let isManifest
      try {
        const data: any = await bee.downloadData(hash)
        const mantarayNode = new MantarayNode()
        mantarayNode.deserialize(data)
        await loadAllNodes(loadFunction, mantarayNode)
        isManifest = true
        node = mantarayNode
      } catch (e) {
        isManifest = false
      }

      if (!isManifest) throw Error('The specified hash does not contain valid content.')
      entries = await manifestJs.getHashes(hash)

      const indexDocument = await manifestJs.getIndexDocumentPath(hash)

      metadata.isWebsite = Boolean(indexDocument && /.*\.html?$/i.test(indexDocument)) // only html documents can be websites

      preview = getPreview(entries, hash)

      // Erase the files added by the gateway
      delete entries[META_FILE_NAME]
      delete entries[PREVIEW_FILE_NAME]

      metadata.count = Object.keys(entries).length

      if (metadata.count > 1) metadata.type = 'folder'
    } catch (e) {} // eslint-disable-line no-empty

    metadata.hash = hash

    return { metadata, preview, entries, node }
  }

  const getPreview = (entries: Record<string, string>, hash: Reference | string): string | undefined => {
    if (!entries[PREVIEW_FILE_NAME]) return

    const hashIndex = hashToIndex(hash)

    return `${BEE_HOSTS[hashIndex]}/bzz/${hash}/${PREVIEW_FILE_NAME}`
  }

  const getChunk = (hash: Reference | string): Promise<Data> => {
    const hashIndex = hashToIndex(hash)
    const bee = new Bee(BEE_HOSTS[hashIndex])

    return bee.downloadData(hash)
  }

  const getDownloadLink = (hash: Reference | string) => {
    const hashIndex = hashToIndex(hash)

    return `${BEE_HOSTS[hashIndex]}/bzz/${hash}`
  }

  const getFolderDownloadLink = (hash: Reference | string, path: string) => {
    const hashIndex = hashToIndex(hash)

    return `${BEE_HOSTS[hashIndex]}/bzz/${hash}/${path}`
  }

  return (
    <Context.Provider value={{ getMetadata, upload, getChunk, getDownloadLink, getFolderDownloadLink, download }}>
      {children}
    </Context.Provider>
  )
}
