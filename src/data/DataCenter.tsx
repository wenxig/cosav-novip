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
}


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