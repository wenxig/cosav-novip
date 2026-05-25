import type { getResult } from "../CosApiUtil"
import type { CommonVideo } from "./VideoInterface"

export type ifAuthLoginApiResponse = getResult<{
  uid: string,
  username: string,
  nickname?: string,
  email: string
  emailverified: string
  photo: string
  fname: string
  gender: string
  vip_expire: number
  vip_expire_date: string
  tags: string
  auth_id: string
  message: string
  invitation_code: string
  invitation_num: string
  invitation_7day: string
  invitation_text: string
  user_info: {
    logintime: string
    gender: string
    premium?: string,
    profile_viewed: string
    invitation_code: string
    invitation_num: string
    invitation_7day: string
  },
  Userparams: string
}>

export interface FavorVideoList<T> {
  type: string
  msg: string
  status: string
  lists: T[]
  lastpage: number
  totalCnt: string
  MaxCnt: number
}
export type ifAuthFavoriteVideoApiResponse = getResult<FavorVideoList<CommonVideo>>
export interface UserActionRes {
  status: string
  msg: string[],
  mod: string
  nowCnt: number
  maxCnt: number
  vid: number
}