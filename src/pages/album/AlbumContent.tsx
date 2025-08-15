import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import BaseMotionDiv from "../BaseMotionDiv";
import useSWR from "swr";
import { getAlbumContent, sendAlbumFavorite } from "../../Shared/Api/CosApi";
import { useParams } from "react-router-dom";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import TopTitleBar from "../../components/TopTitleBar";
import FavoriteIcon from '@mui/icons-material/Favorite';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; 
import { ifAlbumContentApiResponse, ifAlbumFavoriteApiResponse } from "../../Shared/Api/interface/AlbumInterface";
import AlbumContentButton from "../../components/album/AlbumContentButton";

import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { API_DEDUPING_INTERVAL } from "../../data/ParameterDef";
import CosCheckIsLogin from "../../components/base/check/CosCheckIsLogin";
import CosMessageAndLoading from "../../components/base/CosMessageAndLoading";
import { checkIsFavoriteAlbum } from "../../Shared/function/VideoFunction";
import { checkIsLogin } from "../../Shared/function/AccountFunction";
import { addFavoriteAlbum, removeFavoriteAlbum } from "../../data/DataCenter";


function AlbumContent() {
  const { albumId } = useParams();
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(checkIsFavoriteAlbum(albumId||""));
  
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info' | 'warning'>('info');
  const setShowMsg = (msg: string, msgType: 'error' | 'success' | 'info' | 'warning') => {
    setMsg(msg);
    setMsgType(msgType);
  }
  const [isLoading2, setIsLoading2] = useState(false);

  const handleFavoriteClick = () => {
    // 檢查是否已登入
    if(!checkIsLogin()){
      setCheckIsLoginOpen(true);
      return;
    }

    setIsLoading2(true);
    sendAlbumFavorite(albumId!).then((res:ifAlbumFavoriteApiResponse)=>{
      if(res.result === "success" && res.data?.status === "ok"){
        if(isFavorite){
          // 取消收藏
          removeFavoriteAlbum(albumId!);
        }else{
          // 收藏
          addFavoriteAlbum(albumId!);
        }
        setShowMsg(isFavorite?"取消收藏成功":"收藏成功", 'success');
        setIsFavorite(!isFavorite);
      }else{
        setShowMsg(res.message||"操作失败,请稍后再试", 'error');
      }
      setIsLoading2(false);
    });
  };

  const fetcher = async (): Promise<ifAlbumContentApiResponse> => {
    return await getAlbumContent(albumId);
  };

  const { data: apiData, error, isLoading } = useSWR(`GetAlbumContent${albumId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: API_DEDUPING_INTERVAL,
    revalidateIfStale: false
  });

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  if (isLoading) {
    return (
      <BaseMotionDiv>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "black",
          }}
        >
          <CircularProgress />
        </Box>
      </BaseMotionDiv>
    );
  }

  if (error || !apiData?.data) {
    return (
      <BaseMotionDiv>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "black",
            color: "white",
          }}
        >
          <Typography>載入失敗</Typography>
        </Box>
      </BaseMotionDiv>
    );
  }

  

  const componentWidth = document.documentElement.clientWidth;
  const componentHeight = document.documentElement.clientHeight - 60;
  //const bottonHeight = document.documentElement.clientHeight * 0.15;

  const handleBeforeChange = (index: number, node: any) => {
    setCurrentIndex(index);
  };

  return (
    <BaseMotionDiv>
      <Box>
        <TopTitleBar title={'相簿內容'} />
        
        <Box 
          sx={{ 
            overflow: 'hidden',
            width: componentWidth,
            height: componentHeight,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          
          <PhotoProvider>
            {
              viewMode === 'horizontal' ? (
                <Carousel 
                  responsive={responsive}
                  beforeChange={handleBeforeChange}
                >
                  {apiData.data.latest.map((photo, index) => (
                    <PhotoView key={index} src={photo}>
                      <Box
                        component="img"
                        src={photo}
                        sx={{
                          width: componentWidth,
                          height: componentHeight,
                          objectFit: 'contain',
                        }}
                      />
                    </PhotoView>
                  ))}
                </Carousel>
              ) :(
                <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {apiData.data.latest.map((photo, index) => (
                  <PhotoView key={index} src={photo}>
                    <Box
                      component="img"
                      src={photo}
                      sx={{
                        width: '100%',
                        objectFit: 'contain',
                        marginBottom: 1,
                      }}
                    />
                  </PhotoView>
                ))}
              </Box>
              )
            }
            
          </PhotoProvider>

        </Box>
  
        {/* 固定底部功能欄 */}
        <Box
          sx={{
            padding: 1,
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AlbumContentButton
              icon={<SwapHorizontalCircleOutlinedIcon />}
              text="水平阅读"
              isEnable={viewMode === 'horizontal'}
              minWidth={75}
              iconSize={20}
              fontSize={14}
              onClick={() => setViewMode('horizontal')}
            />
            <AlbumContentButton
              icon={<SwapVerticalCircleOutlinedIcon />}
              text="垂直阅读"
              isEnable={viewMode === 'vertical'}
              minWidth={75}
              iconSize={20}
              fontSize={14}
              onClick={() => setViewMode('vertical')}
            />
            <AlbumContentButton
              icon={<FavoriteIcon />}
              text={isFavorite?"已收藏":"收藏"}
              isEnable={isFavorite}
              minWidth={75}
              iconSize={20}
              fontSize={14}
              onClick={() => handleFavoriteClick()}
            />

          </Box>
          
          <Box>
            <MenuBookOutlinedIcon sx={{ color: 'white' ,fontSize: '26px'}} />
            <Typography sx={{ color: 'white' ,fontSize: '14px',fontWeight: 'bold'}}>
              {viewMode === 'horizontal' 
                ? `${currentIndex + 1}/${apiData.data.latest.length}`
                : `${apiData.data.latest.length}頁`}
            </Typography>
          </Box>
          
        </Box>
      </Box>

      {/* 確認是否登入訊息框 */}
      <CosCheckIsLogin
        open={checkIsLoginOpen}
        onCancel={() => {setCheckIsLoginOpen(false)}}
      />

      {/* 提示訊息 */}
      <CosMessageAndLoading
        isloading={isLoading2}
        msgType={msgType}
        msg={msg}
        onClose={()=>{
          setShowMsg('', 'info');
        }}
      />
    </BaseMotionDiv>
  );
}

export default AlbumContent;