import { MantarayNode } from 'mantaray-js'
import { ReactElement, useState, useContext } from 'react'
import { getNodeTypes, isEdgeTypeNode, isValueTypeNode, saveFunction, utf8ToBytes } from '../utils/mantaray'
import NodeEmpty from './NodeEmpty'
import { ExternalLinkIcon, PaperClipIcon } from '@heroicons/react/solid'
import ForkForm from './ForkForm'
import { Context } from '../providers/bee'
import NodeDropdown from './NodeDropdown'
import ClipboardCopy from './ClipboardCopy'

export default function NodeCard({
  hash,
  node,
  manifest,
  handleManifestUpdate,
  setActiveNode,
}: {
  hash: string
  node: any
  manifest: MantarayNode
  handleManifestUpdate: any
  setActiveNode: any
}): ReactElement {
  const { download, getFolderDownloadLink } = useContext(Context)

  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleToggleCreate = () => {
    setCreating(!creating)
  }

  const handleToggleEdit = () => {
    setEditing(!editing)
  }

  const handleAddFork = ({ path, entry, metadata }: { path: string; entry: any; metadata: any }) => {
    const bytesPath = utf8ToBytes(path)
    manifest.addFork(bytesPath, entry, metadata)
    handleManifestUpdate(manifest)
    handleToggleCreate()
    // manifest.save(saveFunction)
  }

  const handleRemoveFork = (path: string) => {
    const bytesPath = utf8ToBytes(path)
    manifest.removePath(bytesPath)
    handleManifestUpdate(manifest)
    setActiveNode({})
  }

  return (
    <div className="w-full border-gray-200">
      {node.path ? (
        <div>
          <div className="bg-white px-5 py-4 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-0">Node</h3>
              </div>
              <div className="ml-4 mt-4 flex-shrink-0">
                <NodeDropdown
                  node={node}
                  handleRemoveFork={handleRemoveFork}
                  handleToggleCreate={handleToggleCreate}
                  handleToggleEdit={handleToggleEdit}
                />
              </div>
            </div>
          </div>
          <div className="px-5 pt-4 pb-6 border-b border-gray-200 sm:px-6">
            {creating || editing ? (
              <ForkForm
                node={creating ? { attributes: {} } : node}
                prefixPath={node.path}
                handleAddFork={handleAddFork}
                handleToggleCreate={handleToggleCreate}
                handleToggleEdit={handleToggleEdit}
              />
            ) : (
              <div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-600">Path</dt>
                    <dd className="mt-1 text-sm text-gray-900">{node.path}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-600">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="mr-2">{node.type}</span>
                      {getNodeTypes(node.type).map(type => (
                        <span
                          key={type}
                          className="mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {type}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-600">Reference</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {isEdgeTypeNode(node.type) ? (
                        <a
                          href={`/?hash=${node.address}`}
                          target="_blank"
                          className="font-medium text-blue-600 hover:text-blue-500"
                          rel="noreferrer"
                        >
                          {node.address}
                        </a>
                      ) : (
                        <div className="table">
                          <div className="mb-1 table-cell" style={{ fontSize: '0.875rem' }}>
                            <span className="ml-2 font-normal text-gray-500 align-middle">{node.address}</span>
                            <ClipboardCopy value={node.address} />
                          </div>
                        </div>
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-600">Metadata</dt>
                    <div className="mt-5 border-t border-gray-200">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        {node?.attributes &&
                          Object.entries(node.attributes).map(([key, value]: [key: string, value: any]) => (
                            <div key={key} className="mt-1 py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-normal text-gray-500">{key}</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
                            </div>
                          ))}
                      </dl>
                    </div>
                  </div>
                  {isValueTypeNode(node.type) && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-600">Entry</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          <li key={node.path} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <span className="ml-2 flex-1 w-0 truncate">{node.title}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a
                                href={getFolderDownloadLink(hash, node.path)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex font-medium text-blue-600 hover:text-blue-500"
                              >
                                <span>Open</span>
                                <ExternalLinkIcon className="h-5 w-5 ml-1" />
                              </a>
                            </div>
                            {/* <div className="ml-4 flex-shrink-0">
                              <a
                                href={getFolderDownloadLink(hash, node.path)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                Download
                              </a>
                            </div> */}
                          </li>
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full px-6 py-8">
          <NodeEmpty />
        </div>
      )}
    </div>
  )
}
