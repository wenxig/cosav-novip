import React, { useEffect, useRef } from "react";
//import { cosApiUtil } from "./Shared/Api/CosApiUtil";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { Capacitor } from "@capacitor/core";
//import CheckDevice from "./pages/CheckDevice";
import { channelUtil } from "./Shared/Utils/ChannelUtil";
import { trackerUtil } from "./Shared/Utils/TrackerUtil";


export const usePWAProtection = (isDevApp: boolean) => {
  
  const hasCheckedRef = useRef(false);
  useEffect(() => {
    if (isDevApp) return;
    //if (process.env.NODE_ENV !== "production" || window.location.href.includes("devapp") || hasCheckedRef.current)
    //  return;
    hasCheckedRef.current = true;
    const isInStandaloneMode = () => {
      const isStandaloneDisplay = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone =
        typeof navigator !== "undefined" && "standalone" in navigator && (navigator as any).standalone === true;
      return isStandaloneDisplay || isIOSStandalone;
    };
    const isNativeApp = (window as any).__IS_NATIVE_APP__ === true  || Capacitor.getPlatform() === "android";
    if (!isNativeApp && !isInStandaloneMode()) {
      window.location.href = "https://cosav-cos.cc";
    }
  }, [isDevApp]);
};

/**
 * 初始化渠道追踪
 * 在应用启动时初始化渠道码并追踪安装事件
 */
export const useChannelTracking = () => {
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initTracking = async () => {
      try {
        // 初始化渠道码
        await channelUtil.initialize();

        // 追踪应用安装事件（仅首次启动）
        await trackerUtil.trackAppInstall();

        // 追踪应用打开事件（每次启动，用于留存统计）
        await trackerUtil.trackAppOpen();

        console.log("[App] Channel tracking initialized");
      } catch (error) {
        console.error("[App] Failed to initialize channel tracking:", error);
      }
    };

    initTracking();
  }, []);
};

export const useDevtoolsBlocker = (isDevApp: boolean) => {
  const hasBlockedRef = useRef(false);
  useEffect(() => {
    if (isDevApp) return;
    //if (process.env.NODE_ENV !== "production" || window.location.href.includes("devapp")) return;
    const threshold = 160;
    let checkInterval: NodeJS.Timeout;
    const detectDevtools = () => {
      const start = new Date().getTime();
      debugger;
      const end = new Date().getTime();
      if (end - start > threshold) {
        triggerBlock();
      }
    };
    const triggerBlock = () => {
      if (!hasBlockedRef.current) {
        hasBlockedRef.current = true;
        window.location.href = "https://cosav-cos.cc";
      }
    };
    const checkByConsoleTiming = () => {
      const start = performance.now();
      console.log("%c", {
        get value() {
          const duration = performance.now() - start;
          if (duration > 100) {
            triggerBlock();
          }
          return "";
        },
      });
    };
    checkInterval = setInterval(() => {
      detectDevtools();
      checkByConsoleTiming();
    }, 2000); // 每 2 秒偵測一次
    return () => {
      clearInterval(checkInterval);
    };
  }, [isDevApp]);
};




function App() {

  const dbgBypass = (() => {
    try {
      const TOKEN = "c3bf81cd14c23f18102259f35e6c0ecd157e168ff3a9995e";
      const url = new URL(window.location.href);
      if (url.searchParams.get("__dbg") === TOKEN) {
        localStorage.setItem("__dbg", TOKEN);
        url.searchParams.delete("__dbg");
        window.history.replaceState(null, "", url.toString());
        return true;
      }
      return localStorage.getItem("__dbg") === TOKEN;
    } catch { return false; }
  })();
  const isDevApp = window.location.href.includes("aadev.cosav-cos.com") || window.location.href.includes("localhost") || process.env.REACT_APP_IS_DEVELOP === "true" || dbgBypass;

  // 禁用瀏覽器
  usePWAProtection(isDevApp);
  // 禁用F12
  useDevtoolsBlocker(isDevApp);
  
  // 初始化渠道追踪
  useChannelTracking();

  return (
    <>
    <AnimatedRoutes />
    </>
      
  );
}

export default App;




