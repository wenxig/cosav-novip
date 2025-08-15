import React, {useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BaseMotionDiv from "../BaseMotionDiv";
import useSWR from "swr";
import { getAlbumInfo } from "../../Shared/Api/CosApi";
import { useParams } from "react-router-dom";
import { cBasePanel } from "../../data/ColorDef";
import VideoTitle from "../../components/video/VideoTitle";
import VideoInfo from "../../components/video/VideoInfo";
import CosAdIFrame from "../../components/CosAdIFrame";
import CosGridFrame from "../../components/CosGridFrame";
import TopTitleBar from "../../components/TopTitleBar";
import { ifAlbumApiResponse } from "../../Shared/Api/interface/AlbumInterface";
import AlbumCover from "../../components/album/AlbumCover";
import ViewerAndFavorite from "../../components/album/ViewerAndFavorite";
import { API_DEDUPING_INTERVAL } from "../../data/ParameterDef";

function AlbumDetial() {
  const { albumId , photoUrl } = useParams();
  

  const fetcher = async (): Promise<ifAlbumApiResponse> => {
    return await getAlbumInfo(albumId);
  };

  // 獲取影片資訊
  const { data, error, isLoading } = useSWR(`GetAlbumInfo${albumId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL, // 1小時 = 3600000毫秒
    revalidateIfStale: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // 加載中只顯示轉圈圈
  if (isLoading) {
    return (
      <BaseMotionDiv>
        <TopTitleBar title={'相簿详情'} />
        <Box
          style={{
            backgroundColor: "black",
            width: "100%",
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "white" }} />
        </Box>
      </BaseMotionDiv>
    );
  }

  // 錯誤顯示
  if (error || !data || !data.data) {
    
    return (
      <BaseMotionDiv>
        <TopTitleBar title={'相簿详情'} />
        <Box
          style={{
            backgroundColor: "black",
            width: "100%",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            載入失敗: {error}
          </Typography>
        </Box>
      </BaseMotionDiv>
    );
  }

  const apiData = data.data;

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: "black",
          width: "100%",
          minHeight: "100%",
          display: "grid",  
          gap: 12,//設定子元件間距
        }}
      >
        <TopTitleBar title={'相簿详情'} />
        
        <AlbumCover albumId={albumId!} photoUrl={photoUrl!} pageCount={apiData.total_photos}/>


        {/* 影片標題 */}
        <VideoTitle title={apiData.title} backgroundColor={cBasePanel} />

        
        {/* 觀看人數 感謝廠商 */}
        <ViewerAndFavorite 
          viewer={apiData.total_views} 
          albumId={albumId!}
        />


        <VideoInfo album={apiData} />




        <Typography sx={{ color: "white" ,ml:2,fontSize:"22px"}}>
          相关视频
        </Typography>
        <CosGridFrame albums={apiData.related.slice(0, 4)} column={2} isReplace={true} />
        {apiData.related.length > 4 && (
          <CosGridFrame albums={apiData.related.slice(4)} column={2} isReplace={true} />
        )}


        <Box sx={{height:30}}></Box>
      </Box>
    </BaseMotionDiv>
  );
}

export default AlbumDetial;
