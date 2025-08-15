import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import InfoMarkIcon from '@mui/icons-material/Info';
import { cMainColor, cWhite80 } from '../../data/ColorDef';

interface CosConfirmDialogProps {
  dialogType?: 'question' | 'info';
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CosConfirmDialog: React.FC<CosConfirmDialogProps> = ({
  dialogType = 'question',
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = '確認',
  cancelText = '取消'
}) => {

  const width = 320;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (cancelButtonRef.current) {
      cancelButtonRef.current.blur();
    }
    onCancel();
  }

  const mainIconStyle = {
    color: cWhite80,
    borderRadius: '50%',
    fontSize: '80px', 
    boxShadow: '0px 0px 5px 8px rgb(45, 45, 45)'
  }
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onCancel();
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'transparent',
            color: 'white',
            minWidth: '300px',
            width: width,
            borderRadius: '12px',
          }
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
      }}>
        {dialogType === 'question' && (
          <QuestionMarkIcon  sx={{...mainIconStyle, backgroundColor: 'orange',}} />
        )}
        {dialogType === 'info' && (
          <InfoMarkIcon sx={{...mainIconStyle, backgroundColor: 'blue',}} />
        )}
      </Box>
      {/* LOGO的背景 */}
      <Box sx={{height: '40px'}}></Box>
      {/* 對話主內容 */}
      <Box
        sx={{
          borderRadius: '12px',
          backgroundColor: 'rgb(45, 45, 45)',
        }}
      >
        {/* 對話主內容的標題 */}
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'right', 
          alignItems: 'center',
          padding: '4px 12px',
        }}>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={onCancel}
            aria-label="close"
            sx={{ color: cWhite80}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* 對話主內容的內容 */}
        <DialogContent sx={{ padding: '20px 24px'}}>
          <DialogContentText sx={{ 
            color: cWhite80,
            textAlign: 'center',
            padding: '10px 0px',
            fontSize: '22px'
          }}>
            {title}
          </DialogContentText>

          <DialogContentText sx={{ 
            color: cWhite80,
            textAlign: 'center'
          }}>
            {content}
          </DialogContentText>
        </DialogContent>

        {/* 對話主內容的按鈕 */}
        <DialogActions sx={{ 
          //width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '16px 24px',
        }}>
          {dialogType === 'question' && (
            <Button 
              ref={cancelButtonRef}
              onClick={handleClose}
              sx={{ 
                width: '120px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'red',
                borderRadius: '15px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
            {cancelText}
            </Button>
          )}
          <Button 
            onClick={onConfirm}
            variant="contained"
            sx={{ 
              width: '120px',
              fontWeight: 'bold',
              backgroundColor: cMainColor,
              borderRadius: '15px',
              color: 'white',
              '&:hover': {
                backgroundColor: `${cMainColor}dd`
              }
            }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CosConfirmDialog; 