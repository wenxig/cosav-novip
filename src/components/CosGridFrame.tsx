import React from 'react';
import { Box } from '@mui/material';
import CosGridCard from './CosGridCard';
import { ifVideoBaseInfo } from '../Shared/Api/interface/VideoInterface';
import { ifAlbumBaseInfo } from '../Shared/Api/interface/AlbumInterface';


interface CosGridFrameProps {
  width?: number;
  column?: number;
  maxShowAmount?: number | null;
  items?: ifVideoBaseInfo[];
  albums?: ifAlbumBaseInfo[];
  delMode?: boolean;
  isReplace?: boolean;
}

const CosGridFrame: React.FC<CosGridFrameProps> = ({
  width = document.documentElement.clientWidth,
  column = 4,
  maxShowAmount,
  items,
  albums,
  delMode = false,
  isReplace = false,
}) => {
  // 計算每個卡片的寬度（考慮間距）
  const gap = 10; // 元件間距
  const totalGap = gap * (column - 1); // 總間距
  const cardWidth = Math.floor((width - totalGap) / column);
  // 計算每個卡片的高度（保持 840:566 的比例）
  const cardHeight = Math.floor((cardWidth / 4) * 3) + 40;

  // 根據 maxShowAmount 決定要顯示的項目
  const displayItems = maxShowAmount ? items?.slice(0, maxShowAmount) : items;
  const displayAlbums = maxShowAmount ? albums?.slice(0, maxShowAmount) : albums;

  const itemStyle = {
    width: cardWidth,
    height: cardHeight,
    mt: 1,
  }

  return (
    <Box
      sx={{
        width: width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: `${gap}px`,
          justifyContent: 'flex-start',
        }}
      >
        {/* 顯示影片列表 */}
        {displayItems&&displayItems.map((item, index) => (
          <Box key={index} sx={itemStyle} >
            <CosGridCard
              video={item}
              width={cardWidth}
              height={cardHeight}
              delMode={delMode}
              isReplace={isReplace}
            />
          </Box>
        ))}

        {/* 顯示相簿列表 */}
        {displayAlbums&&displayAlbums.map((album, index) => (
          <Box key={index} sx={itemStyle} >
            <CosGridCard
              album={album}
              width={cardWidth}
              height={cardHeight}
              delMode={delMode}
              isReplace={isReplace}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CosGridFrame; 