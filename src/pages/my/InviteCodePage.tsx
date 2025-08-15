import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { getUserInfo } from '../../data/DataCenter';
import { cMainColor } from '../../data/ColorDef';
import BaseMotionDiv from '../BaseMotionDiv';
import TopTitleBar from '../../components/TopTitleBar';
import { checkIsVip } from '../../Shared/function/AccountFunction';
import PaidIcon from '@mui/icons-material/Paid';
import { useNavigate } from 'react-router-dom';

const InviteCodePage: React.FC = () => {

  const navigate = useNavigate();
  const maxWidth = document.documentElement.clientWidth;

  const createText = (text: string,ml:number=0,color:string='white') => (
    <Typography 
      sx={{ 
        color: color, 
        mb: 1,
        fontSize: '16px',
        lineHeight: '1.5',
        marginLeft: ml
      }}
    >
      {text}
    </Typography>
  );

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'COSAV 邀請碼',
        text: `我的邀请码是：${getUserInfo()!.invitation_code}，快来加入吧！`,
        url: 'https://cosav-cos.cc/'
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 如果瀏覽器不支援 Web Share API，複製到剪貼簿
        await navigator.clipboard.writeText(shareData.text);
        alert('邀請碼已複製到剪貼簿！');
      }
    } catch (err) {
      console.error('分享失敗:', err);
      // 如果複製到剪貼簿也失敗，顯示錯誤訊息
      alert('分享失敗，請稍後再試');
    }
  };

  const handleVip = ()=>{
    navigate('/sponsor');
  }

  const isVip = checkIsVip();

  const userInfo = getUserInfo();

  if(!userInfo){
    return (
      <BaseMotionDiv>
        <TopTitleBar title="邀請碼" />
        <Box sx={{ width: maxWidth }}>
          {createText('请先登录',0,'red')}
        </Box>
      </BaseMotionDiv>
    )
  }

  return (
    <BaseMotionDiv>
      <TopTitleBar title="邀請碼" />
      <Box sx={{ width: maxWidth }}>
        {/* 邀請碼顯示區域 */}
        <Box
          sx={{
            width: maxWidth * 0.75,
            backgroundColor: 'black',
            border: '1px solid white',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px auto',
            padding: '20px',
            gap: 2
          }}
        >
          {/* 邀請碼標題 */}
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            邀请码
          </Typography>

          {/* 邀請碼內容 */}
          <Typography
            sx={{
              color: cMainColor,
              fontSize: '24px',
            }}
          >
            {userInfo.invitation_code}
          </Typography>

          {/* 已邀請人數 */}
          <Typography
            sx={{
              color: 'white',
            }}
          >
            已邀请人数 {userInfo.invitation_num}/12
          </Typography>

          {/* 分享按鈕 */}
          {isVip&&
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                backgroundColor: cMainColor,
                color: 'white',
                '&:hover': {
                  backgroundColor: cMainColor,
                  opacity: 0.8
                }
              }}
            >
              分享邀请码
            </Button>
          }
          {!isVip&&
            <Button
              startIcon={<PaidIcon />}
              onClick={handleVip}
              sx={{
                backgroundColor: cMainColor,
                color: 'white',
                '&:hover': {
                  backgroundColor: cMainColor,
                  opacity: 0.8
                }
              }}
            >
              成为VIP
            </Button>
          }
        </Box>

        {/* 說明文字區域 */}
        <Box sx={{ 
          width: maxWidth * 0.8,
          padding: '30px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {createText('1.需成为VIP后才能分享邀请码。',0,'red')}
          {createText('2.受邀者输入邀请码后，首次充值时:')}
          {createText('   受邀者充值7天，邀请者获得1天VIP。',2)}
          {createText('   受邀者充值1个月，邀请者获得7天VIP。',2)}
          {createText('   受邀者充值3个月，邀请者获得21天VIP。',2)}
          {createText('   受邀者充值半年，邀请者获得1个月VIP。',2)}
          {createText('   受邀者充值一年，邀请者获得2个月VIP。',2)}
          {createText('3.仅VIP可邀请人，至多可邀12人。')}
          {createText('4.受邀者获得 [7日体验卡]机会。')}
          {createText('5.注意 : VIP到期后，被邀请人产生的充值会无法得到回馈。',0,'red')}
        </Box>
      </Box>
    </BaseMotionDiv>
  );
};

export default InviteCodePage; 