import { getFavoriteAlbumList, getFavoriteVideoList } from "../../data/DataCenter";


/**判斷是否已收藏視頻 */
export const checkIsFavoriteVideo = (videoId:string)=>{
    const favoriteList = getFavoriteVideoList();
    if(!favoriteList || favoriteList.length === 0){
        return false;
    }

    return favoriteList.find(item => item === videoId) !== undefined;
}

/**判斷是否已收藏專輯 */
export const checkIsFavoriteAlbum = (albumId:string)=>{
    const favoriteList = getFavoriteAlbumList();
    if(!favoriteList || favoriteList.length === 0){
        return false;
    }
    return favoriteList.find(item => item === albumId) !== undefined;
}



