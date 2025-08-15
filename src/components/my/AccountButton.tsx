import React from 'react';
import { Button, Typography, SvgIconProps } from '@mui/material';
import { cBasePanel, cMainColor } from '../../data/ColorDef';

interface AlbumContentButtonProps {
  icon: React.ReactElement<SvgIconProps>;
  text: string;
  isEnable?: boolean;
  onClick?: () => void;
}

const AccountButton: React.FC<AlbumContentButtonProps> = ({
  icon,
  text,
  isEnable = false,
  onClick,
}) => {

  const maxWidth = document.documentElement.clientWidth;
  const buttonWidth = (maxWidth - 70) / 4;
  
  // 按鈕通用樣式
  const buttonStyle = {
    backgroundColor: cBasePanel,
    borderRadius: 1,
    width: buttonWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
  };
  
  const iconStyle = {
    width: '30px',
    height: '30px',
  };
  
  const fontStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: cMainColor,
    whiteSpace: 'nowrap',
    overflow: 'visible',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <Button
      onClick={onClick}
      sx={buttonStyle}
    >
      {
        React.cloneElement(
          icon, 
          { 
            sx: { 
              ...icon.props.sx,  // 保留原有的 sx 屬性
              ...iconStyle      // 添加新的樣式
            } 
          }
        )
      }
      <Typography  sx={fontStyle}>
        {text}
      </Typography>
    </Button>
  );
};

export default AccountButton; 