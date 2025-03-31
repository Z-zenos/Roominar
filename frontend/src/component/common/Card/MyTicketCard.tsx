'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import {
  MdAirplaneTicket,
  MdNotAccessible,
  MdOutlineAccessTime,
} from 'react-icons/md';
import { Image } from '@nextui-org/react';
import { styles } from '@/src/constants/styles.constant';
import type {
  ApiException,
  CancelTicketReasonCode,
  ErrorResponse400,
} from '@/src/lib/api/generated';
import {
  TransactionStatusCode,
  type ListingMyTicketsItem,
} from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa6';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

import Badge from '@/src/component/common/Badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/src/component/common/Alert';
import { MdLockClock } from 'react-icons/md';

import toast from 'react-hot-toast';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import { useCancelTicketsMutation } from '@/src/api/ticket.api';
import { useTranslations } from 'next-intl';
import { Tabs } from '../Tabs';
import { RadioGroup, RadioGroupItem } from '../RadioGroup';
import { Label } from '../Label';

interface MyTicketCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  ticket: ListingMyTicketsItem;
}

export enum AudienceCancelTicketReasonCode {
  ChangePlan = 'CHANGE_PLAN',
  FinancialIssue = 'FINANCIAL_ISSUE',
  PersonalReason = 'PERSONAL_REASON',
  TimeConflict = 'TIME_CONFLICT',
  HealthIssue = 'HEALTH_ISSUE',
  TransportIssue = 'TRANSPORT_ISSUE',
  PurchaseError = 'PURCHASE_ERROR',
  NoCompanion = 'NO_COMPANION',
  VisaIssue = 'VISA_ISSUE',
  PolicyIssue = 'POLICY_ISSUE',
  BadCustomerService = 'BAD_CUSTOMER_SERVICE',
  WeatherIssue = 'WEATHER_ISSUE',
}

function MyTicketCard({
  className,
  direction = 'vertical',
  ticket,
}: MyTicketCardProps) {
  const t = useTranslations('code.ticket');
  const isVertical = useMemo(() => direction === 'vertical', [direction]);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formatMoney = useFormatMoney();
  const [selectedReason, setSelectedReason] =
    useState<AudienceCancelTicketReasonCode>(
      AudienceCancelTicketReasonCode.ChangePlan,
    );

  const { trigger: cancelTickets, isMutating: isCanceling } =
    useCancelTicketsMutation({
      onSuccess() {
        toast.success('Ticket(s) canceled successfully');
      },
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  function handleCancelTickets() {
    if (!selectedReason) {
      toast.error('Please select a reason for cancellation');
      return;
    }
    cancelTickets({
      cancelTicketsRequest: {
        transactionItemId: ticket.transactionItemId,
        reason: selectedReason as unknown as CancelTicketReasonCode,
      },
    });
  }

  return (
    <div
      className={clsx(
        `relative rounded-lg p-3 overflow-hidden
        shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px]
        active:shadow-none transition-all border
        `,
        isVertical
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px]'
          : 'border-gray-200 items-start px-3 w-full',
        ticket.cancelable
          ? 'cursor-pointer'
          : 'text-gray-600 border-gray-400 cursor-not-allowed pointer-events-none',
        className,
      )}
      onClick={onOpen}
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
            src={ticket.eventCoverImageUrl}
            alt={ticket.name}
            className={clsx(
              'rounded-lg ',
              isVertical
                ? 'aspect-square object-cover'
                : 'aspect-video object-fill',
              !ticket.cancelable && 'grayscale',
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
            onClick={() => router.push(`/events/${ticket.eventSlug}`)}
          >
            <div>
              <p className='font-semibold text-sm'>{ticket.eventName}</p>
              <p className='text-xs'>
                Applied at {dayjs(ticket.appliedAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>

          <div className='px-3'>
            <h3
              className={clsx(
                'font-medium text-nm line-clamp-2 h-12',
                ticket.cancelable ? 'text-primary' : 'text-gray-600',
              )}
            >
              {ticket.name}
            </h3>
            <p className='text-sm line-clamp-1 text-gray-700'>
              {ticket.description}
            </p>
            <span className='flex items-center text-ss gap-1 my-2'>
              <MdOutlineAccessTime className='text-nm' />
              {formatEventDate(ticket.eventStartAt)}
              {direction === 'horizontal' &&
                '〜' + formatEventDate(ticket.eventEndAt)}
            </span>
            <div className={clsx(styles.flexStart)}>
              <Chip
                content={ticket?.transactionStatus}
                leftIcon={<FaCheck className='text-sm' />}
                type={
                  ticket.cancelable
                    ? ticket.transactionStatus == TransactionStatusCode.Success
                      ? 'success'
                      : ticket.transactionStatus ==
                          TransactionStatusCode.Pending
                        ? 'warning'
                        : 'error'
                    : 'default'
                }
                className='font-semibold text-xs'
              />
              <Chip
                content={ticket.type}
                leftIcon={<MdAirplaneTicket className='text-sm' />}
                type={ticket.cancelable ? 'info' : 'default'}
                className='text-xs'
              />
              {!ticket.cancelable && (
                <Chip
                  content='Not Cancelable'
                  type='default'
                  className='text-xs'
                  leftIcon={<MdNotAccessible className='text-sm' />}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        size='2xl'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            {ticket.name}
          </ModalHeader>
          <ModalBody>
            <Tabs
              className='w-full'
              tabClassName='w-full'
              defaultValue='info'
              tabs={[
                {
                  value: 'info',
                  content: (
                    <div className={clsx('flex gap-2 flex-col')}>
                      <div className='flex gap-3 items-center px-3'>
                        <div>
                          <p className='font-semibold text-sm'>
                            {ticket.eventName}
                          </p>
                          <p className='text-xs'>
                            Applied at{' '}
                            {dayjs(ticket.appliedAt).format('MMM DD, YYYY')}
                          </p>
                        </div>
                      </div>

                      <div className='px-3'>
                        <div className={clsx(styles.between)}>
                          <h3
                            className={clsx(
                              'font-medium text-nm line-clamp-2 h-12',
                              ticket.cancelable
                                ? 'text-primary'
                                : 'text-gray-600',
                            )}
                          >
                            {ticket.name}
                          </h3>
                          <div className='rounded-md p-4 bg-gray-100'>
                            {ticket.price ? formatMoney(ticket.price) : 'FRee'}
                          </div>
                        </div>
                        <p className='text-sm line-clamp-1 text-gray-700'>
                          {ticket.description}
                        </p>
                        <span className='flex items-center text-ss gap-1 my-2'>
                          <MdOutlineAccessTime className='text-nm' />
                          {formatEventDate(ticket.eventStartAt)}
                          {direction === 'horizontal' &&
                            '〜' + formatEventDate(ticket.eventEndAt)}
                        </span>
                        <div className={clsx(styles.flexStart)}>
                          <Chip
                            content={ticket?.transactionStatus}
                            leftIcon={<FaCheck className='text-sm' />}
                            type={
                              ticket.cancelable
                                ? ticket.transactionStatus ==
                                  TransactionStatusCode.Success
                                  ? 'success'
                                  : ticket.transactionStatus ==
                                      TransactionStatusCode.Pending
                                    ? 'warning'
                                    : 'error'
                                : 'default'
                            }
                            className='font-semibold text-xs'
                          />
                          <Chip
                            content={ticket.type}
                            leftIcon={<MdAirplaneTicket className='text-sm' />}
                            type={ticket.cancelable ? 'info' : 'default'}
                            className='text-xs'
                          />
                        </div>
                      </div>

                      <div className='px-3 py-2'>
                        <p className='font-light text-sm'>
                          Ticket ID:{' '}
                          <span className='text-primary font-bold text-md'>
                            {ticket.transactionItemId}
                          </span>
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  value: 'cancel',
                  content: (
                    <div className='mb-4 p-4 bg-gray-50 rounded-md grid grid-cols-2'>
                      <Alert className='col-span-2'>
                        <MdLockClock className='h-5 w-5' />
                        <AlertTitle>
                          Cancelable before:{' '}
                          <span className='opacity-60 text-sm'>
                            {formatEventDate(ticket.cancelableBeforeAt)}
                          </span>
                        </AlertTitle>
                        <AlertDescription className='font-light opacity-60 text-sm'></AlertDescription>
                      </Alert>

                      <div className='col-span-2 text-sm my-3'>
                        <div className={clsx(styles.flexStart, 'gap-2')}>
                          <Badge
                            title='Policy'
                            className='w-fit'
                          />
                          {t(
                            `cancellationPolicy.${ticket.cancellationPolicyCode}`,
                          )}
                        </div>
                        {ticket.cancellationPolicyExtraDescription && (
                          <span className='text-xs block'>
                            ℹ️ {ticket.cancellationPolicyExtraDescription}
                          </span>
                        )}

                        <p className='text-xs text-gray-500 mt-2'>
                          *Please note that the refund amount may vary depending
                          on the cancellation policy.
                        </p>
                      </div>

                      <p className='col-span-2 h-[1px] border-dashed border border-gray-300 my-2'></p>
                      <p className='col-span-1 text-sm'>Total Amount Paid: </p>
                      <p className='text-md font-semibold text-right'>
                        {formatMoney(ticket.price)}
                      </p>

                      <p className='col-span-1 text-sm'>Refund Amount: </p>
                      <p className='text-md font-semibold text-right'>
                        {formatMoney(ticket.refundedAmount)}
                      </p>

                      <p className='col-span-2 h-[1px] border-dotted border border-gray-300 my-2'></p>

                      <div className='col-span-2'>
                        <p className='text-sm'>Cancel Reason:</p>
                        <RadioGroup defaultValue='comfortable'>
                          {Object.keys(AudienceCancelTicketReasonCode).map(
                            (reason) => (
                              <div
                                key={reason}
                                className='flex items-center space-x-2'
                              >
                                <RadioGroupItem
                                  value={AudienceCancelTicketReasonCode[reason]}
                                  id={AudienceCancelTicketReasonCode[reason]}
                                  onClick={() =>
                                    setSelectedReason(
                                      AudienceCancelTicketReasonCode[reason],
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={
                                    AudienceCancelTicketReasonCode[reason]
                                  }
                                  className='text-sm font-light'
                                >
                                  {t(
                                    `cancelReason.${AudienceCancelTicketReasonCode[reason]}`,
                                  )}
                                </Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                      </div>

                      <Button
                        color='warning'
                        variant='flat'
                        onPress={handleCancelTickets}
                        isLoading={isCanceling}
                        hidden={!ticket.cancelable}
                        className='mt-3'
                      >
                        Cancel
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MyTicketCard;
