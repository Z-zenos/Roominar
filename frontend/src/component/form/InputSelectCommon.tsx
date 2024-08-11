import type { SelectProps } from '@mui/material';
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import type { ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  className?: string;
  label: string | ReactNode;
  options: Array<{ label: string; value: any }>;
  rules?: any;
}

const InputSelectCommon = <T extends FieldValues>({
  control,
  name,
  className,
  label,
  options,
  sx,
  rules,
  ...rest
}: InputSelectProps<T> & SelectProps) => {
  return (
    <FormControl fullWidth className={className} sx={sx}>
      <InputLabel variant='outlined' shrink>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Select
              displayEmpty
              value={value || ''}
              onChange={onChange}
              label={label}
              error={!!error}
              {...rest}
              input={<OutlinedInput label='Equip' />}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText className='!text-[#D32F2F]'>{error.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
  );
};

export default InputSelectCommon;
