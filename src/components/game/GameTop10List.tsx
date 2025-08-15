import React from 'react';
import { Box, Typography } from '@mui/material';
import { getGameTop10 } from '../../data/DataCenter';
import GameCard from './GameCard';


const GameTop10List: React.FC = () => {

  const maxWidth = document.documentElement.clientWidth ;


  const containerStyle = {
    width: maxWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: 'black',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    padding: '15px 0',
  }


  const gameTop10 = getGameTop10();

  // 如果沒有遊戲列表,則不顯示
  if(!gameTop10 || gameTop10.list.length === 0) return null;

  const firstGame = gameTop10.list[0];
  const otherGame = gameTop10.list.slice(1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body2" sx={{
        width: maxWidth - 20,
        fontWeight: 'bold', 
        color: 'white',
        textAlign: 'left',
        fontSize: '24px',
        mt: 2,
      }}>   
        游戏排行榜
      </Typography>
        
        <Box sx={containerStyle}>
            <GameCard key={0} game={firstGame} rank={1} width={maxWidth - 20}/>
        </Box>
        <Box sx={{
          display: 'flex',
          width: maxWidth - 20,
          overflowX: 'auto',
          scrollbarWidth: 'none',  // Firefox
          '&::-webkit-scrollbar': {  // Chrome, Safari, Edge
            display: 'none'
          },
          gap: 1,
          padding: '2px 0',
          '& > *': {
            flexShrink: 0
          }
        }}>
        {
          otherGame.map((item,index)=>{
            return (
              <GameCard key={index+1} game={item} rank={index+2} />
            )
          })
        }
        </Box>
    </Box>
  );
};

export default GameTop10List; 