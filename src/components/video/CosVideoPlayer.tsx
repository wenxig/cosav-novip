import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Box } from '@mui/material';
import CosVideoPlayerAd from './CosVideoPlayerAd';
import { usePlaybackSpeed } from '../../data/DataCenter';

interface CosVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  adSec?: number;
}

const CosVideoPlayer: React.FC<CosVideoPlayerProps> = ({
  videoUrl = "https://cdn-ms3.cosgenshinproxy.xyz/video_path_m3u8/baBYoMiFwWtZlaGOKQQtcQ/1746392403/hls2/iphone/18490.mp4/index.m3u8?e=1744316880&st=jp_f2aw_lfHHB5vbODHGxg",
  posterUrl = "https://api.cosplayeringoodfunk.cc/media/videos/tmb/18490/0.jpg?v=1743229224",
  adSec = 15,
}) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // 初始化 HLS 或直接播放本地文件
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    
    // 清理之前的 HLS 實例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // 檢查是否為本地文件（blob URL 或 file:// URI）
    const isLocalFile = videoUrl.startsWith('blob:') || 
                       videoUrl.startsWith('file://') || 
                       videoUrl.startsWith('capacitor://');
    
    // 檢查是否為 TS 格式（通過 URL 或文件擴展名判斷）
    const isTSFormat = isLocalFile && (
      videoUrl.includes('.ts') || 
      videoUrl.endsWith('.ts')
    );

    if (isLocalFile) {
      // 本地文件：根據格式選擇播放方式
      if (isTSFormat) {
        // TS 格式：嘗試使用 HLS.js 播放（雖然 HLS.js 主要用於 M3U8，但可以嘗試）
        // 如果失敗，則嘗試直接播放
        
        if (Hls.isSupported()) {
          try {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: false,
            });
            hlsRef.current = hls;
            
            // HLS.js 無法直接播放單個 TS 文件，需要 M3U8 播放列表
            // 所以我們直接嘗試用 video 元素播放
            console.warn('TS 格式無法使用 HLS.js 直接播放，嘗試使用 video 元素');
            hls.destroy();
            hlsRef.current = null;
          } catch (error) {
            console.error('HLS.js 初始化失敗:', error);
          }
        }
        
        // 直接嘗試播放 TS 文件（某些瀏覽器可能支持）
        // 先清除之前的 src
        video.src = '';
        video.removeAttribute('src');
        
        // 清除所有 source 元素
        const sources = video.querySelectorAll('source');
        sources.forEach(source => source.remove());
        
        // 設置新的 src 和類型
        video.src = videoUrl;
        // 注意：video.type 不是標準屬性，但我們可以通過其他方式設置
        video.load();
      } else {
        // 先清除之前的 src 和所有源
        video.src = '';
        video.removeAttribute('src');
        
        // 清除所有 source 元素
        const sources = video.querySelectorAll('source');
        sources.forEach(source => source.remove());
        
        // 設置新的 src
        video.src = videoUrl;
        
        // 設置音頻相關屬性，減少系統錯誤
        video.muted = false;
        video.volume = 1.0;
        // 設置 preload 為 metadata，減少系統檢查
        video.preload = 'metadata';
        
        // 添加錯誤監聽（只添加一次）
        const errorHandler = (e: Event) => {
          // 過濾系統級錯誤（不會影響播放）
          const error = video.error;
          if (error) {
            // 只記錄真正的播放錯誤，忽略系統級警告
            if (error.code !== 0) { // 0 通常是系統警告
              console.error('視頻播放錯誤:', e);
              console.error('錯誤代碼:', error.code);
              console.error('錯誤訊息:', error.message);
              
              // 如果是解碼錯誤（code 3），嘗試恢復
              if (error.code === 3 && videoUrl.startsWith('blob:')) {
                console.warn('檢測到解碼錯誤，嘗試恢復播放');
                
                // 保存當前狀態
                const wasPlaying = !video.paused;
                const seekTime = video.currentTime;
                
                // 嘗試重新加載
                video.load();
                
                // 等待元數據加載後再設置時間
                video.addEventListener('loadedmetadata', () => {
                  if (seekTime > 0 && seekTime < video.duration) {
                    video.currentTime = seekTime;
                  }
                  if (wasPlaying) {
                    setTimeout(() => {
                      video.play().catch(err => {
                        console.warn('恢復播放失敗:', err);
                      });
                    }, 200);
                  }
                }, { once: true });
              } else if (error.code !== 0 && videoUrl.startsWith('blob:')) {
                console.warn('本地文件播放失敗，可能需要使用遠程 URL');
                // 不立即清理 Blob URL，讓用戶可以重試
              }
            } else {
              // 系統警告，只記錄不處理
              console.debug('系統警告（可忽略）:', error.message);
            }
          }
        };
        
        const metadataHandler = () => {};
        
        const canPlayHandler = () => {};
        
        // 監聽 seeking 事件，確保拖動時間軸時正確處理
        const seekingHandler = () => {
          // 在 seeking 時暫停播放，避免解碼錯誤
          if (!video.paused) {
            video.pause();
          }
        };
        
        const seekedHandler = () => {
          // 等待一小段時間讓解碼器準備好
          setTimeout(() => {
            // 檢查是否有錯誤
            if (video.error) {
              console.warn('Seek 後發現錯誤，嘗試恢復:', video.error);
              // 嘗試重新加載
              const wasPlaying = !video.paused;
              const seekTime = video.currentTime;
              
              video.load();
              
              // 等待元數據加載後再設置時間
              video.addEventListener('loadedmetadata', () => {
                if (seekTime > 0 && seekTime < video.duration) {
                  video.currentTime = seekTime;
                }
                if (wasPlaying) {
                  video.play().catch(err => {
                    console.warn('恢復播放失敗:', err);
                  });
                }
              }, { once: true });
            } else {
              // 沒有錯誤，正常恢復播放
              if (!video.paused && video.readyState >= 2) {
                video.play().catch(err => {
                  console.warn('播放失敗:', err);
                });
              }
            }
          }, 100);
        };
        
        // 監聽 timeupdate 事件，確保播放不會中斷
        const timeUpdateHandler = () => {
          // 如果播放被暫停但應該在播放，嘗試恢復
          if (video.paused && video.readyState >= 2 && video.currentTime > 0) {
            // 不自動恢復，讓用戶控制
          }
        };
        
        video.addEventListener('error', errorHandler, { once: true });
        video.addEventListener('loadedmetadata', metadataHandler, { once: true });
        video.addEventListener('canplay', canPlayHandler, { once: true });
        video.addEventListener('seeking', seekingHandler);
        video.addEventListener('seeked', seekedHandler);
        video.addEventListener('timeupdate', timeUpdateHandler);
        
        // 對於 Blob URL，使用不同的加載策略
        if (videoUrl.startsWith('blob:')) {
          // 先嘗試讀取 Blob 來驗證
          fetch(videoUrl)
            .then(response => response.blob())
            .then(blob => {
              // 檢查 Blob 大小
              if (blob.size === 0) {
                console.error('Blob 大小為 0，無法播放');
                return;
              }
              // 沿用父層建立的 blob URL，不可 revoke：revoke 後切換另一播放器時 URL 已失效
              video.src = videoUrl;
              video.load();
            })
            .catch(error => {
              console.error('Blob 驗證錯誤:', error);
              // 即使驗證失敗，也嘗試直接加載
              video.load();
            });
        } else {
          // 非 Blob URL，直接加載
          video.load();
        }
      }
    } else if (Hls.isSupported()) {
      // M3U8 格式：使用 HLS.js
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      // 監聽 TS 切片下載完成，記錄下載速度 + TTFB
      hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
        const stats = data.frag.stats;
        if (stats.loading.end && stats.loading.start && stats.loaded) {
          const durationMs = stats.loading.end - stats.loading.start;
          if (durationMs > 0) {
            const speedKbps = Math.round((stats.loaded * 8) / durationMs); // kbps
            // 把 durationMs 傳下去由 store 決定要不要當 cache hit 丟棄
            usePlaybackSpeed.getState().addSpeedSample(speedKbps, durationMs);
            usePlaybackSpeed.getState().setFirstLoad(durationMs);
          }
          // TTFB: 首字節響應時間
          if (stats.loading.first && stats.loading.start) {
            const ttfbMs = stats.loading.first - stats.loading.start;
            if (ttfbMs > 0) {
              usePlaybackSpeed.getState().addTtfbSample(ttfbMs);
            }
          }
        }
      });

      // 監聽 m3u8 加載：只監聽 LEVEL_LOADED（主 playlist 重載），避免與 MANIFEST_LOADED 初次加載重複計數
      hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => {
        usePlaybackSpeed.getState().addM3u8Load();
        if (data.details?.fragments?.length) {
          usePlaybackSpeed.getState().setTotalSegments(data.details.fragments.length);
        }
      });

      // 監聽緩衝卡頓（配對 waiting/playing 計算緩衝時長）
      video.addEventListener('waiting', () => {
        usePlaybackSpeed.getState().addStall();
      });
      video.addEventListener('playing', () => {
        usePlaybackSpeed.getState().endStall();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        // data.type: 'networkError' | 'mediaError' | 'muxError' | 'otherError'
        usePlaybackSpeed.getState().addError(data.type);
        if (data.fatal) {
          console.error('HLS 錯誤:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS Safari 原生支持
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', () => {
        // 不自動播放
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);


  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
        paddingTop: '56.25%', // 16:9 寬高比 (9/16 = 0.5625)
        backgroundColor: 'black',
        '& video': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          maxHeight: '100vh',
        },
      }}
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        controls
        playsInline
        controlsList="nodownload noremoteplayback"
      />
      
      <CosVideoPlayerAd adSec={adSec} />
    </Box>
  );
};

export default CosVideoPlayer; 