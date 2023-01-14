import React, { useContext, useEffect, useState } from 'react';
import { BsFillSunFill, BsMoonFill } from 'react-icons/bs';
import { UIContext } from '../contexts/UIContext';
import jsCookie from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import classnames from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/react';

type Props = {};

const Navbar = (props: Props) => {
  const { state, dispatch } = useContext(UIContext);
  const { darkMode, openDrawer } = state;
  const { data: session } = useSession();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
    return () => {};
  }, [darkMode]);

  const [show, setShow] = useState(false);

  const transitionNavbar = () => {
    setShow(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavbar);
    return () => window.removeEventListener('scroll', transitionNavbar);
  }, []);

  const navLinks = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Live Sessions',
      href: '/sessions',
    },
    {
      name: 'Take a Session',
      href: '/take-session',
    },
    {
      name: 'Support Us',
      href: '/support-us',
    },
    {
      name: 'Contact us',
      href: '/contact-us',
    },
  ];

  return (
    <div
      className={classnames(
        'navbar fixed z-20 dark:bg-gray-1100',
        show ? 'dark:backdrop-blur-lg dark:bg-opacity-80' : ''
      )}
    >
      <div className="navbar-start">
        <Link href="/" className="navbar-item">
          <Image
            src="/assets/DcodeLogo.svg"
            height={60}
            width={100}
            alt="Decode Logo"
          />
        </Link>
      </div>
      <div className="navbar-center">
        {navLinks.map((navLink, idx) => {
          const { name, href } = navLink;
          return (
            <Link
              key={idx}
              href={href}
              className="navbar-item dark:text-gray-700 dark:hover:text-gray-50 whitespace-nowrap"
            >
              {name}
            </Link>
          );
        })}
      </div>
      <div className="navbar-end space-x-4 cursor-pointer dark:text-gray-100">
        {dark ? (
          <BsFillSunFill className="text-lg" onClick={darkModeChangeHandler} />
        ) : (
          <BsMoonFill className="text-lg" onClick={darkModeChangeHandler} />
        )}

        {session ? (
          <div className="avatar avatar-ring avatar-sm">
            <div className="dropdown-container">
              <div className="dropdown">
                <div
                  className="btn relative btn-ghost cursor-pointer hover:bg-inherit"
                  tabIndex={0}
                >
                  <Image
                    fill
                    className="object-cover"
                    src={session.user?.image!}
                    alt={session.user?.name!}
                  />
                </div>
                <div className="dropdown-menu dark:bg-gray-1000 dropdown-menu-bottom-left">
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="dropdown-item text-sm dark:hover:bg-gray-900"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account-settings"
                    tabIndex={-1}
                    className="dropdown-item text-sm dark:hover:bg-gray-900"
                  >
                    Account settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    tabIndex={-1}
                    className="dropdown-item text-sm dark:hover:bg-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="btn-rounded btn btn-primary"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
