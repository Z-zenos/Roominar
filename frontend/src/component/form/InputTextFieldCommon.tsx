import { FormHelperText } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
interface InputTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  className?: string;
  rules?: any;
  helperText?: string;
}

const InputTextFieldCommon = <T extends FieldValues>({
  control,
  name,
  className,
  label,
  inputProps,
  InputProps,
  sx,
  type,
  rules,
  helperText,
}: InputTextFieldProps<T> & TextFieldProps) => {
  return (
    <div className='w-full'>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error && error.message}
            onChange={onChange}
            value={value || ''}
            fullWidth
            label={label}
            className={className}
            inputProps={{
              ...inputProps,
            }}
            InputProps={{
              ...InputProps,
            }}
            sx={sx}
            variant='outlined'
            InputLabelProps={{ shrink: true }}
            type={type}
          />
        )}
      />
      {helperText && <FormHelperText className='text-xs w-full !text-end'>{helperText}</FormHelperText>}
    </div>
  );
};

export default InputTextFieldCommon;
