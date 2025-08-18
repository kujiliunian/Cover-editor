import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import {ElMessage} from 'element-plus';
import {encryption,decrypt}from '@/utils/AES'
// 定义接口返回的数据结构
interface ApiResponse<T = any> {
    err: string;
    code: number;
    message: string;
    data: T;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000,
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig & { useFixedToken?: boolean }) => {
        // 设置请求头

        config.headers = config.headers || {};
        config.headers['Content-Type'] = 'application/json';
        let token = "";
        let etoken=Cookies.get(encryption('token'))
        if(etoken){
            token=decrypt(etoken)
        }
        console.log()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {

        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        if (response.headers.authorization) {
            // console.log(response.headers.authorization)
            // localStorage.setItem('accessToken', response.headers.authorization);
            // localStorage.setItem('refreshToken', response.headers.authorization);
            Cookies.set(encryption('token'), encryption(response.headers.authorization), {expires: 7, domain: window.location.hostname.indexOf("mochiani.com") > 0 ? ".mochiani.com" : window.location.hostname });
        }

        const res = response.data;
        if (res.code !== 200) {
            switch (res.code) {
                case 401:
                    // if(localStorage){
                    //     localStorage.removeItem('accessToken');
                    //     localStorage.removeItem('refreshToken');
                    // }

                    Cookies.remove(
                        encryption('token'),
                        {
                          domain: window.location.hostname.indexOf("mochiani.com") > 0 ? ".mochiani.com" : window.location.hostname
                        }
                      );

                    setTimeout(()=>{

                        if(localStorage){
                            location.reload();
                        }
                    },100)

                    break;
                case 403:
                    ElMessage.error('拒绝访问');
                    break;
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error(res.err);
                    break;
                default:
                    ElMessage.error(res.err);
            }
            return res.data
        }
        return res;
    },
    (error: AxiosError) => {
        console.log(error)
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 401:
                    ElMessage.error('请重新登录');
                    break;
                case 403:
                    ElMessage.error('拒绝访问');
                    break;
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    ElMessage.error('请求失败');
            }
        } else if (error.request) {
            ElMessage.error('请求超时，请检查网络连接');
        } else {
            ElMessage.error('请求失败');
        }
        return Promise.reject(error);
    }
);

// 封装通用的请求方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    return service.request<T, T>(config);
};

// 导出封装的请求方法
export default request;
