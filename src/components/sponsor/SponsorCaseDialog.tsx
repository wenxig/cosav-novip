import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {  cBlack80} from '../../data/ColorDef';
import { ifApiPaymentFunc } from '../../Shared/Api/interface/OrderInterface';
import CosCheckIsLogin from '../base/check/CosCheckIsLogin';
import { checkIsLogin } from '../../Shared/function/AccountFunction';

interface CosConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  pfunc: ifApiPaymentFunc[];
  note: string[];
  selectedPKey: string;
}

const SponsorCaseDialog: React.FC<CosConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  pfunc,
  note,
  selectedPKey,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFunc, setSelectedFunc] = useState<ifApiPaymentFunc | null>(null);
  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);

  const width = document.documentElement.clientWidth * 0.8;
  const height = document.documentElement.clientHeight * 0.9;

  const handleClose = () => {
    onCancel();
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, func: ifApiPaymentFunc) => {
    setAnchorEl(event.currentTarget);
    setSelectedFunc(func);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFunc(null);
  };

  const handlePayment = (paymentUrl: string) => {
    if(checkIsLogin()){
      //recordLastEnterBillingDialogTime();
      //console.log("paymentUrl = ",paymentUrl.replace('pay_key', selectedPKey));
      //alert("paymentUrl = "+paymentUrl.replace('pay_key', selectedPKey));
      window.open(paymentUrl.replace('pay_key', selectedPKey), '_blank');
      handleMenuClose();
    }else{
      setCheckIsLoginOpen(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'transparent',
            color: 'black',
            minWidth: '300px',
            width: width,
            height: height,
            borderRadius: '12px',
          }
        }
      }}
    >
      {/* 對話主內容 */}
      <Box
        sx={{
          borderRadius: '12px',
          backgroundColor: 'transparent',
        }}
      >
        {/* 對話主內容的標題 */}
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: '10px 0px',
        }}>
          
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{
              color: 'white',
              border: '3px solid white',
              fontSize: '3rem',
              '& .MuiSvgIcon-root': {
                fontSize: '14px'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* 對話主內容的內容 */}
        <DialogContent sx={{ padding: '20px 10px' , textAlign: 'center' ,backgroundColor: 'white' ,borderRadius: '12px'}}>
          <DialogContentText sx={{ color: 'black',fontSize: '24px'}}>
            付费方式选择
          </DialogContentText>

          <DialogContentText sx={{ color: 'black',fontSize: '14px'}}>
            帐单不会显示任何成人讯息，本站采SSL安全交易验证
          </DialogContentText>

          {/* 支付方式按鈕 */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            marginTop: 2
          }}>
            {pfunc
              .filter(func => func.payment_plans.length === 1)
              .map((func, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={
                    <img 
                      src={func.icon} 
                      alt={func.name}
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain'
                      }}
                    />
                  }
                  onClick={() => handlePayment(func.payment_plans[0].payment_url)}
                  sx={{
                    width: '45%',
                    justifyContent: 'flex-start',
                    padding: '8px 16px',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {func.name}
                </Button>
              ))
            }
          </Box>

          {/* 下拉式支付方式 */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            marginTop: 3,
            padding: '0 20px'
          }}>
            {pfunc
              .filter(func => func.payment_plans.length > 1)
              .map((func, index) => (
                <React.Fragment key={index}>
                  <Button
                    variant="outlined"
                    startIcon={
                      <img 
                        src={func.icon} 
                        alt={func.name}
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: 'contain'
                        }}
                      />
                    }
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(e) => handleMenuClick(e, func)}
                    sx={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '8px 16px',
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                      '&:hover': {
                        borderColor: 'rgba(0, 0, 0, 0.5)',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    {func.name}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedFunc?.name === func.name}
                    onClose={handleMenuClose}
                    slotProps={{
                      paper: {
                        sx: {
                          width: width * 0.7,
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    {selectedFunc?.payment_plans.map((plan, planIndex) => (
                      <MenuItem 
                        key={planIndex}
                        onClick={() => handlePayment(plan.payment_url)}
                      >
                        <ListItemText primary={plan.name} />
                      </MenuItem>
                    ))}
                  </Menu>
                </React.Fragment>
              ))
            }
          </Box>

          <Box
            sx={{
              width: width * 0.8,
              color: cBlack80,
              textAlign: 'left',
              fontSize: '16px',
              whiteSpace: 'pre-line',
              padding: '30px 15px'
            }}
            dangerouslySetInnerHTML={{ 
              __html: note
                .map(benefit => benefit.replace(/\n/g, '<br>'))
                .join('<br>') || '' 
            }}
          />
        </DialogContent>

        
      </Box>

      {/* 檢查是否已登入 */}
      <CosCheckIsLogin
        open={checkIsLoginOpen}
        onCancel={() => {setCheckIsLoginOpen(false)}}
      />
    </Dialog>
  );
};

export default SponsorCaseDialog; 