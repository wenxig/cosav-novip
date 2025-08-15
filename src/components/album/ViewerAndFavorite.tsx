import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { cBasePanel } from '../../data/ColorDef';
import CosCheckIsLogin from '../base/check/CosCheckIsLogin';
import CosMessageAndLoading from '../base/CosMessageAndLoading';
import { checkIsFavoriteAlbum } from '../../Shared/function/VideoFunction';
import { checkIsLogin } from '../../Shared/function/AccountFunction';
import { addFavoriteAlbum, removeFavoriteAlbum } from '../../data/DataCenter';
import { sendAlbumFavorite } from '../../Shared/Api/CosApi';
import { ifAlbumFavoriteApiResponse } from '../../Shared/Api/interface/AlbumInterface';

interface ViewerAndFavoriteProps {
  viewer?: string;
  albumId?: string;
}

const componentWidth = document.documentElement.clientWidth;

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
  fontSize: '18px',
};

const ViewerAndFavorite: React.FC<ViewerAndFavoriteProps> = ({
  viewer = 0,
  albumId,
}) => {

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(checkIsFavoriteAlbum(albumId||""));

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
    sendAlbumFavorite(albumId!).then((res:ifAlbumFavoriteApiResponse)=>{
      if(res.result === "success" && res.data?.status === "ok"){
        if(isFavorite){
          // 取消收藏
          removeFavoriteAlbum(albumId!);
        }else{
          // 收藏
          addFavoriteAlbum(albumId!);
        }
        setShowMsg(isFavorite?"取消收藏成功":"收藏成功", 'success');
        setIsFavorite(!isFavorite);
      }else{
        setShowMsg(res.message||"操作失败,请稍后再试", 'error');
      }
      setIsLoading(false);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: componentWidth,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        my: 0.5,
      }}
    >
      {/* 觀看人數 */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <VisibilityIcon sx={{ fontSize: 12, mr: 0.5, color: 'white' }} />
        <Typography variant="body2" sx={{ color: 'white',fontSize: 12 }}>
          {viewer}
        </Typography>
      </Box>

      {/* 收藏按鈕 */}
      <Button
        variant="contained"
        startIcon={<FavoriteIcon sx={{color:isFavorite?"red":"white"}}/>}
        sx={{
          ...buttonStyle,
          mr: 2,
        }}
        onClick={handleFavoriteClick}
      >
        <Typography variant="caption" sx={fontStyle}>
          {isFavorite?"已收藏":"收藏"}
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

export default ViewerAndFavorite; 