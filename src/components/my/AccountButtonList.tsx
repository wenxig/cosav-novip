import React, { useState } from 'react';
import { Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaidIcon from '@mui/icons-material/Paid';
import AccountButton from './AccountButton';
import { useNavigate } from 'react-router-dom';
import CosCheckIsLogin from '../base/check/CosCheckIsLogin';
import { checkIsLogin } from '../../Shared/function/AccountFunction';





const AccountButtonList: React.FC = () => {
  const navigate = useNavigate();

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);

  const handleFavoriteClick = () => {
    if(checkIsLogin()){
      navigate('/my/favorite/video/1');
    }else{
      setCheckIsLoginOpen(true);
    }
  }

  const handleHistoryClick = () => {
    if(checkIsLogin()){
      navigate('/my/view/video/1');
    }else{
      setCheckIsLoginOpen(true);
    }
  }

  const handleSponsorClick = () => {
    if(checkIsLogin()){
      navigate('/my/sponsor');
    }else{
      setCheckIsLoginOpen(true);
    }
  }

  const handleAccountClick = () => {
    if(checkIsLogin()){
      navigate('/my/account');
    }else{
      setCheckIsLoginOpen(true);
    }
  }

  const maxWidth = document.documentElement.clientWidth;
  return (

    <Box sx={{ 
      display: 'flex', 
      width: maxWidth - 40,
      padding: "0 20px",
      justifyContent: 'space-between',
      gap: '8px'
    }}
    >
      <AccountButton
        icon={<FavoriteIcon sx={{color: '#e20000'}}/>}
        text="我的收藏"
        onClick={handleFavoriteClick}
      />
      <AccountButton
        icon={<HistoryIcon sx={{color: '#fc2ab8'}}/>}
        text="观看记录"
        onClick={handleHistoryClick}
      />
      <AccountButton
        icon={<PaidIcon sx={{color: '#fbd018'}}/>}
        text="赞助记录"
        onClick={handleSponsorClick}
      />
      <AccountButton
        icon={<AccountCircleIcon sx={{color: 'white'}}/>}
        text="帐号资讯"
        onClick={handleAccountClick}
      />

      {/* 檢查是否已登入 */}
      <CosCheckIsLogin
          open={checkIsLoginOpen}
          onCancel={() => {setCheckIsLoginOpen(false)}}
        />

    </Box>
  );
};

export default AccountButtonList; 