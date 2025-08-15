import React from 'react';
import { Box, Typography } from '@mui/material';
import { cMainColor } from '../../data/ColorDef';
import { ifVideoDetail } from '../../Shared/Api/interface/VideoInterface';
import { ifAlbumDetail } from '../../Shared/Api/interface/AlbumInterface';
import { useNavigate } from 'react-router-dom';

interface VideoInfoProps {
  video?: ifVideoDetail;
  album?: ifAlbumDetail;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video, album }) => {

  const navigate = useNavigate();


  // 處理資料，移除空白格
  const cleanData = (value: string | undefined | null): string[] | null => {
    if (!value) return null;
    return value.trim().split(" ");
  };


  // 定義要顯示的資訊項目
  const infoItems = [
    { label: '上架日期', value: cleanData(video?video.adddate:album?.adddate) ,searchType:undefined},
    { label: '番号', value: cleanData(video?video.barcode:null) ,searchType:'keyword'},
    { label: '女优', value: cleanData(video?video.author:album?.author) ,searchType:'keyword'},
    { label: '登场人物', value: cleanData(video?video.cos_role:album?.cos_role) ,searchType:'keyword'},
    { label: '作品', value: cleanData(video?video.cos_works:album?.cos_works) ,searchType:'keyword'},
    { label: '片商', value: cleanData(video?video.company:null) ,searchType:'keyword'},
    { label: '系列', value: cleanData(video?video.series:null) ,searchType:'keyword'},
    //{ label: '标签', value: cleanTags(data?data.tags:album?.tags) ,searchType:undefined},
  ];
  const tagItems = video?video.tags:album?.tags;

  // 過濾掉值為 null 的項目
  const filteredItems = infoItems.filter(item => item.value !== null);

  // 通用字型設定
  const fontFamily = "'Noto Sans SC', sans-serif";

  const labelStyle = {
    color: 'white',
    minWidth: '80px',
    width: '25%',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: '18px',
    mr: 2,
    fontFamily,
  }

  const valueStyle = (searchType: string | undefined) => ({
    color: cMainColor,
    textAlign: 'left',
    fontSize: '18px',
    //textDecoration: searchType ? 'underline' : 'none',
    cursor: searchType ? 'pointer' : 'default',
    //fontFamily,
    '&:hover': {
      opacity: searchType ? 0.8 : 1
    }
  });

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 1,
        fontFamily,
      }}
    >
      {filteredItems.map((item, index) => (
        <React.Fragment key={index}>
          <Box
            sx={{
              display: 'flex',
              py: 0.1,
              fontSize: '18px',
              width: '95%',
              border: 'none'
            }}
          >
            <Typography
              variant="body2"
              sx={labelStyle}
            >
              {item.label}:
            </Typography>

            {item.value?.map((text, index) => (
              <React.Fragment key={index}>
                <Typography
                  sx={valueStyle(item.searchType)}
                  onClick={() => {
                    if (!item.searchType) {
                      return;
                    }
                    if (video) {
                      navigate(`/search/video/kw=${text}`);
                    } else {
                      navigate(`/search/album/kw=${text}`);
                    }
                  }}
                >
                  {text}
                </Typography>
                {index < item.value!.length - 1 && <span style={{ color: 'white' }}>, </span>}
              </React.Fragment>
            ))}

            
          </Box>
        </React.Fragment>
      ))}
      
      {tagItems&&tagItems.length>0&&(
      <React.Fragment key='tags'>
        <Box
          sx={{
            display: 'flex',
            py: 0.1,
            width: '95%',
          }}
        >
          <Typography
            variant="body2"
            sx={labelStyle}
          >
            标签:
          </Typography>
          <Box
            sx={{
              flex: 1,
              color: cMainColor,
              fontSize: '18px',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {tagItems?.map((item, index) => (
              <React.Fragment key={index}>
                <span
                  style={{
                    //textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if(video){
                      navigate(`/search/video/tags=${item}`);
                    }else{
                      navigate(`/search/album/tags=${item}`);
                    }
                  }}
                >
                  {item}
                </span>
                {index < tagItems.length - 1 && <span style={{color:'white'}}> , </span>}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </React.Fragment>
      )}

    </Box>
  );
};

export default VideoInfo; 