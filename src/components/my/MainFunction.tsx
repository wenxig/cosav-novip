import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DraftsIcon from '@mui/icons-material/Drafts';
import QuizIcon from '@mui/icons-material/Quiz';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { useNavigate } from 'react-router-dom';
import CosCheckIsLogin from '../base/check/CosCheckIsLogin';
import { checkIsLogin } from '../../Shared/function/AccountFunction';


const width = document.documentElement.clientWidth;

const iconStyle = {
  width: 30,
  height: 30,
}
const iconButtonStyle = {
  width: width - 40,
  height: 60,
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'flex-start',
  gap: 1,
  color: 'white',
  border: '1px solid #666666',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  padding: '0 20px',
  textTransform: 'none'
}

const MainFunction: React.FC = () => {
  const navigate = useNavigate();

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);

  const onFeedbackClick = () => {
    if(checkIsLogin()){
      navigate('/my/feedback');
    }else{
      setCheckIsLoginOpen(true);
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      color: 'white',
      alignItems: 'center',
      padding: '10px 20px'
    }}>

        <Button
          startIcon={<Diversity3Icon sx={iconStyle} />}
          sx={iconButtonStyle}
          fullWidth
          onClick={() => navigate('/my/swp/advertise')}
        >
          <Typography sx={{ fontSize: 20, }}>刊登广告</Typography>
        </Button>

        <Button
          startIcon={<QuizIcon sx={iconStyle} />}
          sx={iconButtonStyle}
          fullWidth
          onClick={() => navigate('/my/swp/faq')}
        >
          <Typography sx={{ fontSize: 20 }}>常见问题</Typography>
        </Button>

        <Button
          startIcon={<DraftsIcon sx={iconStyle} />}
          sx={iconButtonStyle}
          fullWidth
          onClick={onFeedbackClick}
        >
          <Typography sx={{ fontSize: 20 }}>意见反馈</Typography>
        </Button>

        <Button
          startIcon={<PrivacyTipIcon sx={iconStyle} />}
          sx={iconButtonStyle}
          fullWidth
          onClick={() => navigate('/my/swp/privacy')}
        >
          <Typography sx={{ fontSize: 20 }}>隐私政策&使用者条款</Typography>
        </Button>

        {/* 檢查是否已登入 */}
        <CosCheckIsLogin
          open={checkIsLoginOpen}
          onCancel={() => {setCheckIsLoginOpen(false)}}
        />
    </Box>
  );
};

export default MainFunction; 