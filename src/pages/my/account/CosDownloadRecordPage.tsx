import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { cMainColor, cWhite60 } from "../../../data/ColorDef";
import { useNavigate, useParams } from "react-router-dom";
import TopTitleBar from "../../../components/TopTitleBar";
import BaseMotionDiv from "../../BaseMotionDiv";
import useSWR from "swr";
import { getExchangeTicket } from "../../../Shared/Api/CosApi";
import { ifExchangeTicket } from "../../../Shared/Api/interface/AuthInterface";

const CosDownloadRecordPage: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

  const { page } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [remainDownload, setRemainDownload] = useState<number | null>(null);

  const handlePageChange = (_: any, page: number) => {
    setCurrentPage(page);
    navigate(`/my/download-records/${page}`, { replace: true });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(document.documentElement.clientWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const fetcher = async () => {
    try {
      const res = await getExchangeTicket();
      setRemainDownload(res.data?.msg?.remain_download ?? 0);
      return res.data?.msg;
    } catch (e) {
      console.warn("讀取下載券餘額失敗", e);
      setRemainDownload(null);
    }

    return undefined;
  };

  const { data, error, isLoading } = useSWR(["downloadRecord", currentPage], fetcher);

  const isEmpty = data?.data?.length === 0;

  return (
    <BaseMotionDiv>
      <Box
        sx={{
          backgroundColor: "black",
          width: windowWidth,
          minHeight: "200%",
          display: "grid",
          gap: 1.5,
        }}
      >
        <TopTitleBar title="下载券使用纪录" backUrl="/my/downloads/1" />

        <Box sx={{ px: 2, fontWeight: "bold", color: "white" }}>
          持有下载券：{remainDownload !== null ? `${remainDownload} 张` : ""}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "0 15px",
          }}
        >
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!isLoading && !error && isEmpty && (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                未持有下载券
              </Typography>

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

          {!isLoading &&
            !error &&
            !isEmpty &&
            data?.data?.map((item: ifExchangeTicket, index: number) => (
              <Box key={index}>
                {/* 上排 */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    gap: 2,
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: "bold" }}>
                    购买下载券{item.video_download}张
                  </Typography>

                  <Typography sx={{ color: "white" }}>购买日期：{item.create_date}</Typography>
                </Box>

                {/* 中排 */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ color: cWhite60 }}>
                    已使用：{item.use_video_download} 张
                  </Typography>

                  <Typography sx={{ color: cWhite60 }}>
                    剩余：{parseInt(item.video_download) - parseInt(item.use_video_download)} 张
                  </Typography>
                </Box>

                {/* 下排 */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  {item.expire_date && (
                    <Typography
                      sx={{ color: new Date(item.expire_date) < new Date() ? "red" : cWhite60 }}
                    >
                      使用期限至 {item.expire_date}
                    </Typography>
                  )}
                  {item.expire_date && new Date(item.expire_date) < new Date() && (
                    <Typography sx={{ color: "red" }}>
                      已过期：{parseInt(item.video_download) - parseInt(item.use_video_download)} 张
                    </Typography>
                  )}
                </Box>

                {index < data.data.length - 1 && (
                  <Box
                    sx={{
                      borderBottom: "1px dashed #666",
                      mt: 2,
                    }}
                  />
                )}
              </Box>
            ))}
        </Box>
      </Box>

      <Box sx={{ height: 40 }} />
    </BaseMotionDiv>
  );
};

export default CosDownloadRecordPage;
