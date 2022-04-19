import { Fragment } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline'
import { atom, useAtom } from 'jotai'
import { useMetamaskAuth } from 'features/auth'
import { useChannelPresence } from 'features/ably/useChannel'
import { shopOverlayAtom } from 'features/shop/ui/overlay'

const sidebarAtom = atom(false)

const shortAddress = (address: string) =>
  address.slice(0, 6) + '...' + address.slice(-4)

export const ChatLauout: React.FC = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom)
  const [isOpen, setOpen] = useAtom(shopOverlayAtom)
  const [{ address, error, loading }, signIn, signOut] = useMetamaskAuth()

  const members = useChannelPresence('chat-demo')

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-2xl font-semibold text-purple-600">
                  ETH Emoji Chat
                </h1>
                {/* <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    alt="Workflow"
                  /> */}
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  <h2 className="px-2 text-gray-400">Users</h2>
                  {members.map((item) => (
                    <a
                      key={item.clientId}
                      // href={item.href}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      // className={classNames(
                      //   item.current
                      //     ? 'bg-gray-100 text-gray-900'
                      //     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      //   'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                      // )}
                    >
                      {shortAddress(item.clientId)}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-semibold text-purple-600">
              ETH Emoji Chat
            </h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <h2 className="px-2 text-gray-400">Users</h2>
              {members.map((item) => (
                <a
                  key={item.clientId}
                  // href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  // className={classNames(
                  //   item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  //   'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  // )}
                >
                  {/* <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    /> */}
                  {shortAddress(item.clientId)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div>
                <button
                  onClick={() => setOpen(true)}
                  className="btn-primary py-1 md:hidden"
                >
                  Shop
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="btn-primary py-1 hidden md:flex"
                >
                  Buy more Emoji!
                </button>
              </div>
              {/* <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form> */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button> */}

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="border rounded-2xl border-black text-xl py-1 px-3">
                      {address && shortAddress(address)}
                    </div>
                    {/* <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      /> */}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                        onClick={signOut}
                      >
                        Log Out
                      </a>
                    </Menu.Item>
                    {/* {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))} */}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 flex">
          {/* <div className="py-6"> */}
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div> */}
          <div className="w-full px-4">
            {children}
            {/* Replace with your content */}
            {/* <div className="py-4">
                  <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                </div> */}
            {/* /End replace */}
          </div>
          {/* </div> */}
        </main>
      </div>
    </>
  )
}
