import { ifVideoBaseInfo, ifVideoDetail } from "../Api/interface/VideoInterface";

/**
 * 下載進度詳情（由 downloadVideo / downloadToWebStorage 的回呼傳入）
 */
export type DownloadProgressDetail = {
  /** 0–100；若伺服器未提供 Content-Length，下載過程中可能長期為 0，完成時為 100 */
  progress: number;
  /** 有 Content-Length 時為檔案總位元組；否則為 null（完成後會等於已下載大小） */
  totalBytes: number | null;
  /** 目前已接收位元組 */
  loadedBytes: number;
  /** 依「下載開始至今」推算的平均速度（位元組/秒） */
  bytesPerSecond: number;
};

/**
 * 下載進度回調函數類型
 */
export type ProgressCallback = (detail: DownloadProgressDetail) => void;

/**
 * 已下載文件信息
 */
export interface DownloadedFileInfo {
  fileName: string;
  filePath: string;
  timestamp?: number;
  size?: number;
}

/**
 * 存儲 Blob 到 IndexedDB
 */
const storeBlobInIndexedDB = (fileName: string, blob: Blob): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VideoDownloads", 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const fileRequest = store.put({
        fileName,
        blob,
        timestamp: Date.now(),
      });

      fileRequest.onsuccess = () => resolve();
      fileRequest.onerror = () => reject(fileRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "fileName" });
      }
    };
  });
};

/**
 * 下載到 Web 存儲（IndexedDB）
 * 使用流式處理，避免大文件記憶體不足問題
 */
const PROGRESS_UPDATE_INTERVAL_BYTES = 256 * 1024; // 每 256KB 回報一次，平衡 UI 與效能

function emitProgress(
  onProgress: ProgressCallback,
  loaded: number,
  progressPct: number,
  totalBytes: number | null,
  downloadStartTime: number,
): void {
  const now = performance.now();
  const dtSec = (now - downloadStartTime) / 1000;
  const bytesPerSecond = dtSec > 0 ? loaded / dtSec : 0;
  onProgress({
    progress: progressPct,
    totalBytes,
    loadedBytes: loaded,
    bytesPerSecond: Math.max(0, bytesPerSecond),
  });
}

export const downloadToWebStorage = async (
  url: string,
  fileName: string,
  onProgress?: ProgressCallback,
): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("下載失敗");
    }

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    const totalBytes: number | null = total > 0 ? total : null;

    // 如果沒有 body，無法下載
    if (!response.body) {
      throw new Error("無法讀取響應");
    }

    // 無進度回調時直接用 blob()，較省資源
    if (!onProgress) {
      const blob = await response.blob();
      await storeBlobInIndexedDB(fileName, blob);
      return;
    }

    // 有進度回調：一律串流讀取，才能回報 loaded / 速度
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;
    let lastEmitBytes = 0;
    const downloadStartTime = performance.now();

    // 依總量計算百分比（未知總量時進度維持 0，僅靠 loadedBytes / bytesPerSecond 顯示）
    const pctForLoaded = (loaded: number) =>
      totalBytes !== null ? Math.min(99, Math.round((loaded / totalBytes) * 100)) : 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        chunks.push(value);
        receivedLength += value.length;

        const reachedFull = totalBytes !== null && receivedLength >= totalBytes;
        const hitInterval = receivedLength - lastEmitBytes >= PROGRESS_UPDATE_INTERVAL_BYTES;

        if (hitInterval || reachedFull) {
          emitProgress(
            onProgress,
            receivedLength,
            pctForLoaded(receivedLength),
            totalBytes,
            downloadStartTime,
          );
          lastEmitBytes = receivedLength;
        }
      }

      // 小檔或未達間隔：補一次進度（最多 99%）
      if (receivedLength > 0 && lastEmitBytes < receivedLength) {
        emitProgress(
          onProgress,
          receivedLength,
          pctForLoaded(receivedLength),
          totalBytes,
          downloadStartTime,
        );
      }

      const mergedArray = new Uint8Array(chunks.reduce((acc, curr) => acc + curr.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        mergedArray.set(chunk, offset);
        offset += chunk.length;
      }
      const blob = new Blob([mergedArray], { type: "video/mp4" });
      chunks.length = 0;

      const resolvedTotal = totalBytes !== null ? totalBytes : receivedLength;
      onProgress({
        progress: 100,
        totalBytes: resolvedTotal,
        loadedBytes: receivedLength,
        bytesPerSecond: 0,
      });

      await storeBlobInIndexedDB(fileName, blob);
    } finally {
      reader.releaseLock();
    }

    console.log("下載完成，文件已存儲到 IndexedDB");
  } catch (error) {
    console.error("Web 下載失敗:", error);
    throw error;
  }
};

/**
 * 下載影片（目前只支援 MP4）
 *
 * 對於 APK，使用與 WEB 相同的方式（IndexedDB）
 * 不再使用分斷下載方式，避免合併時的複雜性和失敗風險
 */
export const downloadVideo = async (
  videoUrl: string,
  fileName: string,
  onProgress?: ProgressCallback,
): Promise<string | void> => {
  // APK 和 WEB 都使用相同的 IndexedDB 方法
  console.log("使用 IndexedDB 方法下載（APK 和 WEB 統一方式）");
  return await downloadToWebStorage(videoUrl, fileName, onProgress);
};

/**
 * 從 IndexedDB 獲取所有已下載的文件
 */
export const getAllFilesFromIndexedDB = async (): Promise<DownloadedFileInfo[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VideoDownloads", 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["videos"], "readonly");
      const store = transaction.objectStore("videos");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const files: DownloadedFileInfo[] = getAllRequest.result.map((item: any) => ({
          fileName: item.fileName,
          filePath: `indexeddb://VideoDownloads/videos/${item.fileName}`,
          timestamp: item.timestamp,
          size: item.blob?.size,
        }));
        resolve(files);
      };

      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "fileName" });
      }
    };
  });
};

/**
 * 獲取所有已下載的文件列表
 * @returns 已下載文件的數組，包含文件名和文件路徑
 */
export const getDownloadedFiles = async (): Promise<DownloadedFileInfo[]> => {
  // 統一使用 IndexedDB 方式
  return await getAllFilesFromIndexedDB();
};

/**
 * 根據文件名查找已下載的文件
 * @param fileName 要查找的文件名
 * @returns 文件信息，如果不存在則返回 null
 */
export const getDownloadedFile = async (fileName: string): Promise<DownloadedFileInfo | null> => {
  const files = await getDownloadedFiles();
  return files.find((f) => f.fileName === fileName) || null;
};

/**
 * 刪除已下載的文件（目前只支援刪除單一檔案，例如 `${id}.mp4`）
 * @param fileName 要刪除的文件名
 * @returns 是否刪除成功
 */
export const deleteDownloadedFile = async (fileName: string): Promise<boolean> => {
  // APK 和 WEB 都使用 IndexedDB 刪除方式（統一方式）
  try {
    return new Promise((resolve) => {
      const request = indexedDB.open("VideoDownloads", 2);

      request.onerror = () => {
        console.error("打開 IndexedDB 失敗:", request.error);
        resolve(false);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["videos"], "readwrite");
        const store = transaction.objectStore("videos");

        const deleteRequest = store.delete(fileName);
        deleteRequest.onsuccess = () => {
          console.log("文件從 IndexedDB 刪除成功:", fileName);
          resolve(true);
        };
        deleteRequest.onerror = () => {
          console.warn("刪除文件失敗（可能不存在）:", fileName);
          resolve(false);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("videos")) {
          db.createObjectStore("videos", { keyPath: "fileName" });
        }
      };
    });
  } catch (error) {
    console.error("從 IndexedDB 刪除文件失敗:", error);
    return false;
  }
};

/**
 * 獲取本地文件的可用 URL（用於播放）
 * @param fileInfo 已下載的文件信息
 * @returns 可用於播放的 URL，如果獲取失敗則返回 null
 */
export const getLocalFileUrl = async (fileInfo: DownloadedFileInfo): Promise<string | null> => {
  // 統一使用 IndexedDB 方式
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("VideoDownloads", 2);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["videos"], "readonly");
        const store = transaction.objectStore("videos");
        const getRequest = store.get(fileInfo.fileName);

        getRequest.onsuccess = () => {
          const item = getRequest.result;
          if (item && item.blob) {
            const blobUrl = URL.createObjectURL(item.blob);
            resolve(blobUrl);
          } else {
            resolve(null);
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("videos")) {
          db.createObjectStore("videos", { keyPath: "fileName" });
        }
      };
    });
  } catch (error) {
    console.error("從 IndexedDB 獲取文件失敗:", error);
    return null;
  }
};

/**
 * IndexedDB 中每筆下載影片的詳情紀錄（等同 API 的 res.data）
 */
export interface DownloadedVideoDataRecord {
  videoId: string;
  data: ifVideoDetail;
  timestamp: number;
}

export interface DownloadedFileCheckResult {
  videoFile: DownloadedFileInfo | null;
  hasFile: boolean;
  videoData: ifVideoDetail | null;
}

const VIDEO_DOWNLOAD_DATAS_DB_NAME = "VideoDownloadDatas";
const VIDEO_DOWNLOAD_DATAS_DB_VERSION = 2;

/** 開啟 VideoDownloadDatas（含 by_timestamp 索引，供分頁游標由新到舊） */
function openVideoDownloadDatasDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VIDEO_DOWNLOAD_DATAS_DB_NAME, VIDEO_DOWNLOAD_DATAS_DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const tx = (event.target as IDBOpenDBRequest).transaction!;
      let store: IDBObjectStore;
      if (!db.objectStoreNames.contains("videoDatas")) {
        store = db.createObjectStore("videoDatas", { keyPath: "videoId" });
      } else {
        store = tx.objectStore("videoDatas");
      }
      if (!store.indexNames.contains("by_timestamp")) {
        store.createIndex("by_timestamp", "timestamp", { unique: false });
      }
    };
  });
}

/**
 * 讀取單筆已儲存影片詳情
 */
export const getDownloadedVideoData = async (
  videoId: string,
): Promise<DownloadedVideoDataRecord | null> => {
  const db = await openVideoDownloadDatasDb();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains("videoDatas")) {
      db.close();
      resolve(null);
      return;
    }
    const tx = db.transaction(["videoDatas"], "readonly");
    const store = tx.objectStore("videoDatas");
    const req = store.get(videoId);
    req.onsuccess = () => {
      const row = req.result as
        | (DownloadedVideoDataRecord & { res?: { data?: ifVideoDetail } })
        | undefined;
      const data = row?.data ?? row?.res?.data;
      if (!row || !data) {
        db.close();
        resolve(null);
        return;
      }
      db.close();
      resolve({
        videoId: row.videoId,
        data,
        timestamp: row.timestamp ?? 0,
      });
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
};

/**
 * 刪除單筆已儲存影片詳情
 */
export const deleteDownloadedVideoData = async (videoId: string): Promise<boolean> => {
  try {
    const db = await openVideoDownloadDatasDb();
    return new Promise((resolve) => {
      if (!db.objectStoreNames.contains("videoDatas")) {
        db.close();
        resolve(false);
        return;
      }
      const tx = db.transaction(["videoDatas"], "readwrite");
      const store = tx.objectStore("videoDatas");
      const req = store.delete(videoId);
      req.onsuccess = () => {
        db.close();
        resolve(true);
      };
      req.onerror = () => {
        db.close();
        resolve(false);
      };
    });
  } catch (e) {
    console.warn("刪除下載影片詳情失敗:", e);
    return false;
  }
};

/**
 * 檢查 MP4 與 ifVideoDetail 是否同時存在；缺任一則刪除殘留資料
 */
export const checkAndGetDownloadedFile = async (
  videoId: string | undefined,
): Promise<DownloadedFileCheckResult> => {
  if (!videoId) {
    return { videoFile: null, hasFile: false, videoData: null };
  }

  const fileName = `${videoId}.mp4`;
  const [downloadedFile, downloadedVideoData] = await Promise.all([
    getDownloadedFile(fileName),
    getDownloadedVideoData(videoId),
  ]);

  const hasMp4 = !!downloadedFile;
  const hasVideoData = !!downloadedVideoData;

  if (hasMp4 && hasVideoData) {
    return { videoFile: downloadedFile, hasFile: true, videoData: downloadedVideoData.data };
  }

  // 不一致：清掉殘留，讓使用者重新下載
  if (hasMp4 && !hasVideoData) {
    await deleteDownloadedFile(fileName);
  }
  if (!hasMp4 && hasVideoData) {
    await deleteDownloadedVideoData(videoId);
  }

  return { videoFile: null, hasFile: false, videoData: null };
};

/** 將詳情轉成列表項目（CosGridFrame / ifVideoBaseInfo） */
export const videoDetailToBaseInfo = (detail: ifVideoDetail): ifVideoBaseInfo => ({
  id: detail.id,
  photo: detail.photo,
  title: detail.title,
  duration: detail.duration,
  viewnumber: detail.viewnumber,
  is_vip: detail.is_vip,
  in_top: detail.in_top,
  channel: detail.channel,
  channel_name: undefined,
  channel_bg_color: null,
  cos_works: detail.cos_works,
  cos_role: detail.cos_role,
  author: detail.author,
  barcode: detail.barcode,
  single_sale: detail.single_sale,
  sale_point: detail.sale_point,
  likes: detail.likes,
  tags: detail.tags ?? [],
  addtime: detail.addtime,
  adddate: detail.adddate,
  is_exclusive: detail.is_exclusive,
  group_id: detail.group_id,
  group_order: "0",
});

/**
 * 讀取所有已儲存的影片詳情紀錄（較新者在前）
 */
export const getAllDownloadedVideoDatas = async (): Promise<DownloadedVideoDataRecord[]> => {
  const db = await openVideoDownloadDatasDb();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains("videoDatas")) {
      db.close();
      resolve([]);
      return;
    }
    const transaction = db.transaction(["videoDatas"], "readonly");
    const store = transaction.objectStore("videoDatas");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const raw = getAllRequest.result as Array<
        DownloadedVideoDataRecord & { res?: { data?: ifVideoDetail } }
      >;
      const records: DownloadedVideoDataRecord[] = [];
      for (const row of raw) {
        const data = row.data ?? row.res?.data;
        if (data) {
          records.push({
            videoId: row.videoId,
            data,
            timestamp: row.timestamp ?? 0,
          });
        }
      }
      records.sort((a, b) => b.timestamp - a.timestamp);
      db.close();
      resolve(records);
    };
    getAllRequest.onerror = () => {
      db.close();
      reject(getAllRequest.error);
    };
  });
};

/**
 * 分頁讀取已儲存影片詳情（依 timestamp 新到舊，只解序列化游標掃到的該頁筆數）
 */
export const getDownloadedVideoDatasPage = async (
  page: number,
  pageSize: number,
): Promise<{ records: DownloadedVideoDataRecord[]; total: number }> => {
  const db = await openVideoDownloadDatasDb();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains("videoDatas")) {
      db.close();
      resolve({ records: [], total: 0 });
      return;
    }

    const tx = db.transaction(["videoDatas"], "readonly");
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };

    const store = tx.objectStore("videoDatas");
    const countReq = store.count();
    countReq.onerror = () => reject(countReq.error);
    countReq.onsuccess = () => {
      const total = countReq.result;
      if (total === 0) {
        resolve({ records: [], total: 0 });
        return;
      }

      const safePageSize = Math.max(1, pageSize);
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * safePageSize;

      const finish = (records: DownloadedVideoDataRecord[]) => {
        resolve({ records, total });
      };

      if (!store.indexNames.contains("by_timestamp")) {
        getAllDownloadedVideoDatas()
          .then((all) => {
            const sliced = all.slice(skip, skip + safePageSize);
            resolve({ records: sliced, total: all.length });
          })
          .catch(reject);
        return;
      }

      const index = store.index("by_timestamp");
      const records: DownloadedVideoDataRecord[] = [];
      let skipped = 0;
      const cursorReq = index.openCursor(null, "prev");

      cursorReq.onerror = () => reject(cursorReq.error);

      cursorReq.onsuccess = (e) => {
        if (records.length >= safePageSize) {
          finish(records);
          return;
        }
        const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (!cursor) {
          finish(records);
          return;
        }
        if (skipped < skip) {
          skipped += 1;
          cursor.continue();
          return;
        }
        const row = cursor.value as DownloadedVideoDataRecord & {
          res?: { data?: ifVideoDetail };
        };
        const data = row.data ?? row.res?.data;
        if (data) {
          records.push({
            videoId: row.videoId,
            data,
            timestamp: row.timestamp ?? 0,
          });
        }
        cursor.continue();
      };
    };
  });
};

/**
 * 儲存下載影片的影片詳情（ifVideoDetail，等同 getVideoInfo 的 res.data）
 * DB: VideoDownloadDatas, Store: videoDatas
 */
export const saveDownloadedVideoData = async (
  videoId: string,
  data: ifVideoDetail,
): Promise<void> => {
  const db = await openVideoDownloadDatasDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["videoDatas"], "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
    const store = tx.objectStore("videoDatas");
    store.put({
      videoId,
      data,
      timestamp: Date.now(),
    });
  });
};
