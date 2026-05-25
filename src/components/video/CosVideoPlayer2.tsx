import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import CosVideoPlayerAd from './CosVideoPlayerAd';
import { usePlaybackSpeed } from '../../data/DataCenter';




interface CosVideoPlayer2Props {
  videoUrl?: string;
  posterUrl?: string;
  adSec?: number;
}

const CosVideoPlayer2: React.FC<CosVideoPlayer2Props> = ({
  videoUrl = "https://cdn-ms.cdn-mscosproxy.xyz/video_path_m3u8/baBYoMiFwWtZlaGOKQQtcQ/1746392403/hls2/iphone/18490.mp4/index.m3u8?e=1744586582&st=tnecFtmohJ250XX1sUMCDg",
  posterUrl = "https://api.cosplayeringoodfunk.cc/media/videos/tmb/18490/0.jpg?v=1743229224",
  adSec = 15,
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
      preload: 'metadata', // 改為 metadata 減少系統檢查
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      muted: false,
      volume: 1.0,
      html5: {
        hls: {
          overrideNative: true
        },
        nativeVideoTracks: false, // 禁用原生視頻軌道檢查
        nativeAudioTracks: false,  // 禁用原生音頻軌道檢查，減少系統錯誤
        nativeTextTracks: false
      },
      className: 'video-js vjs-16-9'
    });

    playerRef.current = player;

    // 監聽播放事件
    player.on('play', () => {
      console.log('視頻開始播放');
    });

    // 監聽緩衝卡頓（配對 waiting/playing 計算緩衝時長）
    player.on('waiting', () => {
      usePlaybackSpeed.getState().addStall();
    });
    player.on('playing', () => {
      usePlaybackSpeed.getState().endStall();
    });

    // 嘗試從 VHS 獲取帶寬數據
    player.on('loadedmetadata', () => {
      const checkBandwidth = setInterval(() => {
        try {
          const tech = player.tech({ IWillNotUseThisInPlugins: true }) as any;
          if (tech?.vhs?.stats?.bandwidth) {
            const kbps = Math.round(tech.vhs.stats.bandwidth / 1000);
            if (kbps > 0) {
              usePlaybackSpeed.getState().addSpeedSample(kbps);
            }
          }
        } catch (_e) { /* ignore */ }
      }, 5000);
      player.on('dispose', () => clearInterval(checkBandwidth));
    });

    // 監聽錯誤事件 — 按 video.js MediaError.code 粗分類
    // code 1: MEDIA_ERR_ABORTED  / code 2: MEDIA_ERR_NETWORK
    // code 3: MEDIA_ERR_DECODE   / code 4: MEDIA_ERR_SRC_NOT_SUPPORTED
    player.on('error', (error: any) => {
      const mediaError = player.error();
      const code = mediaError?.code;
      const type = (code === 2) ? 'networkError'
                 : (code === 3 || code === 4) ? 'mediaError'
                 : 'otherError';
      usePlaybackSpeed.getState().addError(type);
      console.error('播放器錯誤:', error, 'code:', code);
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
    
    // 檢查是否為本地文件（blob URL 或 file:// URI 或 capacitor:// URI）或 MP4 文件
    const isLocalFile = videoUrl.startsWith('blob:') || 
                       videoUrl.startsWith('file://') || 
                       videoUrl.startsWith('capacitor://') ||
                       videoUrl.endsWith('.mp4') ||
                       (!videoUrl.includes('.m3u8') && !videoUrl.includes('application/x-mpegURL'));

    if (isLocalFile) {
      // 本地文件或 MP4：使用 video/mp4 類型
      console.log('使用本地文件播放 (Video.js):', videoUrl);
      
      // 先清除之前的錯誤監聽器，避免重複添加
      player.off('error');
      player.off('loadedmetadata');
      player.off('canplay');
      player.off('seeking');
      player.off('seeked');
      
      // 設置源
      player.src({ type: "video/mp4", src: videoUrl });
      
      // 添加錯誤監聽
      player.on('error', (error: any) => {
        console.error('Video.js 播放錯誤:', error);
        if (player.error()) {
          console.error('錯誤詳情:', {
            code: player.error().code,
            message: player.error().message
          });
        }
      });
      
      player.on('loadedmetadata', () => {
        
      });
      
      player.on('canplay', () => {
        
      });
      
      // 監聽 seeking 事件，確保拖動時間軸時正確處理
      player.on('seeking', () => {
        
      });
      
      player.on('seeked', () => {
        // 確保播放狀態正確
        if (isPlaying && !player.paused()) {
          player.play().catch((err: any) => {
            console.warn('Video.js 播放失敗:', err);
          });
        }
      });
    } else {
      // M3U8 格式：使用 application/x-mpegURL
      player.src({ type: "application/x-mpegURL", src: videoUrl });
    }

    // 重置播放器狀態
    player.load();
    
    // 等待元數據加載後再設置時間
    player.ready(() => {
      if (currentTime > 0) {
        player.currentTime(currentTime);
      }
      if (isPlaying) {
        player.play().catch((err: any) => {
          console.warn('Video.js 自動播放失敗:', err);
        });
      }
    });
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
      

      
      <CosVideoPlayerAd adSec={adSec} />
    </Box>
  );
};

export default CosVideoPlayer2; 