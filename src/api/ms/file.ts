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
export function cloudList(pageSize:number,pageNum:number,keyword:string,parent_id:number,file_type:string,is_all:number,is_project:number,src_type:number){//管理空间的文件列表
    return  request({
        headers:{useFixedToken:false},
        url: '/v1/cloud/list',
        method: 'GET',
        params:{
            pageSize:pageSize,
            pageNum:pageNum,
            keyword:keyword,
            parent_id:parent_id,
            file_type:file_type,
            is_all:is_all,
            src_type,
            is_project:is_project
        }
    })
}