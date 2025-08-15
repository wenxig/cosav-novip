import type { getResult } from "../CosApiUtil"
import type { Stream } from "./VideoInterface"

export interface GameItem {
  category_id: string
  category_name: string
  slug: string
  show_name: string
  total_games: string
  status: string
  sort: string
}
export type ifGameList = Stream<GameItem[]>
export type ifGameCategoriesApiResponse = getResult<ifGameList>