'use client';

import clsx from 'clsx';
import FilterBox from './FilterBox';
import type { Control } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { IoMdAdd } from 'react-icons/io';
import { Link } from '@nextui-org/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { Label } from '../../component/common/Label';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { FormCheckBox, FormCheckBoxList, FormDateRangePicker } from '@/src/component/form/Form';
import { styles } from '@/src/constant/styles.constant';
import { IndustryCode, type EventsApiSearchEventsRequest } from '@/src/lib/api/generated';
import { parseCode } from '@/src/util/app.util';

interface SearchFilterProps {
  className?: string;
  control: Control<EventsApiSearchEventsRequest>;
  onSearch: (data: EventsApiSearchEventsRequest) => void;
}

function SearchFilter({ className, control, onSearch }: SearchFilterProps) {
  const [showMoreIndustryCodes, setShowMoreIndustryCodes] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div
      className={clsx(
        'border border-gray-300 rounded-sm 1000px:block 600px:grid 600px:grid-cols-2 600px:gap-2 400px:grid-cols-1 1000px:max-w-[300px] min-w-[250px]',
        className,
      )}
    >
      <FilterBox title='Industry'>
        <FormCheckBoxList
          name='industryCodes'
          control={control}
          items={Object.keys(IndustryCode)
            .slice(0, showMoreIndustryCodes ? Object.keys(IndustryCode).length : 7)
            .map((ic: string) => ({
              value: IndustryCode[ic],
              label: parseCode(IndustryCode[ic]),
            }))}
          onSearch={onSearch}
        />
        <Link
          className={(styles.flexStart, 'font-light text-sm gap-2 cursor-pointer')}
          underline='hover'
          onClick={() => setShowMoreIndustryCodes(!showMoreIndustryCodes)}
        >
          Show {showMoreIndustryCodes ? 'less' : 'more'}
          {showMoreIndustryCodes ? <FaChevronUp /> : <FaChevronDown />}
        </Link>
      </FilterBox>
      <FilterBox title='Tags'>
        <Button radius='sm' variant='bordered' color='primary' startContent={<IoMdAdd />} onPress={onOpen}>
          Add tags
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center' size='2xl'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Log in</ModalHeader>
                <ModalBody>
                  <FormCheckBoxList
                    className='flex justify-start flex-wrap items-center gap-3'
                    name='tags'
                    control={control}
                    items={Object.keys(IndustryCode).map((ic: string) => ({
                      value: IndustryCode[ic],
                      label: parseCode(IndustryCode[ic]),
                    }))}
                    onSearch={onSearch}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='flat' onPress={onClose}>
                    Close
                  </Button>
                  <Button color='primary' onPress={onClose}>
                    Pick
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </FilterBox>

      <FilterBox title='Price'>
        <FormCheckBox name='isFree' control={control} onSearch={onSearch} title='Free' />
        <FormCheckBox name='isPaid' control={control} onSearch={onSearch} title='Paid' />
      </FilterBox>
      <FilterBox title='State'>
        <FormCheckBox name='isOnline' control={control} onSearch={onSearch} title='Online' />
        <FormCheckBox name='isOffline' control={control} onSearch={onSearch} title='Offline' />
      </FilterBox>
      <FilterBox title='Timeline'>
        <FormCheckBox name='today' control={control} onSearch={onSearch} title='Today' />
        <FormCheckBox name='isApplyOngoing' control={control} onSearch={onSearch} title='Opening Application' />
        <FormCheckBox name='isApplyEnded' control={control} onSearch={onSearch} title='Closed Application' />
        <Label className='mt-3'>Start date</Label>
        <FormDateRangePicker name='start_at_range' control={control} className='w-full' onSearch={onSearch} />
      </FilterBox>
    </div>
  );
}

export default SearchFilter;
