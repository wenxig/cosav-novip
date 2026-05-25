import { getAuthFavoriteAlbumLists, getAuthFavoriteVideoLists } from "../Shared/Api/CosApi";
import { ifAlbumBaseInfo } from "../Shared/Api/interface/AlbumInterface";
import { ifAuthLogin } from "../Shared/Api/interface/AuthInterface";
import { ifCategoryItem } from "../Shared/Api/interface/CategoriesInterface";
import { ifGameCategories, ifGameList } from "../Shared/Api/interface/GameInterface";
import { ifSiteSetting } from "../Shared/Api/interface/SiteInterface";
import { ifVideoBaseInfo } from "../Shared/Api/interface/VideoInterface";
import { clearLoginInfo } from "../Shared/function/AccountFunction";
import { create } from "zustand";
import { persist } from "zustand/middleware";



/////////////////////userInfo/////////////////////
interface UserInfoState {
  userInfo: ifAuthLogin;
  userParams: string;
  userAuthId: string;
  favoriteVideoList: string[];
  favoriteAlbumList: string[];
  setUserInfo: (info: ifAuthLogin) => void;
  setUserParams: (params: string) => void;
  setUserAuthId: (authId: string) => void;
  setFavoriteVideoList: (list: string[]) => void;
  setFavoriteAlbumList: (list: string[]) => void;
  clearUserInfo: () => void;
}

export const storedUserInfo = create<UserInfoState>()(
  persist(
    (set) => ({
      userInfo: {} as ifAuthLogin,
      userParams: '',
      userAuthId: '',
      favoriteVideoList: [],
      favoriteAlbumList: [],
      setUserInfo: (info: ifAuthLogin) => set({
        userInfo: info,
        userParams: info.Userparams,
        userAuthId: info.auth_id
      }),
      setUserParams: (params: string) => set({
        userParams: params
      }),
      setUserAuthId: (authId: string) => set({
        userAuthId: authId
      }),
      setFavoriteVideoList: (list: string[]) => set({
        favoriteVideoList: list
      }),
      setFavoriteAlbumList: (list: string[]) => set({
        favoriteAlbumList: list
      }),
      clearUserInfo: () => set({
        userInfo: {} as ifAuthLogin,
        userParams: '',
        userAuthId: '',
      })
    }),
    {
      name: 'user-info-storage', // localStorage 的 key
    }
  )
);

export const getUserInfo = (): ifAuthLogin|undefined => {
  return storedUserInfo.getState().userInfo;
}

export const getUserParams = (): string => {
  return storedUserInfo.getState().userParams || '';
}

export const getUserAuthId = (): string => {
  return storedUserInfo.getState().userAuthId || '';
}

export const setUserInfo = (userInfo: ifAuthLogin) => {
  storedUserInfo.getState().setUserInfo(userInfo);

  getAuthFavoriteVideoLists(0,9999).then((res) => {
    if(res.result === "success" && res.data){
      storedUserInfo.getState().setFavoriteVideoList(res.data.lists.map((item: ifVideoBaseInfo) => item.id));
    }
  });

  getAuthFavoriteAlbumLists(0,9999).then((res) => {
    if(res.result === "success" && res.data){
      storedUserInfo.getState().setFavoriteAlbumList(res.data.lists.map((item: ifAlbumBaseInfo) => item.id));
    }
  });
}

export const getFavoriteVideoList = (): string[] => {
  const list = storedUserInfo.getState().favoriteVideoList;
  return list;
}

export const addFavoriteVideo = (videoId: string) => {
  storedUserInfo.getState().setFavoriteVideoList([...storedUserInfo.getState().favoriteVideoList, videoId]);
}

export const removeFavoriteVideo = (videoId: string) => {
  let favoriteSet = storedUserInfo.getState().favoriteVideoList;
  favoriteSet = favoriteSet.filter(item => item !== videoId);
  storedUserInfo.getState().setFavoriteVideoList(favoriteSet);
}

export const getFavoriteAlbumList = (): string[] => {
  const list = storedUserInfo.getState().favoriteAlbumList;
  return list;
}

export const addFavoriteAlbum = (albumId: string) => {
  storedUserInfo.getState().setFavoriteAlbumList([...storedUserInfo.getState().favoriteAlbumList, albumId]);
}

export const removeFavoriteAlbum = (albumId: string) => {
  let favoriteSet = storedUserInfo.getState().favoriteAlbumList;
  favoriteSet = favoriteSet.filter(item => item !== albumId);
  storedUserInfo.getState().setFavoriteAlbumList(favoriteSet);
}

export const clearUserInfo = () => {
  storedUserInfo.getState().clearUserInfo();
  clearLoginInfo();
}




/////////////////////siteData/////////////////////
interface SiteDataState {
  siteSetting: ifSiteSetting;
  categories: ifCategoryItem[];
  setSiteSetting: (info: ifSiteSetting) => void;
  setCategories: (categories: ifCategoryItem[]) => void;
}

export const storedSiteData = create<SiteDataState>()(
  persist(
    (set) => ({
      siteSetting: {} as ifSiteSetting,
      categories: [] as ifCategoryItem[],
      setSiteSetting: (info: ifSiteSetting) => set({
        siteSetting: info,
      }),
      setCategories: (categories: ifCategoryItem[]) => set({
        categories: categories
      }),
    }),
    {
      name: 'site-data-storage', // localStorage 的 key
    }
  )
);

export const getSiteSetting = (): ifSiteSetting => {
  return storedSiteData.getState().siteSetting;
}

export const getCategories = (): ifCategoryItem[] => {
  return storedSiteData.getState().categories;
}

export const setSiteSetting = (siteSetting: ifSiteSetting) => {
  storedSiteData.getState().setSiteSetting(siteSetting);
}

export const setCategories = (categories: ifCategoryItem[]) => {
  const data = [
    {
      CHID:"exclusive",
      has_sub:false,
      name:"独家",
      photo:"",
      queryStr: "tags=%E7%8B%AC%E5%AE%B6",
      iconData: "Icons.duo",
    },
    {
      CHID:"new",
      has_sub:false,
      name:"最新",
      photo:"",
      queryStr: "order=mr",
      iconData: "FiberNewIcon",
    },
    {
      CHID:"hot",
      has_sub:false,
      name:"热门",
      photo:"",
      queryStr: "order=mv",
      iconData: "LocalFireDepartmentIcon",
    },
    ...categories,
    {
      CHID:"cos",
      has_sub:false,
      name:"COS图",
      icon:"/icons/cos.png",
      queryStr: "",
    }
  ];
  storedSiteData.getState().setCategories(data);
}




/////////////////////gameData/////////////////////
interface GameDataState {
  gameCategories: ifGameCategories[];
  gameTop10: ifGameList;
  setGameCategories: (categories: ifGameCategories[]) => void;
  setGameTop10: (top10: ifGameList) => void;
}

export const storedGameData = create<GameDataState>()(
  persist(
    (set) => ({
      gameCategories: [] as ifGameCategories[],
      gameTop10: {} as ifGameList,
      setGameCategories: (categories: ifGameCategories[]) => set({
        gameCategories: categories,
      }),
      setGameTop10: (top10: ifGameList) => set({
        gameTop10: top10
      }),
    }),
    {
      name: 'game-data-storage', // localStorage 的 key
    }
  )
);

export const getGameCategories = (): ifGameCategories[] => {
  return storedGameData.getState().gameCategories;
}

export const getGameTop10 = (): ifGameList => {
  return storedGameData.getState().gameTop10;
}

export const setGameCategories = (categories: ifGameCategories[]) => {
  const allCategory: ifGameCategories = {
    category_id: "0",
    category_name: "全部",
    show_name: "全部",
    slug: "all",
    sort: "0",
    status: "1",
    total_games: "0",
  };  
  storedGameData.getState().setGameCategories([allCategory, ...categories]);
}

export const setGameTop10 = (top10: ifGameList) => {
  storedGameData.getState().setGameTop10(top10);
}




/////////////////////tempData/////////////////////

export interface TempFeedbacVideoData {
  videoId: string;
  videoUrl: string;
  player: string;
  line: string;
  reason: string;
  downloadSpeed: string;
}

// 播放速度統計（不持久化，僅內存）
// 速率樣本有效區間：低於下限（極慢到不合理）/ 高於上限（瀏覽器緩存命中）都丟棄
const SPEED_MIN_KBPS = 10;
const SPEED_MAX_KBPS = 100000; // 100Mbps
const MIN_DURATION_MS = 50; // duration 太短說明命中緩存，計算出的速率不可信

interface PlaybackSpeedState {
  speedSamples: number[]; // kbps
  ttfbSamples: number[]; // ms，每個 TS 的首字節響應時間
  stallCount: number;
  totalSegments: number; // TS 總段數
  errorCount: number;
  netErrorCount: number;
  mediaErrorCount: number;
  otherErrorCount: number;
  cacheHitCount: number; // duration 過短被過濾的樣本數（命中瀏覽器緩存）
  firstLoadMs: number; // 首個 TS 加載耗時(ms)
  bufferingMs: number; // 累計緩衝等待毫秒數
  m3u8LoadCount: number; // m3u8 加載次數（正常1次，多次=抖動或重載）
  _bufferingStart: number; // 緩衝開始時間戳（內部用）
  addSpeedSample: (kbps: number, durationMs?: number) => void;
  addTtfbSample: (ms: number) => void;
  addStall: () => void;
  endStall: () => void;
  setTotalSegments: (total: number) => void;
  addError: (type?: string) => void;
  setFirstLoad: (ms: number) => void;
  addM3u8Load: () => void;
  getSpeedSummary: () => string;
  reset: () => void;
}

export const usePlaybackSpeed = create<PlaybackSpeedState>()((set, get) => ({
  speedSamples: [],
  ttfbSamples: [],
  stallCount: 0,
  totalSegments: 0,
  errorCount: 0,
  netErrorCount: 0,
  mediaErrorCount: 0,
  otherErrorCount: 0,
  cacheHitCount: 0,
  firstLoadMs: 0,
  bufferingMs: 0,
  m3u8LoadCount: 0,
  _bufferingStart: 0,
  addSpeedSample: (kbps: number, durationMs?: number) => set((state) => {
    // duration 過短 → 瀏覽器緩存命中，丟棄並計數
    if (durationMs !== undefined && durationMs < MIN_DURATION_MS) {
      return { cacheHitCount: state.cacheHitCount + 1 };
    }
    // 樣本不在合理區間 → 丟棄（< 10kbps 可能是錯誤讀數，> 100Mbps 基本是緩存命中假值）
    if (!Number.isFinite(kbps) || kbps < SPEED_MIN_KBPS || kbps > SPEED_MAX_KBPS) {
      return { cacheHitCount: state.cacheHitCount + 1 };
    }
    return { speedSamples: [...state.speedSamples.slice(-50), kbps] };
  }),
  addTtfbSample: (ms: number) => set((state) => ({
    ttfbSamples: [...state.ttfbSamples.slice(-50), ms]
  })),
  addStall: () => set((state) => ({
    stallCount: state.stallCount + 1,
    _bufferingStart: Date.now(),
  })),
  endStall: () => set((state) => {
    if (state._bufferingStart === 0) return {};
    const elapsed = Date.now() - state._bufferingStart;
    return { bufferingMs: state.bufferingMs + elapsed, _bufferingStart: 0 };
  }),
  setTotalSegments: (total: number) => set({ totalSegments: total }),
  addError: (type?: string) => set((state) => {
    if (type === 'networkError') {
      return { errorCount: state.errorCount + 1, netErrorCount: state.netErrorCount + 1 };
    }
    if (type === 'mediaError') {
      return { errorCount: state.errorCount + 1, mediaErrorCount: state.mediaErrorCount + 1 };
    }
    return { errorCount: state.errorCount + 1, otherErrorCount: state.otherErrorCount + 1 };
  }),
  setFirstLoad: (ms: number) => set((state) => {
    if (state.firstLoadMs === 0) return { firstLoadMs: ms };
    return {};
  }),
  addM3u8Load: () => set((state) => ({ m3u8LoadCount: state.m3u8LoadCount + 1 })),
  getSpeedSummary: () => {
    const { speedSamples, ttfbSamples, stallCount, totalSegments, errorCount,
            netErrorCount, mediaErrorCount, otherErrorCount, cacheHitCount,
            firstLoadMs, bufferingMs, m3u8LoadCount } = get();
    if (speedSamples.length === 0 && errorCount === 0) return '';
    const parts: string[] = [];
    if (speedSamples.length >= 5) {
      // 樣本足夠才算 avg，否則只展示 min/max + low_samples 標記
      const avg = Math.round(speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length);
      const min = Math.round(Math.min(...speedSamples));
      const max = Math.round(Math.max(...speedSamples));
      parts.push(`avg:${avg}kbps,min:${min}kbps,max:${max}kbps`);
    } else if (speedSamples.length > 0) {
      const min = Math.round(Math.min(...speedSamples));
      const max = Math.round(Math.max(...speedSamples));
      parts.push(`low_samples:${speedSamples.length},min:${min}kbps,max:${max}kbps`);
    }
    if (ttfbSamples.length > 0) {
      const ttfbAvg = Math.round(ttfbSamples.reduce((a, b) => a + b, 0) / ttfbSamples.length);
      const ttfbMax = Math.round(Math.max(...ttfbSamples));
      parts.push(`ttfb_avg:${ttfbAvg}ms,ttfb_max:${ttfbMax}ms`);
    }
    parts.push(`stall:${stallCount}`);
    parts.push(`samples:${speedSamples.length}`);
    if (cacheHitCount > 0) parts.push(`cache_hit:${cacheHitCount}`);
    if (totalSegments > 0) parts.push(`total:${totalSegments}`);
    if (bufferingMs > 0) parts.push(`buffering:${(bufferingMs / 1000).toFixed(1)}s`);
    if (errorCount > 0) {
      parts.push(`errors:${errorCount}`);
      if (netErrorCount > 0) parts.push(`err_net:${netErrorCount}`);
      if (mediaErrorCount > 0) parts.push(`err_media:${mediaErrorCount}`);
      if (otherErrorCount > 0) parts.push(`err_other:${otherErrorCount}`);
    }
    if (firstLoadMs > 0) parts.push(`firstLoad:${(firstLoadMs / 1000).toFixed(1)}s`);
    if (m3u8LoadCount > 0) parts.push(`m3u8:${m3u8LoadCount}`);
    return parts.join(',');
  },
  reset: () => set({
    speedSamples: [], ttfbSamples: [], stallCount: 0, totalSegments: 0,
    errorCount: 0, netErrorCount: 0, mediaErrorCount: 0, otherErrorCount: 0,
    cacheHitCount: 0,
    firstLoadMs: 0, bufferingMs: 0, m3u8LoadCount: 0, _bufferingStart: 0,
  }),
}))


interface TempDataState {
  feedbackVideoData: TempFeedbacVideoData;
  setFeedbackVideoData: (data: TempFeedbacVideoData) => void;
  clearFeedbackVideoData: () => void;
}

export const storedTempData = create<TempDataState>()(
  persist(
    (set) => ({
      feedbackVideoData: {} as TempFeedbacVideoData,
      setFeedbackVideoData: (data: TempFeedbacVideoData) => set({
        feedbackVideoData: data
      }),
      clearFeedbackVideoData: () => set({
        feedbackVideoData: {} as TempFeedbacVideoData
      }),
    }),
    {
      name: 'temp-data-storage', // localStorage 的 key
    }
  )
);

export const getFeedbackVideoData = (): TempFeedbacVideoData => {
  return storedTempData.getState().feedbackVideoData;
}

export const setFeedbackVideoData = (data: TempFeedbacVideoData) => {
  const oldValue = storedTempData.getState().feedbackVideoData;
  storedTempData.getState().setFeedbackVideoData({
    ...oldValue,
    ...data
  });
}


export const clearFeedbackVideoData = () => {
  storedTempData.getState().clearFeedbackVideoData();
}








// 共用文字內容
class DataCenter {
  private static instance: DataCenter;
  private _shouldShowAd: boolean = true;


  private constructor() {}

  // 單例模式
  public static getInstance(): DataCenter {
    if (!DataCenter.instance) {
      DataCenter.instance = new DataCenter();
    }
    return DataCenter.instance;
  }

  get shouldShowAd(): boolean {
    return this._shouldShowAd;
  }

  set shouldShowAd(value: boolean) {
    this._shouldShowAd = value;
  }

}





// 匯出單例實例
export const dataCenter = DataCenter.getInstance(); 