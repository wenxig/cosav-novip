import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
//import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { cMainColor, cWhite80 } from "../../data/ColorDef";

export type DownloadDialogStatus = "noCoupon" | "confirm" | "downloading" | "success" | "fail";

interface CosDownloadDialogProps {
  open: boolean;
  status: DownloadDialogStatus;
  progress?: number;
  usedCouponCount?: number;
  downloadedSizeText?: string;
  totalSizeText?: string;
  downloadedSpeedText?: string;
  expireDate?: string;
  errorMessage?: string;
  onClose: () => void;
  onStartDownload: () => void;
}

const CosDownloadDialog: React.FC<CosDownloadDialogProps> = ({
  open,
  status,
  progress = 0,
  usedCouponCount = 1,
  downloadedSizeText = "0MB",
  totalSizeText = "0MB",
  downloadedSpeedText = "0KB/s",
  expireDate = "",
  errorMessage = "",
  onClose,
  onStartDownload,
}) => {
  const navigate = useNavigate();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const width = 320;
  const [countdownText, setCountdownText] = useState("");

  useEffect(() => {
    if (!expireDate) {
      setCountdownText("");
      return;
    }

    const formatRemaining = (totalSeconds: number) => {
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return days > 0
        ? `剩余 ${days}天 ${hours}:${minutes}:${seconds}`
        : `剩余 ${hours}${minutes}:${seconds}`;
    };

    const hmsMatch = expireDate.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (hmsMatch) {
      const [, h, m, s] = hmsMatch;
      let remainSeconds = Number(h) * 3600 + Number(m) * 60 + Number(s);

      const updateHmsCountdown = () => {
        if (remainSeconds <= 0) {
          setCountdownText("已到期");
          return;
        }
        setCountdownText(formatRemaining(remainSeconds));
        remainSeconds -= 1;
      };

      updateHmsCountdown();
      const timer = window.setInterval(updateHmsCountdown, 1000);
      return () => {
        window.clearInterval(timer);
      };
    }

    // 相容舊格式：可被 Date 解析的到期時間字串
    const targetTime = new Date(expireDate).getTime();
    if (Number.isNaN(targetTime)) {
      setCountdownText(`到期时间：${expireDate}`);
      return;
    }

    const updateDateCountdown = () => {
      const now = Date.now();
      const diffMs = targetTime - now;
      if (diffMs <= 0) {
        setCountdownText("已到期");
        return;
      }
      setCountdownText(formatRemaining(Math.floor(diffMs / 1000)));
    };

    updateDateCountdown();
    const timer = window.setInterval(updateDateCountdown, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [expireDate]);

  const handleClose = () => {
    if (cancelButtonRef.current) {
      cancelButtonRef.current.blur();
    }
    onClose();
  };

  const mainIconStyle = {
    color: cMainColor,
    borderRadius: "50%",
    fontSize: "80px",
  };

  const showCloseButton = status !== "downloading";

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        onClose();
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            color: "white",
            minWidth: "300px",
            width,
            borderRadius: "12px",
            boxShadow: "none",
          },
        },
      }}
    >
      {/* 上方 icon */}
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <FileDownloadIcon sx={{ ...mainIconStyle, backgroundColor: "rgb(45, 45, 45)" }} />
      </Box>

      {/* icon 預留空間 */}
      <Box sx={{ height: "40px" }} />

      {/* 主要內容區 */}
      <Box
        sx={{
          borderRadius: "12px",
          backgroundColor: "rgb(45, 45, 45)",
          overflow: "hidden",
        }}
      >
        {/* 標題列 */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: showCloseButton ? "4px 12px" : "0 12px",
            minHeight: "40px",
          }}
        >
          {showCloseButton && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
              sx={{
                color: cWhite80,
                zIndex: 4,
                position: "relative",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        {/* 內容 */}
        <DialogContent sx={{ padding: "20px 24px" }}>
          <DialogContentText
            sx={{
              color: cWhite80,
              textAlign: "center",
              padding: "10px 0px",
              fontSize: "22px",
            }}
          >
            下载影片
          </DialogContentText>

          {/* confirm */}
          {status === "confirm" && (
            <>
              <DialogContentText
                sx={{
                  color: cWhite80,
                  textAlign: "left",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  minHeight: "84px",
                }}
              >
                点选下载后请于24小时内完成，
                <br />
                下载过程中请勿关闭画面。
              </DialogContentText>

              <DialogContentText
                sx={{
                  color: cWhite80,
                  textAlign: "center",
                  fontSize: "16px",
                  mt: 2,
                }}
              >
                {expireDate ? (
                  <>
                    <br />● 下载券到期时间：{countdownText}
                  </>
                ) : (
                  <>● 使用下载券：{usedCouponCount}</>
                )}
              </DialogContentText>
            </>
          )}

          {/* noCoupon */}
          {status === "noCoupon" && (
            <DialogContentText
              sx={{
                color: "#ff5252",
                textAlign: "center",
                fontSize: "18px",
                lineHeight: 1.7,
                minHeight: "84px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              目前尚无下载券，
              <br />
              请先前往购买。
            </DialogContentText>
          )}

          {/* downloading */}
          {status === "downloading" && (
            <Box sx={{ mt: 1 }}>
              <DialogContentText
                sx={{
                  color: cWhite80,
                  textAlign: "left",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  mb: 2,
                }}
              >
                下载中，请保持画面及网路正常。
              </DialogContentText>

              <Typography
                sx={{
                  textAlign: "center",
                  color: cWhite80,
                  fontSize: "22px",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {progress}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: "999px",
                  backgroundColor: "#666",
                  mb: 1.5,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: cMainColor,
                    borderRadius: "999px",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography sx={{ color: cWhite80, fontSize: "14px" }}>
                  {downloadedSpeedText}
                </Typography>
                <Typography sx={{ color: cWhite80, fontSize: "14px" }}>
                  {downloadedSizeText} / {totalSizeText}
                </Typography>
              </Box>

              <Typography
                sx={{
                  textAlign: "center",
                  color: "#ff5252",
                  fontSize: "14px",
                }}
              >
                欲取消请关闭APP
              </Typography>
            </Box>
          )}

          {/* success */}
          {status === "success" && (
            <DialogContentText
              sx={{
                color: cWhite80,
                textAlign: "left",
                fontSize: "16px",
                lineHeight: 1.7,
                minHeight: "84px",
                display: "flex",
                alignItems: "center",
              }}
            >
              此影片已下载完成，
              <br />
              可直接观看。
            </DialogContentText>
          )}

          {/* fail */}
          {status === "fail" && (
            <DialogContentText
              sx={{
                color: cWhite80,
                textAlign: "left",
                fontSize: "16px",
                lineHeight: 1.7,
                minHeight: "84px",
                display: "flex",
                alignItems: "center",
              }}
            >
              发生错误，
              <br />
              {errorMessage}
            </DialogContentText>
          )}
        </DialogContent>

        {/* 按鈕區 */}
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            padding: "16px 24px",
          }}
        >
          {status === "confirm" && (
            <>
              <Button
                ref={cancelButtonRef}
                onClick={handleClose}
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  color: "white",
                  border: `2px solid ${cWhite80}`,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                关闭
              </Button>

              <Button
                onClick={onStartDownload}
                variant="contained"
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  backgroundColor: cMainColor,
                  borderRadius: "10px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: `${cMainColor}dd`,
                  },
                }}
              >
                开始下载
              </Button>
            </>
          )}

          {status === "noCoupon" && (
            <>
              <Button
                ref={cancelButtonRef}
                onClick={handleClose}
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  color: "white",
                  border: `2px solid ${cWhite80}`,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                关闭
              </Button>

              <Button
                onClick={() => navigate("/sponsor", { state: { tab: "download" } })}
                variant="contained"
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  backgroundColor: cMainColor,
                  borderRadius: "10px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: `${cMainColor}dd`,
                  },
                }}
              >
                前往购买
              </Button>
            </>
          )}

          {status === "fail" && (
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                width: "120px",
                fontWeight: "bold",
                backgroundColor: cMainColor,
                borderRadius: "10px",
                color: "white",
                "&:hover": {
                  backgroundColor: `${cMainColor}dd`,
                },
              }}
            >
              关闭
            </Button>
          )}
          {status === "success" && (
            <>
              <Button
                ref={cancelButtonRef}
                onClick={handleClose}
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  color: "white",
                  border: `2px solid ${cWhite80}`,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                关闭
              </Button>

              <Button
                onClick={() => navigate("/my/downloads/1")}
                variant="contained"
                sx={{
                  width: "120px",
                  fontWeight: "bold",
                  backgroundColor: cMainColor,
                  borderRadius: "10px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: `${cMainColor}dd`,
                  },
                }}
              >
                前往下载区
              </Button>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CosDownloadDialog;
