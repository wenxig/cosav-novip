import React from 'react';
import { Box, Typography } from '@mui/material';
import { ifGameBaseInfo } from '../../Shared/Api/interface/GameInterface';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { cBlack80, cMainColor, cWhite80 } from '../../data/ColorDef';

interface CosGridCardProps {
  game: ifGameBaseInfo;
  rank?: number;
  width?: number;
  height?: number;
}

const getPlatformIcons = (types: string | string[]) => {
  const platformTypes = Array.isArray(types) ? types : [types];
  return platformTypes.map((type, index) => {
    switch (type) {
      case 'app':
        return <AndroidIcon key={index} sx={{fontSize:'16px', color: cWhite80, marginLeft: index > 0 ? '2px' : 0 }} />;
      case 'ios':
        return <AppleIcon key={index} sx={{fontSize:'16px', color: cWhite80, marginLeft: index > 0 ? '2px' : 0 }} />;
      case 'h5':
        return <LanguageIcon key={index} sx={{ fontSize:'16px', color: cWhite80, marginLeft: index > 0 ? '2px' : 0 }} />;
      case 'pc':
        return <ComputerIcon key={index} sx={{fontSize:'16px', color: cWhite80, marginLeft: index > 0 ? '2px' : 0 }} />;
      case 'mob':
        return <PhoneAndroidIcon key={index} sx={{fontSize:'16px', color: cWhite80, marginLeft: index > 0 ? '2px' : 0 }} />;
      default:
        return null;
    }
  });
};

const GameCard: React.FC<CosGridCardProps> = ({
  game,
  rank,
  width = 250,
}) => {

  const componentHeight = Math.min((width / 850 * 600),document.documentElement.clientHeight) ;
  const imageHeight = componentHeight * 0.75;
  const titleHeight = componentHeight * 0.25;

  const containerStyle = {
    width: width,
    height: componentHeight,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  }

  const imageContainerStyle={
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    borderRadius: '6px',
    width: width,
    height: imageHeight,
    backgroundColor: 'black',
  }

  const ranklabelStyle = {
    position: 'absolute',
    padding: '2px 4px',
    borderRadius: '4px',
    fontWeight: 'bold',
    top: 7,
    left: 5,
    backgroundColor: cBlack80,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
  }

  const titleContainerStyle={
    flex: 1,
    height: titleHeight,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    mb:2
  }

  return (
    <Box 
      sx={containerStyle} 
      onClick={() => {
        if (game.mob_link) {
          window.open(game.mob_link, '_blank');
        }
      }}
    >
      {/* 圖片容器 */}
      <Box sx={{ position: 'relative',borderRadius: '6px'}}
      >
        <Box
          sx={{
            backgroundImage: `url('${game.photo}')`,
            ...imageContainerStyle,
          }}
        />

        {/* 排名標籤 */}
        {rank && (
          <Box sx={ranklabelStyle}>
            {
              rank <= 3 &&
              <EmojiEventsIcon 
                sx={{ 
                  fontSize: rank===1?'24px':rank===2?'20px':'18px',
                  color: rank===1?'#FFD700':rank===2?'#BFC1C2':'#B87333'
                }} 
              />
            }
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold', 
                color:'white' ,
                fontSize: rank===1?'18px':'14px',}}
            >
              {`第${rank}名`}
            </Typography>
          </Box>
        )}

      </Box>

      {/* 標題 */}
      <Box sx={titleContainerStyle}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{
            fontWeight: 'bold', 
            color: 'white',
            textAlign: 'left',
            fontSize: (rank===1 || !rank)?'20px':'12px',
          }}>
            {game.title}
          </Typography>
          <Typography variant="caption" sx={{
            fontWeight: 'bold', 
            color: cMainColor,
            textAlign: 'left',
          }}>
            {game.category}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getPlatformIcons(game.type)}
        </Box>
      </Box>
    </Box>
  );
};

export default GameCard; 