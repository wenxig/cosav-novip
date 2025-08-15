import cryptoJs from "crypto-js"
import { getUserAuthId, getUserParams } from "../../data/DataCenter"
import { checkIsLogin } from "../function/AccountFunction"


type Wordarray = cryptoJs.lib.WordArray
type getApiReason = 'success' | 'get link fail' | 'decrypt fail' | string

export type getResult<T = any> = {
  result: 'success' | 'fail',
  message: string | null,
  data?: T
}


export class CosApiUtil {
  private static instance: CosApiUtil

  private readonly cosKey = "CosAppMakeBigMoneyCosplayAPPContent"
  private cosKeyMd5: string = ''
  private cosKeyMd5Hex: Wordarray = cryptoJs.lib.WordArray.create()

  //private readonly apiCloudServer = "https://cos-c01-1308024008.cos.ap-guangzhou.myqcloud.com/server-2024.txt"
  //private readonly defaultApiUrl = "https://api.cosfl-airapi.org/api/app/v1"
  private readonly apiCloudServer = "https://cos-c01-1308024008.cos.ap-guangzhou.myqcloud.com/server-2025.txt"
  private readonly defaultApiUrl = "https://api.macintosh-serve.org/api/app/v1"
  public isInitApiUrl: boolean = false
  public getApiUrlFailReason: getApiReason = 'success'
  public apiUrl = this.defaultApiUrl

  public static getInstance(): CosApiUtil {
    if (!CosApiUtil.instance) {
      CosApiUtil.instance = new CosApiUtil()
    }
    return CosApiUtil.instance
  }

  /**
   * 測試API是否能正常連接
   * @param url 
   * @returns 
   */
  private async testUrl(url: string): Promise<boolean> {
    try {
      const fatchApiUrlRes = await fetch(url)
      if (fatchApiUrlRes.ok) {
        return true
      }
    } catch { }
    return false
  }

  /**
   * 設定ApiUrl,並記錄設定原因
   * @param url 
   * @param reason 
   * @returns 
   */
  private setGetApiResult(url: string, reason: getApiReason): string {
    this.isInitApiUrl = true
    this.getApiUrlFailReason = reason
    this.apiUrl = url
    return this.apiUrl
  }

  /**
   * 將KEY做MD5並轉換為HEX
   * @returns 
   */
  private getMd5HexKey(): Wordarray {
    if (!this.cosKeyMd5) {
      this.cosKeyMd5 = cryptoJs.MD5(this.cosKey).toString()
      this.cosKeyMd5Hex = cryptoJs.enc.Utf8.parse(this.cosKeyMd5)
    }
    return this.cosKeyMd5Hex
  }

  /**
   * 利用cosKey將輸入的資料解碼
   * @param data 
   * @returns 
   */
  private decryptData(data: string, url?: string): string {
    try {
      const dData = cryptoJs.AES.decrypt(data, this.getMd5HexKey(), {
        mode: cryptoJs.mode.ECB,
        padding: cryptoJs.pad.Pkcs7
      })
      const result = dData.toString(cryptoJs.enc.Utf8)
      console.log(url, JSON.parse(result))
      return result
    } catch (e) {
      console.log(e)
    }
    return 'decrypt fail'
  }

  /**
   * 
   * @returns 取得ApiUrl
   */
  public async getApiUrl(): Promise<string> {
    if (this.isInitApiUrl) {
      //當已初始完成時,使用已完成的資料
      return this.apiUrl
    }

    try {
      const res = await fetch(this.apiCloudServer)
      if (res.ok) {

        const textData = await res.text()
        const url = this.decryptData(textData, this.apiCloudServer)

        if (url === 'decrypt fail' || url === '') {
          return this.setGetApiResult(url, 'decrypt cloud data fail')
        }
        if (!this.testUrl(url)) {
          return this.setGetApiResult(this.defaultApiUrl, 'fatch api url fail',)
        }
        return this.setGetApiResult(url, 'success')
      }
      return this.setGetApiResult(this.defaultApiUrl, 'get cloud link fail',)
    } catch (e) {
      return this.setGetApiResult(this.defaultApiUrl, `error with ${e}`)
    }
  }

  /**
   * 建立Header要用的Token
   * @returns 
   */
  public genToken = () => {
    return "CosAppMakeBigMoney," + Math.floor(Date.now() / 1000)
  }

  /**
   * 建立登入後判斷重複登入用的AuthId
   * @returns 
   */
  public genAuthId = () => {
    return (Math.floor(Date.now() / 1000)).toString()
  }



  /**
   * 
   * @param apiName 
   * @param data 
   */
  public sendGet = async (apiName: string, useAuthId: boolean = false): Promise<getResult> => {
    const apiUrl: string = await this.getApiUrl()
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Tokenparam': this.genToken(),
      'userParams': getUserParams(),
    })
    if (useAuthId && checkIsLogin() && getUserAuthId()) {
      headers.set('AuthId', getUserAuthId())
    }
    try {
      const url = `${apiUrl}${apiName}`
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const textData = await response.text()
      try {
        const jsonData = JSON.parse(textData)
        if (jsonData.code === 200 || jsonData.code === 0) {
          return {
            result: 'success' as const,
            message: null,
            data: JSON.parse(this.decryptData(jsonData.data, url))
          }
        }

        return {
          result: 'fail' as const,
          message: `API error code with: ${jsonData.code}`,
          data: null
        }
      } catch (e) {
        return {
          result: 'success' as const,
          message: null,
          data: textData
        }
      }
    } catch (error) {
      console.error('POST request failed:', error)
      return {
        result: 'fail' as const,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      }
    }
  }

  public sendPost = async (apiName: string, params: FormData): Promise<getResult> => {
    try {
      const apiUrl = await this.getApiUrl()
      const headers = new Headers({
        'Tokenparam': this.genToken(),
        'userParams': getUserParams(),
      })
      const url = `${apiUrl}${apiName}`
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: params
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const textData = await response.text()
      try {
        const jsonData = JSON.parse(textData)
        if (jsonData.code === 200 || jsonData.code === 0) {
          return {
            result: 'success' as const,
            message: null,
            data: JSON.parse(this.decryptData(jsonData.data, url))
          }
        }

        return {
          result: 'fail' as const,
          message: `API error code with: ${jsonData.code}`,
          data: null
        }
      } catch (e) {

        return {
          result: 'success' as const,
          message: null,
          data: textData
        }
      }

    } catch (error) {
      console.error('POST request failed:', error)
      return {
        result: 'fail' as const,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      }
    }
  }

}

// 匯出單例實例
export const cosApiUtil = CosApiUtil.getInstance();


