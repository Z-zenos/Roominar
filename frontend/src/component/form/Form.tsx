'use client';

import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import type {
  Control,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import type {
  ChangeEvent,
  HTMLAttributes,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
import { createContext, useContext, forwardRef, useId, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import clsx from 'clsx';
import { Label } from '../common/Label';
import { cn } from '@/src/util/app.util';
import type { CheckboxProps } from '../common/Input/Checkbox';
import {
  DateRangePicker,
  type DateRangePickerProps,
} from '../common/DateTime/DateRangePicker';
import Checkbox from '../common/Input/Checkbox';
import type { TextInputProps } from '../common/Input/TextInput';
import TextInput from '../common/Input/TextInput';
import { Popover, PopoverContent, PopoverTrigger } from '../common/Popover';
import type { ComboboxProps } from '../common/Combobox';
import { Button } from '../common/Button/ShardButton';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../common/Command';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectElement,
  SelectTrigger,
  SelectValue,
} from '../common/Select';
import type {
  ListingTagsResponse,
  TagGroup,
  TagItem,
} from '@/src/lib/api/generated';
import { styles } from '@/src/constant/styles.constant';
import { IoClose } from 'react-icons/io5';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { Button as UIButton } from '@nextui-org/button';
import { RadioGroup, RadioGroupItem } from '../common/RadioGroup';
import type { ImageUploaderProps } from '../common/Upload/ImageUploader';
import ImageUploader from '../common/Upload/ImageUploader';
import { useTranslations } from 'next-intl';
import { DateTimePicker } from '../common/DateTime/DateTimePicker';
import { Textarea, type TextareaProps } from '../common/Input/Textarea';
import Nodata from '../common/Nodata';
import type Option from '@/src/type/Option';
import { capitalize } from 'lodash-es';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

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

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={cn('space-y-2', className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  },
);

FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});

FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

FormDescription.displayName = 'FormDescription';

interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  label?: string;
}

const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ label, className, children, ...props }, ref) => {
    const t = useTranslations('form');
    const { error, formMessageId } = useFormField();
    let body = undefined;
    if (error) {
      if (error?.message === 'required') {
        body = capitalize(t('message.error.required')).replace(
          '[field]',
          label,
        );
      } else {
        body = capitalize(
          t(
            `message.error.${error.type !== 'custom' ? error.type : error.message}`,
          ).replace('[field]', t(`label.${label}`)),
        );

        if (['too_small', 'too_big'].includes(error.type)) {
          const match = error?.message?.match(/\d+/);
          const value = match ? Number(match[0]) : null;
          body = body.replace('[value]', value);
        }
      }
    } else {
      body = children;
    }

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);

FormMessage.displayName = 'FormMessage';

enum FormItemClassname {
  label = 'label',
  wrapper = 'wrapper',
}

interface FormItemProps {
  name: string;
  control: Control<any>;
  showError?: boolean;
  classNames?: { [k in FormItemClassname]?: string };
  label?: string;
  required?: boolean;
  onValueChange?(val?: any): void;
  i18nPath?: string;
}

interface FormInputProps extends Omit<FormItemProps & TextInputProps, null> {}

const FormInput = ({
  name,
  control,
  showError = false,
  ...props
}: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={props.classNames?.wrapper}>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <TextInput
              {...props}
              {...field}
              error={fieldState.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                props.onValueChange && props.onValueChange(e.target.value);
              }}
            />
          </FormControl>
          {showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};

interface FormCheckBoxListProps
  extends Omit<FormItemProps & CheckboxProps, null> {
  options: Option[];
  direction?: 'vertical' | 'horizontal';
}
const FormCheckBoxList = ({
  options,
  name,
  control,
  classNames,
  i18nPath,
  direction = 'horizontal',
  ...props
}: FormCheckBoxListProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={classNames?.label}
            />
          )}
          <div
            className={clsx(
              'gap-4 flex justify-start',
              direction === 'vertical' ? 'flex-col' : 'items-center',
            )}
          >
            {options.length > 0 &&
              options.map((option: Option, index: number) => (
                <FormField
                  key={`fcbl-${option.value}`}
                  name={name}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={`ficb-${option.value}`}
                        className={clsx(
                          !index && 'mt-2',
                          'flex flex-row items-center justify-start space-x-1 ',
                          classNames?.wrapper,
                        )}
                      >
                        <FormControl>
                          <Checkbox
                            checked={field?.value?.includes(option.value)}
                            {...props}
                            onCheckedChange={(checked) => {
                              let newItems = null;

                              if (checked) {
                                newItems = field?.value
                                  ? [...field.value, option.value]
                                  : [option.value];
                              } else {
                                newItems = field?.value?.filter(
                                  (value: any) => value !== option.value,
                                );
                              }
                              field.onChange(newItems);
                              if (props.onValueChange) props.onValueChange();
                            }}
                            label={option.label}
                            i18nPath={i18nPath}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              ))}
          </div>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormCheckBoxList.displayName = 'FormCheckBoxList';

interface FormCheckBoxProps extends Omit<FormItemProps & CheckboxProps, null> {}
const FormCheckBox = ({
  name,
  control,
  classNames,
  onValueChange,
  ...props
}: FormCheckBoxProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx(
            'flex flex-row items-center justify-start space-x-1',
            classNames?.wrapper,
          )}
        >
          <FormControl>
            <Checkbox
              checked={field?.value}
              label={props.label}
              {...props}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onValueChange && onValueChange();
              }}
              i18nPath={props.i18nPath}
            />
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormCheckBox.displayName = 'FormCheckBox';

interface FormComboboxProps extends Omit<FormItemProps & ComboboxProps, null> {
  multiple?: boolean;
  className?: string;
  options?: Option[];
}
const FormCombobox = ({
  name,
  control,
  title,
  onValueChange,
  multiple = true,
  options,
  i18nPath,
  className,
  ...props
}: FormComboboxProps) => {
  const t = useTranslations(i18nPath);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx(
            'flex flex-col shadow-[2px_2px_10px_rgba(0,_0,_0,_0.075)] bg-white',
            props.classNames?.wrapper,
          )}
        >
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <Popover>
            <PopoverTrigger
              asChild
              className='border border-gray-main rounded-md h-11'
            >
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-[200px] justify-between px-2',
                    !field?.value && 'text-muted-foreground',
                    className,
                  )}
                >
                  <span
                    className={clsx(
                      (!field?.value || !field?.value?.length) &&
                        'text-[#a3a9b5] font-normal',
                      'font-medium line-clamp-1',
                    )}
                  >
                    {multiple &&
                      field?.value &&
                      (field?.value as string[])
                        .map((selectedItem: string) =>
                          t(
                            `${options.find((option) => option.value === selectedItem)}`,
                          ),
                        )
                        .join(', ')}

                    {!multiple &&
                      field?.value &&
                      t(
                        `${options.find((option) => option.value === field?.value)}`,
                      )}

                    {(!field?.value || !field?.value?.length) &&
                      `Select ${title}`}
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
                    {options &&
                      options.length > 0 &&
                      options.map((option: Option) => (
                        <CommandItem
                          value={t(option.label)}
                          key={option.value}
                          onSelect={() => {
                            let newItems = null;

                            if (multiple) {
                              if (field?.value.includes(option.value)) {
                                newItems = field?.value?.filter(
                                  (value: string) => value !== option.value,
                                );
                              } else {
                                newItems = field?.value
                                  ? [...field.value, option.value]
                                  : [option.value];
                              }
                            } else {
                              newItems = option.value;
                            }
                            field.onChange(newItems);
                            if (onValueChange) onValueChange();
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              multiple
                                ? field?.value.includes(option.value)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                                : field?.value === option.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                            )}
                          />
                          {t(option.label)}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormCombobox.displayName = 'FormCombobox';

interface FormTagsInputProps extends FormItemProps {
  className?: string;
  data?: ListingTagsResponse;
  title?: string;
}
const FormTagsInput = ({
  data,
  name,
  control,
  onValueChange,
  className,
  title,
  ...props
}: FormTagsInputProps) => {
  const tags = useMemo(
    () =>
      data && data.data?.length
        ? (data.data.flatMap((group: TagGroup) =>
            group.tags
              .map((tag: TagItem) => ({
                id: tag.id,
                name: tag.name,
              }))
              .map((tag) => ({ value: tag.id + '', label: tag.name })),
          ) as Option[])
        : [],
    [data],
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleSelectTags(
    field: ControllerRenderProps<any, string>,
    id: string,
  ) {
    let newItems = null;

    if (field?.value.includes(id)) {
      newItems = field?.value?.filter((value: string) => value !== id);
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
        <FormItem className={clsx('flex flex-col', props.classNames?.wrapper)}>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <div className='border border-gray-300 rounded-sm bg-white'>
            <div className={clsx('max-h-[100px] overflow-y-scroll p-1')}>
              {field?.value &&
                field?.value?.length > 0 &&
                field?.value.map((id: string) => (
                  <li
                    key={`selected-tag-${id}`}
                    className={clsx(
                      'text-primary bg-info-sub border rounded-sm w-fit mb-[6px] mr-[6px] p-1',
                      styles.flexStart,
                      'gap-2 inline-flex',
                    )}
                  >
                    <span className='break-all max-w-[90%]'>
                      {'#' +
                        tags?.find((tag: Option) => tag.value === id)?.label}
                    </span>
                    <IoClose
                      onClick={() => {
                        field.onChange(
                          field?.value?.filter((value: string) => value !== id),
                        );
                        if (onValueChange) onValueChange();
                      }}
                      className='min-w-5 cursor-pointer'
                    />
                  </li>
                ))}
            </div>

            <Popover>
              <PopoverTrigger
                asChild
                className='bg-white'
              >
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full rounded-none border-t border-b-0 border-l-0 border-r-0 justify-between px-2',
                      !field?.value && 'text-muted-foreground',
                      className,
                    )}
                  >
                    <span className='text-gray-500 font-medium line-clamp-1'>
                      Select {title}
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
                      {tags.map((item: Option) => (
                        <CommandItem
                          value={item.label}
                          key={`command-${item.value}`}
                          onSelect={() => {
                            handleSelectTags(field, item.value);
                            if (onValueChange) onValueChange();
                          }}
                          onKeyDown={() => {
                            if (onValueChange) onValueChange();
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field?.value.includes(item.value)
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

            <button
              className='w-full px-3 py-2 transition-all text-dark-main font-light hover:bg-green-sub border-t border-t-green-sub hover:text-green-main'
              onClick={onOpen}
            >
              More tags +
            </button>

            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement='top-center'
              size='2xl'
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className='flex flex-col gap-1'>
                      Tags
                    </ModalHeader>
                    <ModalBody>
                      {data && data.data.length > 0 ? (
                        data.data.map((tagGroup: TagGroup) => (
                          <div key={tagGroup.groupId}>
                            <h3 className='py-1 px-3 bg-emerald-50'>
                              {tagGroup.groupName}
                            </h3>
                            <div
                              className={clsx(
                                'grid grid-cols-4 gap-2 my-2 [&_.checkbox-title]:text-s',
                              )}
                            >
                              {tagGroup.tags.map((tag: TagItem) => (
                                <Checkbox
                                  key={`modal-tag-${tag.id}`}
                                  id={tag.id + ''}
                                  onCheckedChange={() => {
                                    handleSelectTags(field, tag.id + '');
                                  }}
                                  defaultChecked={field?.value.includes(
                                    tag.id + '',
                                  )}
                                >
                                  {tag.name.toLowerCase()}
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <Spinner />
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <UIButton
                        color='danger'
                        variant='flat'
                        onPress={onClose}
                      >
                        Close
                      </UIButton>
                      <UIButton
                        color='primary'
                        onPress={() => {
                          if (onValueChange) onValueChange();
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
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormTagsInput.displayName = 'FormTagsInput';

interface FormRadioBoxListProps extends FormItemProps {
  direction: 'vertical' | 'horizontal';
  options: Option[];
}
function FormRadioBoxList({
  name,
  options,
  i18nPath,
  control,
  onValueChange,
  direction = 'vertical',
  ...props
}: FormRadioBoxListProps) {
  const t = useTranslations(i18nPath);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={clsx('space-y-3', props.classNames?.wrapper)}>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                if (onValueChange) onValueChange();
              }}
              defaultValue={field?.value}
              className={clsx(
                direction === 'vertical'
                  ? 'flex flex-col space-y-1'
                  : 'grid grid-cols-3 space-x-1',
              )}
            >
              {options &&
                options.length > 0 &&
                options.map((option: Option) => (
                  <FormItem
                    key={`frbl-${option.value}`}
                    className='flex items-center space-x-3 space-y-0 mt-2'
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      {t(option.label)}
                    </FormLabel>
                  </FormItem>
                ))}
            </RadioGroup>
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
}
FormRadioBoxList.displayName = 'FormRadioBoxList';

// interface FormSliderProps extends HTMLAttributes<HTMLDivElement> {
// 	min: number;
// 	max: number;
// 	control: Control<any>;
// 	onValueChange?(data: any): void;
// 	name?: string;
// }

// const FormSlider = ({
// 	min,
// 	max,
// 	onValueChange,
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
// 								value={field?.value || [1, 1000]}
// 								onChange={(values) => {
// 									field.onChange(values);
// 									(onValueChange as Function)({ price: values });
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
// 									value={field?.value ? field?.value[0] : 1}
// 									onChange={(ev) => {
// 										field.onChange([+ev.target.value, field?.value[1]]);
// 										(onValueChange as Function)({
// 											price: [+ev.target.value, field?.value[1]],
// 										});
// 									}}
// 								/>
// 								<IoRemoveOutline className="1000px:block hidden w-10 h-10" />
// 								<TextInput
// 									leftIcon={<FaDollarSign className="text-purple-main " />}
// 									type="number"
// 									leftIconClassName="col-span-2"
// 									className="col-span-8"
// 									value={field?.value ? field?.value[1] : 1000}
// 									onChange={(ev) => {
// 										field.onChange([field?.value[0], +ev.target.value]);
// 										(onValueChange as Function)({
// 											price: [field?.value[0], +ev.target.value],
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

interface FormDateRangePickerProps
  extends Omit<FormItemProps & DateRangePickerProps, null> {}

const FormDateRangePicker = ({
  name,
  control,
  className,
  ...props
}: FormDateRangePickerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx(
            'flex flex-row items-center justify-start space-x-1',
            props.classNames?.wrapper,
          )}
        >
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <DateRangePicker
              className={className}
              daterange={field?.value}
              onDateRangeChange={(daterange: DateRange | undefined) => {
                field.onChange(daterange);
              }}
              onDateRangeSelect={props.onValueChange}
            />
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormDateRangePicker.displayName = 'FormDateRangePicker';

interface FormCustomLabelProps {
  htmlFor: string;
  label?: string;
  className?: string;
  required?: boolean;
  custom?: ReactNode;
  i18nPath?: string;
}
const FormCustomLabel = ({
  htmlFor,
  className,
  required,
  label,
  custom,
  i18nPath = 'form.label',
}: FormCustomLabelProps) => {
  const t = useTranslations(i18nPath);

  return (
    <div className='-mb-1 block'>
      <Label
        htmlFor={htmlFor}
        className={clsx(styles.label, className)}
      >
        {capitalize(t(`${label}`))}
        {custom}
        {required && <span className='text-red-500 ml-2'>*</span>}
      </Label>
    </div>
  );
};
FormCustomLabel.displayName = 'FormCustomLabel';

interface FormTextareaProps extends Omit<FormItemProps & TextareaProps, null> {}
const FormTextarea = ({
  name,
  control,
  placeholder,
  ...props
}: FormTextareaProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className='resize-none'
              {...field}
            />
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormTextarea.displayName = 'FormTextarea';

interface FormSelectProps extends FormItemProps {
  options: Option[];
  className?: string;
  defaultValue?: string;
  onSelect?(val: any): void;
  placeholder?: string;
}
const FormSelect = ({
  options,
  i18nPath,
  name,
  control,
  className,
  defaultValue,
  onSelect,
  placeholder,
  ...props
}: FormSelectProps) => {
  const t = useTranslations(i18nPath);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={props.classNames?.wrapper}>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <Select
            onValueChange={(value: string) => {
              field.onChange(value);
              if (onSelect) onSelect(value);
              if (props.onValueChange) props.onValueChange();
            }}
            defaultValue={defaultValue}
          >
            <FormControl>
              <SelectTrigger className={clsx('w-[180px] h-11', className)}>
                <SelectValue
                  placeholder={
                    placeholder ??
                    `${i18nPath ? t(options[0]?.label) : options[0]?.label}`
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options && options?.length > 0 ? (
                  options?.map((option: Option) => (
                    <SelectElement
                      key={option.value}
                      value={option.value}
                    >
                      {i18nPath ? t(option.label) : option.label}
                    </SelectElement>
                  ))
                ) : (
                  <SelectElement value='0'>
                    <Nodata />
                  </SelectElement>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormSelect.displayName = 'FormSelect';

interface FormImageUploaderProps
  extends Omit<FormItemProps & ImageUploaderProps, null> {}
const FormImageUploader = ({
  name,
  control,
  className,
  formats,
  onGetImageUrl,
  ...props
}: FormImageUploaderProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={props.classNames?.wrapper}>
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <ImageUploader
              className={className}
              formats={formats}
              onGetImageUrl={onGetImageUrl}
              {...field}
            />
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormImageUploader.displayName = 'FormImageUploader';

interface FormInstructionsProps {
  className?: string;
  children: ReactNode;
}

const FormInstructions = ({ className, children }: FormInstructionsProps) => {
  return (
    <ul
      className={clsx(
        'mt-2 p-4 bg-emerald-50 flex flex-col justify-start gap-2 text-ss font-light list-disc pl-6 marker:text-blue-500',
        className,
      )}
    >
      {children}
    </ul>
  );
};

FormInstructions.displayName = 'FormInstructions';

interface FormDateTimePickerProps extends FormItemProps {
  className?: string;
  defaultValue?: string;
}
const FormDateTimePicker = ({
  name,
  control,
  className,
  ...props
}: FormDateTimePickerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx(
            'flex flex-col items-start justify-start space-x-1',
            props.classNames?.wrapper,
          )}
        >
          {props.label && (
            <FormCustomLabel
              htmlFor={name}
              label={props.label}
              required={props.required}
              className={props.classNames?.label}
            />
          )}
          <FormControl>
            <DateTimePicker
              className={className}
              date={field.value}
              onDateTimeChange={(date) => field.onChange(date)}
            />
          </FormControl>
          {props.showError && <FormMessage label={props.label} />}
        </FormItem>
      )}
    />
  );
};
FormDateTimePicker.displayName = 'FormDateTimePicker';

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
  FormTextarea,
  FormSelect,
  FormImageUploader,
  FormCombobox,
  FormTagsInput,
  FormRadioBoxList,
  FormCustomLabel,
  FormInstructions,
  FormDateTimePicker,
};
