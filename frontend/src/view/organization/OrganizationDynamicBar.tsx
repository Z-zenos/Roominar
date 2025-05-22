'use client';

import { styles } from '@/src/constants/styles.constant';
import { matchRoute } from '@/src/utils/app.util';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
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
];

export default function OrganizationDynamicBar() {
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState(ORGANIZATION_ROUTE[0]);

  useEffect(() => {
    const route = ORGANIZATION_ROUTE.find((route) =>
      matchRoute(route.url, pathname),
    );
    if (route) {
      setCurrentRoute(route);
    }
  }, [pathname]);

  return (
    <div>
      {currentRoute?.key === 'EVENT_OVERVIEW' && (
        <div
          className={clsx(styles.flexStart, 'gap-4 font-light cursor-pointer')}
        >
          <div
            className={clsx(
              'hover:underline',
              currentRoute.url.includes('overview') &&
                'text-primary font-semibold',
            )}
          >
            Dashboard
          </div>
          <div className='hover:underline'>Detail View</div>
        </div>
      )}
    </div>
  );
}
