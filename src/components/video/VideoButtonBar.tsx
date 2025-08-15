import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import { ifVideoDetail, ifVideoFavoriteApiResponse } from '../../Shared/Api/interface/VideoInterface';
import { cBasePanel } from '../../data/ColorDef';
import { addFavoriteVideo, getSiteSetting, removeFavoriteVideo, setFeedbackVideoData, TempFeedbacVideoData } from '../../data/DataCenter';
import { useNavigate } from 'react-router-dom';
import CosCheckIsLogin from '../base/check/CosCheckIsLogin';
import { checkIsLogin } from '../../Shared/function/AccountFunction';
import { checkIsFavoriteVideo } from '../../Shared/function/VideoFunction';
import { sendVideoFavorite } from '../../Shared/Api/CosApi';
import CosMessageAndLoading from '../base/CosMessageAndLoading';

interface VideoButtonBarProps {
  videoId: string;
  videoUrl: string;
  player: number;
  line: number;
  reason: string;
  videoData: ifVideoDetail;
}

const VideoButtonBar: React.FC<VideoButtonBarProps> = ({ videoId, videoUrl, player, line , reason, videoData }) => {

  const navigate = useNavigate();

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(checkIsFavoriteVideo(videoId||""));

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);


  const handleFavoriteClick = () => {
    // 檢查是否已登入
    if(!checkIsLogin()){
      setCheckIsLoginOpen(true);
      return;
    }

    setIsLoading(true);
    sendVideoFavorite(videoId).then((res:ifVideoFavoriteApiResponse)=>{
      if(res.result === "success" && res.data?.status === "ok"){
        if(isFavorite){
          // 取消收藏
          removeFavoriteVideo(videoId);
        }else{
          // 收藏
          addFavoriteVideo(videoId);
        }
        setShowMsg(isFavorite?"取消收藏成功":"收藏成功", 'success');
        setIsFavorite(!isFavorite);
      }else{
        setShowMsg(res.message||"操作失败,请稍后再试", 'error');
      }
      setIsLoading(false);
    });
  };


  // 處理翻牆神器按鈕點擊
  const handleVpnClick = () => {
    window.open(getSiteSetting().vpn_url, '_blank');
  };

  const handleReportClick = () => {

    if(!checkIsLogin()){
      setCheckIsLoginOpen(true);
      return;
    }
    
    const tmpInfo:TempFeedbacVideoData = {
      videoId: videoData.id,
      videoUrl: videoUrl,
      player: player.toString(),
      line: line.toString(),
      reason: reason,
    }

    setFeedbackVideoData(tmpInfo);
    navigate('/my/feedback');
  };

  // 按鈕通用樣式
  const buttonStyle = {
    backgroundColor: cBasePanel,
    color: 'rgba(255, 255, 255, 0.6)', // white60
    border: 'none',
    borderRadius: 1,
    textTransform: 'none',
    minWidth: '30px',
    py: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(51, 51, 51, 0.7)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 12,
    },
    '& .MuiButton-startIcon': {
      marginRight: 0.5, // 縮小圖標和文字之間的間距
    },
  };
  
  const fontStyle = {
    fontSize: 12,
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        py: 1,
        gap: 1.5, // 按鈕之間的間距
      }}
    >
      {/* 收藏按鈕 */}
      <Button
        variant="contained"
        startIcon={<FavoriteIcon sx={{color:isFavorite?"red":"white"}}/>}
        sx={buttonStyle}
        onClick={handleFavoriteClick}
      >
        <Typography variant="caption" sx={fontStyle}>
          {isFavorite?"已收藏":"收藏"}
        </Typography>
      </Button>

      {/* 翻牆神器按鈕 */}
      <Button
        variant="contained"
        startIcon={<ThumbUpOffAltIcon />}
        onClick={handleVpnClick}
        sx={buttonStyle}
      >
        <Typography variant="caption" sx={fontStyle}>
          翻墙神器
        </Typography>
      </Button>

      {/* 問題回報按鈕 */}
      <Button
        variant="contained"
        startIcon={<InsertCommentOutlinedIcon />}
        sx={buttonStyle}
        onClick={handleReportClick}
      >
        <Typography variant="caption" sx={fontStyle}>
          問題回報
        </Typography>
      </Button>


      {/* 確認是否登入訊息框 */}
      <CosCheckIsLogin
        open={checkIsLoginOpen}
        onCancel={() => {setCheckIsLoginOpen(false)}}
      />

      {/* 提示訊息 */}
      <CosMessageAndLoading
        isloading={isLoading}
        msgType={msgType}
        msg={msg}
        onClose={()=>{
          setShowMsg('', 'info');
        }}
      />
    </Box>
  );
};

export default VideoButtonBar; 