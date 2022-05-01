import { Fragment } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline'
import { atom, useAtom } from 'jotai'
import { useMetamaskAuth } from 'features/auth'
import { useChannelPresence } from 'features/ably'
import { shopOverlayAtom } from 'features/shop'

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
          className="fixed inset-0 z-40 flex md:hidden"
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
            <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-dark-0">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 pt-2 -mr-12">
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-semibold text-primary">
                  ETH Emoji Chat
                </h1>
              </div>
              <div className="flex-1 h-0 mt-5 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  <h2 className="px-2 text-gray-400">Users</h2>
                  {members.map((item) => (
                    <a
                      key={item.clientId}
                      className="flex items-center px-2 py-2 text-base font-medium text-gray-200 rounded-md group"
                    >
                      {shortAddress(item.clientId)}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-dark-3 bg-dark-0">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-semibold text-primary">
              ETH Emoji Chat
            </h1>
          </div>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <h2 className="px-2 text-gray-400">Users</h2>
              {members.map((item) => (
                <a
                  key={item.clientId}
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-200 rounded-md group"
                >
                  {shortAddress(item.clientId)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 shadow bg-dark-0">
          <button
            type="button"
            className="px-4 border-r border-dark-3 text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="flex justify-between flex-1 px-4">
            <div className="flex items-center flex-1">
              <div>
                <button
                  onClick={() => setOpen(true)}
                  className="py-1 btn-primary md:hidden"
                >
                  Shop
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="hidden py-1 btn-primary md:flex"
                >
                  Buy more Emoji!
                </button>
              </div>
            </div>
            <div className="flex items-center ml-4 md:ml-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs text-sm rounded-full bg-dark-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="px-3 py-1 text-xl border rounded-2xl border-dark-3 text-primary">
                      {address && shortAddress(address)}
                    </div>
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
                  <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right rounded-md shadow-lg bg-dark-0 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      <a
                        className="block px-4 py-2 text-sm text-gray-300 cursor-pointer"
                        onClick={signOut}
                      >
                        Log Out
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex flex-1">
          <div className="w-full px-4">{children}</div>
        </main>
      </div>
    </>
  )
}
