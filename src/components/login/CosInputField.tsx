import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import { cBlack80, cMainColor } from '../../data/ColorDef';
import { checkAccount, checkInviteCode, checkPassword, getIcon, InputType, validateEmail } from '../../Shared/function/AccountFunction';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface CosInputFieldProps {
  value: string;
  title: string;
  inputType?: InputType;
  showHelperText?: string;
  setValue: (value: string) => void;
  backgroundColor?: string;
  fontColor?: string;
}

const CosInputField: React.FC<CosInputFieldProps> = ({ 
  value, 
  title, 
  inputType = 'account', 
  showHelperText = '',
  setValue,
  backgroundColor = cMainColor,
  fontColor = cBlack80,
}) => {

  const [showPassword, setShowPassword] = useState(inputType === 'password');
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  /** 檢查是否錯誤,回傳true時外框會變紅色 */
  const checkError = () => {
    if(showHelperText !== ''){
      return false;
    }

    if(value === ''){
      return false;
    }

    switch(inputType){
      case 'email':
        return validateEmail(value) !== '';
      case 'account':
        return checkAccount(value) !== '';
      case 'password':
        return checkPassword(value) !== '';
      case 'inviteCode':
        return checkInviteCode(value) !== '';
      default:
        return false;
    }
  }

  /** 取得錯誤訊息,當不為空時,輸入框下方會顯示錯誤訊息 */
  const getErrorText = () => {
    if(showHelperText !== ''){
      return showHelperText;
    }
    if(value === ''){
      return '';
    }

    switch(inputType){
      case 'email':
        return validateEmail(value);
      case 'account':
        return checkAccount(value);
      case 'password':
        return checkPassword(value);
      case 'inviteCode':
        return checkInviteCode(value);
      default:
        return '';
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <TextField
      fullWidth
      type={showPassword ? 'password' : 'text'}
      value={value}
      onChange={handleChange}
      placeholder={!value ? title : undefined}
      label={value ? title : undefined}
      variant="outlined"
      error={checkError()}
      helperText={getErrorText()}
      slotProps={{
        input: {
          startAdornment: (getIcon(inputType)),
          endAdornment: inputType === 'password' ? (
            <IconButton onClick={handleTogglePassword}>
              {showPassword ?  <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: backgroundColor,
          color: fontColor,
          borderRadius: '10px',
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: cMainColor,
          },
          '&.Mui-focused fieldset': {
            borderColor: cMainColor,
          },
          '& input': {
            fontSize: '18px',
            padding: '10px 5px',
            '&::placeholder': {
              color: fontColor,
              opacity: 0.7
            }
          },
          '& .MuiInputAdornment-root': {
            '& .MuiSvgIcon-root': {
              fontSize: '20px',
            },
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '16px',
          color: fontColor,
          '&.Mui-focused': {
            color: fontColor,
          },
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          fontSize: '14px',
          color: 'red',
        },
      }}
    />
  );
};

export default CosInputField; 