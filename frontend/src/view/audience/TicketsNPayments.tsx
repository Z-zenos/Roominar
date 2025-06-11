'use client';

import { useCancelTicketsMutation } from '@/src/api/ticket.api';
import MyTransactionCard from '@/src/component/common/Card/MyTransactionCard';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import { Form, FormInput } from '@/src/component/form/Form';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import type {
  ApiException,
  ErrorResponse400,
  ListingMyTransactionsItem,
  TransactionsApiListingMyTransactionsRequest,
} from '@/src/lib/api/generated';
import { TransactionStatusCode } from '@/src/lib/api/generated';
import { formatEventDate, searchQuery } from '@/src/utils/app.util';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import {
  BaseTabs,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/src/component/common/Tabs';
import ReactPaginate from 'react-paginate';
import Nodata from '@/src/component/common/Nodata';
import queryString from 'query-string';
import { useTranslations } from 'next-intl';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import toast from 'react-hot-toast';
import Chip from '@/src/component/common/Chip';
import {
  MdAirplaneTicket,
  MdKeyboardReturn,
  MdOutlineAccessTime,
} from 'react-icons/md';
import { Image } from '@nextui-org/react';
import { FaCheck } from 'react-icons/fa6';
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from '@/src/component/common/Alert';
// import Badge from '@/src/component/common/Badge';
// import { Label } from '@/src/component/common/Label';
// import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import {
  useGetTransactionStatusCountsQuery,
  useListingMyTransactionsQuery,
} from '@/src/api/transaction.api';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation, Pagination } from 'swiper/modules';

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

function TicketsNPayment() {
  const t = useTranslations('code');
  const { width } = useWindowDimensions();
  const searchParams = useSearchParams();
  const router = useRouter();

  const formatMoney = useFormatMoney();
  const [selectedReason, setSelectedReason] =
    useState<AudienceCancelTicketReasonCode>(
      AudienceCancelTicketReasonCode.ChangePlan,
    );

  const {
    data: myTransactionsData,
    isLoading: isListingMyTransactionsLoading,
    isFetching: isListingMyTransactionsFetching,
    refetch: refetchListingMyTransactions,
  } = useListingMyTransactionsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const { data: statusCounts, refetch: refetchStatusCounts } =
    useGetTransactionStatusCountsQuery();

  const { trigger: cancelTickets, isMutating: isCanceling } =
    useCancelTicketsMutation({
      onSuccess() {
        toast.success('Đã huỷ vé thành công 🎉');

        refetchListingMyTransactions();
        refetchStatusCounts();
      },
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  const [page, setPage] = useState<number>(myTransactionsData?.page || 1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ListingMyTransactionsItem | null>(null);

  const form = useForm<TransactionsApiListingMyTransactionsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      status:
        (searchParams.get('status') as TransactionStatusCode) ||
        TransactionStatusCode.Success,
    },
  });

  function handleSearch(
    data: TransactionsApiListingMyTransactionsRequest = {},
  ) {
    const filters: TransactionsApiListingMyTransactionsRequest = {
      ...form.getValues(),
      ...data,
    };

    searchQuery(router, filters, searchParams, []);
  }

  // function handleCancelTickets() {
  //   if (!selectedReason) {
  //     toast.error('Vui lòng chọn lí do huỷ vé');
  //     return;
  //   }
  //   cancelTickets({
  //     cancelTicketsRequest: {
  //       transactionItemId: selectedTransaction.transactionItemId,
  //       reason: selectedReason as unknown as CancelTicketReasonCode,
  //     },
  //   });
  // }

  return (
    <Form {...form}>
      <form
        className='px-5 w-full mt-3'
        onSubmit={form.handleSubmit(handleSearch)}
      >
        <div className={clsx(styles.between, 'flex-wrap gap-6')}>
          <div className={clsx(styles.flexStart, 'gap-2')}>
            <FormInput
              name='keyword'
              leftIcon={<IoSearchOutline size={20} />}
              placeholder='Find ticket name...'
              className='w-full 600px:min-w-[320px] min-w-full'
              control={form.control}
              onKeyDown={debounce(
                () => handleSearch({ keyword: form.getValues('keyword') }),
                1000,
              )}
            />
          </div>
          <BaseTabs
            defaultValue={form.getValues('status')}
            className={clsx('w-full mx-auto')}
          >
            <TabsList
              className={clsx(
                'grid grid-flow-col auto-cols-auto gap-4 px-5',
                width > 1200 && 'grid-cols-4',
              )}
            >
              {Object.keys(TransactionStatusCode).map((tab) => (
                <TabsTrigger
                  value={TransactionStatusCode[tab]}
                  key={`met-${tab}`}
                  onClick={() => {
                    form.setValue('status', TransactionStatusCode[tab]);
                    handleSearch({ status: TransactionStatusCode[tab] });
                  }}
                  className={clsx(
                    form.getValues('status') === TransactionStatusCode[tab] &&
                      '!bg-primary font-bold !text-white min-w-[160px]',
                  )}
                >
                  {t(`transactionStatus.${tab.toUpperCase()}`)}
                  {statusCounts &&
                    ' [' + statusCounts[TransactionStatusCode[tab]] + '] '}
                </TabsTrigger>
              ))}
            </TabsList>
          </BaseTabs>
        </div>

        <div className={clsx('border-t border-t-gray-300 mt-2')}>
          {!selectedTransaction && (
            <div className='mt-2 text-sm'>
              Click hoặc chạm vào thẻ để xem chi tiết giao dịch
            </div>
          )}
          {!myTransactionsData &&
            (isListingMyTransactionsLoading ||
              isListingMyTransactionsFetching) && (
              <div className='mx-auto'>
                <DotLoader />
              </div>
            )}

          <div className='flex 1200px:jusify-start justify-start flex-wrap gap-4 p-5'>
            {!selectedTransaction &&
              myTransactionsData &&
              myTransactionsData.data?.length > 0 &&
              myTransactionsData.data?.map((transaction) => {
                return (
                  <MyTransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    direction={
                      width > 1200 || width < 600 ? 'vertical' : 'horizontal'
                    }
                    onClick={() => setSelectedTransaction(transaction)}
                  />
                );
              })}
          </div>

          {myTransactionsData && selectedTransaction && (
            <>
              <div
                className='mb-4 cursor-pointer'
                onClick={() => setSelectedTransaction(null)}
              >
                <MdKeyboardReturn className='w-5 h-5 inline-block' /> Quay lại
              </div>
              <Tabs
                className='w-full'
                tabClassName='w-full'
                defaultValue='Thông tin'
                tabs={[
                  {
                    value: 'Thông tin',
                    content: (
                      <div className={clsx('flex gap-2 flex-col mt-4')}>
                        <div className='flex gap-3 items-center px-3'>
                          <div>
                            <p className='font-semibold text-md'>
                              {selectedTransaction.eventName}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Swiper
                            key={1}
                            modules={[Pagination, Navigation]}
                            pagination={{
                              type: 'fraction',
                            }}
                            slidesPerView={1}
                            spaceBetween={30}
                            wrapperClass='pb-2'
                            navigation={true}
                          >
                            {selectedTransaction.tickets.map((ticket) => (
                              <SwiperSlide
                                key={ticket.id}
                                className={clsx('dark:rounded-lg px-10 pb-2')}
                              >
                                <div className='px-3'>
                                  <div className={clsx(styles.between)}>
                                    <h3
                                      className={clsx(
                                        'font-medium text-md line-clamp-2 h-12',
                                        ticket.cancelable
                                          ? 'text-primary'
                                          : 'text-gray-600',
                                      )}
                                    >
                                      {ticket.name}
                                    </h3>
                                    <div className='rounded-md p-4 bg-gray-100'>
                                      {ticket.price
                                        ? formatMoney(ticket.price)
                                        : 'Miễn phí'}
                                    </div>
                                  </div>
                                  <p className='text-sm line-clamp-1 text-gray-700'>
                                    {ticket.description}
                                  </p>
                                  <div
                                    className={clsx(styles.flexStart, 'my-4')}
                                  >
                                    <Chip
                                      content={t(
                                        `transactionStatus.${ticket?.transactionStatus}`,
                                      )}
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
                                      content={
                                        'Loại vé: ' +
                                        t(`ticket.type.${ticket.type}`)
                                      }
                                      leftIcon={
                                        <MdAirplaneTicket className='text-sm' />
                                      }
                                      type={
                                        ticket.cancelable ? 'info' : 'default'
                                      }
                                      className='text-xs'
                                    />
                                  </div>

                                  <span className='flex items-center text-sm font-light flex-wrap gap-1 mt-3'>
                                    <MdOutlineAccessTime className='text-md' />
                                    Sự kiện sẽ bắt đầu vào:{' '}
                                    <span className='font-semibold text-red-500 text-md'>
                                      {formatEventDate(
                                        selectedTransaction.eventStartAt,
                                      )}{' '}
                                      〜{' '}
                                      {formatEventDate(
                                        selectedTransaction.eventEndAt,
                                      )}
                                      .
                                    </span>
                                    Vui lòng đến check-in đúng giờ và đúng địa
                                    điểm.
                                  </span>
                                </div>

                                <div className='px-3 py-2'>
                                  <div className='text-nm underline font-semibold'>
                                    Mã QR:{' '}
                                    <p className='flex items-center justify-center'>
                                      <Image
                                        src={ticket.qrCodeUrl}
                                        alt='Ticket QR Code'
                                        className='w-[200px] h-[200px] rounded-md'
                                      />
                                    </p>
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>

                        <div className='bg-gray-900 text-white p-6 rounded-xl shadow-md space-y-8 1000px:max-w-full max-w-4xl w-full'>
                          {/* Order Header */}
                          <div className='space-y-2'>
                            <h2 className='font-semibold text-lg'>
                              🧾 Đơn hàng:{' '}
                              <span className='text-gray-300'>
                                {selectedTransaction.id}
                              </span>
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                              <div>
                                <p className='text-gray-400'>Ngày đặt hàng</p>
                                <p>
                                  {formatEventDate(
                                    selectedTransaction.purchasedAt,
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className='text-gray-400'>
                                  Phương thức thanh toán
                                </p>
                                <p>
                                  {t(
                                    `paymentMethod.${selectedTransaction.paymentMethodCode}`,
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className='text-gray-400'>
                                  Tình trạng đơn hàng
                                </p>
                                <p className='text-green-400 font-semibold'>
                                  {t(
                                    `transactionStatus.${selectedTransaction.status}`,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Buyer Info */}
                          <div className='space-y-2'>
                            <h3 className='font-semibold text-lg'>
                              👤 Thông tin người mua
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                              <div>
                                <p className='text-gray-400'>Tên</p>
                                <p>{selectedTransaction.applicationFullName}</p>
                              </div>
                              <div>
                                <p className='text-gray-400'>Email</p>
                                <p>{selectedTransaction.applicationEmail}</p>
                              </div>
                              <div>
                                <p className='text-gray-400'>Số điện thoại</p>
                                <p>
                                  {selectedTransaction.applicationPhoneNumber}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className='space-y-4'>
                            <h3 className='font-semibold text-lg'>
                              📦 Thông tin đơn hàng
                            </h3>
                            <div className='overflow-auto text-sm'>
                              <table className='min-w-full border-collapse border border-gray-700'>
                                <thead>
                                  <tr className='bg-gray-800'>
                                    <th className='border border-gray-700 px-4 py-2 text-left'>
                                      Loại vé
                                    </th>
                                    <th className='border border-gray-700 px-4 py-2 text-center'>
                                      Số lượng
                                    </th>
                                    <th className='border border-gray-700 px-4 py-2 text-right'>
                                      Thành tiền
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedTransaction.tickets.map((ticket) => (
                                    <tr
                                      key={ticket.id}
                                      className='hover:bg-gray-800 transition-colors'
                                    >
                                      <td className='border border-gray-700 px-4 py-2'>
                                        {t(`ticket.type.${ticket.type}`)} -{' '}
                                        <span className='text-gray-400 text-sm'>
                                          {ticket.price
                                            ? formatMoney(ticket.price)
                                            : 'Miễn phí'}
                                        </span>
                                      </td>
                                      <td className='border border-gray-700 px-4 py-2 text-center'>
                                        {1}
                                      </td>
                                      <td className='border border-gray-700 px-4 py-2 text-right'>
                                        {formatMoney(ticket.price * 1)}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td
                                      colSpan={2}
                                      className='border border-gray-700 px-4 py-2 font-semibold text-right'
                                    >
                                      Tổng tạm tính
                                    </td>
                                    <td className='border border-gray-700 px-4 py-2 text-right'>
                                      {formatMoney(
                                        selectedTransaction.totalAmount,
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan={2}
                                      className='border border-gray-700 px-4 py-2 font-bold text-right'
                                    >
                                      Tổng tiền
                                    </td>
                                    <td className='border border-gray-700 px-4 py-2 text-right text-green-400 font-bold'>
                                      {formatMoney(
                                        selectedTransaction.totalAmount,
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    value: 'Huỷ vé',
                    content: (
                      <div className='mb-4 p-4 bg-gray-50 rounded-md grid grid-cols-2'>
                        {/* <Alert className='col-span-2'>
                          <MdLockClock className='h-5 w-5' />
                          <AlertTitle>
                            Có thể huỷ trước:{' '}
                            <span className='opacity-60 text-sm'>
                              {formatEventDate(
                                selectedTransaction.cancelableBeforeAt,
                              )}
                            </span>
                          </AlertTitle>
                          <AlertDescription className='font-light opacity-60 text-nm'></AlertDescription>
                        </Alert>

                        <div className='col-span-2 text-md my-3'>
                          <div className={clsx(styles.flexStart, 'gap-2')}>
                            <Badge
                              title='Policy'
                              className='w-fit'
                            />
                            {t(
                              `ticket.cancellationPolicy.${selectedTransaction.cancellationPolicyCode}`,
                            )}
                          </div>
                          {selectedTransaction.cancellationPolicyExtraDescription && (
                            <span className='text-sm block'>
                              ℹ️{' '}
                              {
                                selectedTransaction.cancellationPolicyExtraDescription
                              }
                            </span>
                          )}

                          <p className='text-sm text-gray-500 mt-2'>
                            *Vui lòng lưu ý rằng số tiền hoàn lại có thể thay
                            đổi tuỳ theo chính sách huỷ vé.
                          </p>
                        </div>

                        <p className='col-span-2 h-[1px] border-dashed border border-gray-300 my-2'></p>
                        <p className='col-span-1 text-nm'>
                          Số tiền bạn đã mua vé:{' '}
                        </p>
                        <p className='text-md font-semibold text-right'>
                          {formatMoney(selectedTransaction.price)}
                        </p>

                        <p className='col-span-1 text-nm'>
                          Số tiền sẽ hoàn trả cho bạn:{' '}
                        </p>
                        <p className='text-md font-semibold text-right'>
                          {formatMoney(selectedTransaction.refundedAmount)}
                        </p>

                        <p className='col-span-2 h-[1px] border-dotted border border-gray-300 my-2'></p>

                        <div className='col-span-2'>
                          <p className='text-nm mb-2'>Lí do huỷ:</p>
                          <RadioGroup defaultValue='comfortable'>
                            {Object.keys(AudienceCancelTicketReasonCode).map(
                              (reason) => (
                                <div
                                  key={reason}
                                  className='flex items-center space-x-2'
                                >
                                  <RadioGroupItem
                                    value={
                                      AudienceCancelTicketReasonCode[reason]
                                    }
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
                                      `ticket.cancelReason.${AudienceCancelTicketReasonCode[reason]}`,
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
                          hidden={!selectedTransaction.cancelable}
                          className='mt-3'
                        >
                          Huỷ
                        </Button> */}
                      </div>
                    ),
                  },
                ]}
              />
            </>
          )}

          {myTransactionsData && !myTransactionsData.data.length && <Nodata />}
        </div>

        {myTransactionsData &&
          myTransactionsData.total > myTransactionsData.perPage && (
            <ReactPaginate
              breakLabel='...'
              nextLabel={width > 800 ? 'next >' : '>'}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPageChange={({ selected }: any) => setPage(selected + 1)}
              pageRangeDisplayed={5}
              pageCount={
                Math.ceil(
                  myTransactionsData.total / myTransactionsData.perPage,
                ) || 0
              }
              previousLabel={width > 600 ? '< previous' : '<'}
              renderOnZeroPageCount={null}
              forcePage={page >= 1 ? page - 1 : 0}
              className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
              pageClassName='lg:py-2 lg:px-4 py-1 px-2'
              nextClassName='lg:py-2 lg:px-4 py-1 px-2'
              previousClassName='lg:py-2 lg:px-4 py-1 px-2'
              disabledClassName='text-gray-400'
              activeClassName='bg-primary text-white rounded-md'
            />
          )}
      </form>
    </Form>
  );
}

export default TicketsNPayment;
