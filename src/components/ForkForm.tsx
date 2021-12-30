import { ReactElement, useState } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'

export default function ForkForm({ node, handleAddFork }: { node: any; handleAddFork: any }): ReactElement {
  const [attributeCount, setAttributeCount] = useState(node.attributes?.length || 1)
  const [prefix, setPrefix] = useState(node.path || '')

  return (
    <div className="pb-6">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                Prefix
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="path"
                  id="path"
                  autoComplete="given-name"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                Metadata
              </label>
            </div>
            {node?.attributes &&
              Object.entries(node.attributes).map(([key, value]: [key: string, value: any], idx) => (
                <>
                  <div className="sm:col-span-6 flex -mt-1">
                    <div>
                      {idx === 0 && (
                        <label htmlFor="first-name" className="mb-1 block text-sm font-medium text-gray-500">
                          Key
                        </label>
                      )}
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        defaultValue={key}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="ml-3">
                      {idx === 0 && (
                        <label htmlFor="first-name" className="mb-1 block text-sm font-medium text-gray-500">
                          Value
                        </label>
                      )}
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        defaultValue={value}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className={idx === 1 ? 'mt-1' : 'mt-7'}>
                      <button
                        type="button"
                        className="inline-block align-middle ml-3 items-center p-1 border-transparent rounded-full shadow-sm text-red-700 border-2 border-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {idx === Object.entries(node.attributes).length - 1 && (
                    <div className="sm:col-span-6">
                      <button
                        // onClick={() => handleAddFork()}
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                        Add
                      </button>
                    </div>
                  )}
                </>
              ))}

            <div className="sm:col-span-6">
              <label htmlFor="entry" className="block text-sm font-medium text-gray-700">
                Entry
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <button
                onClick={() =>
                  handleAddFork({ path: prefix, entry: new Uint8Array(32), metadata: { test: 'testvalue' } })
                }
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
