import type { DialogProps, PaperProps } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export interface ICustomDialogProps {
  dialogTitle: string | React.ReactNode;
  dialogContent: string | React.ReactNode;
  handleClose: () => void;
  open: boolean;
  PaperProps?: PaperProps;
}

const CustomDialog: React.FC<DialogProps & ICustomDialogProps> = ({
  dialogTitle,
  dialogContent,
  handleClose,
  open,
  maxWidth,
  PaperProps,
}) => {
  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth={maxWidth ?? 'sm'} PaperProps={PaperProps}>
      <DialogTitle className='w-full' sx={{ padding: '12px' }}>
        {dialogTitle}
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          padding: 0,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className='w-full' sx={{ padding: '0px 12px 12px' }}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
