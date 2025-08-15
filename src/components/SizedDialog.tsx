import React from 'react';
import { Dialog, DialogProps, IconButton } from '@mui/material';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import { cBasePanel } from '../data/ColorDef';

interface SizedDialogProps extends Omit<DialogProps, 'maxWidth'> {
  width?: number | string;
  backgroundColor?: string;
  closeButtonColor?: string | undefined;
}

const SizedDialog: React.FC<SizedDialogProps> = ({
  width = 'sm',
  backgroundColor = 'transparent',
  closeButtonColor = 'white',
  children,
  ...props
}) => {

    //關閉的方法
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClose) {
      props.onClose(event, 'backdropClick');
    }
  };

  return (
    <Dialog
      {...props}
      maxWidth={false}
      fullWidth={true}
      sx={{
        '& .MuiDialog-paper': {
          width: typeof width === 'number' ? `${width}px` : width,
          maxWidth: typeof width === 'number' ? `${width}px` : width,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          backgroundColor: backgroundColor || 'transparent',
        },
        '& .MuiDialogContent-root': {
          padding: 0,
          margin: 0,
        },
      }}
    >
      {closeButtonColor && (
        <IconButton 
          onClick={handleClose}
          sx={{
            color: closeButtonColor,
            //fontSize: '3rem',
            '& .MuiSvgIcon-root': {
              fontSize: '3rem'
            }
          }}
          aria-label="close"
        >
          <DangerousOutlinedIcon sx={{backgroundColor: cBasePanel,borderRadius: '50%'}}/>
        </IconButton>
      )}
      {children}
    </Dialog>
  );
};

export default SizedDialog; 