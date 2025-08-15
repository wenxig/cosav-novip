import React from 'react';
import { Box, Typography } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
//import { dataCenter } from '../../data/DataCenter';
import GameCard from './GameCard';
import { ifGameList } from '../../Shared/Api/interface/GameInterface';


interface GameListProps {
  gameList?: ifGameList;
  title: string;
}

const GameList: React.FC<GameListProps> = ({ gameList, title }) => {

  const maxWidth = document.documentElement.clientWidth ;

  
  // 如果沒有遊戲列表,則不顯示
  if(!gameList || gameList.list.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body2" sx={{
        width: maxWidth,
        fontWeight: 'bold', 
        color: 'white',
        textAlign: 'left',
        fontSize: '24px',
        padding: '5px 0',
      }}>   
        {title}
      </Typography>
        
        <Box >
        {
          gameList!.list.map((item,index)=>{
            return (
              <GameCard key={index} game={item} width={maxWidth - 20} />
            )
          })
        }
        </Box>
    </Box>
  );
};

export default GameList; 