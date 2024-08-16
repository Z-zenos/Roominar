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
import { useRouter } from 'next/navigation';
import { RoleCode } from '@/src/constant/role_code.constant';

const menuItems = [
  'Profile',
  'Dashboard',
  'Activity',
  'Analytics',
  'System',
  'Deployments',
  'My Settings',
  'Team Settings',
  'Help & Feedback',
  'Log Out',
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: auth, status } = useSession();
  const router = useRouter();

  const handleLogout = (auth: Session) => {
    localStorage.setItem('rememberMe', 'false');
    if (process.env.NODE_ENV === 'development') {
      signOut({ redirect: false }).then(() => router.push('/home'));
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
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className='sm:hidden' />
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem isActive aria-current='page'>
          <Link href='/home'>Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='/search'>
            Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            Create Event
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        {status === 'authenticated' ? (
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Avatar
                isBordered
                as='button'
                className='transition-transform'
                color='secondary'
                name='Jason Hughes'
                size='sm'
                src={auth?.user?.avatarUrl}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='Profile Actions' variant='flat'>
              <DropdownItem key='profile' className='h-14 gap-2'>
                <p className='font-semibold'>Signed in as</p>
                <p className='font-semibold'>zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key='settings'>My Settings</DropdownItem>
              <DropdownItem key='team_settings'>Team Settings</DropdownItem>
              <DropdownItem key='analytics'>Analytics</DropdownItem>
              <DropdownItem key='system'>System</DropdownItem>
              <DropdownItem key='configurations'>Configurations</DropdownItem>
              <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
              <DropdownItem key='logout' color='danger' onClick={() => handleLogout(auth)}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className='hidden lg:flex'>
              <Link href='/login' underline='hover'>
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color='primary' href='/register' variant='flat' radius='sm'>
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
              color={index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
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
