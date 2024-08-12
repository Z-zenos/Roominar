import type { InputHTMLAttributes, LegacyRef } from 'react';
import { forwardRef } from 'react';

import './Input.css';
import { Link } from '@nextui-org/link';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  link?: string;
  helperText?: string;
  className?: string;
  title?: string;
  onCheckedChange?(checked: boolean): void;
}

function CustomCheckbox(
  { id, title, link, helperText, onCheckedChange, children, ...props }: CheckboxProps,
  ref: LegacyRef<HTMLInputElement>,
) {
  return (
    <div className='flex'>
      <div className='flex items-center me-4 checkbox-container'>
        <input
          id={id}
          type='checkbox'
          className='custom-checkbox'
          // eslint-disable-next-line @typescript-eslint/ban-types
          onChange={(event) => (onCheckedChange as Function)(event.target.checked)}
          ref={ref}
          {...props}
        />
        <label htmlFor={id} className='checkmark cursor-pointer' />
        <div className='text-sm'>
          <label htmlFor={id} className='text-dark-main dark:text-gray-300 peer-checked:text-primary'>
            {title}
            {children}

            {link && (
              <Link href='#' className='text-blue-600 dark:text-blue-500 hover:underline'>
                {link}
              </Link>
            )}
          </label>
          {helperText && (
            <p id='helper-checkbox-text' className='text-sm font-normal text-gray-500 dark:text-gray-300'>
              For orders shipped from $25 in books or $29 in other categories
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(CustomCheckbox);

export default Checkbox;
