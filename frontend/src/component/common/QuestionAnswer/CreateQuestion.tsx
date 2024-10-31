'use client';

import { styles } from '@/src/constant/styles.constant';
import clsx from 'clsx';
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useFieldArray, type Control } from 'react-hook-form';
import { FormCustomLabel, FormSelect } from '../../form/Form';
import CreateAnswer, { DEFAULT_ANSWER } from './CreateAnswer';
import { Button, Input, useDisclosure } from '@nextui-org/react';
import { GoTrash } from 'react-icons/go';
import { QuestionTypeCode } from '@/src/lib/api/generated';
import { IoMdAddCircleOutline } from 'react-icons/io';
import ConfirmDialog from '../Dialog/ConfirmDialog';
import type { CreateSurveyFormSchema } from '@/src/schemas/survey/CreateSurveyFormSchema';
import { optionify } from '@/src/util/app.util';

interface CreateQuestionProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<CreateSurveyFormSchema>;
}

export const DEFAULT_QUESTION_ANSWER = {
  question: '',
  typeCode: QuestionTypeCode.Single,
  answers: [DEFAULT_ANSWER],
};

function CreateQuestion({
  control,
  register,
  getValues,
  setValue,
  errors,
}: CreateQuestionProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionAnswers',
  });

  return (
    <div>
      {fields?.length > 0 &&
        fields.map((item, index) => (
          <div
            key={`qa-${item.id}`}
            className='col-span-2 mb-8'
          >
            <div className='bg-slate-50 p-6 rounded-md'>
              <div className={clsx(styles.flexStart)}>
                <span className='font-semibold text-nm'>{index + 1}.</span>
                <FormCustomLabel
                  htmlFor='typeCode'
                  label='question'
                />
              </div>

              <div className='grid grid-cols-10 gap-2'>
                <FormSelect
                  name='typeCode'
                  control={control}
                  onSelect={(val) => {
                    setValue(`questionAnswers.${index}.typeCode`, val, {
                      shouldValidate: true,
                    });

                    if (val === QuestionTypeCode.Text) {
                      setValue(
                        `questionAnswers.${index}.answers`,
                        [DEFAULT_ANSWER],
                        { shouldValidate: true },
                      );
                    }
                  }}
                  options={optionify(QuestionTypeCode)}
                  i18nPath='code.question.type'
                  classNames={{
                    wrapper: 'max-w-xs col-span-2 h-[42px] mt-3 bg-white',
                  }}
                />
                <Input
                  variant='underlined'
                  label='question title'
                  className='col-span-8'
                  classNames={{
                    inputWrapper: [
                      errors.questionAnswers?.[index]?.question?.message
                        ? 'border-b-red-500'
                        : 'border-b-slate-300',
                      'border-b-1',
                    ],
                  }}
                  isInvalid={
                    errors.questionAnswers?.[index]?.question?.message
                      ? true
                      : false
                  }
                  errorMessage={
                    errors.questionAnswers?.[index]?.question?.message
                  }
                  {...register(`questionAnswers.${index}.question`)}
                />
              </div>
              <CreateAnswer
                control={control}
                register={register}
                nestedIndex={index}
                questionTypeCode={getValues(
                  `questionAnswers.${index}.typeCode`,
                )}
                errors={errors}
              />
            </div>
            <div className='grid grid-cols-7'>
              <Button
                radius='none'
                color='danger'
                className='transition-all col-span-1 hover:bg-white group hover:border-red-500 border border-red-500 cursor-pointer'
                startContent={
                  <GoTrash className='w-4 h-4 text-white group-hover:text-red-500' />
                }
                onPress={onOpen}
              />
              <Button
                radius='none'
                className={clsx(
                  styles.center,
                  'w-full bg-slate-200 col-span-6',
                )}
                onClick={() => {
                  append(DEFAULT_QUESTION_ANSWER);
                }}
              >
                <IoMdAddCircleOutline className='w-6 h-6' />
                Add Question
              </Button>
            </div>
            <ConfirmDialog
              content={<p>Are you sure you want to remove this question?</p>}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onConfirm={() => {
                remove(index);
                onClose();
              }}
              confirmLabel='Remove'
            />
          </div>
        ))}
    </div>
  );
}

export default CreateQuestion;
