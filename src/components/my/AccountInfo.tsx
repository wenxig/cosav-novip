import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { checkIsLogin, checkIsPay } from "../../Shared/function/AccountFunction";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { cMainColor, cWhite60, cMainColor3, cDisabledColor } from "../../data/ColorDef";
import CircularProgressWithValue from "../base/CircularProgressWithValue";
import { getUserInfo } from "../../data/DataCenter";
import { getAuthActivity } from "../../Shared/Api/CosApi";
import { ifAuthActivity } from "../../Shared/Api/interface/AuthInterface";

const AccountInfo: React.FC = () => {
  const navigate = useNavigate();
  const ReloadCountdownSec = 60;

  const [reloadCountdownSeconds, setReloadCountdownSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [vipStatus, setVipStatus] = useState({ text: "", color: "" });
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityData, setActivityData] = useState<ifAuthActivity | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const maxWidth = document.documentElement.clientWidth;

  const userInfo = getUserInfo();
  useEffect(() => {
    if (checkIsLogin()) {
      getVipStatus();
    }
  }, []);

  // 清理計時器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const baseBoxStyle = {
    display: "flex",
    gap: 2,
    width: maxWidth - 40,
    height: "200px",
    padding: "0 20px",
    justifyContent: "center",
    alignItems: "center",
  };

  if (!userInfo || !userInfo.uid || userInfo.uid === "") {
    //未登入
    return (
      <Box sx={baseBoxStyle}>
        <Button
          startIcon={<PersonIcon sx={{ color: "white" }} />}
          sx={{
            height: "40px",
            background: `linear-gradient(45deg,${cMainColor}, ${cMainColor3})`,
            borderRadius: "5px",
            padding: "10px 20px",
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          <Typography sx={{ color: "white", fontWeight: "bold" }}>登入/注册</Typography>
        </Button>
      </Box>
    );
  }

  // 判斷贊助狀態
  const getVipStatus = () => {
    if (!userInfo.vip_expire_date) {
      setVipStatus({ text: "未赞助", color: "red" });
      return;
      //return { text: '未赞助', color: 'red' };
    }

    const expireDate = new Date(userInfo.vip_expire_date);
    const now = new Date();
    const dateOnly = userInfo.vip_expire_date.split(" ")[0];

    if (expireDate < now) {
      setVipStatus({ text: `${dateOnly} (已到期)`, color: "red" });
      return;
      //return { text: `${dateOnly} (已到期)`, color: 'red' };
    }

    setVipStatus({ text: dateOnly, color: cWhite60 });
    //return { text: dateOnly, color: 'white' };
  };

  //const vipStatus = getVipStatus();

  const pannelWidth = document.documentElement.clientWidth - 40;
  //const leftWidth = pannelWidth * 0.3;
  //const rightWidth = pannelWidth * 0.7;

  const normalGradient = `linear-gradient(135deg, #2e2e2eff, #4d4d4dff)`;
  const vipGradient = `linear-gradient(135deg, #111, #8f7237ae)`;

  const setReloadCountdownSec = () => {
    // 先清除可能存在的舊計時器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setReloadCountdownSeconds(ReloadCountdownSec);

    timerRef.current = setInterval(() => {
      setReloadCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRefresh = async () => {
    await checkIsPay();
    getVipStatus();
    setReloadCountdownSec();
  };

  // TODO: 實作取得活動獎勵 API
  const fetchActivityReward = async (): Promise<ifAuthActivity> => {
    const res = await getAuthActivity();
    return res.data!;
  };

  const handleActivityRewardClick = async () => {
    try {
      const data = await fetchActivityReward();
      setActivityData(data);
      setActivityDialogOpen(true);
    } catch (error) {
      console.error("取得活動獎勵失敗:", error);
    }
  };

  /** 點擊活動內容中的文字時，將該區塊文字複製到剪貼簿 */
  const handleActivityContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target === e.currentTarget) return;
    const text = target.textContent?.trim();
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyFeedback(text);
        setTimeout(() => setCopyFeedback(null), 1500);
      })
      .catch(() => {});
  };

  return (
    <Box
      sx={{
        width: pannelWidth,
        padding: "10px 20px",
        position: "relative",
      }}
    >
      {/* 歡迎訊息 */}
      <Box
        sx={{
          padding: "10px 20px",
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "white", fontWeight: "bold" }}>
          Wellcome {userInfo.username}
        </Typography>
      </Box>

      {/* 右側資訊區塊 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          background: userInfo?.user_info.premium === "1" ? vipGradient : normalGradient,
          borderRadius: "10px",
          padding: "20px 20px",
        }}
      >
        {/* 會員等級 */}
        <Typography sx={{ fontSize: "16px", color: "white" }}>
          {userInfo?.user_info.premium === "1" ? "VIP 會員" : "普通會員"}
        </Typography>

        {/* Email */}
        <Typography sx={{ fontSize: "12px", color: "white" }}>{userInfo.email}</Typography>

        {/* 贊助狀態 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span>赞助到期日期:</span>
            <span style={{ color: "white" }}>{vipStatus.text}</span>
          </Typography>
          {reloadCountdownSeconds === 0 && (
            <IconButton
              onClick={handleRefresh}
              sx={{
                color: userInfo.user_info.premium === "1" ? "#ab885fff" : cMainColor,
                padding: "4px",
              }}
            >
              <RefreshRoundedIcon />
            </IconButton>
          )}
          {reloadCountdownSeconds > 0 && (
            <CircularProgressWithValue
              nowProgress={reloadCountdownSeconds}
              maxProgress={ReloadCountdownSec}
              size={25}
            />
          )}
        </Box>

        {/* 邀請好友連結 */}
        <Link
          component="button"
          onClick={() => navigate("/my/invite")}
          sx={{
            fontSize: "",
            color: "black",
            textDecoration: "underline",
            textAlign: "left",
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            background: userInfo?.user_info.premium === "1" ? "#ab885fff" : cMainColor,
            cursor: "pointer",
            width: "fit-content",
            textDecorationLine: "none",
            "&:hover": {
              color: "black",
            },
          }}
        >
          邀请好友，获得VIP天数!
        </Link>
      </Box>

      {/* 右側圖片區塊 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "10px",
          right: "36px",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid transparent",
            borderRadius: "50%",
            backgroundColor: userInfo?.user_info.premium === "1" ? "#f3c591ff" : cDisabledColor,
            WebkitBackgroundClip: "border-box",
            backgroundClip: "border-box",
          }}
        >
          <Box
            component="img"
            src={userInfo.photo}
            alt="user photo"
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "#fff",
            }}
          />
        </Box>
        <Button
          onClick={handleActivityRewardClick}
          sx={{
            color: "white",
            backgroundColor: "#F18789",
            borderRadius: 5,
            textTransform: "none",
            py: 0,
            px: 1.5,
            minHeight: 0,
            fontSize: "13px",
            "&:hover": {
              backgroundColor: "#e07678",
            },
          }}
        >
          领取活动奖励
        </Button>
      </Box>

      {/* 活動獎勵彈出視窗 */}
      <Dialog
        open={activityDialogOpen}
        onClose={() => {
          setActivityDialogOpen(false);
          setCopyFeedback(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2e2e2e",
            color: "white",
            borderRadius: 2,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogContent
          sx={{
            overflowY: "auto",
            "& .activity-html-content": {
              color: "white",
              cursor: "pointer",
              "& div": { cursor: "pointer" },
              "& a": { color: "#F18789" },
              "& img": { maxWidth: "100%" },
            },
          }}
        >
          {activityData?.msg && (
            <Box
              className="activity-html-content"
              dangerouslySetInnerHTML={{ __html: activityData.msg }}
              onClick={handleActivityContentClick}
            />
          )}
          {copyFeedback && (
            <Typography
              sx={{
                mt: 1,
                fontSize: "12px",
                color: "#F18789",
              }}
            >
              已複製到剪貼簿
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: 2,
            pb: 2,
            gap: 4,
            "& .MuiButton-root": { margin: 0 },
          }}
        >
          <Button
            onClick={() => {
              setActivityDialogOpen(false);
              setCopyFeedback(null);
            }}
            sx={{
              color: "black",
              backgroundColor: "white",
              borderRadius: 1,
              py: 0.25,
              minHeight: 0,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            关闭
          </Button>
          {activityData?.show_link === true && (
            <Button
              onClick={() => {
                window.open(activityData?.link || "", "_blank");
              }}
              sx={{
                color: "white",
                backgroundColor: "#F18789",
                borderRadius: 1,
                py: 0.25,
                px: 4,
                minHeight: 0,
                "&:hover": {
                  backgroundColor: "#e07678",
                },
              }}
            >
              前往使用
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountInfo;
