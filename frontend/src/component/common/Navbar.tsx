'use client';

import React, { useState } from 'react';
import {
  Navbar as UINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import Logo from './Logo';
import { signOut, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { RoleCode } from '@/src/constant/role_code.constant';
import useWindowDimensions from '@/src/hook/useWindowDimension';

const menuItems = [
  'My Profile',
  'My Events',
  'Host Event',
  'Account Settings',
  'Help Center',
  'Log Out',
];

const navbarItems = [
  {
    label: 'Home',
    pathname: '/home',
  },
  {
    label: 'Search',
    pathname: '/search',
  },
  {
    label: 'Host your event',
    pathname: '/organization/login',
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: auth, status } = useSession();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const handleLogout = (auth: Session) => {
    localStorage.setItem('rememberMe', 'false');
    if (process.env.NODE_ENV === 'development') {
      signOut({ redirect: false });
    } else {
      signOut(
        auth.user.roleCode == RoleCode.ORGANIZER
          ? { callbackUrl: '/organization/login' }
          : {
              callbackUrl: '/home',
            },
      ).then(() => {
        router.refresh();
      });
    }
  };

  return (
    <UINavbar
      isBordered
      classNames={{
        wrapper: ['max-w-none px-[15%]'],
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='sm:hidden'
        />
        <NavbarBrand>
          <Logo className='scale-120' />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex gap-4'
        justify='center'
      >
        {navbarItems.map((ni, i) => (
          <NavbarItem
            isActive={pathname.includes(ni.pathname)}
            aria-current='page'
            key={`nbi-${i}`}
          >
            <Link
              href={ni.pathname}
              color={pathname.includes(ni.pathname) ? 'primary' : 'foreground'}
            >
              {ni.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        {status === 'authenticated' ? (
          <div className='flex justify-end items-center gap-x-4'>
            {width > 800 && (
              <span className='text-primary'>Hi, {auth.user.firstName}</span>
            )}
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as='button'
                  className='transition-transform'
                  color='secondary'
                  name={auth.user.firstName + ' ' + auth.user.lastName}
                  size='sm'
                  src={auth?.user?.avatarUrl}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Profile Actions'
                variant='flat'
              >
                <DropdownItem
                  key='profile'
                  className='h-14 gap-2'
                >
                  <p className='font-semibold'>Signed in as</p>
                  <p className='font-semibold'>{auth.user?.email}</p>
                </DropdownItem>
                <DropdownItem key='my_profile'>My Profile</DropdownItem>
                <DropdownItem key='my_events'>My Events</DropdownItem>
                <DropdownItem key='host_my_event'>Host Event</DropdownItem>
                <DropdownItem key='account_settings'>
                  Account Settings
                </DropdownItem>
                <DropdownItem key='help_center'>Help Center</DropdownItem>
                <DropdownItem
                  key='logout'
                  color='danger'
                  onClick={() => handleLogout(auth)}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <>
            <NavbarItem className='hidden lg:flex'>
              <Link
                href='/login'
                underline='hover'
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color='primary'
                href='/register'
                variant='flat'
                radius='sm'
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className='w-full'
              color={
                index === 2
                  ? 'primary'
                  : index === menuItems.length - 1
                    ? 'danger'
                    : 'foreground'
              }
              href='#'
              size='lg'
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </UINavbar>
  );
}
