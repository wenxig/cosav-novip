import React, { useEffect, useState} from 'react';
import useSWR, { mutate } from 'swr';
import { CircularProgress, Box } from '@mui/material';
import { getSiteAdtemplate } from '../Shared/Api/CosApi';
import { cMainColor } from '../data/ColorDef';
//import { API_DEDUPING_INTERVAL } from '../data/ParameterDef';

export type AdType = 
  | 'APP_FULL_AD_UP'
  | 'APP_FULL_AD_down'
  | 'INDEX_VIEW'
  | 'INDEX_VIEW2'
  | 'INDEX_EVENT'
  | 'INDEX_INFO'
  | 'VIDEO_COVER'
  | 'VIDEO_INFO'
  | 'ALBUM_COVER'
  | 'ALBUM_INFO'
  | 'PLAYER_VIEW'
  | 'PLAYER_BUFFER'
  | 'GAME_INFO';


export const AD_DATA = {
  APP_FULL_AD_UP: {name: "app_full_ad_up", w: 300, h: 250 },
  APP_FULL_AD_down: {name: "app_full_ad_down", w: 300, h: 250 },
  INDEX_VIEW: {name: "index_view", w: 600, h: 800 },
  INDEX_VIEW2: {name: "index_view_2", w: 600, h: 800 },
  INDEX_EVENT: {name: "index_event", w: 300, h: 100 },
  //INDEX_EVENT: {name: "index_event", w: 900, h: 300 },
  //INDEX_INFO: {name: "index_info", w: 728, h: 90 },
  INDEX_INFO: {name: "index_info", w: 900, h: 210 },
  //VIDEO_COVER: {name: "video_cover", w: 728, h: 90 },
  VIDEO_COVER: {name: "video_cover", w: 600, h: 200 },
  VIDEO_INFO: {name: "video_info", w: 900, h: 210 },
  //ALBUM_COVER: {name: "album_cover", w: 728, h: 90 },
  ALBUM_COVER: {name: "album_cover", w: 900, h: 210 },
  //ALBUM_INFO: {name: "album_info", w: 300, h: 100 },
  ALBUM_INFO: {name: "album_info", w: 900, h: 210 },
  PLAYER_VIEW: {name: "player_view", w: 500, h: 250 },
  PLAYER_BUFFER: {name: "player_view", w: 500, h: 250 },
  GAME_INFO: {name: "index_info", w: 900, h: 210 },
} as const;

interface CosAdIFrameProps {
  adType: AdType;
  position?: any;
  limit?: {width?: number, height?: number};
  width?: number;
  closeButton?: boolean;
  pageName: string;
}



const CosAdIFrame: React.FC<CosAdIFrameProps> = ({
  adType,
  position = {},
  limit = {},
  width = document.documentElement.clientWidth,
  closeButton = false,
  pageName
}) => {
  const adData = AD_DATA[adType];

  const maxHeight = document.documentElement.clientHeight;
  const [isShowAd, setIsShowAd] = useState(true);
  const [isShowAdIcon, setIsShowAdIcon] = useState(false);
  const isMountedRef = React.useRef(true);

  // 安全的狀態更新函數
  const safeSetState = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  console.log("***************"+pageName);

  //取得螢幕寬度和高度
  let componentWidth = Math.min(width, adData.w, limit.width ?? 9999);
  let componentHeight = Math.min(maxHeight,adData.h,componentWidth * adData.h / adData.w, limit.height ?? 9999);
  componentWidth = componentHeight * adData.w / adData.h;


  const fetcher = async (apiName: string) => {
    const res = await getSiteAdtemplate(apiName);
    return res.data;
  };

  // 創建唯一的快取鍵，包含頁面名稱和廣告類型
  const cacheKey = pageName ? `${adData.name}_${pageName}` : adData.name;
  
  const { data: adDataList, error, isLoading: isUrlLoading } = useSWR(
    cacheKey, 
    () => fetcher(adData.name), // 使用箭頭函數包裝，傳遞不同的參數
    {
      revalidateOnFocus: false,//不會因為視窗焦點變化而重新獲取數據
      revalidateOnReconnect: false,//不會因為網路重連而重新獲取數據
      dedupingInterval: 0, // 0表示不暫存，每次都重新獲取
      //revalidateIfStale: false, // 如果資料過期不重新獲取
      //refreshInterval: 0, // 不自動重新獲取
      onSuccess: (data) => {
        // 只在組件掛載時處理成功回調
        if (isMountedRef.current && data && data.length > 0) {
          if (data[0].adv_sale_type !== 'own' && adType !== 'INDEX_VIEW2') {
            safeSetState(setIsShowAdIcon, true);
          }
        }
      }
    }
  );




  // 組成 HTML 內容
  const iframeHtml = React.useMemo(() => {
    if (!adDataList || adDataList.length === 0) return null;
    
    let bodyContent = '';
    
    if(adType === 'INDEX_VIEW2'){
      bodyContent = `<div class="grid-container">`;
      for(let i = 0; i < adDataList.length; i++){
        bodyContent += `<div class="grid-item">`;
        bodyContent += adDataList[i].adv_text;
        bodyContent += `<h2 class="ad-name">${adDataList[i].adv_name}</h2>`;
        bodyContent += `</div>`;
      }
      bodyContent += `</div>`;
    }else{
      const rndIndex = 0; //Math.floor(Math.random() * adDataList.length);
      bodyContent += adDataList[rndIndex].adv_text;
    }
    
    // 創建完整的 HTML 文檔
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=${componentWidth}, initial-scale=1.0">
          <style>
            html, body { 
              margin: 0; 
              padding: 0; 
              overflow: hidden;
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar {
              display: none;  /* Chrome, Safari and Opera */
            }
            * { box-sizing: border-box; }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              max-width: ${componentWidth}px;
            }
            video {
              width: 100%;
              height: 100%;
              object-fit: contain;
              max-width: ${componentWidth}px;
            }

            .grid-container {
              display: grid;
              width: 100%;
              height: 100%;
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(4, 1fr);
            }
            
            .grid-item {
              display: grid;
              width: 100%;
              height: 100%;
              grid-template-columns: 1fr;
              grid-template-rows: 1fr;
              padding: 5px;
            }
            .ad-name {
              text-align: center;
              margin: 5px;
              background-color: red;
              color: white;
              border-radius: 5px;
              font-size: 12px;
              max-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          </style>
        </head>
        <body>
          <div style="width: ${componentWidth}px; height: ${componentHeight}px;object-fit: scale-down;text-align: center;">
          ${bodyContent || ''}
          </div>
          
        </body>
      </html>
    `;
    
    return fullHtml;
  }, [adDataList, adType, componentWidth, componentHeight]);

  // 創建 Blob URL 用於 iframe
  const iframeSrc = React.useMemo(() => {
    if (!iframeHtml || iframeHtml.trim() === '') return null;
    
    const blob = new Blob([iframeHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [iframeHtml]);

  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // 組件卸載時的清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // 強制清理 useSWR 快取
      mutate(cacheKey, undefined, false);
    };
  }, [cacheKey]);

  // 清理 Blob URL
  useEffect(() => {
    return () => {
      if (iframeSrc && iframeSrc.startsWith('blob:')) {
        URL.revokeObjectURL(iframeSrc);
      }
    };
  }, [iframeSrc]);
  
  

  const containerStyle = {
    width: width,
    height: componentHeight,
    position: 'relative',
    ...position,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: '4px',
    boxShadow: '0 4px 4px rgba(0,0,0,0.2)',
  };

  const iframeStyle = {
    position: 'absolute' as const,
    width: componentWidth,
    height: componentHeight,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none'
  };

  const loadingStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: '5px',
    right: '10px',
    zIndex: 10,
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    }
  };

  const adIconButtonStyle = {
    position: 'absolute' as const,
    top: '5px',
    left: '10px',
    zIndex: 10,
    width: '24px',
    height: '24px',
    backgroundColor: cMainColor,
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    }
  };

  // 如果組件已卸載，直接返回 null
  if (!isMountedRef.current) {
    return null;
  }

  if (isUrlLoading || error) {
    return (
      <Box sx={containerStyle}>
        <Box sx={loadingStyle}>
          <CircularProgress 
            sx={{ 
              color: 'rgb(236, 121, 172)',
              '& .MuiCircularProgress-circle': {
                strokeWidth: 5
              }
            }} 
          />
        </Box>
      </Box>
    );
  }

  if(!isShowAd){
    return null;
  }

  return (
    <Box sx={containerStyle}>
      {isIframeLoading && (
        <Box sx={loadingStyle}>
          <CircularProgress 
            sx={{ 
              color: 'rgb(236, 121, 172)',
              '& .MuiCircularProgress-circle': {
                strokeWidth: 3
              }
            }} 
          />
        </Box>
      )}
      {closeButton && isShowAd && (
        <Box 
          component="button"
          sx={closeButtonStyle}
          onClick={() => safeSetState(setIsShowAd, false)}
        >
          ×
        </Box>
      )}
      {isShowAdIcon && (
        <Box 
          component="div"
          sx={adIconButtonStyle}
        >
          AD
        </Box>
      )}
      {iframeSrc && (
        <iframe
          title={adData.name}
          src={iframeSrc}
          style={iframeStyle}
          width={componentWidth}
          height={componentHeight}
          onLoad={() => setIsIframeLoading(false)}
          onError={() => setIsIframeLoading(false)}
        />
      )}
    </Box>
  );
};

export default CosAdIFrame; 