import { Capacitor, registerPlugin } from "@capacitor/core";

/**
 * ChannelPlugin 接口定义
 * 用于与原生 Android 插件通信
 */
interface ChannelPluginInterface {
  getChannelCode(): Promise<{ channelCode: string }>;
}

// 注册原生插件
const ChannelPlugin = registerPlugin<ChannelPluginInterface>("ChannelPlugin");

// 本地存储 key
const CHANNEL_STORAGE_KEY = "cos_channel_code";

/**
 * ChannelUtil - 渠道工具类
 *
 * 用于获取和管理渠道码
 * - Android: 从 APK 的 META-INF 目录读取 channel_xxx 文件
 * - PWA/Web: 从 URL 参数或 localStorage 读取
 */
export class ChannelUtil {
  private static instance: ChannelUtil;
  private cachedChannelCode: string | null = null;
  private isInitialized: boolean = false;
  // 在模块加载时（HashRouter 修改 hash 之前）立即捕获 URL 中的 channel 参数
  private readonly earlyChannelCode: string | null;

  private constructor() {
    this.earlyChannelCode = this.readChannelFromUrl();
    // 如果读到了，立即存到 localStorage，防止丢失
    if (this.earlyChannelCode) {
      localStorage.setItem(CHANNEL_STORAGE_KEY, this.earlyChannelCode);
    }
  }

  public static getInstance(): ChannelUtil {
    if (!ChannelUtil.instance) {
      ChannelUtil.instance = new ChannelUtil();
    }
    return ChannelUtil.instance;
  }

  /**
   * 初始化渠道码
   * 应在应用启动时调用一次
   */
  public async initialize(): Promise<string> {
    if (this.isInitialized && this.cachedChannelCode) {
      return this.cachedChannelCode;
    }

    try {
      const platform = Capacitor.getPlatform();

      if (platform === "android") {
        // Android 平台: 从原生插件读取
        const result = await ChannelPlugin.getChannelCode();
        this.cachedChannelCode = result.channelCode;
      } else {
        // Web/PWA 平台: 从 URL 参数或 localStorage 读取
        this.cachedChannelCode = this.getChannelFromUrlOrStorage();
      }

      this.isInitialized = true;

      // 保存到 localStorage 以便后续使用
      if (this.cachedChannelCode && this.cachedChannelCode !== "default") {
        localStorage.setItem(CHANNEL_STORAGE_KEY, this.cachedChannelCode);
      }

      return this.cachedChannelCode;
    } catch (error) {
      console.error("[ChannelUtil] Failed to initialize channel code:", error);
      this.cachedChannelCode = "default";
      this.isInitialized = true;
      return this.cachedChannelCode;
    }
  }

  /**
   * 获取渠道码
   * 如果未初始化，会自动初始化
   */
  public async getChannelCode(): Promise<string> {
    if (!this.isInitialized) {
      return await this.initialize();
    }
    return this.cachedChannelCode || "default";
  }

  /**
   * 同步获取渠道码（仅在已初始化后使用）
   */
  public getChannelCodeSync(): string {
    return this.cachedChannelCode || "default";
  }

  /**
   * 在模块加载时立即读取 URL 中的 channel（HashRouter 修改 hash 之前）
   */
  private readChannelFromUrl(): string | null {
    // 尝试路径匹配: /c/xxx
    const pathMatch = window.location.pathname.match(/^\/c\/([^/?#]+)/);
    if (pathMatch) return pathMatch[1];

    // 尝试 query string: ?channel=xxx
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuery = urlParams.get("channel");
    if (fromQuery) return fromQuery;

    // 尝试 hash fragment: #/?channel=xxx
    const hash = window.location.hash;
    if (hash) {
      const qi = hash.indexOf("?");
      if (qi !== -1) {
        const hashParams = new URLSearchParams(hash.substring(qi));
        const fromHash = hashParams.get("channel");
        if (fromHash) return fromHash;
      }
    }

    return null;
  }

  private getChannelFromUrlOrStorage(): string {
    // 优先使用构造函数中提前捕获的值
    if (this.earlyChannelCode) {
      return this.earlyChannelCode;
    }

    // 然后尝试从 localStorage 获取
    const channelFromStorage = localStorage.getItem(CHANNEL_STORAGE_KEY);
    if (channelFromStorage) {
      return channelFromStorage;
    }

    return "default";
  }

  /**
   * 检查是否是首次安装
   */
  public isFirstInstall(): boolean {
    const hasLaunched = localStorage.getItem("cos_has_launched");
    return !hasLaunched;
  }

  /**
   * 标记应用已启动过
   */
  public markAsLaunched(): void {
    localStorage.setItem("cos_has_launched", "1");
  }
}

// 导出单例实例
export const channelUtil = ChannelUtil.getInstance();
