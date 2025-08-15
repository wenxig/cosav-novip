import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface JoinVipButtonProps {
  /**
   * 按鈕顯示的文字
   */
  buttonText: string;
  
  /**
   * 導向的URL
   */
  redirectUrl: string;
  
  /**
   * 是否顯示此按鈕
   */
  show: boolean;
  
  /**
   * 按鈕背景顏色，預設為 #FBD592
   */
  backgroundColor?: string;
  
  /**
   * 按鈕文字顏色，預設為 #82501C
   */
  textColor?: string;
}

/**
 * VIP 加入按鈕元件
 * 
 * @param props 按鈕屬性
 * @returns 按鈕元件
 */
const JoinVipButton: React.FC<JoinVipButtonProps> = ({
  buttonText,
  redirectUrl,
  show = true,
  backgroundColor = '#FBD592',
  textColor = '#82501C'
}) => {
  const navigate = useNavigate();

  // 如果 show 為 false，則不顯示按鈕
  if (!show) {
    return null;
  }

  // 處理按鈕點擊事件
  const handleClick = () => {
    // 如果是外部 URL，則使用 window.open 開啟
    if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
      window.open(redirectUrl, '_blank');
    } else {
      // 否則使用 React Router 導航
      navigate(redirectUrl);
    }
  };

  return (
    <Box sx={{ width: 'calc(100% - 32px)', mx: 2 ,paddingTop:"15px"}}>{/*1mt=左右各8px*/}
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: 5,
          '&:hover': {
            backgroundColor: backgroundColor,
            opacity: 0.8
          }
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default JoinVipButton; 