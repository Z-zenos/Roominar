'use client';

import { IoTicketOutline } from 'react-icons/io5';
import './Card.css';

interface TicketProps {
  name?: string;
}

export default function Ticket({ name }: TicketProps) {
  return (
    <button className='Btn text-ss bg-orange-500 font-medium'>
      {name}
      <IoTicketOutline className='w-16 h-16' />
    </button>
  );
}
