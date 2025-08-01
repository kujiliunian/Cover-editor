import request from '@/utils/msrequest';
export function get_minio_url(file_url:string){//minioURL上传
    return  request({
        url: '/common/get_minio_url',
        method: 'POST',
        data:{
            file_url
        }
    })
}
export function get_sts(){//获取sts临时凭证
    return  request({
        headers:{useFixedToken:false},
        url: 'common/get_sts',
        method: 'GET',
        
      })
}
export function get_minio_sts(){//获取miniosts临时凭证
  return  request({
      headers:{useFixedToken:false},
      url: '/common/get_minio_sts',
      method: 'GET',
      
    })
}
