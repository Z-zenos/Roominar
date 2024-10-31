import type { InputHTMLAttributes, LegacyRef } from 'react';
import { forwardRef } from 'react';

import './Input.css';
import { Link } from '@nextui-org/link';
import { FormCustomLabel } from '../../form/Form';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  link?: string;
  className?: string;
  label?: string;
  onCheckedChange?(checked: boolean): void;
  i18nPath?: string;
}

function CustomCheckbox(
  {
    id,
    label,
    link,
    onCheckedChange,
    i18nPath,
    children,
    ...props
  }: CheckboxProps,
  ref: LegacyRef<HTMLInputElement>,
) {
  return (
    <div className='flex'>
      <div className='flex items-center me-4 checkbox-container'>
        <input
          id={id}
          type='checkbox'
          className='custom-checkbox'
          onChange={(event) => {
            if (onCheckedChange) onCheckedChange(event.target.checked);
          }}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id}
          className='checkmark cursor-pointer'
        />
        <div className='text-sm'>
          <label
            htmlFor={id}
            className='text-dark-main dark:text-gray-300 peer-checked:text-primary checkbox-title'
          >
            {label && (
              <FormCustomLabel
                htmlFor={id}
                label={label}
                required={props.required}
                i18nPath={i18nPath}
              />
            )}
            {children}

            {link && (
              <Link
                href='#'
                className='text-blue-600 dark:text-blue-500 hover:underline'
              >
                {link}
              </Link>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(CustomCheckbox);

export default Checkbox;
