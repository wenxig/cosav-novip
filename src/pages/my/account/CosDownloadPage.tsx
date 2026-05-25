import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TopTitleBar from "../../../components/TopTitleBar";
import BaseMotionDiv from "../../BaseMotionDiv";
import { cMainColor } from "../../../data/ColorDef";
import CosGridFrame from "../../../components/CosGridFrame";
import CosCheckIsDelete from "../../../components/base/check/CosCheckIsDelete";
import CosPagination from "../../../components/base/CosPagination";
import { ifVideoBaseInfo } from "../../../Shared/Api/interface/VideoInterface";
import { pEachPageCount } from "../../../data/ParameterDef";
import {
  deleteDownloadedFile,
  deleteDownloadedVideoData,
  getDownloadedVideoDatasPage,
  videoDetailToBaseInfo,
} from "../../../Shared/Utils/VideoDownloadUtil";
import { getExchangeTicket } from "../../../Shared/Api/CosApi";

type DownloadPageVideoList = {
  lastpage: number;
  totalCnt: string;
  MaxCnt: number;
  lists: ifVideoBaseInfo[];
};

const emptyVideoList: DownloadPageVideoList = {
  lastpage: 0,
  totalCnt: "0",
  MaxCnt: 0,
  lists: [],
};

const CosDownloadPage: React.FC = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    if (page == null || page === "") {
      return null;
    }
    const p = parseInt(page, 10);
    return Number.isFinite(p) && p >= 1 ? p : null;
  }, [page]);

  useEffect(() => {
    if (currentPage === null) {
      navigate("/my/downloads/1", { replace: true });
    }
  }, [currentPage, navigate]);

  const [videoList, setVideoList] = useState<DownloadPageVideoList>(emptyVideoList);
  const [remainDownload, setRemainDownload] = useState<number | null>(null);
  /** 刪除後遞增，用於重新觸發讀取 IndexedDB 分頁清單 */
  const [listRefreshTick, setListRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getExchangeTicket();

        if (cancelled) return;
        setRemainDownload(res.data?.msg?.remain_download ?? 0);
      } catch (e) {
        console.warn("讀取下載券餘額失敗", e);
        if (!cancelled) {
          setRemainDownload(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentPage === null) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { records, total } = await getDownloadedVideoDatasPage(currentPage, pEachPageCount);
        if (cancelled) return;

        const lastPage = Math.max(1, Math.ceil(total / pEachPageCount));
        if (total > 0 && currentPage > lastPage) {
          navigate(`/my/downloads/${lastPage}`, { replace: true });
          return;
        }

        const lists = records.map((r) => videoDetailToBaseInfo(r.data));
        setVideoList({
          ...emptyVideoList,
          totalCnt: String(total),
          lists,
        });
      } catch (e) {
        console.warn("讀取已下載影片清單失敗", e);
        if (!cancelled) {
          setVideoList(emptyVideoList);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPage, navigate, listRefreshTick]);

  const [checkIsDeleteOpen, setCheckIsDeleteOpen] = useState(false);
  const [pendingDeleteVideo, setPendingDeleteVideo] = useState<ifVideoBaseInfo | null>(null);

  const totalItems = parseInt(videoList.totalCnt, 10) || 0;
  const paginationPage = currentPage ?? 1;

  const handleClickDelete = (videoId: string) => {
    const target = videoList.lists.find((v) => v.id === videoId);
    if (!target) return;

    setPendingDeleteVideo(target);
    setCheckIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const videoId = pendingDeleteVideo?.id;
    setCheckIsDeleteOpen(false);
    setPendingDeleteVideo(null);
    if (!videoId) return;

    const fileName = `${videoId}.mp4`;
    await Promise.all([deleteDownloadedFile(fileName), deleteDownloadedVideoData(videoId)]);
    setListRefreshTick((t) => t + 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    navigate(`/my/downloads/${value}`, { replace: true });
  };

  const isEmpty = totalItems === 0;

  return (
    <BaseMotionDiv>
      <Box
        sx={{
          backgroundColor: "black",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <TopTitleBar title="已下载影片" backUrl="/my" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: "bold" }}>
            持有下载券：{remainDownload !== null ? `${remainDownload} 张` : ""}
          </Typography>

          <Typography onClick={() => navigate("/my/downloadsRecord")} sx={{ color: cMainColor }}>
            使用纪录
          </Typography>
        </Box>

        {isEmpty && (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: "white", fontSize: "18px" }}>尚未下载任何影片</Typography>

            <Button
              variant="outlined"
              onClick={() => navigate("/sponsor", { state: { tab: "download" } })}
              sx={{
                mt: 1,
                px: 3,
                py: 1,
                borderColor: cMainColor,
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              前往购买下载券
            </Button>

            <Typography
              onClick={() => navigate("/home")}
              sx={{
                mt: 1,
                color: cMainColor,
              }}
            >
              返回首页
            </Typography>
          </Box>
        )}

        {!isEmpty && (
          <CosGridFrame
            items={videoList.lists}
            column={2}
            delMode={true}
            onClickDeleteVideo={handleClickDelete}
          />
        )}
      </Box>

      <CosCheckIsDelete
        open={checkIsDeleteOpen}
        onCancel={() => setCheckIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        videoTitle={pendingDeleteVideo?.title}
      />

      {!isEmpty && (
        <CosPagination
          totalItems={totalItems}
          currentPage={paginationPage}
          handlePageChange={handlePageChange}
          pEachPageCount={pEachPageCount}
        />
      )}

      <Box sx={{ height: 20 }}></Box>
    </BaseMotionDiv>
  );
};

export default CosDownloadPage;
