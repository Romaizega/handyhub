import {
  Disclosure, DisclosureButton, DisclosurePanel,
  Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/handyman.png'
import { logoutUser } from '../features/auth/authThunk'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, accessToken } = useSelector(s => s.auth)
  const isAuthed = Boolean(user && accessToken)
  const role = user?.role // 'client' | 'worker'

  const baseNav = [
    { name: 'Home', to: '/', private: false },
    { name: 'Jobs', to: '/jobs', private: false },
  ]

  const roleNav = isAuthed
    ? role === 'client'
      ? [{ name: 'My Jobs', to: '/my-jobs', private: true }]
      : [{ name: 'Offers', to: '/offers', private: true }]
    : []

  const navigation = [...baseNav, ...roleNav]

  const Logout =  () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <Disclosure as="nav" className="relative bg-base-100 border-b border-base-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-base-content/70 hover:bg-base-200 hover:text-base-content focus:outline-2 focus:-outline-offset-1 focus:outline-primary">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Desktop nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img
                alt="HandyHub"
                src={logo}
                className="h-8 w-auto"
              />
              <span className="font-bold">HandyHub</span>
            </Link>

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      classNames(
                        isActive ? 'bg-base-200 text-base-content' : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: notifications + profile / auth links */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthed && (
              <button
                type="button"
                className="relative rounded-full p-1 text-base-content/70 hover:text-base-content focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
            )}

            {/* Profile dropdown or Login/Register */}
            {isAuthed ? (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <img
                    alt=""
                    src=""
                    className="size-8 rounded-full outline -outline-offset-1 outline-base-300"
                  />
                  <span className="hidden sm:block text-sm">{user?.username}</span>
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-base-100 py-1 shadow-lg outline outline-black/5 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
                >
                  <MenuItem>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-base-200"
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm hover:bg-base-200"
                    >
                      Settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={Logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-base-200"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-neutral">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={NavLink}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  isActive ? 'bg-base-200 text-base-content' : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )
              }
            >
              {item.name}
            </DisclosureButton>
          ))}
          {!isAuthed && (
            <>
              <DisclosureButton as={NavLink} to="/login" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-base-200">
                Login
              </DisclosureButton>
              <DisclosureButton as={NavLink} to="/register" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-base-200">
                Register
              </DisclosureButton>
            </>
          )}
          {isAuthed && (
            <DisclosureButton
              as="button"
              onClick={Logout}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium hover:bg-base-200"
            >
              Sign out
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
