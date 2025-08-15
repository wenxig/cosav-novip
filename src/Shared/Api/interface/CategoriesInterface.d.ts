import type { getResult } from "../CosApiUtil"

export type ifCategoriesApiResponse = getResult<{
  CHID: string
  bg_color: string
  has_sub: boolean
  icon: string
  name: string
  photo: string
  slug: string
}[]>
export type ifCategoriesSubApiResponse = getResult<{
  CHID: string
  has_sub: boolean
  name: string
  photo: string
  slug: string
  total: number
}[]>