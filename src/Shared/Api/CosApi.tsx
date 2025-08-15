import { cosApiUtil } from "./CosApiUtil";
import { ifCategoriesApiResponse, ifCategoriesSubApiResponse } from "./interface/CategoriesInterface";
import { ifSiteAdtemplateResponse, ifSiteFeedbackResponse, ifSiteSettingResponse, ifSiteSwgApiResponse } from "./interface/SiteInterface";
import { ifVideoApiResponse, ifVideoFavoriteApiResponse, ifVideoListApiResponse, ifVideoRecommendApiResponse } from "./interface/VideoInterface";
import { ifAlbumApiResponse, ifAlbumContentApiResponse, ifAlbumFavoriteApiResponse, ifAlbumListApiResponse } from "./interface/AlbumInterface";
import { ifGameCategoriesApiResponse, ifGameListApiResponse } from "./interface/GameInterface";
import { ifAuthChangePasswordApiResponse, ifAuthFavoriteAlbumApiResponse, ifAuthFavoriteVideoApiResponse, ifAuthForgetApiResponse, ifAuthLoginApiResponse, ifAuthRegisterApiResponse, ifAuthSponsorApiResponse } from "./interface/AuthInterface";
import { ifOrderPlanApiResponse } from "./interface/OrderInterface";

////site
export const getSiteSetting = async ():Promise<ifSiteSettingResponse> => {
    const res = await cosApiUtil.sendGet("/site/setting")
    return res;
}


export const getSwp = async (page:string):Promise<ifSiteSwgApiResponse> => {
    const res = await cosApiUtil.sendGet(`/site/swp?page=${page}`)
    return res;
}


export const sendSiteFeedback = async (
    department:string,
    email:string,
    name:string,
    message:string,
    videoId:string,
    line:string,
    videoUrl:string,
    reason:string,
    telecom:string,
    device:string,
    uploadFile:File|null,
    player:string
):Promise<ifSiteFeedbackResponse> => {
    const formData = new FormData();
    formData.append("department", department);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("message", message);
    formData.append("video_id", videoId);
    formData.append("line", line);
    formData.append("video_url", videoUrl);
    formData.append("reason", reason);
    formData.append("telecom", telecom);
    formData.append("device", device);

    if (uploadFile) {
        formData.append("msg_img", uploadFile);
    }
    formData.append("player", player);

    // 印出 FormData 的所有內容
    /*
    console.log("FormData 內容:");
    Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
    });*/

    const res = await cosApiUtil.sendPost("/site/feedback", formData);
    return res;
}

export const getSiteAdtemplate = async (
    group:string,
):Promise<ifSiteAdtemplateResponse> => {
    const formData = new FormData();
    formData.append("group", group);
    formData.append("no_website", "1");

    const res = await cosApiUtil.sendPost("/site/adtemplate", formData);
    return res;
}





////auth
/**
 * 忘記密碼
 * @param email 
 * @returns 
 */
export const sendAuthForget = async (email: string):Promise<ifAuthForgetApiResponse> => {
    const formData = new FormData();
    formData.append("email",email.trim());

    const res = await cosApiUtil.sendPost("/auth/forget",formData)
    return res;
}

/**
 * 註冊
 * @param account 
 * @param password 
 * @param password_confirm 
 * @param email 
 * @param inviteCode 
 * @returns 
 */
export const sendAuthRegister = async (account: string,password: string,password_confirm: string,email: string,inviteCode: string):Promise<ifAuthRegisterApiResponse> => {
    
    const formData = new FormData();
    formData.append("username",account);
    formData.append("password",password);
    formData.append("password_confirm",password_confirm);
    formData.append("email",email);
    formData.append("invitation_use",inviteCode);
    formData.append("terms","on");
    formData.append("age","on");

    const res = await cosApiUtil.sendPost("/auth/register",formData)
    return res;
}

/**
 * 登入
 * @param account 
 * @param password 
 * @returns 
 */
export const sendAuthLogin = async (account: string,password: string):Promise<ifAuthLoginApiResponse> => {
    const authId = cosApiUtil.genAuthId();
    const formData = new FormData();
    formData.append("username",account);
    formData.append("password",password);
    formData.append("auth_id",authId);

    const res = await cosApiUtil.sendPost("/auth/login",formData)
    return res;
}

export const sendAuthChangePassword = async (oldPassword: string,newPassword: string,password_confirm: string):Promise<ifAuthChangePasswordApiResponse> => {
    const formData = new FormData();
    formData.append("old_password",oldPassword);
    formData.append("password",newPassword);
    formData.append("password_confirm",password_confirm);

    const res = await cosApiUtil.sendPost("/auth/update_password",formData)
    return res;
}



export const getAuthFavoriteVideoLists = async (page:number,limit:number):Promise<ifAuthFavoriteVideoApiResponse> => {
    //console.log(`/auth/subscribe_video_lists?page=${page}&limit=${limit}`);
    const res = await cosApiUtil.sendGet(`/auth/subscribe_video_lists?page=${page}&limit=${limit}`)
    //console.log(res);
    return res;
}

export const getAuthFavoriteAlbumLists = async (page:number,limit:number):Promise<ifAuthFavoriteAlbumApiResponse> => {
    const res = await cosApiUtil.sendGet(`/auth/subscribe_album_lists?page=${page}&limit=${limit}`)
    return res;
}

export const getAuthViewVideoLists = async (page:number,limit:number):Promise<ifAuthFavoriteVideoApiResponse> => {
    const res = await cosApiUtil.sendGet(`/auth/view_video_lists?page=${page}&limit=${limit}`)
    //console.log(res);
    return res;
}

export const getAuthViewAlbumLists = async (page:number,limit:number):Promise<ifAuthFavoriteAlbumApiResponse> => {
    const res = await cosApiUtil.sendGet(`/auth/view_album_lists?page=${page}&limit=${limit}`)
    return res;
}

export const getAuthSponsorLists = async (page:number,limit:number):Promise<ifAuthSponsorApiResponse> => {
    const res = await cosApiUtil.sendGet(`/auth/record_lists?page=${page}&limit=${limit}`)
    return res;
}



////video
export const getVideoCategories = async ():Promise<ifCategoriesApiResponse> => {
    const res = await cosApiUtil.sendGet("/video/categories")
    return res;
}

export const getVideoCategoriesSub = async (ct: string|undefined):Promise<ifCategoriesSubApiResponse> => {
    const res = await cosApiUtil.sendGet(`/video/categories_sub?ct=${ct}`)
    return res;
}

export const getVideoList = async (queryStr: string,page:number,limit:number):Promise<ifVideoListApiResponse> => {
    let query = queryStr;
    if (page >= 0) {
        query += `&page=${page}`;
    }
    if (limit > 0) {
        query += `&limit=${limit}`;
    }
    //console.log(`/video/lists?${query}`);
    const res = await cosApiUtil.sendGet(`/video/lists?${query}`)
    return res;
}

export const getVideoRecommend = async ():Promise<ifVideoRecommendApiResponse> => {

    const res = await cosApiUtil.sendGet(`/video/recommend`)
    return res;
}

export const getVideoInfo = async (videoId: string|undefined):Promise<ifVideoApiResponse> => {
    const res = await cosApiUtil.sendGet(`/video/videoinfo?id=${videoId}`,true)
    //console.log(res);
    return res;
}

export const sendVideoFavorite = async (videoId:string):Promise<ifVideoFavoriteApiResponse> => {
    const res = await cosApiUtil.sendGet(`/video/favorite?id=${videoId}`)
    return res;
}


////albums

export const getAlbumList = async (queryStr: string,page:number,limit:number):Promise<ifAlbumListApiResponse> => {
    let query = queryStr;
    if (page > 0) {
        query += `&page=${page}`;
    }
    if (limit > 0) {
        query += `&limit=${limit}`;
    }
    const res = await cosApiUtil.sendGet(`/albums/lists?${query}`)
    return res;
}

export const getAlbumInfo = async (albumId: string|undefined):Promise<ifAlbumApiResponse> => {
    const res = await cosApiUtil.sendGet(`/albums/albuminfo?id=${albumId}`)
    return res;
}

export const getAlbumContent = async (albumId: string|undefined):Promise<ifAlbumContentApiResponse> => {
    const res = await cosApiUtil.sendGet(`/albums/album_content?id=${albumId}&limit=999`)
    return res;
}


export const sendAlbumFavorite = async (albumId:string):Promise<ifAlbumFavoriteApiResponse> => {
    const res = await cosApiUtil.sendGet(`/albums/favorite?id=${albumId}`)
    return res;
}




////game

export const getGameCategories = async ():Promise<ifGameCategoriesApiResponse> => {
    const res = await cosApiUtil.sendGet('/game/categories?status=1')
    return res;
}

export const getGameTop10 = async ():Promise<ifGameListApiResponse> => {
    return getGameList("order=order_rank",0,10);
}

export const getGameList = async (queryStr: string,page:number,limit:number):Promise<ifGameListApiResponse> => {
    let query = queryStr;
    if (page > 0) {
        query += `&page=${page}`;
    }
    if (limit > 0) {
        query += `&limit=${limit}`;
    }
    const res = await cosApiUtil.sendGet(`/game/lists?${query}`)
    return res;
}


////order

export const getOrderPlan = async ():Promise<ifOrderPlanApiResponse> => {
    const res = await cosApiUtil.sendGet('/order/plans')
    return res;
}



