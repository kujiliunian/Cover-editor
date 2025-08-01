import request from '@/utils/msrequest';
import {encryptedRequest} from '@/utils/AES'
export function getProjectlist(pageNum:number){//获取项目列表
    return  request({
        url: 'project/list',
        method: 'GET',
        params:{
            pageNum: pageNum,
            pageSize:20,
        }
      })
}
export function material_coverlist(pageNum:number,src_size_title:string){//获取模版列表
    return  request({
        url: '/material_cover/list',
        method: 'GET',
        params:{
            pageNum: pageNum,
            pageSize:20,
            src_size_title
        }
    })
}
export function material_fontlist(pageNum:number){//获取字体列表
    return  request({
        headers:{useFixedToken:false},
        url: '/material_font/list',
        method: 'GET',
        params:{
            pageNum,
            pageSize:1000
        }
    })
}

export function upd_preview(id:number,preview_info:string,project_logo:string){//创建项目
    let redata={
        id,
        preview_info,
        project_logo
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/upd_preview',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function createProject(project_logo:string,project_name:string,project_desc:string,preview_info:string){//创建项目
    let redata={ 
        project_logo:project_logo,
        project_name:project_name,
        project_desc:project_desc,
        preview_info:preview_info
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/add',
        method: 'POST',
        data:{
           code:encryptedData
        }
      })
}
export function getProjectInfo(id:number){//获取项目信息
    return  request({
        url: '/project/info',
        method: 'GET',
        params:{
            id
        }
    })
}
export function delSMS(phone:string){//删除项目发送短信
    let redata={ 
        phone:phone
    }
    let encryptedData= encryptedRequest(redata)
    return request({
        url:"/project/del_sms",
        method:"POST",
        data:{
           code:encryptedData
        }
    })
}
export function deleteProject( id: number,phone:string,code:string){//删除项目
    let redata={ 
        id:id,
        phone:phone,
        code:code,
    }
    let encryptedData= encryptedRequest(redata)
    return request({
        url:"/project/del",
        method:"POST",
        data:{
          code:encryptedData
        }
    })
}
export function updateProjectInfo( id: number,project_logo:string,project_name:string,project_desc: string){//修改项目信息
    let redata={ 
        id:id,
        project_logo:project_logo,
        project_name:project_name,
        project_desc:project_desc,
    }
    let encryptedData= encryptedRequest(redata)
    return request({
        url:"/project/upd",
        method:"POST",
        data:{
          code:encryptedData
        }
    })
}
export function projectListAccount(project_id:string,pageNum:number){//项目用户列表
    return  request({
        url: '/project/list_account',
        method: 'GET',
        params:{
            pageNum: pageNum,
            project_id:project_id,
            pageSize:20,
        }
      })
}
export function projectUpd_account(id:number, project_id: number,remark:string,role:number){//项目用户编辑
    let redata={ 
        "id": id,
        project_id:project_id,
        remark:remark,
        role:role
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/upd_account',
        method: 'POST',
        data:{
         code:encryptedData
        }
      })
}
export function projectdel_account(id:number, project_id: number){//项目用户删除
    let redata={
        "id": id,
        project_id:project_id,
    }
    console.log(redata)
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/del_account',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function getList_works(project_id:string,pageNum:number,is_del:number){//获取作品列表
    return  request({
        url: '/project/list_works',
        method: 'GET',
        params:{
            pageNum: pageNum,
            project_id:project_id,
            is_del:is_del,
            pageSize:20,
        }
      })
   
}
export function projectAddWorks(project_id: number,works_name:string,scale_size:string){//项目创建作品
    let redata={ 
        "project_id": project_id,
        "works_name":works_name,
        "scale_size":scale_size
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/add_works',
        method: 'POST',
        data:{
          code:encryptedData
        }
      })
}
export function getList_works_dow(works_id:number,pageNum:number){//获取作品下载历史
    return  request({
        url: '/project/list_works_dow',
        method: 'GET',
        params:{
            pageNum: pageNum,
            works_id:works_id,
            pageSize:20,
        }
      })
   
}
export function projectDelWorks(id: number){//删除作品至回收站
    let redata={ 
        "id": id,
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/del_works',
        method: 'POST',
        data:{
         code:encryptedData
        }
      })
}
export function projectRecover_works(id: number){//回收站恢复
    let redata={ 
        "id": id,
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/recover_works',
        method: 'POST',
        data:{
            code:encryptedData
        }
      })
}
export function projectDel_clear_works(id: number){//回收站彻底删除
    let redata={ 
        "id": id,
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/del_clear_works',
        method: 'POST',
        data:{
           code:encryptedData
        }
      })
}
