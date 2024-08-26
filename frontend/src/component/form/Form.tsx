import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import type { Control, ControllerProps, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import type { ChangeEvent, HTMLAttributes, ElementRef, ComponentPropsWithoutRef } from 'react';
import { createContext, useContext, forwardRef, useId, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import clsx from 'clsx';
import { Label } from '../common/Label';
import { cn } from '@/src/util/app.util';
import type { CheckboxProps } from '../common/Input/Checkbox';
import { DateRangePicker, type DateRangePickerProps } from '../common/Datetime/DateRangePicker';
import Checkbox from '../common/Input/Checkbox';
import type { TextInputProps } from '../common/Input/TextInput';
import TextInput from '../common/Input/TextInput';
import { Popover, PopoverContent, PopoverTrigger } from '../common/Popover';
import type { ComboboxProps } from '../common/Combobox';
import { Button } from '../common/Button/ShardButton';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../common/Command';
import { Select, SelectContent, SelectGroup, SelectElement, SelectTrigger, SelectValue } from '../common/Select';
import type { SelectItem } from '@/src/type/SelectItem';
import type { ListingTagsResponse, TagGroup, TagItem } from '@/src/lib/api/generated';
import { styles } from '@/src/constant/styles.constant';
import { IoClose } from 'react-icons/io5';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react';
import { Button as UIButton } from '@nextui-org/button';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label ref={ref} className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />;
});

FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />;
  },
);

FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn('text-sm font-medium text-destructive', className)} {...props}>
        {body}
      </p>
    );
  },
);

FormMessage.displayName = 'FormMessage';

interface FormInputProps extends TextInputProps {
  control: Control<any>;
  label?: string;
  isDisplayError?: boolean;
  onTextChange?(value: string): void;
}

const FormInput = ({ name, control, isDisplayError = false, label, onTextChange, ...props }: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <TextInput
              {...props}
              {...field}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                onTextChange && onTextChange(e.target.value);
              }}
            />
          </FormControl>
          {isDisplayError && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

interface FormCheckBoxListProps extends CheckboxProps {
  items: { value: any; label: string }[];
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
}

const FormCheckBoxList = ({ items, name, control, onSearch, className, ...props }: FormCheckBoxListProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {items.map((item, index) => (
            <FormField
              key={`ffcb-${item.value}`}
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={`ficb-${item.value}`}
                    className={clsx(!index && 'mt-2', 'flex flex-row items-center justify-start space-x-1 ')}
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.value)}
                        {...props}
                        onCheckedChange={(checked) => {
                          let newItems = null;

                          if (checked) {
                            newItems = field?.value ? [...field.value, item.value] : [item.value];
                          } else {
                            newItems = field.value?.filter((value: any) => value !== item.value);
                          }
                          field.onChange(newItems);
                          if (onSearch) onSearch();
                        }}
                        title={item.label}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          ))}
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
};

FormCheckBoxList.displayName = 'FormCheckBoxList';

interface FormCheckBoxProps extends CheckboxProps {
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
}

const FormCheckBox = ({ name, control, onSearch, ...props }: FormCheckBoxProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-center justify-start space-x-1'>
          <FormControl>
            <Checkbox
              checked={field.value}
              {...props}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onSearch && onSearch();
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

FormCheckBox.displayName = 'FormCheckBox';

interface FormComboboxProps extends ComboboxProps {
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
  multiple?: boolean;
  className?: string;
}

const FormCombobox = ({ name, control, data, title, onSearch, multiple = true, className }: FormComboboxProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn('w-[200px] justify-between px-2', !field.value && 'text-muted-foreground', className)}
                >
                  <span className='text-gray-500 font-medium line-clamp-1'>
                    {multiple &&
                      field.value &&
                      (field.value as string[])
                        .map((selectedItem: string) => data.find((item) => item.value === selectedItem)?.label)
                        .join(', ')}

                    {!multiple && field.value && data.find((item) => item.value === field.value)?.label}

                    {(!field.value || !field.value?.length) && `Select ${title}`}
                  </span>
                  <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className={clsx('w-[200px] p-0', className)}>
              <Command>
                <CommandInput placeholder={`Search ${title}...`} />
                <CommandList>
                  <CommandEmpty>No {title} found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item: SelectItem) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          let newItems = null;

                          if (multiple) {
                            if (field?.value.includes(item.value)) {
                              newItems = field.value?.filter((value: string) => value !== item.value);
                            } else {
                              newItems = field?.value ? [...field.value, item.value] : [item.value];
                            }
                          } else {
                            newItems = item.value;
                          }
                          field.onChange(newItems);
                          if (onSearch) onSearch();
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            multiple
                              ? field.value.includes(item.value)
                                ? 'opacity-100'
                                : 'opacity-0'
                              : field.value === item.value
                                ? 'opacity-100'
                                : 'opacity-0',
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

FormCombobox.displayName = 'FormCombobox';

interface FormTagsInputProps {
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
  className?: string;
  data?: ListingTagsResponse;
  title?: string;
}

const FormTagsInput = ({ data, name, control, onSearch, className, title }: FormTagsInputProps) => {
  const tags = useMemo(
    () =>
      data && data.data.length
        ? (data.data.flatMap((group: TagGroup) =>
            group.tags
              .map((tag: TagItem) => ({
                id: tag.id,
                name: tag.name,
              }))
              .map((tag) => ({ value: tag.id + '', label: tag.name })),
          ) as SelectItem[])
        : [],
    [data],
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleSelectTags(field: ControllerRenderProps<any, string>, id: string) {
    let newItems = null;

    if (field?.value.includes(id)) {
      newItems = field.value?.filter((value: string) => value !== id);
    } else {
      newItems = field?.value ? [...field.value, id] : [id];
    }
    field.onChange(newItems);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <div className='border border-gray-300 rounded-sm'>
            <div className={clsx('max-h-[100px] overflow-y-scroll p-1')}>
              {field.value.length > 0 &&
                field.value.map((id: string) => (
                  <li
                    key={`selected-tag-${id}`}
                    className={clsx(
                      'text-primary bg-info-sub border rounded-sm w-fit mb-[6px] mr-[6px] p-1',
                      styles.flexStart,
                      'gap-2 inline-flex',
                    )}
                  >
                    <span className='break-all max-w-[90%]'>
                      {'#' + tags?.find((tag: SelectItem) => tag.value === id)?.label}
                    </span>
                    <IoClose
                      onClick={() => {
                        field.onChange(field.value?.filter((value: string) => value !== id));
                        if (onSearch) onSearch();
                      }}
                      className='min-w-5 cursor-pointer'
                    />
                  </li>
                ))}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full rounded-none border-t border-b-0 border-l-0 border-r-0 justify-between px-2',
                      !field.value && 'text-muted-foreground',
                      className,
                    )}
                  >
                    <span className='text-gray-500 font-medium line-clamp-1'>
                      {(!field.value || !field.value?.length) && `Select ${title}`}
                    </span>
                    <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={clsx('w-full p-0', className)}>
                <Command>
                  <CommandInput placeholder={`Search ${title}...`} />
                  <CommandList>
                    <CommandEmpty>No {title} found.</CommandEmpty>
                    <CommandGroup>
                      {tags.map((item: SelectItem) => (
                        <CommandItem
                          value={item.label}
                          key={`command-${item.value}`}
                          onSelect={() => {
                            handleSelectTags(field, item.value);
                            if (onSearch) onSearch();
                          }}
                          onKeyDown={() => {
                            if (onSearch) onSearch();
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value.includes(item.value) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <button
              className='w-full px-3 py-2 transition-all hover:bg-green-sub border-t border-t-green-sub hover:text-green-main'
              onClick={onOpen}
            >
              More tags +
            </button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center' size='2xl'>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className='flex flex-col gap-1'>Tags</ModalHeader>
                    <ModalBody>
                      {data && data.data.length > 0 ? (
                        data.data.map((tagGroup: TagGroup) => (
                          <div key={tagGroup.groupId}>
                            <h3 className='py-1 px-3 bg-emerald-50'>{tagGroup.groupName}</h3>
                            <div className={clsx(styles.flexStart, 'gap-2 flex-wrap my-2')}>
                              {tagGroup.tags.map((tag: TagItem) => (
                                <Checkbox
                                  key={`modal-tag-${tag.id}`}
                                  title={tag.name}
                                  id={tag.id + ''}
                                  onCheckedChange={() => {
                                    handleSelectTags(field, tag.id + '');
                                  }}
                                  defaultChecked={field.value.includes(tag.id + '')}
                                />
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <Spinner />
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <UIButton color='danger' variant='flat' onPress={onClose}>
                        Close
                      </UIButton>
                      <UIButton
                        color='primary'
                        onPress={() => {
                          if (onSearch) onSearch();
                          onClose();
                        }}
                      >
                        Search
                      </UIButton>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </FormItem>
      )}
    />
  );
};

FormTagsInput.displayName = 'FormTagsInput';

// interface FormSliderProps extends HTMLAttributes<HTMLDivElement> {
// 	min: number;
// 	max: number;
// 	control: Control<any>;
// 	onSearch?(data: any): void;
// 	name?: string;
// }

// const FormSlider = ({
// 	min,
// 	max,
// 	onSearch,
// 	name,
// 	control,
// 	className,
// }: FormSliderProps) => {
// 	return (
// 		<FormField
// 			control={control}
// 			name={name as string}
// 			render={({ field }) => (
// 				<FormItem>
// 					<FormControl>
// 						<div className={className}>
// 							<Slider
// 								className={clsx('my-2')}
// 								max={max}
// 								min={min}
// 								defaultValue={[1, 1000]}
// 								{...field}
// 								value={field.value || [1, 1000]}
// 								onChange={(values) => {
// 									field.onChange(values);
// 									(onSearch as Function)({ price: values });
// 								}}
// 							/>
// 							<div
// 								className={clsx(
// 									styles.between,
// 									'gap-1 1000px:flex-nowrap flex-wrap',
// 								)}
// 							>
// 								<TextInput
// 									leftIcon={<FaDollarSign className="text-purple-main" />}
// 									type="number"
// 									leftIconClassName="col-span-2"
// 									className="col-span-8"
// 									value={field.value ? field.value[0] : 1}
// 									onChange={(ev) => {
// 										field.onChange([+ev.target.value, field.value[1]]);
// 										(onSearch as Function)({
// 											price: [+ev.target.value, field.value[1]],
// 										});
// 									}}
// 								/>
// 								<IoRemoveOutline className="1000px:block hidden w-10 h-10" />
// 								<TextInput
// 									leftIcon={<FaDollarSign className="text-purple-main " />}
// 									type="number"
// 									leftIconClassName="col-span-2"
// 									className="col-span-8"
// 									value={field.value ? field.value[1] : 1000}
// 									onChange={(ev) => {
// 										field.onChange([field.value[0], +ev.target.value]);
// 										(onSearch as Function)({
// 											price: [field.value[0], +ev.target.value],
// 										});
// 									}}
// 								/>
// 							</div>
// 						</div>
// 					</FormControl>
// 					{/* <FormMessage /> */}
// 				</FormItem>
// 			)}
// 		/>
// 	);
// };

// FormSlider.displayName = 'FormSlider';

interface FormDateRangePickerProps extends DateRangePickerProps {
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
}

const FormDateRangePicker = ({ name, control, onSearch, className }: FormDateRangePickerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-center justify-start space-x-1'>
          <FormControl>
            <DateRangePicker
              className={className}
              daterange={field.value}
              onDateRangeChange={(daterange: DateRange | undefined) => {
                field.onChange(daterange);
                if (onSearch) onSearch();
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

FormDateRangePicker.displayName = 'FormDateRangePicker';

// interface FormTextareaProps extends TextareaProps {
// 	name: string;
// 	control: Control<any>;
// 	onSearch?(data: any): void;
// 	isDisplayError?: boolean;
// }

// const FormTextarea = ({
// 	name,
// 	control,
// 	onSearch,
// 	placeholder,
// 	isDisplayError,
// }: FormTextareaProps) => {
// 	return (
// 		<FormField
// 			control={control}
// 			name={name}
// 			render={({ field }) => (
// 				<FormItem>
// 					<FormControl>
// 						<Textarea
// 							placeholder={placeholder}
// 							className="resize-none"
// 							{...field}
// 						/>
// 					</FormControl>
// 					{isDisplayError && <FormMessage />}
// 				</FormItem>
// 			)}
// 		/>
// 	);
// };

// FormTextarea.displayName = 'FormTextarea';

interface FormSelectProps {
  name: string;
  control: Control<any>;
  onSearch?(data?: any): void;
  data: SelectItem[];
  className?: string;
  defaultValue?: string;
}

const FormSelect = ({ data, name, control, onSearch, className, defaultValue }: FormSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* <FormLabel>Sort By</FormLabel> */}
          <Select
            onValueChange={(value: string) => {
              field.onChange(value);
              if (onSearch) onSearch();
            }}
            defaultValue={defaultValue}
          >
            <FormControl>
              <SelectTrigger className={clsx('w-[180px]', className)}>
                <SelectValue placeholder={`${data[0].label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {data?.map((item: SelectItem) => (
                  <SelectElement key={item.value} value={item.value}>
                    {item.label}
                  </SelectElement>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

FormSelect.displayName = 'FormSelect';

// interface FormImageUploaderProps extends ImageUploaderProps {
// 	name: string;
// 	control: Control<any>;
// 	isDisplayError?: boolean;
// }

// const FormImageUploader = ({
// 	name,
// 	control,
// 	isDisplayError,
// 	className,
// 	formats,
// 	onGetImageUrl,
// }: FormImageUploaderProps) => {
// 	return (
// 		<FormField
// 			control={control}
// 			name={name}
// 			render={({ field }) => (
// 				<FormItem>
// 					<FormControl>
// 						<ImageUploader
// 							className={className}
// 							formats={formats}
// 							onGetImageUrl={onGetImageUrl}
// 							{...field}
// 						/>
// 					</FormControl>
// 					{isDisplayError && <FormMessage />}
// 				</FormItem>
// 			)}
// 		/>
// 	);
// };

// FormImageUploader.displayName = 'FormImageUploader';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormInput,
  FormCheckBox,
  FormCheckBoxList,
  // FormSlider,
  FormDateRangePicker,
  // FormTextarea,
  FormSelect,
  // FormImageUploader,
  FormCombobox,
  FormTagsInput,
};
