import cryptoJs from "crypto-js";
import { Capacitor } from "@capacitor/core";
import { channelUtil } from "./ChannelUtil";

/**
 * 追踪事件类型
 */
export type TrackEventType =
  | "app_install" // 应用安装（首次启动）
  | "app_open" // 应用打开
  | "register" // 用户注册
  | "login" // 用户登录
  | "video_view" // 视频观看
  | "album_view"; // 相册观看

/**
 * 追踪事件参数
 */
export interface TrackEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * TrackerUtil - 数据追踪工具类
 *
 * 用于向 Tracker 服务上报用户行为事件
 */
export class TrackerUtil {
  private static instance: TrackerUtil;

  // Tracker 服务配置
  private readonly trackerBase = "https://cos-dkop.cc";
  private readonly trackerApiPath = "/api/v1/track";
  private readonly appKey = "cosav_android";
  private readonly appSecret = "e0f22d59acf0b25c634e7ec34d399a56";

  // 设备信息缓存
  private deviceId: string | null = null;

  private constructor() {
    this.initDeviceId();
  }

  public static getInstance(): TrackerUtil {
    if (!TrackerUtil.instance) {
      TrackerUtil.instance = new TrackerUtil();
    }
    return TrackerUtil.instance;
  }

  /**
   * 初始化或获取设备 ID
   */
  private initDeviceId(): void {
    const storageKey = "cos_device_id";
    let deviceId = localStorage.getItem(storageKey);

    if (!deviceId) {
      // 生成新的设备 ID (UUID v4 格式)
      deviceId = this.generateUUID();
      localStorage.setItem(storageKey, deviceId);
    }

    this.deviceId = deviceId;
  }

  /**
   * 生成 UUID
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 生成签名
   * 签名算法: MD5(app_key + timestamp + body + app_secret)
   */
  private generateSign(timestamp: number, body: string): string {
    const signStr = `${this.appKey}${timestamp}${body}${this.appSecret}`;
    return cryptoJs.MD5(signStr).toString();
  }

  /**
   * 追踪事件
   *
   * @param event 事件类型
   * @param params 额外参数
   */
  public async track(event: TrackEventType, params?: TrackEventParams): Promise<boolean> {
    try {
      const channelCode = await channelUtil.getChannelCode();
      const timestamp = Math.floor(Date.now() / 1000);
      const platform = Capacitor.getPlatform();

      const payload = {
        event,
        channel_code: channelCode,
        device_id: this.deviceId || "",
        platform: platform === "android" ? "android" : "web",
        timestamp,
        params: params || undefined,
      };

      const body = JSON.stringify(payload);
      const sign = this.generateSign(timestamp, body);

      const response = await fetch(`${this.trackerBase}${this.trackerApiPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Key": this.appKey,
          "X-Timestamp": timestamp.toString(),
          "X-Signature": sign,
        },
        body,
      });

      if (!response.ok) {
        console.error("[TrackerUtil] Track failed:", response.status, response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("[TrackerUtil] Track error:", error);
      return false;
    }
  }

  /**
   * 追踪应用安装事件（首次启动）
   */
  public async trackAppInstall(): Promise<boolean> {
    if (!channelUtil.isFirstInstall()) {
      return false;
    }

    const result = await this.track("app_install");

    if (result) {
      channelUtil.markAsLaunched();
    }

    return result;
  }

  /**
   * 追踪应用打开事件
   */
  public async trackAppOpen(): Promise<boolean> {
    return await this.track("app_open");
  }

  /**
   * 追踪视频观看事件
   */
  public async trackVideoView(videoId: string, params?: TrackEventParams): Promise<boolean> {
    return await this.track("video_view", { video_id: videoId, ...params });
  }

  /**
   * 追踪相册观看事件
   */
  public async trackAlbumView(albumId: string, params?: TrackEventParams): Promise<boolean> {
    return await this.track("album_view", { album_id: albumId, ...params });
  }
}

// 导出单例实例
export const trackerUtil = TrackerUtil.getInstance();
