'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import { MdAirplaneTicket, MdOutlineAccessTime } from 'react-icons/md';
import { Image } from '@nextui-org/react';
import { styles } from '@/src/constants/styles.constant';

import type { ListingMyTransactionsItem } from '@/src/lib/api/generated';
import { TransactionStatusCode } from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import { FaCheck } from 'react-icons/fa6';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

interface MyTransactionCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  transaction: ListingMyTransactionsItem;
  onClick?: () => void;
}

function MyTransactionCard({
  className,
  direction = 'vertical',
  transaction,
  onClick,
}: MyTransactionCardProps) {
  const t = useTranslations('code');
  const isVertical = useMemo(() => direction === 'vertical', [direction]);
  const router = useRouter();

  return (
    <div
      className={clsx(
        `relative rounded-lg p-3 overflow-hidden
        shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px]
        active:shadow-none transition-all border cursor-pointer
        `,
        isVertical
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px]'
          : 'border-gray-200 items-start px-3 w-full',
        className,
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          'absolute top-0 z-10',
          isVertical
            ? 'bg-transparent w-full h-full absolute left-0'
            : 'w-2/3 right-0',
        )}
      >
        <div
          className={clsx(
            'relative transition-all',
            isVertical ? ' opacity-15 hover:opacity-10' : '',
          )}
        >
          <Image
            src={transaction.eventCoverImageUrl}
            alt={transaction.eventName}
            className={clsx(
              'rounded-lg ',
              isVertical
                ? 'aspect-square object-cover'
                : 'aspect-video object-fill',
            )}
          />
        </div>
      </div>
      {!isVertical && (
        <div className='absolute top-0 right-0 z-20 w-2/3 h-full bg-gradient-to-r from-gray-50 to-white/10'></div>
      )}
      <div
        className={clsx(
          'flex justify-start',
          isVertical
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap z-30 relative w-2/3',
        )}
      >
        <div className={clsx('flex gap-2 flex-col')}>
          <div
            className='flex gap-3 items-center px-3'
            onClick={() => router.push(`/events/${transaction.eventSlug}`)}
          >
            <div>
              <p className='font-semibold text-nm'>{transaction.eventName}</p>
            </div>
          </div>

          <div className='px-3'>
            <h3
              className={clsx(
                'font-medium text-nm line-clamp-2 h-6',
                'text-primary',
              )}
            >
              Đã mua {transaction.quantity} vé
            </h3>
            <p className='text-sm mb-2'>
              vào ngày {formatEventDate(transaction.purchasedAt)}
            </p>
            <span className='flex items-center text-ss gap-1 my-2'>
              <MdOutlineAccessTime className='text-nm' />
              {formatEventDate(transaction.eventStartAt)}
              {direction === 'horizontal' &&
                '〜' + formatEventDate(transaction.eventEndAt)}
            </span>
            <div className={clsx(styles.flexStart, 'flex-wrap gap-2')}>
              <Chip
                content={t(`transactionStatus.${transaction?.status}`)}
                leftIcon={<FaCheck className='text-sm' />}
                type={
                  transaction.status == TransactionStatusCode.Success
                    ? 'success'
                    : transaction.status == TransactionStatusCode.Pending
                      ? 'warning'
                      : 'error'
                }
                className='font-semibold text-xs'
              />
              <Chip
                content={t(`paymentMethod.${transaction.paymentMethodCode}`)}
                leftIcon={<MdAirplaneTicket className='text-sm' />}
                type={'info'}
                className='text-xs'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTransactionCard;
