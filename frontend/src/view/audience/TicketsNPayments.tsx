'use client';

import { useListingMyTicketsQuery } from '@/src/api/ticket.api';
import MyTicketCard from '@/src/component/common/Card/MyTicketCard';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import useWindowDimensions from '@/src/hooks/useWindowDimension';

function TicketsNPayment() {
  const { data: myTicketsData, isLoading: isListingMyTicketsLoading } =
    useListingMyTicketsQuery();
  const { width } = useWindowDimensions();

  if (isListingMyTicketsLoading) return <DotLoader />;

  return (
    <div className='flex jusify-start flex-wrap gap-4 p-5'>
      {myTicketsData &&
        myTicketsData.data?.length > 0 &&
        myTicketsData.data?.map((ticket) => {
          return (
            <MyTicketCard
              key={ticket.id}
              ticket={ticket}
              direction={
                width > 1200 || width < 600 ? 'vertical' : 'horizontal'
              }
            />
          );
        })}
    </div>
  );
}

export default TicketsNPayment;
