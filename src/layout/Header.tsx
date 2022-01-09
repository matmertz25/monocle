import { MenuAlt2Icon, PlusSmIcon } from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { Utils } from '@ethersphere/bee-js'
import { useSearchParams } from 'react-router-dom'

export default function Header({ setMobileMenuOpen }: { setMobileMenuOpen: any }) {
  const [hash, setHash] = useState<string | undefined>(undefined)
  const [searchParams, setSearchParams] = useSearchParams()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!(Utils.isHexString(hash, 64) || Utils.isHexString(hash, 128))) {
      setErrorMsg('Not a valid Swarm Reference')

      return
    }

    setErrorMsg(null)
    setSearchParams({ hash })
  }, [hash, setSearchParams])

  return (
    <header className="w-full">
      <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 flex justify-between px-4 sm:px-6">
          <div className="lg:invisible flex-1 flex">
            <form className="w-full flex md:ml-0" action="#" method="GET">
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
                  placeholder="Search"
                  type="search"
                  onChange={e => setHash(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            <button
              type="button"
              className="flex bg-indigo-600 p-1 rounded-full items-center justify-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusSmIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Add file</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
