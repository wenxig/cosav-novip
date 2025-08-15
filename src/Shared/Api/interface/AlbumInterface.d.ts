import type { getResult } from "../CosApiUtil"
import type { FavorVideoList, UserActionRes } from "./AuthInterface"
import type { CommonVideo, Stream } from "./VideoInterface"

export interface CommonPicture {
  id: string
  title: string
  tags: string
  photo: string
  ct: string
  cos_works: string
  cos_role: string
  author: string
  total_photos: string
  total_views: string
  addtime: string
  adddate: string
  type: string
  album_desc?: string
  username: string
  uid: string
}
export type ifAlbumList = Stream<CommonPicture>
export type ifAlbumListApiResponse = getResult<ifAlbumList>

export interface FullPicture {
  adddate: string
  addtime: string
  album_desc?: string
  author: string
  cos_role: string
  cos_works: string
  ct: string
  ct_name: string
  dislikes: string
  id: string
  likes: string
  rate_view: string
  tags: string[]
  title: string
  total_photos: string
  total_views: string
  type: string
  uid: string
  user_avatar: string
  username: string
}
export type ifAlbumApiResponse = getResult<FullPicture>

export type ifAlbumContentApiResponse = getResult<Stream<string>>


export type ifAlbumFavoriteApiResponse = getResult<UserActionRes>