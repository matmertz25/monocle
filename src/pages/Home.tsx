import { ReactElement, useContext, useEffect, useState } from 'react'
import Graph from '../components/Graph'
import MainLayout from '../layout/Main'
import { bytesToHex, bytesToUtf8, loadManifest } from '../utils/mantaray'
import { SearchIcon } from '@heroicons/react/solid'
import NodeCard from '../components/NodeCard'
import { MantarayNode } from 'mantaray-js'
import { Utils } from '@ethersphere/bee-js'
import _ from 'lodash'
import { Context } from '../providers/bee'
import TreeNavigator from '../components/TreeNavigator'

const getLeaf = (key: string, node: any): any => {
  const { contentAddress, entry, forks, metadata, obfuscationKey, type } = node.node

  return {
    key,
    name: bytesToHex(contentAddress) || key,
    path: bytesToUtf8(node.prefix),
    title: bytesToUtf8(node.prefix),
    data: entry,
    metadata,
    obfuscationKey,
    type,
    children: forks ? Object.entries(forks).map(([key, node]) => getLeaf(key, node)) : null,
    attributes: {
      ...metadata,
    },
  }
}

export default function Home(): ReactElement {
  const [manifest, setManifest] = useState<any>(new MantarayNode())
  const [data, setData] = useState<any>({
    key: 'Root',
    name: 'Root',
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

  // 8f56d76a4c61980232f36bbeb37d908cad80c0184b0fbab2fd75035aed2bd3cf
  useEffect(() => {
    if (!(Utils.isHexString(hash, 64) || Utils.isHexString(hash, 128))) {
      setErrorMsg('Not a valid Swarm Reference')
      setIsLoading(false)

      return
    }

    loadManifest(hash).then(res => setManifest(res))

    setErrorMsg(null)
    setEntries({})
    setIsLoading(true)
    // getMetadata(hash)
    //   .then(({ metadata, preview, entries, node }) => {
    //     // eslint-disable-next-line no-console
    //     console.log(metadata, preview, entries, node)
    //     setManifest(node)
    //     setMetadata(metadata)
    //     setPreview(preview)
    //     setEntries(entries)
    //     setIsLoading(false)
    //   })
    //   .catch(() => {
    //     // There are no metadata, but maybe there is a retrievable file
    //     getChunk(hash)
    //       .then(d => setChunkExists(Boolean(d.byteLength)))
    //       .catch(() => setChunkExists(false))
    //       .finally(() => setIsLoading(false))
    //   })
  }, [getChunk, getMetadata, hash])

  useEffect(() => {
    const data = {
      key: 'Root',
      name: manifest?.contentAddress ? bytesToUtf8(manifest.contentAddress) : 'Root',
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
                <TreeNavigator data={data} handleNodeClick={handleNodeClick} />
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
            <Graph initialDepth={1} data={data} handleNodeClick={handleNodeClick} />
            <NodeCard
              hash={hash}
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
