import type { getResult } from "../CosApiUtil"
import type { Stream } from "./VideoInterface"

export type ifCategoriesApiResponse = getResult<ifCategoryItem[]>
export type ifCategoriesSubApiResponse = getResult<ifCategorySubItem[]>
export interface ifCategorySubItem {
  CHID: string
  bg_color: string
  has_sub: boolean
  icon: string
  name: string
  photo: string
  slug: string
}
export interface ifCategoryItem extends ifCategorySubItem {
  bg_color: string
  subCategories?: ifCategorySubItem[] | Stream<ifCategorySubItem>
}