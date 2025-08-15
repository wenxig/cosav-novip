import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, IconButton, Link, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { checkIsLogin, checkIsPay } from '../../Shared/function/AccountFunction';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { cMainColor, cWhite60} from '../../data/ColorDef';
import CircularProgressWithValue from '../base/CircularProgressWithValue';
import { getUserInfo } from '../../data/DataCenter';


const AccountInfo: React.FC = () => {

  const navigate = useNavigate();
  const ReloadCountdownSec = 60;
  
  const [reloadCountdownSeconds, setReloadCountdownSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [vipStatus,  setVipStatus] = useState({text: '', color: ''});

  const maxWidth = document.documentElement.clientWidth;
  
  const userInfo = getUserInfo();
  useEffect(() => {
    if(checkIsLogin()){
      getVipStatus();
    }
  }, []);

  // 清理計時器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const baseBoxStyle = {
    display: 'flex', 
    gap: 2 , 
    width: maxWidth - 40,
    height: '200px',
    padding: "0 20px",
    justifyContent: 'center',
    alignItems: 'center',
  }

  if (!userInfo || !userInfo.uid || userInfo.uid === '') {
    //未登入
    return (
      <Box sx={baseBoxStyle}>
        <Button
          startIcon={<PersonIcon />}
          sx={{
            height: '40px',
            backgroundColor: 'rgba(255, 150, 230, 1)',
            borderRadius: '5px',
            padding: '10px 20px',
          }}
          onClick={() => {
            navigate('/login');
          }}
        >
          <Typography sx={{color: 'white',fontWeight: 'bold'}}>
            登入/注册
          </Typography>
        </Button>
  
      </Box>
    )
  }

  

  // 判斷贊助狀態
  const getVipStatus = () => {
    if (!userInfo.vip_expire_date) {
      setVipStatus({ text: '未赞助', color: 'red' });
      return;
      //return { text: '未赞助', color: 'red' };
    }

    const expireDate = new Date(userInfo.vip_expire_date);
    const now = new Date();
    const dateOnly = userInfo.vip_expire_date.split(' ')[0];

    if (expireDate < now) {
      setVipStatus({ text: `${dateOnly} (已到期)`, color: 'red' });
      return;
      //return { text: `${dateOnly} (已到期)`, color: 'red' };
    }

    setVipStatus({ text: dateOnly, color: cWhite60 });
    //return { text: dateOnly, color: 'white' };
  };

  //const vipStatus = getVipStatus();

  const pannelWidth = document.documentElement.clientWidth - 40;
  const leftWidth = pannelWidth * 0.3;
  const rightWidth = pannelWidth * 0.7;

  const setReloadCountdownSec = () => {
    // 先清除可能存在的舊計時器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setReloadCountdownSeconds(ReloadCountdownSec);

    timerRef.current = setInterval(() => {
      setReloadCountdownSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleRefresh = async () => {
    await checkIsPay();
    getVipStatus();
    setReloadCountdownSec();
  }



  return (
    <Box sx={{ display: 'flex', width: pannelWidth ,padding: '30px 20px'}}>
      {/* 左側圖片區塊 */}
      <Box sx={{ width: leftWidth, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box
          component="img"
          src={userInfo.photo}
          alt="user photo"
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </Box>

      {/* 右側資訊區塊 */}
      <Box sx={{ width: rightWidth, display: 'flex', flexDirection: 'column' }}>
        {/* 歡迎訊息 */}
        <Typography sx={{ fontSize: '14px', color: 'white', fontWeight: 'bold'}}>
          Wellcome {userInfo.username}
        </Typography>

        {/* Email */}
        <Typography sx={{ fontSize: '12px', color: cWhite60 }}>
          {userInfo.email}
        </Typography>

        {/* 贊助狀態 */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <Typography sx={{ fontSize: '12px', color: cWhite60, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>赞助到期日期:</span>
            <span style={{ color: vipStatus.color }}>{vipStatus.text}</span>
          </Typography>
          {reloadCountdownSeconds === 0 && (
            <IconButton
              onClick={handleRefresh}
              sx={{color: cMainColor, padding: '4px'}}
            >
              <RefreshRoundedIcon />
            </IconButton>
          )}
          {reloadCountdownSeconds > 0 && (
            <CircularProgressWithValue nowProgress={reloadCountdownSeconds} maxProgress={ReloadCountdownSec} size={25} />
          )}
        </Box>

        {/* 邀請好友連結 */}
        <Link
          component="button"
          onClick={() => navigate('/my/invite')}
          sx={{
            fontSize: '',
            color: 'yellow',
            textDecoration: 'underline',
            textAlign: 'left',
            p: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              color: '#fbd018'
            }
          }}
        >
          邀请好友，获得VIP天数!  {'>>>'}
        </Link>
      </Box>
    </Box>
  );
};

export default AccountInfo; 