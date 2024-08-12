'use client';

import type { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../component/common/Accordion';

interface FilterBoxProps {
  title: string;
  collapsible?: boolean;
  content?: ReactNode;
  children?: ReactNode;
  open?: boolean;
}

function FilterBox({ title, collapsible = true, content, children, open = true }: FilterBoxProps) {
  return (
    <div className='px-4'>
      <Accordion type='single' defaultValue={open ? title : undefined} collapsible={collapsible}>
        <AccordionItem value={title}>
          <AccordionTrigger className='font-normal'>{title}</AccordionTrigger>
          <AccordionContent className='px-1 flex flex-col gap-3 justify-start'>
            {content}
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default FilterBox;
