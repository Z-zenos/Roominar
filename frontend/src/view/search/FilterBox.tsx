'use client';

import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../component/common/Accordion';

interface FilterBoxProps {
  title: string;
  collapsible?: boolean;
  content?: ReactNode;
  children?: ReactNode;
  open?: boolean;
}

function FilterBox({
  title,
  collapsible = true,
  content,
  children,
  open = true,
}: FilterBoxProps) {
  return (
    <div className=''>
      <Accordion
        type='single'
        defaultValue={open ? title : undefined}
        collapsible={collapsible}
      >
        <AccordionItem value={title}>
          <AccordionTrigger className='font-normal bg-slate-50 px-4 py-2'>
            {title}
          </AccordionTrigger>
          <AccordionContent className='px-5 flex flex-col gap-3 pt-4 justify-start'>
            {content}
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default FilterBox;
