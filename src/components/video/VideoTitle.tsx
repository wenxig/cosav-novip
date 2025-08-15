import React from 'react';
import { Typography, Box } from '@mui/material';

interface VideoTitleProps {
  /**
   * 顯示的文字
   */
  title: string | undefined;
  
  /**
   * 是否顯示此元件
   */
  show?: boolean;
  
  /**
   * 背景顏色，預設為 white
   */
  backgroundColor?: string;
  
  /**
   * 文字顏色，預設為 black
   */
  textColor?: string;
  
  /**
   * 文字大小，預設為 1rem
   */
  fontSize?: string;
}

/**
 * 視頻標題元件
 * 
 * @param props 元件屬性
 * @returns 標題元件
 */
const VideoTitle: React.FC<VideoTitleProps> = ({
  title,
  show = true,
  backgroundColor = 'black',
  textColor = 'white',
  fontSize = '1.2rem'
}) => {
  // 如果 show 為 false，則不顯示元件
  if (!show || !title) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        backgroundColor: backgroundColor,
        py: 1 // 設定內部上下填充
      }}
    >
      <Typography
        sx={{
          color: textColor,
          fontSize: fontSize,
          fontWeight: 'bold',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.4,
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default VideoTitle; 