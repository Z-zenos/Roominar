'use client';

import { styles } from '@/src/constants/styles.constant';
import { QuestionTypeCode } from '@/src/lib/api/generated';
import type { CreateSurveyFormSchema } from '@/src/schemas/survey/CreateSurveyFormSchema';
import { Checkbox, Input, Radio, RadioGroup } from '@nextui-org/react';
import clsx from 'clsx';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { SlClose } from 'react-icons/sl';

interface CreateAnswerProps {
  nestedIndex: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  questionTypeCode: QuestionTypeCode;
  errors: FieldErrors<CreateSurveyFormSchema>;
}

export const DEFAULT_ANSWER = {
  isCorrect: false,
  answer: '',
};

function CreateAnswer({
  nestedIndex,
  control,
  register,
  questionTypeCode = QuestionTypeCode.Single,
  errors,
}: CreateAnswerProps) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questionAnswers.${nestedIndex}.answers`,
  });

  return (
    <RadioGroup>
      {fields.map((item, index) => (
        <div
          key={`a-${item.id}`}
          className='flex justify-start items-center gap-3 '
        >
          {questionTypeCode === QuestionTypeCode.Multiple && (
            <Checkbox
              radius='none'
              className='mt-4'
              size='lg'
              {...register(
                `questionAnswers.${nestedIndex}.answers.${index}.isCorrect`,
              )}
            />
          )}
          {questionTypeCode === QuestionTypeCode.Single && (
            <Radio
              className='mt-4'
              value={item.id}
              size='lg'
              {...register(
                `questionAnswers.${nestedIndex}.answers.${index}.isCorrect`,
              )}
            />
          )}
          <Input
            variant='underlined'
            label='answer'
            isInvalid={
              errors.questionAnswers?.[nestedIndex]?.answers?.[index]?.answer
                ?.message
                ? true
                : false
            }
            classNames={{
              inputWrapper: [
                errors.questionAnswers?.[nestedIndex]?.answers?.[index]?.answer
                  ?.message
                  ? 'border-b-red-500'
                  : 'border-b-slate-300',
                'border-b-1',
              ],
            }}
            errorMessage={
              errors.questionAnswers?.[nestedIndex]?.answers?.[index]?.answer
                ?.message
            }
            {...register(
              `questionAnswers.${nestedIndex}.answers.${index}.answer`,
            )}
          />
          {questionTypeCode !== QuestionTypeCode.Text && (
            <SlClose
              className='w-6 h-6 mt-5 text-red-500 cursor-pointer'
              onClick={() => remove(index)}
            />
          )}
        </div>
      ))}
      {questionTypeCode !== QuestionTypeCode.Text && (
        <p
          className={clsx(
            styles.flexStart,
            'underline text-primary my-4 cursor-pointer',
          )}
          onClick={() => append(DEFAULT_ANSWER)}
        >
          <IoMdAddCircleOutline className='w-5 h-5' />
          <span className=' transition-all hover:bg-primary hover:text-white'>
            Add answer
          </span>
        </p>
      )}
    </RadioGroup>
  );
}

export default CreateAnswer;
