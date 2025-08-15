import React, {useState, useEffect } from "react";
import { Box, CircularProgress, Button, Typography } from "@mui/material";
import { cMainColor, cWhite60 } from "../../../data/ColorDef";

import useSWR from "swr";


import TopTitleBar from "../../../components/TopTitleBar";
import { useNavigate, useParams } from "react-router-dom";
import BaseMotionDiv from "../../BaseMotionDiv";
import CosGridFrame from "../../../components/CosGridFrame";
import CosPagination from "../../../components/base/CosPagination";
import { getAuthFavoriteAlbumLists, getAuthFavoriteVideoLists } from "../../../Shared/Api/CosApi";
import { ifAuthFavoriteAlbum, ifAuthFavoriteVideo } from "../../../Shared/Api/interface/AuthInterface";
import { pEachPageCount } from "../../../data/ParameterDef";

export interface ifQueryResult {
  videoList?: ifAuthFavoriteVideo;
  albumList?: ifAuthFavoriteAlbum;
  totalItems: number;
}

function CosFavoritePage() {
  const { type,page } = useParams();
  const navigate = useNavigate();
  
  const [queryType, setQueryType] = useState(type || 'video');
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);

  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(document.documentElement.clientWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(document.documentElement.clientWidth);
      });
    };
  }, []);

  // 監聽路由變化，自動滾動到頂部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [page]);

  // 監聽 type 參數變化
  useEffect(() => {
    if (type) {
      setQueryType(type);
    }
  }, [type]);

  // 處理切換類型
  const handleTypeChange = (newType: string) => {
    setQueryType(newType);
    setCurrentPage(1);
    navigate(`/my/favorite/${newType}/1`,{replace:true});
  };

  const fetcher = async (): Promise<ifQueryResult | undefined> => {
    if(queryType === 'video'){
      const res = await getAuthFavoriteVideoLists((currentPage - 1),pEachPageCount);
      if(res.result === 'success'){
        return {videoList: res.data ,totalItems: parseInt(res.data!.totalCnt)};
      }
    }else{
      const res = await getAuthFavoriteAlbumLists(currentPage-1,pEachPageCount);
      if(res.result === 'success'){
        return {albumList: res.data ,totalItems: parseInt(res.data!.totalCnt)};
      }
    }
    return undefined;
  };

  const { data, error, isLoading } = useSWR(`favoriteList${queryType}${currentPage}`, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 0,
    refreshInterval: 0
  });
  
  // 處理頁面變動
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    navigate(`/my/favorite/${queryType}/${value}`,{replace:true});
    
  };

  //const windowWidth = document.documentElement.clientWidth;
  const totalCount = data?.videoList?.totalCnt || data?.albumList?.totalCnt || 0;
  const maxCount = data?.videoList?.MaxCnt || data?.albumList?.MaxCnt || 0;

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",  
          gap: 12,//設定子元件間距
        }}
      >
        <TopTitleBar title="我的收藏" />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '5px 5px',
          gap: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            flex: 1,
          }}>
            <Button
              onClick={() => handleTypeChange('video')}
              sx={{
                fontSize: '22px',
                color: queryType === 'video' ? cMainColor : cWhite60,
                textDecoration: queryType === 'video' ? 'underline' : 'none',
                minWidth: 'auto',
                padding: '4px 4px',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              视频
            </Button>

            <Box sx={{ 
              width: '1px', 
              height: '20px', 
              backgroundColor: cWhite60 
            }} />

            <Button
              onClick={() => handleTypeChange('album')}
              sx={{
                fontSize: '22px',
                color: queryType === 'album' ? cMainColor : cWhite60,
                textDecoration: queryType === 'album' ? 'underline' : 'none',
                minWidth: 'auto',
                padding: '4px 4px',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              相簿
            </Button>
          </Box>

          <Typography sx={{ color: cWhite60 }}>
            收藏数量: {totalCount} / {maxCount}
          </Typography>
        </Box>
        
        {
          isLoading&&
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <CircularProgress />
            </Box>
        }

        {/* 影片列表 */}
        {
        (!error&&data&&data.videoList)&&
          <CosGridFrame
            items={data.videoList.lists}
            column={2}
            delMode={true}
          />
        }

        {/* 相簿列表 */}
        {(!error&&data&&data.albumList)&&
          <CosGridFrame
            albums={data.albumList.lists}
            column={2}
            delMode={true}
          />
        }
        
        {/* 頁面控制器 */}
        {(!error && data) && (
          <CosPagination
            totalItems={data.totalItems}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            pEachPageCount={pEachPageCount}
          />
        )}
        
        {/* 增加空間,避免底部導航被蓋住 */}
        <Box sx={{height:20}}></Box>
      </Box>
    </BaseMotionDiv>
  );
}

export default CosFavoritePage;
