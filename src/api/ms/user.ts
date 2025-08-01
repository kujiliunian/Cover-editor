import request from '@/utils/msrequest';
import {encryptedRequest} from '@/utils/AES'
export function updateuser(nick_name:string,avatar:string){//修改用户信息
    let redata={ 
        "nick_name": nick_name,
        "avatar":avatar
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/upd',
        method: 'POST',
        data:{
         code:encryptedData
        }
      })
}

export function getUserInfo(){//获取用户信息
    return  request({
        url: '/mochi_user/info',
        method: 'GET',
      })
}

export function get_address(){//获取用户的当前IP
    return  request({
        url: '/common/get_address',
        method: 'GET',
    })
}
export function faq_list(faqType: number){//获取常见问题
    return  request({
        url: '/announcement/faq_list',
        method: 'GET',
        params:{
            faqType
        }
    })
}
export function upd_works(id:number,works_name:string,scale_size:string){//修改作品信息
    let redata={
        works_name,scale_size,works_desc:"",id
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/upd_works',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function add_account_link(){
    let redata={ 
    
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/invitation_link/add_account_link',
        method: 'POST',
        data:{
         code:encryptedData
        }
      })
}
export function copy_works(works_id:number){
    let redata={
        works_id
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/project/copy_works',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}

export function addfeedback(typ:number,content:string,comment_image:string){//反馈
    // let redata={
    //
    // }
    // let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/v1/feedback/add',
        method: 'POST',
        data:{
            typ,content,comment_image
        }
    })
}
export function user_coupon(){///用户卡包
    return  request({
        url: '/v1/coupon/user_coupon',
        method: 'GET',

    })
}
export function getMadouFlowList(pageNum:number,beginTime:string,endTime:string,flowType:string,fluctuateType:string){//获取麻豆流水
    return  request({
        url: '/mochi_user/madou_flow_list',
        method: 'GET',
        params:{
            pageNum: pageNum,
            pageSize:20,
            beginTime:beginTime,
            endTime:endTime,
            flowType:flowType,
            fluctuateType:fluctuateType
        }
      })
}

export function getPayment_info(){//获取收款信息
    return  request({
        url: '/mochi_user/payment_info',
        method: 'GET'
    })
}
export function payment_flow_list(beginTime:number,endTime:number,payment_status:number,payment_sn:string){//获取提现列表
    return  request({
        url: '/mochi_user/payment_flow_list',
        method: 'GET',
        params:{
            pageNum:1,
            pageSize:20000,
            beginTime,
            endTime,
            payment_status,
            payment_sn
        }
    })
}
export function getshutiao_info(){//获取薯条信息
    return  request({
        url: '/mochi_user/shutiao_info',
        method: 'GET'
    })
}
export function initialize(){//每日领取麻豆
    return  request({
        url: '/mochi_user/initialize',
        method: 'GET'
    })
}
export function upd_payment(payment_name:string,payment_number:string,payment_card:string,phone:string,phone_code:string,is_agreement:number){//保存提现收款信息
    let redata={
        payment_name,payment_number,payment_card,phone,phone_code,is_agreement
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/upd_payment',
        method: 'POST',
        data:{
           code:encryptedData
        }
    })
}
export function withdrawal_payment(shutiao_count:number,payment_id:number,is_agreement:number){//申请提现
    let redata={
        shutiao_count,is_agreement,payment_id
    }
    console.log(redata)
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/withdrawal_payment',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function getinvite_list(beginTime:number,endTime:number){//获取被邀请人信息
    return  request({
        url: '/mochi_user/invite_list',
        method: 'GET',
        params:{
            pageNum:1,
            pageSize:20,
            beginTime:beginTime,
            endTime:endTime
        }
    })
}
export function send_payment(payment_name:string,payment_number:string,payment_card:string,phone:string,is_agreement: number){//提现信息编辑发送验证码
    let redata={
        payment_name,payment_number,payment_card,phone,is_agreement
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/send_payment',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function confirm_payment(phone_code:string){//提现信息编辑提交
    let redata={
        phone_code
    }
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/confirm_payment',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}
export function upd_payment_info(phone_code:string,payment_name:string,payment_number:string,phone:string){//提现信息编辑修改
    let redata={
        phone_code,payment_name,payment_number,phone
    }
    console.log(redata)
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/mochi_user/upd_payment_info',
        method: 'POST',
        data:{
            code:encryptedData
        }
    })
}

export function start_payment(phone_code:string){//首次绑定验证验证码
    return  request({
        url: '/mochi_user/start_payment',
        method: 'POST',
        data:{
            phone_code
        }
    })
}

export function join_link_info(code:string,cloud_id: number,is_project: number){
    let redata={
        code,cloud_id,is_project
    }
    console.log(redata)
    let encryptedData= encryptedRequest(redata)
    return  request({
        url: '/invitation_link/join_link_info',
        method: 'POST',
        data:{
           code:encryptedData
        }
    })
}