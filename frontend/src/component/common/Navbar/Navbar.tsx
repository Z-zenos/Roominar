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
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { maskEmail } from '@/src/utils/app.util';
import { useTranslations } from 'next-intl';
import { setUserLocale } from '@/src/utils/locale';
import { getCookie } from 'cookies-next';
import { useGetTotalUnreadNotificationsQuery } from '@/src/api/user.api';

import { useRemoveNotificationDeviceTokenMutation } from '@/src/api/notification.api';
import { getStoredFcmToken } from '@/src/hooks/useNotification';
import Logo from '../Logo';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '../Sheet';
import { NotificationIcon, NotificationList } from '../Notification';

const menuItems = [
  {
    title: 'Trang chủ',
    url: '/home',
  },
  {
    title: 'Tìm kiếm',
    url: '/search',
  },
  {
    title: 'Tổ chức sự kiện',
    url: '/organization/login',
  },
  {
    title: 'Help Center',
    url: '/help-center',
  },
  {
    title: 'Đăng nhập',
    url: '/login',
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
  const t = useTranslations('common');
  const router = useRouter();

  const [isEnglish, setIsEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const {
    data: totalUnreadNotifications,
    refetch: refetchTotalUnreadNotifications,
  } = useGetTotalUnreadNotificationsQuery(status === 'authenticated');
  const { trigger: removeToken } = useRemoveNotificationDeviceTokenMutation();

  const handleLogout = async () => {
    localStorage.setItem('rememberMe', 'false');

    // Get the FCM token and remove it if available
    const fcmToken = getStoredFcmToken();
    if (fcmToken) {
      try {
        await removeToken({ logoutRequest: { fcmToken } });
        localStorage.removeItem('fcm_token');
      } catch (error) {
        console.error('Error removing FCM token:', error);
      }
    }

    // Then logout
    if (process.env.NODE_ENV === 'development') {
      signOut({ redirect: false });
      router.push('/home');
      location.reload();
    } else {
      signOut({ redirect: false }).then(() => {
        router.push('/home');
        location.reload();
      });
    }
  };

  return (
    <Sheet
      open={isNotificationOpen}
      onOpenChange={setIsNotificationOpen}
    >
      <UINavbar
        isBordered
        classNames={{
          wrapper: ['max-w-none 450px:px-[15%] px-4', className],
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
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            className='sm:hidden'
          />
          {hasLogo && (
            <NavbarBrand>
              <Logo className='450px:scale-120 450px:translate-y-0 scale-70 -translate-y-2' />
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
          {width > 450 && (
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
          )}
          {status === 'authenticated' && (
            <SheetTrigger className='relative cursor-pointer mr-2'>
              <NotificationIcon
                totalUnreadNotifications={totalUnreadNotifications}
              />
            </SheetTrigger>
          )}

          {status === 'authenticated' ? (
            <div className='flex justify-end items-center gap-x-4'>
              {width > 800 && (
                <span className='text-primary'>
                  Chào, {auth.user.firstName}
                </span>
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
                    <p className='font-semibold'>Đăng nhập với</p>
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
                    key='tickets_n_payments'
                    href='/tickets-n-payments'
                  >
                    Vé của tôi
                  </DropdownItem>
                  <DropdownItem key='host_my_event'>
                    Tổ chức sự kiện
                  </DropdownItem>
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
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <>
              <NavbarItem className='450px:hidden lg:flex'>
                <Link
                  href='/login'
                  underline='hover'
                >
                  Đăng nhập
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
                  Đăng ký
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
          {width <= 450 && (
            <NavbarItem
              aria-current='page'
              className='h-fit'
            >
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
            </NavbarItem>
          )}
        </NavbarMenu>
      </UINavbar>

      <SheetOverlay>
        <SheetContent
          side='right'
          className='min-w-[400px]'
        >
          <SheetHeader>
            <SheetTitle className='text-primary'>Thông báo</SheetTitle>
            <SheetDescription />
            <NotificationList
              onRefetch={refetchTotalUnreadNotifications}
              onClose={() => setIsNotificationOpen(false)}
            />
          </SheetHeader>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  );
}
