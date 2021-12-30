import { MantarayNode } from 'mantaray-js'
import { ReactElement, useState, useContext } from 'react'
import { saveFunction, utf8ToBytes } from '../utils/mantaray'
import NodeEmpty from './NodeEmpty'
import { PaperClipIcon } from '@heroicons/react/solid'
import ForkForm from './ForkForm'
import { Context } from '../providers/bee'

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
                <button
                  onClick={() => handleRemoveFork(node.path)}
                  type="button"
                  className="mr-3 inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent  text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={handleToggleCreate}
                  type="button"
                  className="mr-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Fork
                </button>
                <button
                  onClick={handleToggleEdit}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
          <div className="px-5 pt-4 pb-6 border-b border-gray-200 sm:px-6">
            {creating || editing ? (
              <ForkForm
                node={creating ? { attributes: {} } : node}
                prefixPath={node.path}
                handleAddFork={handleAddFork}
              />
            ) : (
              <div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Path</dt>
                    <dd className="mt-1 text-sm text-gray-900">{node.path}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{node.type}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Reference</dt>
                    <dd className="mt-1 text-sm text-gray-900">{node.address}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Metadata</dt>
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
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Attachments</dt>
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
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              Download
                            </a>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
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
