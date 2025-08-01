import {get_minio_url} from "@/api/ms/file.ts";

/**
 * 格式化速度单位 (B/s, KB/s, MB/s)
 * @param {number} bytesPerSecond - 速度，单位：字节/秒
 * @returns {string} 格式化后的速度字符串
 */
function formatSpeed(bytesPerSecond) {
    if (isNaN(bytesPerSecond) || bytesPerSecond <= 0) return "0 B/s";
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let unitIndex = 0;
    let speed = bytesPerSecond;
    while (speed >= 1024 && unitIndex < units.length - 1) {
        speed /= 1024;
        unitIndex++;
    }
    return `${speed.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 根据文件名获取 MIME 类型
 * @param {string} fileName - 文件名
 * @returns {string} MIME 类型字符串
 */
function getMimeType(fileName = '') {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        // 可以根据需要添加更多类型
    };
    return mimeTypes[extension] || 'application/octet-stream'; // 默认二进制流
}

/**
 * [核心实现] 使用预签名URL上传文件 (内部函数)
 * @param {File | Blob} file - 文件对象
 * @param {string} uploadUrl - 预签名上传URL
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<string>} 上传成功后文件的公共URL
 */
function uploadViaPresignedUrl(file, uploadUrl, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', getMimeType(file.name));

        const startTime = Date.now();
        let lastUpdateTime = startTime;
        let lastUploadedBytes = 0;
        let lastSpeeds = [];

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && typeof onProgress === 'function') {
                const now = Date.now();
                const uploadedBytes = event.loaded;
                const progress = (uploadedBytes / event.total) * 100;

                const timeDiff = (now - lastUpdateTime) / 1000;
                const bytesDiff = uploadedBytes - lastUploadedBytes;
                const instantSpeed = timeDiff > 0 ? bytesDiff / timeDiff : 0;

                lastSpeeds.push(instantSpeed);
                if (lastSpeeds.length > 5) lastSpeeds.shift();
                const smoothedSpeed = lastSpeeds.reduce((sum, speed) => sum + speed, 0) / lastSpeeds.length;

                lastUploadedBytes = uploadedBytes;
                lastUpdateTime = now;

                onProgress({
                    progress: Number(progress.toFixed(2)),
                    speed: formatSpeed(smoothedSpeed), // 只返回平滑速度，简化接口
                });
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (typeof onProgress === 'function') {
                    onProgress({ progress: 100, speed: "0 B/s" });
                }
                const finalUrl = uploadUrl.split('?')[0];
                resolve(finalUrl);
            } else {
                reject(new Error(`上传失败，服务器响应: ${xhr.status} ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error("上传时发生网络错误"));
        xhr.onabort = () => reject(new Error("上传已中止"));

        xhr.send(file);
    });
}


// /**
//  * [模拟后端API] 向后端请求预签名URL。
//  * !!!注意: 这只是一个模拟函数，您需要替换成真实的API请求。!!!
//  * @param {string} fileName - 原始文件名
//  * @param {string} pathName - 上传路径
//  * @returns {Promise<{uploadUrl: string}>}
//  */
// async function getPresignedUploadUrlFromBackend(fileName, pathName) {
//   console.log(`正在为文件 "${fileName}" 在路径 "${pathName}" 请求上传URL...`);
//
//   // --- !!!请将这部分替换为您真实的后端API调用!!! ---
//   const MOCK_API_ENDPOINT = '/api/v1/files/presigned-url'; // 假设这是您的API地址
//   try {
//     const response = await fetch(MOCK_API_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // 如果需要，带上认证 Token
//         // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({
//         fileName: fileName,
//         path: pathName
//       })
//     });
//
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || '获取上传URL失败');
//     }
//
//     // 假设后端返回的数据格式是 { data: { uploadUrl: "..." } }
//     const result = await response.json();
//     if (!result.data || !result.data.uploadUrl) {
//       throw new Error('后端返回的URL数据格式不正确');
//     }
//
//     return result.data;
//
//   } catch (error) {
//     console.error("请求预签名URL失败:", error);
//     throw error; // 将错误继续向上抛出
//   }
//   // --- 真实API调用结束 ---
// }


// --- 对外暴露的主函数 ---

/**
 * 上传文件到Minio（通过预签名URL模式）
 * @param {string} oldFileName - 原始文件名，用于后端生成URL
 * @param {{file: File | Blob}} params - 包含文件对象的参数
 * @param {Function} onProgress - 进度回调函数，接收 { progress, speed }
 * @param {string} [pathName] - 上传的目标路径/文件夹名，默认为 'CloudDisks'
 * @returns {Promise<string>} 上传成功后文件的公共访问URL
 */
export async function uploadFile(oldFileName, params, onProgress, pathName) {
    // 1. 参数验证
    if (!params?.file || !(params.file instanceof Blob)) {
        throw new TypeError("文件参数必须是Blob类型");
    }
    if (params.file.size <= 0) {
        throw new Error("文件内容为空");
    }
    if (!oldFileName) {
        throw new Error("必须提供原始文件名 (oldFileName)");
    }

    // 2. 确定上传路径
    const finalPathName = pathName || 'CloudDisks';

    try {
        // 3. [修正] 使用 await 等待 API 调用完成，而不是 .then()
        console.log(`正在为文件 "${oldFileName}" 在路径 "${finalPathName}" 请求上传URL...`);
        const res = await get_minio_url(finalPathName + '/' + oldFileName);

        // 健壮性检查：确保后端返回了需要的数据
        if (!res?.data?.upload_url || !res?.data?.url) {
            throw new Error('API响应无效：未找到 upload_url 或 url');
        }

        // 4. 从结果中提取 URL
        const uploadUrl = res.data.upload_url;
        const finalFileUrl = res.data.url;

        // 5. [修正] 使用 await 等待文件上传完成
        await uploadViaPresignedUrl(params.file, uploadUrl, onProgress);

        // 6. [修正] 直接从主函数体返回最终的 URL
        console.log(`文件上传成功: ${finalFileUrl}`);
        return finalFileUrl;

    } catch (error) {
        // 这个 catch 现在可以捕获 get_minio_url 和 uploadViaPresignedUrl 中任何一个环节的错误
        console.error(`文件 "${oldFileName}" 上传失败:`, error);
        throw error; // 将错误继续向上抛出，以便调用方可以捕获
    }
}