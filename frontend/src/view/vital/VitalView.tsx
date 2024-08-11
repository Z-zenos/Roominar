'use client';

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import './VitalView.css';
import { formatTime } from '@/src/util/date';
import { useMemo } from 'react';

const VitalView = () => {
  const header = {
    VitalDatetime: '鈍的外傷',
    PulseRate: '脈拍(/分)',
    BloodPressure_D: '血圧(mmHg)',
    RespiratoryRate: '呼吸数(/分)',
    SpO2: 'SpO2(%)',
    AVPU: 'AVPU',
    PainScale: '疼痛スケール',
  };

  const vitals = [
    {
      VitalDatetime: '2024-04-04 19:12:11',
      PulseRate: 72,
      BloodPressure_D: 123,
      BloodPressure_S: 67,
      RespiratoryRate: 18,
      SpO2: 98,
      AVPU: 'A',
      PainScale: 9,
      GCS: null,
    },
    {
      VitalDatetime: '2024-04-04 19:12:11',
      PulseRate: 80,
      BloodPressure_D: 85,
      BloodPressure_S: 125,
      RespiratoryRate: 16,
      SpO2: 97,
      AVPU: 'V',
      PainScale: 5,
      GCS: 14,
    },
  ];

  const transposeData = (data) => {
    const transposed = Object.keys(header).map((field) =>
      data.map((row) => {
        if (!row[field]) return '';
        if (field === 'VitalDatetime') return formatTime(row[field]);
        if (field === 'BloodPressure_D') return `${row[field]}/${row['BloodPressure_S']}`;

        return row[field];
      }),
    );
    return { transposed };
  };

  const { transposed } = useMemo(() => transposeData(vitals), [vitals]);

  return (
    <div className='bg-white rounded-md p-3'>
      <div className='text-lg font-semibold'>バイタル情報</div>
      <div className='mt-6 space-y-3 w-full overflow-auto'>
        <TableContainer>
          <Table sx={{ minWidth: 600 }} style={{ tableLayout: 'fixed' }}>
            <TableBody>
              {Object.keys(header).map((field, index) => (
                <TableRow key={index}>
                  <TableCell variant='head'>{header[field]}</TableCell>
                  {transposed[index].map((cell, cellIndex) => (
                    <TableCell sx={{ color: '#2196f3' }} key={cellIndex}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default VitalView;
