import React from 'react';
import { Button, Typography, SvgIconProps } from '@mui/material';
import { cBasePanel, cMainColor, cWhite60 } from '../../data/ColorDef';

interface AlbumContentButtonProps {
  icon: React.ReactElement<SvgIconProps>;
  text: string;
  isEnable?: boolean;
  minWidth?: number;
  iconSize?: number;
  fontSize?: number;
  onClick?: () => void;
}

const AlbumContentButton: React.FC<AlbumContentButtonProps> = ({
  icon,
  text,
  isEnable = false,
  minWidth = 90,
  iconSize = 30,
  fontSize = 16,
  onClick,
}) => {

  // 按鈕通用樣式
  const buttonStyle = {
    backgroundColor: cBasePanel,
    color: 'white',
    borderRadius: 1,
    minWidth: minWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.25,
  };

  const iconStyle = {
    width: iconSize,
    height: iconSize,
    color: 'white',
  };

  const fontStyle = {
    fontSize: fontSize,
    fontWeight: 'bold',
  };


  return (
    <Button
      onClick={onClick}
      sx={buttonStyle}
    >
      {
        React.cloneElement(
          icon, 
          {sx: { ...iconStyle, color: isEnable ? cMainColor : cWhite60 } }
        )
      }
      <Typography 
        sx={{
          ...fontStyle,
          color: isEnable ? cMainColor : cWhite60,
        }}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default AlbumContentButton; 