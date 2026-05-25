import React, { useState, useEffect} from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useSWR from 'swr';
import { authUseExchangeTicket, checkExchangeTicket, getVideoInfo } from '../../Shared/Api/CosApi';
import { useNavigate, useParams } from 'react-router-dom';
import { ifVideoApiResponse } from '../../Shared/Api/interface/VideoInterface';
import JoinVipButton from '../../components/video/JoinVipButton';
import VideoTitle from '../../components/video/VideoTitle';
import PlayerAndLineSelectBar from '../../components/video/PlayerAndLineSelectBar';
import CosVideoPlayer from '../../components/video/CosVideoPlayer';
import CosVideoPlayer2 from '../../components/video/CosVideoPlayer2';
import ViewerAndThanks from '../../components/video/ViewerAndThanks';
import VideoButtonBar from '../../components/video/VideoButtonBar';
import VideoInfo from '../../components/video/VideoInfo';
import CosAdIFrame from '../../components/CosAdIFrame';
import CosGridFrame from '../../components/CosGridFrame';
import TopTitleBar from '../../components/TopTitleBar';
import BaseMotionDiv from '../BaseMotionDiv';
import {
  checkIsLogin,
  checkIsVip,
} from '../../Shared/function/AccountFunction';
import CosCheckIsLogin from '../../components/base/check/CosCheckIsLogin';
import CosCheckIsVip from '../../components/base/check/CosCheckIsVip';
//import { API_DEDUPING_INTERVAL } from "../../data/ParameterDef";
import CosRepeatedLogin from '../../components/base/check/CosRepeatedLogin';
import CosVipOnlyFrame from '../../components/video/CosVipOnlyFrame';
import { getSiteSetting } from '../../data/DataCenter';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { cBasePanel, cMainColor } from '../../data/ColorDef';
import CosVideoCollection from '../../components/video/CosVideoCollection';
import {
  checkAndGetDownloadedFile,
  downloadVideo,
  getDownloadedFile,
  getLocalFileUrl,
  saveDownloadedVideoData,
} from '../../Shared/Utils/VideoDownloadUtil';
import { trackerUtil } from '../../Shared/Utils/TrackerUtil';
import CosDownloadDialog, {
  DownloadDialogStatus,
} from '../../components/video/CosDownloadDialog';

function VideoDetial() {
  const { videoId } = useParams();

  const [videoUrl, setVideoUrl] = useState<string>(''); // 預設為空值
  const [playerId, setPlayerId] = useState<number>(1); // 預設為1
  const [lineIndex, setLineIndex] = useState<number>(0); // 預設為0
  const [urlAvailable, setUrlAvailable] = useState<boolean>(true);
  const [vipOnly, setVipOnly] = useState<boolean>(false);

  const [checkIsLoginOpen, setCheckIsLoginOpen] = useState(false);
  const [checkIsVipOpen, setCheckIsVipOpen] = useState(false);
  const [checkIsRepeatedLoginOpen, setCheckIsRepeatedLoginOpen] = useState(false);

  const [checkIsCollectionOpen, setCheckIsCollectionOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(
    document.documentElement.clientWidth,
  );

  const [hasDownloadedFile, setHasDownloadedFile] = useState(false);
  const [localDiskVideoResponse, setLocalDiskVideoResponse] = useState<ifVideoApiResponse | null | undefined>(undefined);

  //const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedTotalSize, setDownloadedTotalSize] = useState(0);
  const [downloadedLoadedSize, setDownloadedLoadedSize] = useState(0);
  const [downloadedSpeed, setDownloadedSpeed] = useState(0);
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadDialogStatus, setDownloadDialogStatus] = useState<DownloadDialogStatus>('confirm');
  const [downloadDialogUsedCouponCount, setDownloadDialogUsedCouponCount] = useState(1);
  const [downloadDialogExpireDate, setDownloadDialogExpireDate] = useState('');
  const [downloadDialogErrorMessage, setDownloadDialogErrorMessage] = useState('');

  /** 本機 MP4 的 blob: URL，建立後重複使用，避免切換線路時再次打 IndexedDB / createObjectURL */
  const [localVideoUrl, setLocalVideoUrl] = useState('');
  const navigate = useNavigate();

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

  // 滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 上报视频观看事件
  useEffect(() => {
    if (videoId) {
      trackerUtil.trackVideoView(videoId).catch(() => {});
    }
  }, [videoId]);

  // 在 useSWR 之前：先檢查 IndexedDB 是否已有 MP4 + ifVideoDetail
  useEffect(() => {
    if (!videoId) {
      setLocalDiskVideoResponse(null);
      setHasDownloadedFile(false);
      return;
    }
    let cancelled = false;
    setVipOnly(false);
    (async () => {
      const { videoFile,hasFile, videoData } = await checkAndGetDownloadedFile(videoId);
      if (cancelled) return;
      setHasDownloadedFile(hasFile);
      if (hasFile && videoData && videoFile) {
        //記錄本地VIDEO的URL
        const localUrl = await getLocalFileUrl(videoFile);
        if (localUrl) {
          setLocalVideoUrl(localUrl);
        }
        setLocalDiskVideoResponse({
          result: 'success',
          message: null,
          data: videoData,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const fetcher = async (): Promise<ifVideoApiResponse | undefined> => {
    console.log('fetcher', videoId);

    const res = await getVideoInfo(videoId);

    if (res.result === 'fail' || !res.data) {
      if (res.message!.includes('401')) {
        setCheckIsRepeatedLoginOpen(true);
      }
      //拿API失敗
      return undefined;
    }

    if (!res.data.can_play && !checkIsVip()) {
      //非VIP無法搶先看
      setVipOnly(true);
    }

    return res;
  };

  const swrKey =
    !hasDownloadedFile
      ? `GetVideoInfo${videoId}`
      : null;

  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
  } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0, //設定60秒避免直拿不到
    revalidateIfStale: false,
  });

  const data: ifVideoApiResponse | undefined | null = localDiskVideoResponse ?? swrData ?? undefined;
  const error = hasDownloadedFile ? undefined : swrError;
  const isLoading = hasDownloadedFile ? false : swrLoading;

  // 當數據加載完成後，設定初始的 videoUrl
  useEffect(() => {
    const checkAndSetVideoUrl = async () => {

      if(localVideoUrl){
        setVideoUrl(localVideoUrl);
        return;
      }

      if (!data?.data) {
        return;
      }

      // 獲取遠程 URL
      const remoteUrl =
        data.data.video_url && data.data.video_url.length > 0
          ? data.data.video_url[0]
          : '';

      if (remoteUrl) {
        setVideoUrl(remoteUrl);
      }
    };

    checkAndSetVideoUrl();
  }, [data, videoId, localVideoUrl]);

  // 處理播放器切換
  const handlePlayerChange = async (newPlayerId: number) => {
    setPlayerId(newPlayerId);

    if(localVideoUrl){
      setVideoUrl(localVideoUrl);
      return;
    }

    // 切換播放器時也要檢查是否有下載檔案
    if (data?.data) {
      // 獲取當前使用的遠程 URL（根據當前線路索引）
      let remoteUrl = '';

      // 根據當前線路索引獲取對應的遠程 URL
      if (lineIndex < (data.data.video_url?.length || 0)) {
        remoteUrl = data.data.video_url[lineIndex];
      } else {
        const vipIndex = lineIndex - (data.data.video_url?.length || 0);
        if (
          data.data.video_url_vip &&
          vipIndex < data.data.video_url_vip.length
        ) {
          remoteUrl = data.data.video_url_vip[vipIndex];
        }
      }
      setVideoUrl(remoteUrl);
    }
  };

  // 處理線路切換
  const handleLineChange = async (newLineIndex: number) => {
    if (data?.data) {
      let targetUrl = '';
      if (newLineIndex < (data.data.video_url?.length || 0)) {
        // 一般線路
        setLineIndex(newLineIndex);
        targetUrl = data.data.video_url[newLineIndex];
      } else {
        // 檢查是否已登入
        if (!checkIsLogin()) {
          setCheckIsLoginOpen(true);
          return;
        }

        if (!checkIsVip()) {
          setCheckIsVipOpen(true);
          return;
        }

        // VIP線路
        const vipIndex = newLineIndex - (data.data.video_url?.length || 0);
        if (
          data.data.video_url_vip &&
          vipIndex < data.data.video_url_vip.length
        ) {
          targetUrl = data.data.video_url_vip[vipIndex];
          setLineIndex(newLineIndex);
        }
      }

      if (targetUrl) {
        if (hasDownloadedFile && localVideoUrl) {
          setVideoUrl(localVideoUrl);
          setUrlAvailable(true);
        } else {
          setVideoUrl(targetUrl);
        }
      }
    }
  };

  // 加載中只顯示轉圈圈
  if (isLoading) {
    return (
      <BaseMotionDiv>
        <Box
          style={{
            backgroundColor: 'black',
            width: windowWidth,
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TopTitleBar title={'视频详情'} defaultBackPath="/home" />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: windowWidth,
              paddingTop: '10px',
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
          </Box>
        </Box>
      </BaseMotionDiv>
    );
  }

  // 錯誤顯示
  if (error || !data || !data.data) {
    return (
      <BaseMotionDiv>
        <Box
          style={{
            backgroundColor: 'black',
            width: windowWidth,
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TopTitleBar title={'视频详情'} defaultBackPath="/home" />
          <Typography variant="h6" sx={{ color: 'white' }}>
            載入失敗: {error}
          </Typography>
        </Box>
        <CosRepeatedLogin
          open={checkIsRepeatedLoginOpen}
          onClose={() => {
            setCheckIsRepeatedLoginOpen(false);
          }}
          redirectUrl={`/videoDetial/${videoId}`}
        />
      </BaseMotionDiv>
    );
  }

  const apiData = data.data;
  const p1_player_before_adv_sec = checkIsVip()
    ? 0
    : getSiteSetting().p1_player_before_adv_sec ?? 15;

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
  };

  const handleCollectionClick = () => {
    setCheckIsCollectionOpen(true);
    //navigate(`/videoDetial/${apiData.group_id}`);
  };

  const getDownloadUrl =  (): string => {
    let downloadUrl = '';
    if (lineIndex < (apiData.video_url_mp4?.length || 0)) {
      // 一般線路：使用 video_url_mp4
      downloadUrl = apiData.video_url_mp4[lineIndex];
    } else {
      // VIP線路：使用 video_url_mp4_vip
      const vipIndex = lineIndex - (apiData.video_url_mp4?.length || 0);
      if (
        apiData.video_url_mp4_vip &&
        vipIndex < apiData.video_url_mp4_vip.length
      ) {
        downloadUrl = apiData.video_url_mp4_vip[vipIndex];
      }
    }
    return downloadUrl;
  };

  // 處理下載影片（背景下載到應用目錄）
  const handleDownload = async () => {

    if (downloadDialogUsedCouponCount > 0) {
      //使用下載券
      const buyResult = await authUseExchangeTicket(videoId!);
      if (buyResult.result === 'fail' || !buyResult.data) {
        alert('使用下載券失敗，請稍後再試');
        setDownloadDialogStatus('fail');
        return;
      }
    }

    setDownloadDialogStatus('downloading');
    setDownloadProgress(0);

    // MP4 文件直接保存為 .mp4 格式（在 try 外定義以便 catch 區塊也能使用）
    const fileName = `${videoId}.mp4`;

    try {
      // 根據當前線路索引從 video_url_mp4 或 video_url_mp4_vip 中選擇 URL
      let downloadUrl = getDownloadUrl();

      // 如果沒有找到 MP4 URL，提示錯誤
      if (!downloadUrl) {
        alert('找不到可下載的 MP4 視頻地址');
        return;
      }

      await downloadVideo(downloadUrl, fileName, (detail) => {
        setDownloadProgress(detail.progress);
        setDownloadedTotalSize(detail.totalBytes ?? 0);
        setDownloadedLoadedSize(detail.loadedBytes);
        setDownloadedSpeed(detail.bytesPerSecond);

      });

      // 下載成功後才另外儲存影片資訊到 VideoDownloadDatas
      if (videoId && swrData) {
        setLocalDiskVideoResponse(swrData);
        await saveDownloadedVideoData(videoId, swrData.data!);
      }

      //強制設為100%
      setDownloadProgress(100);

      // 在背景檢查文件（不阻塞 UI）
      (async () => {
        try {
          // 下載完成後，更新是否有已下載文件的狀態
          const downloadedFile = await getDownloadedFile(fileName);
          console.log('檢查下載文件結果:', downloadedFile);
          setHasDownloadedFile(!!downloadedFile);

          if (downloadedFile) {
            console.log('下載成功，文件已確認存在');
            setDownloadDialogStatus('success');
          } else {
            console.warn('下載完成但文件未找到');
            setDownloadDialogStatus('fail');
          }
        } catch (checkError) {
          console.warn('檢查下載文件時發生錯誤（可能不影響下載）:', checkError);
          // 即使檢查失敗，也嘗試設置狀態
          setHasDownloadedFile(true);
          setDownloadDialogStatus('fail');
        }
      })();
    } catch (error: any) {
      alert('下載失敗，請稍後再試');
      setDownloadProgress(0);
      setDownloadDialogStatus('fail');
    }
  };

 
  const handleClickDownload = async () => {
    //刪除IndexedDB
    //indexedDB.deleteDatabase('VideoDownloads')
    
    //  登入檢查
    if (!checkIsLogin()) {
      setCheckIsLoginOpen(true);
      return;
    }

    const checkResult = await checkExchangeTicket(videoId!);
    console.log('checkResult', checkResult);
    if(checkResult.result === 'fail' || !checkResult.data){
      setDownloadDialogStatus('fail');
      setDownloadDialogErrorMessage(checkResult.data?.msg ?? '');
      setDownloadDialogOpen(true);
      return;
    }
    if (checkResult.data && (checkResult.data.expire_date && checkResult.data.expire_date > new Date().toISOString())){
      //還在下載有效期內
      setDownloadDialogExpireDate(checkResult.data.expire_date);
      setDownloadDialogStatus('confirm');
      setDownloadDialogUsedCouponCount(0);
      setDownloadDialogOpen(true);
      return;
    }

    console.log('checkResult.data', checkResult.data);

    if (!checkResult.data || !checkResult.data.video_download || checkResult.data.video_download! <= 0){
      //下載券已用完
      setDownloadDialogStatus('noCoupon');
      setDownloadDialogOpen(true);
      return;
    }

    // 获取下载券
    /*
    const tickets = await getExchangeTicket();
    console.log('tickets', tickets);
    if (tickets.result === 'fail' || !tickets.data) {
      alert('获取下载券失败，请稍后重试');
      return;
    }

    // 下載券檢查（先用 mock）
    if (tickets.data.msg.remain_download! <= -1){
      //下載券已用完
      setDownloadDialogStatus('noCoupon');
      setDownloadDialogOpen(true);
      return;
    }*/

    //顯示下載券使用彈窗
    setDownloadDialogStatus('confirm');
    setDownloadDialogUsedCouponCount(1);
    setDownloadDialogOpen(true);
  };

  return (
    <BaseMotionDiv>
      <Box
        style={{
          backgroundColor: 'black',
          width: '100%',
          minHeight: '100%',
          display: 'grid',
          gap: 12, //設定子元件間距
        }}
      >
        <TopTitleBar title={'视频详情'} defaultBackPath="/home" />
        <Typography
          sx={{ color: 'white', ml: 2, fontSize: '12px', textAlign: 'center' }}
        >
          请勿使用 行政.学校单位网路观看会导致无法播放
        </Typography>
        {vipOnly && (
          <CosVipOnlyFrame
            posterUrl={apiData.video_img}
            message={apiData.can_play_msg}
            adSec={p1_player_before_adv_sec}
          />
        )}
        {!vipOnly &&
          (playerId === 1 ? (
            <CosVideoPlayer
              videoUrl={videoUrl}
              posterUrl={apiData.video_img}
              adSec={p1_player_before_adv_sec}
            />
          ) : (
            <CosVideoPlayer2
              videoUrl={videoUrl}
              posterUrl={apiData.video_img}
              adSec={p1_player_before_adv_sec}
            />
          ))}

        {/* 加入VIP略过广告，并享更多专属服务 */}
        <JoinVipButton
          buttonText="加入VIP略过广告，并享更多专属服务"
          redirectUrl="/sponsor"
          show={true}
        />

        {/* 影片標題 */}
        <VideoTitle title={apiData.title} backgroundColor={'black'} />


        {/* 播放器與線路選擇器 */}
        <PlayerAndLineSelectBar
          data={apiData}
          playerId={playerId}
          lineIndex={lineIndex}
          onPlayerChange={handlePlayerChange}
          onLineChange={handleLineChange}
          hasDownloadedFile={hasDownloadedFile}
        />

        {/* 觀看人數 感謝廠商 */}
        <ViewerAndThanks
          viewer={apiData.viewnumber}
          thank_vendor_text={apiData.thank_vendor_text}
          thank_vendor_url={apiData.thank_vendor_url}
        />

        {/* VIDEO_COVER廣告 */}
        <CosAdIFrame adType="VIDEO_COVER" pageName={'videoDetial'} />

        {apiData.group_id !== '0' && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: -1 }}
          >
            <Button
              variant="contained"
              startIcon={<ArticleOutlinedIcon sx={{ color: cMainColor }} />}
              onClick={handleCollectionClick}
              sx={buttonStyle}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 14, color: cMainColor, fontWeight: 600 }}
              >
                续集
              </Typography>
            </Button>
          </Box>
        )}
        {/* 下載影片按鈕 */}
        {/*}
          <Button
            variant="contained"
            sx={{ mx: 1, backgroundColor: hasDownloadedFile ? '#4CAF50' : '#aa7712', color: 'black' }}
            startIcon={hasDownloadedFile ? <ArticleOutlinedIcon /> : <FileDownloadIcon />}
            onClick={hasDownloadedFile ? ()=>{navigate('/my/downloads/1')} : handleClickDownload}
          >
            {hasDownloadedFile ? '已下载影片，前往下载区查看' : '下载影片'}
          </Button>
      */}

        {/* 影片按鈕條 */}
        <VideoButtonBar
          videoId={videoId || ''}
          videoUrl={videoUrl}
          player={playerId}
          line={lineIndex + 1}
          reason={urlAvailable ? '0' : '2'}
          videoData={apiData}
        />

        {/* 影片資訊 */}
        <VideoInfo video={apiData} />

        <Typography sx={{ color: 'white', ml: 2, fontSize: '22px' }}>
          相关视频
        </Typography>
        {apiData && apiData.cnxh && apiData.cnxh.length > 0 && (
          <CosGridFrame
            items={apiData.cnxh.slice(0, 4)}
            column={2}
            isReplace={true}
          />
        )}

        <CosAdIFrame adType="VIDEO_INFO" pageName={'videoDetial'} />
        {apiData && apiData.cnxh && apiData.cnxh.length > 4 && (
          <CosGridFrame
            items={apiData.cnxh.slice(4)}
            column={2}
            isReplace={true}
          />
        )}
        <Box sx={{ height: 20 }}></Box>

        {/* 檢查是否已登入 */}
        <CosCheckIsLogin
          open={checkIsLoginOpen}
          onCancel={() => {
            setCheckIsLoginOpen(false);
          }}
        />

        {/* 檢查是否已VIP */}
        <CosCheckIsVip
          open={checkIsVipOpen}
          onCancel={() => {
            setCheckIsVipOpen(false);
          }}
        />

        <CosVideoCollection
          open={checkIsCollectionOpen}
          onCancel={() => {
            setCheckIsCollectionOpen(false);
          }}
          group_id={apiData.group_id}
        />

        <CosDownloadDialog
          open={downloadDialogOpen}
          status={downloadDialogStatus}
          progress={downloadProgress}
          usedCouponCount={downloadDialogUsedCouponCount}
          downloadedSizeText={downloadedLoadedSize > 0 ? `${(downloadedLoadedSize / 1024 / 1024).toFixed(2)}MB` : '0MB'}
          totalSizeText={downloadedTotalSize > 0 ? `${(downloadedTotalSize / 1024 / 1024).toFixed(2)}MB` : '0MB'}
          downloadedSpeedText={downloadedSpeed > 0 ? ((downloadedSpeed / 1024) >= 1024 ? `${(downloadedSpeed / 1024 / 1024).toFixed(2)}MB/s` : `${(downloadedSpeed / 1024).toFixed(2)}KB/s`) : '0KB/s'}
          expireDate={downloadDialogExpireDate}
          onClose={() => {
            setDownloadDialogOpen(false);
          }}
          onStartDownload={handleDownload}
          errorMessage={downloadDialogErrorMessage}
        />
      </Box>
    </BaseMotionDiv>
  );
}

export default VideoDetial;
