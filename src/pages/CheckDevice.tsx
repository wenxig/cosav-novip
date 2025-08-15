import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import BaseMotionDiv from "./BaseMotionDiv";
import { cMainColor } from "../data/ColorDef";
import { CosApiUtil } from "../Shared/Api/CosApiUtil";

interface DeviceInfo {
  userAgent: string;
  userAgentData?: {
    platform: string;
    mobile: boolean;
    brands: Array<{
      brand: string;
      version: string;
    }>;
  };
}

const fetcher = async (): Promise<DeviceInfo> => {

  await CosApiUtil.getInstance().getApiUrl();

  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 使用現代的 User-Agent Client Hints API
  const userAgentData = (navigator as any).userAgentData;
  
  return {
    userAgent: navigator.userAgent,
    userAgentData: userAgentData ? {
      platform: userAgentData.platform,
      mobile: userAgentData.mobile,
      brands: userAgentData.brands
    } : undefined
  };
};

const CheckDevice: React.FC = () => {
  const navigate = useNavigate();
  const { data: deviceInfo, error, isLoading } = useSWR("deviceInfo", fetcher);
  const [deviceType, setDeviceType] = useState<
    "APPLE" | "ANDROID" | "OTHER" | null
  >(null);

  useEffect(() => {
    if (deviceInfo) {
      const userAgent = deviceInfo.userAgent.toLowerCase();
      // 使用更精確的判斷方式
      const isIOS = /iphone|ipad|ipod|macintosh/.test(userAgent) || 
                   deviceInfo.userAgentData?.platform === 'iOS';
      const isAndroid = /android/.test(userAgent) || 
                       deviceInfo.userAgentData?.platform === 'Android';

      if (isIOS) {
        setDeviceType("APPLE");
        navigate("/init");
      } else if (isAndroid) {
        setDeviceType("ANDROID");
        navigate("/init");
      } else {
        setDeviceType("OTHER");
      }
    }
  }, [deviceInfo, navigate]);

  const containerStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  };

  const paperStyle = {
    padding: "40px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center" as const,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#000000",
    color: "#ffffff",
  };

  const loadingStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "20px",
  };

  if (isLoading) {
    return (
      <BaseMotionDiv>
        <Box sx={containerStyle}>
          <Paper sx={paperStyle}>
            <Box sx={loadingStyle}>
              <CircularProgress
                sx={{
                  color: cMainColor,
                  "& .MuiCircularProgress-circle": {
                    strokeWidth: 3,
                  },
                }}
              />
              <Typography variant="h6" sx={{ color: "#ffffff" }}>
                设备确认中...
              </Typography>
            </Box>
          </Paper>
        </Box>
      </BaseMotionDiv>
    );
  }

  if (error) {
    return (
      <Box sx={containerStyle}>
        <Paper sx={paperStyle}>
          <Typography color="error" variant="h6">
            發生錯誤：{error.message}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={containerStyle}>
      <Paper sx={paperStyle}>
        <Typography
          variant="h5"
          sx={{
            color: cMainColor,
            fontWeight: "bold",
            whiteSpace: "pre-line",
          }}
        >
          {deviceType === "APPLE"
            ? "APPLE 裝置"
            : deviceType === "ANDROID"
            ? "ANDROID 裝置"
            : "亲！目前暂时不支援该平台!!\n请直接与客服联络"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CheckDevice;

