import type { getResult } from "../CosApiUtil"
import type { UserActionRes } from "./AuthInterface"
export type CommonVideo = {
  id: string
  photo: string
  title: string
  duration: string
  viewnumber: string
  is_vip: string
  in_top: string
  channel: string
  channel_name: string
  channel_bg_color: null
  cos_works: string
  cos_role: string
  author: string
  barcode: string
  single_sale: string
  sale_point: string
  likes: string
  tags: string[],
  addtime: string
  adddate: string
  is_exclusive: boolean,
  group_id: string
  group_order: string
}
export type FullVideo = {
  id: string,
  photo: string
  title: string
  duration: string
  viewnumber: string
  channel: string
  cos_works: string
  cos_role: string
  author: string
  barcode: string
  is_vip: string
  in_top: string
  type: string
  single_sale: string
  sale_point: string
  addtime: string
  adddate: string
  addtimestamp: string
  likes: string
  dislikes: string
  like_rate: string
  is_vip_limited_time: string
  vip_limited_time_start: string
  username: string
  user_avatar: string
  tags: string[],
  is_exclusive: boolean,
  company: string,
  series: string,
  thank_vendor_text: string,
  thank_vendor_url: string,
  group_id: string
  video_url: string[]
  video_url_vip: string[],
  video_img: string
  can_play: boolean,
  can_play_status: string
  can_play_msg: string
  comments: string
  cnxh: CommonVideo[]
}
export type ifVideoApiResponse = getResult<FullVideo>
export interface Stream<T> {
  lastpage: number
  list: T[]
  totalCnt: string
}
export type ifVideoList = Stream<CommonVideo>
export type ifVideoListApiResponse = getResult<ifVideoList>
export type ifVideoFavoriteApiResponse = getResult<UserActionRes>
export type ifVideoRecommendApiResponse = getResult<Stream<CommonVideo>>