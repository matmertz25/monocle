import { ReactElement, useContext, useEffect, useState } from 'react'
import Graph from '../components/Graph'
import MainLayout from '../layout/Main'
import { bytesToHex, bytesToUtf8, saveFunction } from '../utils/mantaray'
import { SearchIcon } from '@heroicons/react/solid'
import NodeCard from '../components/NodeCard'
import { MantarayNode } from 'mantaray-js'
import { Utils } from '@ethersphere/bee-js'
import _ from 'lodash'
import { Context } from '../providers/bee'
import TreeNavigator from '../components/TreeNavigator'
import { useSearchParams } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'
import { shortenHash } from '../utils'
import ClipboardCopy from '../components/ClipboardCopy'
import TreeEmpty from '../components/TreeEmpty'
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'

const getLeaf = (key: string, node: any, prefix = ''): any => {
  const { contentAddress, entry, forks, metadata, obfuscationKey, type } = node.node
  const path = prefix + bytesToUtf8(node.prefix)
  const address = contentAddress ? bytesToHex(contentAddress) : ''

  return {
    key: `${key}-${address}`,
    address: address || key,
    prefix: prefix,
    path: path,
    title: bytesToUtf8(node.prefix),
    data: entry,
    metadata,
    obfuscationKey,
    type,
    children: forks ? Object.entries(forks).map(([key, childNode]) => getLeaf(key, childNode, path)) : null,
    attributes: {
      ...metadata,
    },
  }
}

export default function Home(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  const [manifest, setManifest] = useState<any>(new MantarayNode())
  const [data, setData] = useState<any>({
    key: 'Root',
    address: ' ',
    title: 'Root',
    path: '/',
    data: undefined,
  })
  const [hash, setHash] = useState<string | undefined>(undefined)
  const [activeNode, setActiveNode] = useState<any>({})

  const { getMetadata, getChunk } = useContext(Context)
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [metadata, setMetadata] = useState<any | undefined>()
  const [preview, setPreview] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [chunkExists, setChunkExists] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [manifestUnsavedChanges, setManifestUnsavedChanges] = useState<boolean>(false)
  const [postageStamp, setPostageStamp] = useState<string>('')

  // 8f56d76a4c61980232f36bbeb37d908cad80c0184b0fbab2fd75035aed2bd3cf
  useEffect(() => {
    if (!(Utils.isHexString(hash, 64) || Utils.isHexString(hash, 128))) {
      if (hash) {
        setErrorMsg('Not a valid Swarm Reference')
      }
      setIsLoading(false)

      return
    }

    setErrorMsg(null)
    setEntries({})
    setIsLoading(true)
    getMetadata(hash)
      .then(({ metadata, preview, entries, node }) => {
        // eslint-disable-next-line no-console
        console.log(metadata, preview, entries, node)
        setManifest(node)
        setMetadata(metadata)
        setPreview(preview)
        setEntries(entries)
        setIsLoading(false)
      })
      .catch(() => {
        // There are no metadata, but maybe there is a retrievable file
        getChunk(hash)
          .then(d => setChunkExists(Boolean(d.byteLength)))
          .catch(() => setChunkExists(false))
          .finally(() => setIsLoading(false))
      })
  }, [getChunk, getMetadata, hash])

  useEffect(() => {
    const hash = searchParams.get('hash')

    if (hash) {
      setHash(hash)
    }
  }, [searchParams])

  useEffect(() => {
    const data = {
      key: 'Root',
      address: manifest?.contentAddress ? bytesToUtf8(manifest.contentAddress) : ' ',
      title: manifest?.contentAddress ? bytesToUtf8(manifest.contentAddress) : 'Root',
      path: '/',
      data: manifest?.entry,
      children: manifest?.forks ? Object.entries(manifest.forks).map(([key, node]) => getLeaf(key, node)) : null,
    }
    setData(data)
  }, [manifest])

  const handleNodeClick = (node: any) => {
    // eslint-disable-next-line no-console
    console.log(node)
    setActiveNode(node)
  }

  const handleManifestSearch = (hash: string) => {
    const currentHistoricalSwarmHashes = localStorage.getItem('historicalSwarmHashes')
    const historicalSwarmHashes = currentHistoricalSwarmHashes ? JSON.parse(currentHistoricalSwarmHashes) : []

    historicalSwarmHashes.push(hash)

    localStorage.setItem('historicalSwarmHashes', JSON.stringify(historicalSwarmHashes))
    setHash(hash)
  }

  const handleManifestUpdate = (manifest: any) => {
    setManifest(_.cloneDeep(manifest))
    setManifestUnsavedChanges(true)
    // eslint-disable-next-line no-console
    console.log(manifest)
  }

  const handleManifestSave = async () => {
    setManifestUnsavedChanges(false)
    await manifest.save(saveFunction)
  }

  return (
    <MainLayout>
      <>
        {/* Secondary column (hidden on smaller screens) */}
        <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
          <div className="h-full relative flex flex-col w-96 border-r border-gray-200 overflow-y-auto">
            <div className="mb-2">
              <div className="flex-1 flex mb-2">
                <form className="px-4 w-full flex md:ml-0 p-2 border-b" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search all files
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <SearchIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      name="search-field"
                      id="search-field"
                      className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400"
                      type="search"
                      placeholder="Paste swarm hash"
                      value={hash}
                      onChange={e => handleManifestSearch(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="px-5 py-4">
                {isLoading ? (
                  <div className="text-center mt-6">
                    <div
                      className=" animate-spin spinner-border inline-block w-10 h-10 border-indigo-200 border-t-indigo-400 border-4 rounded-full"
                      role="status"
                    >
                      <span className="hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {errorMsg && <ErrorAlert messages={[errorMsg]} />}
                    {data.children ? (
                      <>
                        <div className="table mb-2">
                          <div className="mb-1 table-cell" style={{ fontSize: '0.875rem' }}>
                            <span className="text-gray-800 font-semibold align-middle">Manifest</span>
                            <span className="ml-2 font-normal text-gray-500 align-middle">
                              {shortenHash(metadata.hash)}
                            </span>
                            <ClipboardCopy value={metadata.hash} />
                          </div>
                        </div>
                        <TreeNavigator data={data} handleNodeClick={handleNodeClick} />
                        {manifestUnsavedChanges && (
                          <div className="flex mt-4">
                            <div className="relative rounded-md shadow-sm mr-1">
                              <input
                                type="text"
                                name="account-number"
                                id="account-number"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="postage stamp"
                                onChange={e => setPostageStamp(e.target.value)}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                            </div>
                            <div className="ml-1">
                              <button
                                onClick={handleManifestSave}
                                type="button"
                                disabled={!postageStamp}
                                className={`disabled:opacity-75 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                              >
                                Save changes
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <TreeEmpty />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
        {/* Primary column */}
        <section
          aria-labelledby="primary-heading"
          className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
        >
          <h1 id="primary-heading" className="sr-only">
            Home
          </h1>
          <div style={{ flexGrow: '1' }}>
            <Graph
              initialDepth={1}
              data={data}
              activeNode={activeNode}
              handleNodeClick={handleNodeClick}
              isLoading={isLoading}
            />
            <NodeCard
              hash={hash || ''}
              node={activeNode}
              manifest={manifest}
              handleManifestUpdate={handleManifestUpdate}
              setActiveNode={setActiveNode}
            />
          </div>
        </section>
      </>
    </MainLayout>
  )
}
