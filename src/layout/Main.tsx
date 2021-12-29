import { Fragment, ReactElement, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CogIcon, HomeIcon, XIcon } from '@heroicons/react/outline'
import Header from './Header'
import BlockLogo from '../assets/blockLogo.png'
import { useLocation } from 'react-router-dom'
import { classNames } from '../utils'
import { Link } from 'react-router-dom'

const sidebarNavigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function Main({ children }: { children: ReactElement }): ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const location = useLocation()

  return (
    <>
      <div className="h-full flex">
        {/* Narrow sidebar */}
        <div className="hidden w-28 bg-indigo-700 overflow-y-auto md:block">
          <div className="w-full py-6 flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-12 w-auto" src={BlockLogo} alt="Monocle" />
            </div>
            <div className="flex-1 mt-6 w-full px-2 space-y-1">
              {sidebarNavigation.map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium',
                  )}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      location.pathname === item.href ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                      'h-6 w-6',
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 px-4 flex items-center">
                    <img className="h-12 w-auto" src={BlockLogo} alt="Monocle" />
                  </div>
                  <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                    <nav className="h-full flex flex-col">
                      <div className="space-y-1">
                        {sidebarNavigation.map(item => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              location.pathname === item.href
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                              'group py-2 px-3 rounded-md flex items-center text-sm font-medium',
                            )}
                            aria-current={location.pathname === item.href ? 'page' : undefined}
                          >
                            <item.icon
                              className={classNames(
                                location.pathname === item.href
                                  ? 'text-white'
                                  : 'text-indigo-300 group-hover:text-white',
                                'mr-3 h-6 w-6',
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setMobileMenuOpen={setMobileMenuOpen} />

          {/* Main area */}
          <main className="min-w-0 flex-1 border-gray-200 lg:flex overflow-hidden">{children}</main>
        </div>
      </div>
    </>
  )
}
