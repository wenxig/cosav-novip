import React, { useState, useEffect } from "react"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import useSWR from "swr"
import { getVideoInfo } from "../../Shared/Api/CosApi"
import { useParams } from "react-router-dom"
import { ifVideoApiResponse } from "../../Shared/Api/interface/VideoInterface"
import JoinVipButton from "../../components/video/JoinVipButton"
import VideoTitle from "../../components/video/VideoTitle"
import PlayerAndLineSelectBar from "../../components/video/PlayerAndLineSelectBar"
import CosVideoPlayer from "../../components/video/CosVideoPlayer"
import CosVideoPlayer2 from "../../components/video/CosVideoPlayer2"
import ViewerAndThanks from "../../components/video/ViewerAndThanks"
import VideoButtonBar from "../../components/video/VideoButtonBar"
import VideoInfo from "../../components/video/VideoInfo"
import CosAdIFrame from "../../components/CosAdIFrame"
import CosGridFrame from "../../components/CosGridFrame"
import TopTitleBar from "../../components/TopTitleBar"
import BaseMotionDiv from "../BaseMotionDiv"
import { checkIsLogin, checkIsVip } from "../../Shared/function/AccountFunction"
import CosCheckIsLogin from "../../components/base/check/CosCheckIsLogin"
import CosCheckIsVip from "../../components/base/check/CosCheckIsVip"
//import { API_DEDUPING_INTERVAL } from "../../data/ParameterDef";
import CosRepeatedLogin from "../../components/base/check/CosRepeatedLogin"
import CosVipOnlyFrame from "../../components/video/CosVipOnlyFrame"
import { getSiteSetting } from "../../data/DataCenter"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import { cBasePanel, cMainColor } from "../../data/ColorDef"
import CosVideoCollection from "../../components/video/CosVideoCollection"


function VideoDetial() {
  const { videoId } = useParams()

  const [videoUrl, setVideoUrl] = useState<string>("") // 預設為空值
  const [playerId, setPlayerId] = useState<number>(1) // 預設為1
  const [lineIndex, setLineIndex] = useState<number>(0) // 預設為0
  const [urlAvailable, setUrlAvailable] = useState<boolean>(true)
  const [vipOnly, setVipOnly] = useState<boolean>(false)

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false)
  const [checkIsVipOpen, setCheckIsVipOpen] = useState(false)
  const [checkIsRepeatedLoginOpen, setCheckIsRepeatedLoginOpen] = useState(false)

  const [checkIsCollectionOpen, setCheckIsCollectionOpen] = useState(false)

  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(document.documentElement.clientWidth)
    })
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(document.documentElement.clientWidth)
      })
    }
  }, [])

  // 滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const fetcher = async (): Promise<ifVideoApiResponse | undefined> => {
    const res = await getVideoInfo(videoId)
    if (res.result === "fail" || !res.data) {
      if (res.message!.includes("401")) {
        setCheckIsRepeatedLoginOpen(true)
      }
      //拿API失敗
      return undefined
    }

    if (!res.data.can_play && !checkIsVip()) {
      //非VIP無法搶先看
      setVipOnly(true)
    }

    return res
  }

  // 獲取影片資訊
  const { data, error, isLoading } = useSWR(`GetVideoInfo${videoId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0,//設定60秒避免直拿不到
    revalidateIfStale: false,
  })

  // 當數據加載完成後，設定初始的 videoUrl
  useEffect(() => {
    if (data?.data?.video_url && data.data.video_url.length > 0) {
      setVideoUrl(data.data.video_url[0])
    }
  }, [data])

  // 測試 URL 可用性
  const testUrlAvailability = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('URL 測試失敗:', error)
      return false
    }
  }

  // 處理播放器切換
  const handlePlayerChange = (newPlayerId: number) => {
    setPlayerId(newPlayerId)
    // 這裡可以添加切換播放器的邏輯
  }

  // 處理線路切換
  const handleLineChange = async (newLineIndex: number) => {

    if (data?.data) {
      let targetUrl = ''
      if (newLineIndex < (data.data.video_url?.length || 0)) {
        // 一般線路
        setLineIndex(newLineIndex)
        targetUrl = data.data.video_url[newLineIndex]
      } else {

        setCheckIsLoginOpen(true)

        setCheckIsVipOpen(true)

        // VIP線路
        const vipIndex = newLineIndex - (data.data.video_url?.length || 0)
        if (data.data.video_url_vip && vipIndex < data.data.video_url_vip.length) {
          targetUrl = data.data.video_url_vip[vipIndex]
          setLineIndex(newLineIndex)
        }
      }

      const isAvailable = await testUrlAvailability(targetUrl)
      setUrlAvailable(isAvailable)
      setVideoUrl(targetUrl)
    }
  }

  // 加載中只顯示轉圈圈
  if (isLoading) {
    return (
      <BaseMotionDiv>
        <Box
          style={{
            backgroundColor: "black",
            width: windowWidth,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TopTitleBar title={'视频详情'} />
          <Box sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: windowWidth,
            paddingTop: "10px"
          }}>
            <CircularProgress size={60} thickness={4} sx={{ color: "white" }} />
          </Box>
        </Box>
      </BaseMotionDiv>
    )
  }

  // 錯誤顯示
  if (error || !data || !data.data) {
    return (
      <BaseMotionDiv>
        <Box
          style={{
            backgroundColor: "black",
            width: windowWidth,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TopTitleBar title={'视频详情'} />
          <Typography variant="h6" sx={{ color: "white" }}>
            載入失敗: {error}
          </Typography>
        </Box>
        <CosRepeatedLogin
          open={checkIsRepeatedLoginOpen}
          onClose={() => { setCheckIsRepeatedLoginOpen(false) }}
          redirectUrl={`/videoDetial/${videoId}`}
        />
      </BaseMotionDiv>
    )
  }

  const apiData = data.data
  const p1_player_before_adv_sec = checkIsVip() ? 0 : getSiteSetting().p1_player_before_adv_sec ?? 15


  // 按鈕通用樣式
  const buttonStyle = {
    backgroundColor: cBasePanel,
    color: 'rgba(255, 255, 255, 0.6)', // white60
    border: 'none',
    borderRadius: 1,
    textTransform: 'none',
    minWidth: '30px',
    width: '300px',
    py: 0.5,
    px: 1,
    '&:hover': {
      backgroundColor: 'rgba(51, 51, 51, 0.7)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 12,
    },
    '& .MuiButton-startIcon': {
      marginRight: 0.5, // 縮小圖標和文字之間的間距
    },
  }

  const handleCollectionClick = () => {
    setCheckIsCollectionOpen(true)
    //navigate(`/videoDetial/${apiData.group_id}`);
  }


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
        <TopTitleBar title={'视频详情'} />
        <Typography sx={{ color: "white", ml: 2, fontSize: "12px", textAlign: "center" }}>
          请勿使用 行政.学校单位网路观看会导致无法播放
        </Typography>
        {

          playerId === 1
            ? (<CosVideoPlayer
              videoUrl={videoUrl}
              posterUrl={apiData.video_img}
              adSec={p1_player_before_adv_sec}
            />)
            : (<CosVideoPlayer2
              videoUrl={videoUrl}
              posterUrl={apiData.video_img}
              adSec={p1_player_before_adv_sec}
            />)

        }

        {/* 加入VIP略过广告，并享更多专属服务 */}
        {/* <JoinVipButton buttonText="加入VIP略过广告，并享更多专属服务" redirectUrl="/sponsor" show={true} /> */}

        {/* 影片標題 */}
        <VideoTitle title={apiData.title} backgroundColor={"black"} />

        {/* 播放器與線路選擇器 */}
        <PlayerAndLineSelectBar
          data={apiData}
          playerId={playerId}
          lineIndex={lineIndex}
          onPlayerChange={handlePlayerChange}
          onLineChange={handleLineChange}
        />

        {/* 觀看人數 感謝廠商 */}
        <ViewerAndThanks
          viewer={apiData.viewnumber}
          thank_vendor_text={apiData.thank_vendor_text}
          thank_vendor_url={apiData.thank_vendor_url}
        />


        {
          apiData.group_id !== '0' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: -1 }}>
              <Button
                variant="contained"
                startIcon={<ArticleOutlinedIcon sx={{ color: cMainColor }} />}
                onClick={handleCollectionClick}
                sx={buttonStyle}
              >
                <Typography variant="caption" sx={{ fontSize: 14, color: cMainColor, fontWeight: 600 }}>
                  续集
                </Typography>
              </Button>
            </Box>
          )
        }

        {/* 影片按鈕條 */}
        <VideoButtonBar
          videoId={videoId || ""}
          videoUrl={videoUrl}
          player={playerId}
          line={lineIndex + 1}
          reason={urlAvailable ? "0" : "2"}
          videoData={apiData}
        />

        {/* 影片資訊 */}
        <VideoInfo video={apiData} />

        <Typography sx={{ color: "white", ml: 2, fontSize: "22px" }}>
          相关视频
        </Typography>
        <CosGridFrame items={apiData.cnxh.slice(0, 4)} column={2} isReplace={true} />
        {apiData.cnxh.length > 4 && (
          <CosGridFrame items={apiData.cnxh.slice(4)} column={2} isReplace={true} />
        )}
        <Box sx={{ height: 20 }}></Box>

        {/* 檢查是否已登入 */}
        <CosCheckIsLogin
          open={checkIsLoginOpen}
          onCancel={() => { setCheckIsLoginOpen(false) }}
        />

        {/* 檢查是否已VIP */}
        {/* <CosCheckIsVip
          open={checkIsVipOpen}
          onCancel={() => {setCheckIsVipOpen(false)}}
        /> */}

        <CosVideoCollection
          open={checkIsCollectionOpen}
          onCancel={() => { setCheckIsCollectionOpen(false) }}
          group_id={apiData.group_id}
        />


      </Box>
    </BaseMotionDiv>
  )
}

export default VideoDetial
