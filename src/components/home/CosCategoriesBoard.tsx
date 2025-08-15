import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CosGridFrame from '../CosGridFrame';
import { cBasePanel, cMainColor } from '../../data/ColorDef';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { ifIndexPageSection } from '../../Shared/Api/interface/SiteInterface';
import { useNavigate } from 'react-router-dom';

/*
interface MoreInfo {
  order: string | null;
  slug: string | null;
  tags: string | null;
  keyword: string | null;
  keyword_cn: string | null;
}*/

interface CosCategoriesBoardProps {
  data: ifIndexPageSection;
  width?: number;
  column?: number;
  maxShowAmount?: number | null;
}

const CosCategoriesBoard: React.FC<CosCategoriesBoardProps> = ({
  data,
  width = 9999,
}) => {
  const navigate = useNavigate();
  const windowWidth = document.documentElement.clientWidth - 16;
  const showWidth = Math.min(windowWidth, width - 16);
  const showAmount = (showWidth > 1000) ? 4 : (showWidth > 750)?3:2;


  const getQueryString = ()=>{
    let queryString = '';
    if(data.more.keyword && data.more.keyword !== ''){
      queryString = `kw=${data.more.keyword}`;
    }
    if(data.more.keyword_cn && data.more.keyword_cn !== ''){
      queryString = `kw=${data.more.keyword_cn}`;
    }

    if(data.more.tags && data.more.tags !== ''){
      if(queryString !== ''){
        queryString += `&`;
      }
      queryString += `tags=${data.more.tags}`;
    }
    
    
    if(data.more.slug && data.more.slug !== ''){
      if(queryString !== ''){
        queryString += `&`;
      }
      queryString += `slug=${data.more.slug}`;
    }
    if(data.more.order && data.more.order !== ''){
      if(queryString !== ''){
        queryString += `&`;
      }
      queryString += `order=${data.more.order}`;
    }
    return queryString;
  }   


  return (
    <Box
      sx={{
        mt: 2,
        ml: 1,
        mr: 1,
        width: showWidth,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* 標題區塊 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
        }}
      >
        {/* 標題 */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {data.name}
        </Typography>

        {/* 更多 */}
        <Button
          variant="text"
          sx={{
            backgroundColor: cBasePanel,
            color: cMainColor,
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '0px',
          }}
          onClick={()=>{
            navigate(`/search/video/${getQueryString()}`);
          }}
        >
          更多<ArrowRightIcon sx={{ fontSize: '18px' }} />
        </Button>
      </Box>

      {/* 內容區塊 */}
      <CosGridFrame
        items={data.list}
        width={showWidth}
        column={showAmount}
        maxShowAmount={showAmount*4}
      />
    </Box>
  );
};

export default CosCategoriesBoard; 