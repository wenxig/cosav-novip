import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import CosVideoPlayerAd from './CosVideoPlayerAd';




interface CosVideoPlayer2Props {
  videoUrl?: string;
  posterUrl?: string;
  adSec?: number;
}

const CosVideoPlayer2: React.FC<CosVideoPlayer2Props> = ({
  videoUrl = "https://cdn-ms.cdn-mscosproxy.xyz/video_path_m3u8/baBYoMiFwWtZlaGOKQQtcQ/1746392403/hls2/iphone/18490.mp4/index.m3u8?e=1744586582&st=tnecFtmohJ250XX1sUMCDg",
  posterUrl = "https://api.cosplayeringoodfunk.cc/media/videos/tmb/18490/0.jpg?v=1743229224",
  adSec = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // 初始化 Video.js 播放器
  useEffect(() => {
    // 確保 DOM 元素已經準備好
    if (!videoRef.current) {
      return;
    }

    // 如果已經初始化過，先清理
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // 初始化播放器
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      html5: {
        hls: {
          overrideNative: true
        }
      },
      className: 'video-js vjs-16-9'
    });

    playerRef.current = player;

    // 監聽播放事件 
    player.on('play', () => {
      console.log('視頻開始播放');
    });

    // 監聽錯誤事件
    player.on('error', (error: any) => {
      console.error('播放器錯誤:', error);
    });

    // 添加自定義快進快退按鈕到控制欄
    const controlBar = player.getChild('ControlBar');
    if (controlBar) {
      // 創建快退按鈕
      const rewindButton = document.createElement('button');
      rewindButton.className = 'vjs-control vjs-button vjs-fast-rewind';
      rewindButton.innerHTML = '◀◀';
      rewindButton.title = '快退 10 秒';
      rewindButton.onclick = () => {
        const currentTime = player.currentTime();
        if (currentTime !== undefined) {
          const newTime = Math.max(0, currentTime - 10);
          player.currentTime(newTime);
        }
      };

      // 創建快進按鈕
      const forwardButton = document.createElement('button');
      forwardButton.className = 'vjs-control vjs-button vjs-fast-forward';
      forwardButton.innerHTML = '▶▶';
      forwardButton.title = '快進 10 秒';
      forwardButton.onclick = () => {
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (currentTime !== undefined && duration !== undefined) {
          const newTime = Math.min(duration, currentTime + 10);
          player.currentTime(newTime);
        }
      };

      // 將按鈕插入到控制欄中（在播放按鈕之後）
      const playButton = controlBar.getChild('PlayToggle');
      if (playButton) {
        const playButtonEl = playButton.el();
        playButtonEl.parentNode?.insertBefore(rewindButton, playButtonEl.nextSibling);
        playButtonEl.parentNode?.insertBefore(forwardButton, rewindButton.nextSibling);
        
        // 移除自定義樣式，使用 Video.js 預設樣式
        rewindButton.style.cssText = '';
        forwardButton.style.cssText = '';
      }
    }

    // 清理函數
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []); // 只在組件掛載時初始化播放器

  // 單獨處理 videoUrl 和 posterUrl 的更新
  useEffect(() => {
    if (!playerRef.current || !videoUrl) {
      return;
    }

    const player = playerRef.current;

    const currentTime = player.currentTime();
    const isPlaying = player.paused() === false;
    
    // 更新視頻源
    player.src({ type: "application/x-mpegURL", src: videoUrl });

    // 重置播放器狀態
    player.load();
    player.currentTime(currentTime);
    if(isPlaying){
      player.play();
    }
  }, [videoUrl]);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: '56.25%',
        backgroundColor: 'black'
      }}
    >
      <video 
        ref={videoRef} 
        poster={posterUrl}
        className="video-js vjs-16-9" 
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      

      
      {/* <CosVideoPlayerAd adSec={0} /> */}
    </Box>
  );
};

export default CosVideoPlayer2; 