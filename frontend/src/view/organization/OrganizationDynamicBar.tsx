'use client';

import { styles } from '@/src/constants/styles.constant';
import { matchRoute } from '@/src/utils/app.util';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ORGANIZATION_ROUTE = [
  {
    title: 'Create an event with AI',
    description: 'Create an event with AI',
    url: '/organization/events/create/auto',
  },
  {
    key: 'EVENT_OVERVIEW',
    title: '',
    description: '',
    url: '/organization/events/[slug]/overview',
  },
  {
    key: 'EVENT_HOME',
    title: '',
    description: '',
    url: '/organization/events/[slug]/home',
  },
];

export default function OrganizationDynamicBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState(ORGANIZATION_ROUTE[0]);

  useEffect(() => {
    const route = ORGANIZATION_ROUTE.find((route) =>
      matchRoute(route.url, pathname),
    );
    if (route) {
      setCurrentRoute(route);
    }
  }, [pathname]);

  const goToSubPage = (subPage: string) => {
    const parts = pathname.split('/');
    // parts = ['', 'organization', 'events', '{eventId}', '{subPage}']
    if (parts.length < 5) return;

    parts[4] = subPage; // thay thế phần {subPage}
    const newPath = parts.join('/');

    router.push(newPath);
  };

  return (
    <div>
      {['EVENT_OVERVIEW', 'EVENT_HOME'].includes(currentRoute?.key) && (
        <div
          className={clsx(styles.flexStart, 'gap-4 font-light cursor-pointer')}
        >
          <div
            className={clsx(
              'hover:underline',
              currentRoute.url.includes('overview') &&
                'text-primary font-semibold',
            )}
            onClick={() => goToSubPage('overview')}
          >
            Dashboard
          </div>
          <div
            className={clsx(
              'hover:underline',
              currentRoute.url.includes('home') && 'text-primary font-semibold',
            )}
            onClick={() => goToSubPage('home')}
          >
            Detail View
          </div>
        </div>
      )}
    </div>
  );
}
