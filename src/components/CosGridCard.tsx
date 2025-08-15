import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ifVideoBaseInfo, ifVideoFavoriteApiResponse } from '../Shared/Api/interface/VideoInterface';
import { ifAlbumBaseInfo } from '../Shared/Api/interface/AlbumInterface';
import { useNavigate } from 'react-router-dom';
import CosMessageAndLoading from './base/CosMessageAndLoading';
import { sendVideoFavorite, sendAlbumFavorite } from '../Shared/Api/CosApi';
import { removeFavoriteAlbum, removeFavoriteVideo } from '../data/DataCenter';

interface CosGridCardProps {
  video?: ifVideoBaseInfo;
  album?: ifAlbumBaseInfo;
  width?: number;
  height?: number;
  delMode?: boolean;
  isReplace?: boolean;
}

const CosGridCard: React.FC<CosGridCardProps> = ({
  video,
  album,
  width = 200,
  height = 300,
  delMode = false,
  isReplace = false,
}) => {
  const navigate = useNavigate();

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading, setIsLoading] = useState(false);

  // 將 duration 轉換為時間格式
  const formatDuration = (duration?: string) => {
    if(!duration) 
      return "";
    const totalSeconds = Math.floor(parseFloat(duration));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 將十六進制顏色轉換為 rgba
  const hexToRgba = (hex: string, alpha: number = 1) => {
    // 確保 hex 格式正確
    const hexColor = hex.startsWith('#') ? hex.substring(1) : hex;
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const componentWidth = Math.min(width,document.documentElement.clientWidth) ;
  const imageHeight = Math.min(componentWidth / 16 * 12) ;
  const titleHeight = 45;
  const componentHeight = imageHeight + titleHeight;
  //const componentHeight = Math.min((componentWidth / 840 * 840),document.documentElement.clientHeight) ;
  const labelFonfontSize = (width > 400) ? 18 : (width > 200)?13:10

  const containerStyle = {
    width: componentWidth,
    height: componentHeight,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  }

  const labelStyle = {
    position: 'absolute',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: labelFonfontSize,
    fontWeight: 'bold',
  }

  const deleteButtonStyle = {
    position: 'absolute',
    padding: '2px 8px',
    minWidth: 'auto',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderRadius: '10px',
    color: 'white',
  }

  const titleContainerStyle={
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: titleHeight,
    padding: '0 4px',
  }

  const titleStyle={
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textAlign: 'center',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '1.2',
    maxHeight: '30px',
    position: 'relative',
    paddingBottom: '2px',
  }

  if(album){
    return (
      <Box 
        sx={containerStyle} 
        onClick={() => {
          if(isReplace){
            navigate(`/albumDetial/${album.id}/${encodeURIComponent(album.photo)}`,{replace:true});
          }else{
            navigate(`/albumDetial/${album.id}/${encodeURIComponent(album.photo)}`);
          }
        }}
      >
        {/* 圖片容器 */}
      <Box
        sx={{
          position: 'relative',
          width: {componentWidth},
          height: `${imageHeight}px`,
          overflow: 'hidden',
        }}
      >
        {/* 模糊背景層 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${album.photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
            transform: 'scale(1.1)', // 防止模糊邊緣出現
          }}
        />
        {/* 清晰前景層 */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${album.photo})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

          {/* 刪除按鈕 */}
          {delMode && (
            <Button
              sx={deleteButtonStyle}
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡

                setIsLoading(true);
                // 刪除相簿
                sendAlbumFavorite(album.id).then(
                  (res:ifVideoFavoriteApiResponse)=>{
                    if(res.result === "success" && res.data?.status === "ok"){
                      removeFavoriteAlbum(album.id);
                      setShowMsg("刪除成功", 'success');
                      window.location.reload();
                      //navigate(`/my/favorite/video`,{replace:true});
                    }else{
                      setShowMsg("刪除失敗", 'error');
                    }
                    setIsLoading(false);
                  }
                );
                
              }}
            > 
              刪除
            </Button>
          )}
        </Box>

        {/* 標題 */}
        <Box sx={titleContainerStyle} >
          <Typography variant="body2" sx={titleStyle} >
            {album.title}
          </Typography>
        </Box>

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
  }


  // 取得頻道背景顏色，如果為 null 則使用預設值
  const channelBgColor = video?.channel_bg_color || '#b74093';
  const channelName = video?.channel_name ? 
    (video.channel_name.includes("同人") ? "同人" : video.channel_name) 
    : "";

  return (
    <Box 
      sx={containerStyle} 
      onClick={() => {
        if(isReplace){
          navigate(`/videoDetial/${video!.id}`,{replace:true});
        }else{
          navigate(`/videoDetial/${video!.id}`);
        }
      }}
    >
      {/* 圖片容器 */}
      <Box
        sx={{
          position: 'relative',
          width: {componentWidth},
          height: `${imageHeight}px`,
          overflow: 'hidden',
        }}
      >
        {/* 模糊背景層 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url('${video!.photo}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
            transform: 'scale(1.1)', // 防止模糊邊緣出現
          }}
        />
        {/* 清晰前景層 */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundImage: `url('${video!.photo}')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* 刪除按鈕 */}
        {delMode && (
          <Button
            sx={deleteButtonStyle}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              // 刪除影片
              setIsLoading(true);
              // 刪除影片
              sendVideoFavorite(video?.id!).then(
                (res:ifVideoFavoriteApiResponse)=>{
                  if(res.result === "success" && res.data?.status === "ok"){
                    removeFavoriteVideo(video?.id!);
                    setShowMsg("刪除成功", 'success');
                    //navigate(`/my/favorite/video/0`,{replace:true});
                    window.location.reload();
                  }else{
                    setShowMsg("刪除失敗", 'error');
                  }
                  setIsLoading(false);
                }
              );
            }}
          > 
            刪除
          </Button>
        )}

        {/* VIP 標籤 */}
        {/* {!delMode && video?.is_exclusive && (
          <Box
            sx={{
              ...labelStyle,
              top: 5,
              left: 5,
              backgroundColor: 'rgba(251, 214, 146, 0.7)',
              color: '#000',
            }}
          >
            VIP抢先看
          </Box>
        )} */}

        {/* 頻道名稱 */}
        <Box
          sx={{
            ...labelStyle,
            backgroundColor: hexToRgba(channelBgColor, 0.7),
            color: '#fff',
            bottom: 5,
            left: 5,
          }}
        >
          {channelName}
        </Box>

        {/* 合集名稱 */}
        {video?.group_id !== '0' &&<Box
          sx={{
            ...labelStyle,
            backgroundColor: hexToRgba('#413C38', 0.85),
            color: '#fff',
            bottom: 5,
            left: 45,
          }}
        >
          合集
        </Box>
        }

        {/* 時長 */}
        <Box
          sx={{
            ...labelStyle,
            bottom: 5,
            right: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
          }}
        >
          {formatDuration(video?.duration)}
        </Box>
      </Box>

      {/* 標題 */}
      <Box sx={titleContainerStyle} >
        <Typography variant="body2" sx={titleStyle} >
          {video?.title}
        </Typography>
      </Box>

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

export default CosGridCard; 