import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Box } from '@mui/material';
import CosVideoPlayerAd from './CosVideoPlayerAd';

interface CosVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  adSec?: number;
}

const CosVideoPlayer: React.FC<CosVideoPlayerProps> = ({
  videoUrl = "https://cdn-ms3.cosgenshinproxy.xyz/video_path_m3u8/baBYoMiFwWtZlaGOKQQtcQ/1746392403/hls2/iphone/18490.mp4/index.m3u8?e=1744316880&st=jp_f2aw_lfHHB5vbODHGxg",
  posterUrl = "https://api.cosplayeringoodfunk.cc/media/videos/tmb/18490/0.jpg?v=1743229224",
  adSec = 0,
}) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // 初始化 HLS
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', () => {
        // 不自動播放
      });
    }
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
      
      {/* <CosVideoPlayerAd adSec={adSec} /> */}
    </Box>
  );
};

export default CosVideoPlayer; 