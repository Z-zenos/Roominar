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
  Switch,
} from '@nextui-org/react';
import Logo from './Logo';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { maskEmail } from '@/src/utils/app.util';
import { useTranslations } from 'next-intl';
import { setUserLocale } from '@/src/utils/locale';
import { getCookie } from 'cookies-next';
import { CiBellOn } from 'react-icons/ci';
import { useGetTotalUnreadNotificationsQuery } from '@/src/api/user.api';
import clsx from 'clsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from './Sheet';
import { NotificationList } from './Notification';

const menuItems = [
  {
    title: 'My Profile',
    url: '/my-profile',
  },
  {
    title: 'My Events',
    url: '/my-events',
  },
  {
    title: 'Host Event',
    url: '/organization/login',
  },
  {
    title: 'Account Settings',
    url: '/account-settings',
  },
  {
    title: 'Help Center',
    url: '/help-center',
  },
  {
    title: 'Log out',
    url: '#',
  },
];

const navbarItems = [
  {
    label: 'home',
    pathname: '/home',
  },
  {
    label: 'search',
    pathname: '/search',
  },
  {
    label: 'hostMyEvent',
    pathname: '/organization/login',
  },
];

interface NavbarProps {
  className?: string;
  hasLogo?: boolean;
}

export default function Navbar({ className, hasLogo = true }: NavbarProps) {
  const t = useTranslations('app');

  const { data: totalUnreadNotifications } =
    useGetTotalUnreadNotificationsQuery();

  const [isEnglish, setIsEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.setItem('rememberMe', 'false');
    if (process.env.NODE_ENV === 'development') {
      signOut({ redirect: false });
      location.reload();
    } else {
      signOut({ redirect: false }).then(() => {
        location.reload();
      });
    }
  };

  return (
    <Sheet>
      <UINavbar
        isBordered
        classNames={{
          wrapper: ['max-w-none px-[15%]', className],
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
          {hasLogo && (
            <NavbarBrand>
              <Logo className='scale-120' />
            </NavbarBrand>
          )}
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
                color={
                  pathname.includes(ni.pathname) ? 'primary' : 'foreground'
                }
              >
                {t(ni.label)}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify='end'>
          <Switch
            defaultSelected={isEnglish}
            size='lg'
            color='success'
            startContent={<span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>}
            endContent={<span>🇻🇳</span>}
            onValueChange={async () => {
              setIsEnglish(!isEnglish);
              await setUserLocale(!isEnglish ? 'en' : 'vi');
            }}
            classNames={{
              thumbIcon: 'font-light text-sm -mt-[2px]',
              startContent: 'text-md ml-[2px] -mt-[2px]',
              endContent: 'text-md mr-[2px] -mt-[2px]',
              wrapper: 'w-16 bg-[#ffff00]',
              thumb: isEnglish && 'translate-x-2',
            }}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <span className={className}>en</span>
              ) : (
                <span className={className}>vi</span>
              )
            }
          />
          <SheetTrigger className='relative cursor-pointer mr-2'>
            <CiBellOn className='w-7 h-7' />
            {!totalUnreadNotifications && (
              <span
                className={clsx(
                  'absolute -top-2 -right-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs',
                  totalUnreadNotifications === 0 ? 'hidden' : 'block',
                  totalUnreadNotifications > 99 && 'w-8 h-5',
                  totalUnreadNotifications > 9 && 'w-6 h-5',
                  totalUnreadNotifications <= 9 && 'w-5 h-5',
                )}
              >
                {totalUnreadNotifications}
                {totalUnreadNotifications > 99 && '+'}
              </span>
            )}
          </SheetTrigger>

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
                    <p className='font-semibold'>
                      {maskEmail(auth?.user?.email)}
                    </p>
                  </DropdownItem>

                  <DropdownItem
                    key='my_profile'
                    href='/my-profile'
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key='my_events'
                    href='/my-events'
                  >
                    My Events
                  </DropdownItem>
                  <DropdownItem key='host_my_event'>Host Event</DropdownItem>
                  <DropdownItem
                    key='account_settings'
                    href='/account-settings'
                  >
                    Account Settings
                  </DropdownItem>
                  <DropdownItem key='help_center'>Help Center</DropdownItem>
                  <DropdownItem
                    key='logout'
                    color='danger'
                    onClick={() => handleLogout()}
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
                href={item.url}
                size='lg'
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </UINavbar>

      <SheetOverlay>
        <SheetContent
          side='right'
          className='min-w-[400px]'
        >
          <SheetHeader>
            <SheetTitle className='text-primary'>Notifications</SheetTitle>
            <SheetDescription />
            <NotificationList />
          </SheetHeader>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  );
}
