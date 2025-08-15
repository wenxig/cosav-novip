import React, { useEffect } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

export type CosMsgType = 'error' | 'success' | 'info' | 'warning';

interface CosMessageAndLoadingProps {
  isloading: boolean;
  msgType: CosMsgType;
  msg: string;
  useSnackbar?: boolean;
  onClose: () => void;
}

const CosMessageAndLoading: React.FC<CosMessageAndLoadingProps> = ({
  isloading = false,
  msgType = 'info',
  msg,
  useSnackbar = true,
  onClose
}) => {

  // 當有錯誤訊息或成功訊息時，3秒後自動關閉
  useEffect(() => {
    if (msg && !useSnackbar) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [msg, onClose, useSnackbar]);

  if (!msg && !isloading) {
    return null;
  }

  if (useSnackbar) {
    return (
      <>
        <Snackbar
          open={msg !== ''}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={onClose} 
            severity={msgType} 
            sx={{ width: '100%' ,fontSize:18}}
          >
            {msg}
          </Alert>
        </Snackbar>
        <Backdrop
          sx={{ 
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          open={isloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }

  return (
    <>
      <Alert 
        onClose={onClose} 
        severity={msgType} 
        sx={{ width: 'auto' }}
      >
        {msg}
      </Alert>
      <Backdrop
          sx={{ 
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          open={isloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    </>
  );
};

export default CosMessageAndLoading; 