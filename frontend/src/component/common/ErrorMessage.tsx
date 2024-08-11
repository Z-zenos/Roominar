'use client';

import React from 'react';

interface ErrorMessageProps {
  text: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  return <p className='text-left text-alert text-[12px] font-[600]'>{text}</p>;
};

export default ErrorMessage;
