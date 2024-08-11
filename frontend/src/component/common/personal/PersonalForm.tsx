'use client';
import InputSelectCommon from '@/src/component/form/InputSelectCommon';
import InputTextFieldCommon from '@/src/component/form/InputTextFieldCommon';
import QRLabel from '@/src/component/form/QRLabel';
import type { GetPatientInformationResponse } from '@/src/lib/api/generated';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
interface IForm {
  incidentNo: string;
  injuryDatetime: string | null;
  firstResponder: string | null;
  firstDoctor: string | null;
  identifyNo: string | null;
  dateOfBirth: string | null;
  name: string | null;
  bloodType: string | null;
  gender: string | null;
  allergies: string | null;
  service: string | null;
  unit: string | null;
  consentRB: string | null;
  consentSB: string | null;
  consentPRE: string | null;
  consentST: string | null;
  LAST: string | null;
}
const PersonalForm = ({ data }: { data: GetPatientInformationResponse }) => {
  const { injuryDatetime, dateOfBirth, ...rest } = data;
  const { control, watch } = useForm<IForm>({
    defaultValues: { ...rest, dateOfBirth: dateOfBirth && dayjs(dateOfBirth).format('YYYY年M月D日') },
  });

  return (
    <div className='w-full flex justify-center'>
      <div className='mt-6 space-y-3 w-[575px]'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label='受傷日'
            sx={{ width: '100%' }}
            slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
            value={injuryDatetime && dayjs(injuryDatetime)}
            readOnly
            format='YYYY年M月D日 HH:ss'
          />
        </LocalizationProvider>
        <div className='flex justify-start items-start gap-4'>
          <InputTextFieldCommon
            InputProps={{
              readOnly: true,
            }}
            helperText={`${watch('firstResponder')?.length || 0}/12`}
            control={control}
            name='firstResponder'
            className='w-[500px]'
            label='処置者'
            variant='outlined'
          />
          <InputTextFieldCommon
            InputProps={{
              readOnly: true,
            }}
            helperText={`${watch('firstDoctor')?.length || 0}/12`}
            control={control}
            name='firstDoctor'
            className='w-[500px]'
            label='担当医'
            variant='outlined'
          />
        </div>
        <div className='flex justify-start items-start gap-4'>
          <InputTextFieldCommon
            InputProps={{
              readOnly: true,
            }}
            helperText={`${watch('identifyNo')?.length || 0}/12`}
            control={control}
            name='identifyNo'
            className='w-[500px]'
            label={<QRLabel label='認識番号' />}
            variant='outlined'
          />
          <InputTextFieldCommon
            InputProps={{
              readOnly: true,
            }}
            control={control}
            name='dateOfBirth'
            className='w-[500px]'
            label={<QRLabel label='生年月日' />}
            variant='outlined'
          />
        </div>
        <div className='flex justify-start items-start gap-4'>
          <InputTextFieldCommon
            InputProps={{
              readOnly: true,
            }}
            control={control}
            name='name'
            className='w-[500px]'
            label={<QRLabel label='氏名' />}
            variant='outlined'
          />
          <InputSelectCommon
            control={control}
            name='bloodType'
            className='w-[500px]'
            label={<QRLabel label='血液型' />}
            variant='outlined'
            options={[{ label: data?.bloodType, value: data?.bloodType }]}
            readOnly
          />
        </div>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex-1'>
            <FormControl>
              <FormLabel id='demo-row-radio-buttons-group-label'>性別</FormLabel>

              <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group'>
                <div className='flex justify-start items-center'>
                  <FormControlLabel
                    value='male'
                    control={<Radio checked={data?.gender === 'male'} disabled />}
                    label='男性'
                  />
                  <FormControlLabel
                    value='female'
                    control={<Radio checked={data?.gender === 'female'} disabled />}
                    label='男性'
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          <div className='flex-1'>
            <InputTextFieldCommon
              InputProps={{
                readOnly: true,
              }}
              helperText={`${watch('allergies')?.length || 0}/12`}
              control={control}
              name='allergies'
              className='w-[500px]'
              label={<QRLabel label='アレルギー' />}
              variant='outlined'
            />
          </div>
        </div>
        <div className='flex justify-start items-start gap-4'>
          <InputSelectCommon
            control={control}
            name='service'
            className='w-[500px]'
            label='所属'
            variant='outlined'
            options={[{ label: data?.service, value: data?.service }]}
            readOnly
          />
          <InputSelectCommon
            control={control}
            name='unit'
            className='w-[500px]'
            label='ユニット名'
            variant='outlined'
            options={[{ label: data?.unit, value: data?.unit }]}
            readOnly
          />
        </div>
        <div>
          <FormControl component='fieldset' variant='standard'>
            <FormLabel component='legend'>同意s</FormLabel>
            <FormGroup>
              <div className='flex justify-start items-center gap-6'>
                <Controller
                  name='consentRB'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={!!data?.consentRB} disabled />}
                      label='受'
                    />
                  )}
                />
                <Controller
                  name='consentSB'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} disabled />}
                      checked={!!data?.consentSB}
                      label='供'
                    />
                  )}
                />
                <Controller
                  name='consentPRE'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} disabled />}
                      checked={!!data?.consentPRE}
                      label='プレ'
                    />
                  )}
                />
                <Controller
                  name='consentST'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} disabled />}
                      checked={!!data?.consentST}
                      label='手術・処置レ'
                    />
                  )}
                />
              </div>
            </FormGroup>
          </FormControl>
        </div>
        <InputTextFieldCommon
          InputProps={{
            readOnly: true,
          }}
          helperText={`${watch('LAST')?.length || 0}/12`}
          control={control}
          name='LAST'
          className='w-[500px]'
          label='LAST4'
          variant='outlined'
        />
      </div>
    </div>
  );
};

export default PersonalForm;
