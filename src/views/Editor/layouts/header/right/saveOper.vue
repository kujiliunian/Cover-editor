<template>
    <a-space>
<!--        <a-button href="https://gitee.com/sourcenet/gzm-design"-->
<!--                  target="_blank"-->
<!--                  type="text"-->
<!--                  class="!underline underline-offset-5 p-l-5px p-r-5px">-->
<!--            <ali-icon type="icon-gitee" class="mr4px text-size-18px"/>Gitee-->
<!--        </a-button>-->
<!--        <a-button href="https://github.com/LvHuaiSheng/gzm-design"-->
<!--                  target="_blank"-->
<!--                  type="text"-->
<!--                  class="!underline underline-offset-5 p-l-5px p-r-5px">-->
<!--            <ali-icon type="icon-github" class="mr3px text-size-18px"/>GitHub-->
<!--        </a-button>-->
      <AspectRatio/>
        <a-divider direction="vertical" />
        <zoom/>
<!--        <a-button @click="preview()">-->
<!--            <template #icon>-->
<!--                <icon-eye />-->
<!--            </template>-->
<!--            预览-->
<!--        </a-button>-->
<!--        <a-button type="primary" @click="save()">-->
<!--            <template #icon>-->
<!--                <icon-save />-->
<!--            </template>-->
<!--            保存-->
<!--        </a-button>-->
<!--        <a-dropdown-button  @select="handleSelect" @click="handleDownload()" style="background-color: red!important;">-->
<!--            <icon-download class="m-r-8px"/>下载作品-->
<!--            <template #icon>-->
<!--                <icon-down/>-->
<!--            </template>-->
<!--            <template #content>-->
<!--                <a-doption value="json">另存为JSON</a-doption>-->
<!--            </template>-->
<!--        </a-dropdown-button>-->
<!--      <ms-button-->
<!--          size="mini"-->
<!--          @click="saveModle()"-->

<!--      >保存</ms-button>-->
      <msLoading :text="msLoadingText" v-if="msLoadingText!=''"/>
      <ms-button
          style="min-width: 83px"
              type="primary"
              size="mini"
              @click="handleDownload()"
             
      >下载封面</ms-button>
      <ms-button
          style="min-width: 83px"
          type="primary"
          size="mini"
          @click="handleSelect('json')"
          v-if="is_gm!=0"
      >下载JSON</ms-button>
      <ms-button
          style="min-width: 63px"
          size="mini"
          @click="backProject()"

      >仅返回</ms-button>
      <ms-button
          style="min-width: 93px"
          v-if="userInfo.permission==0"
          size="mini"
          @click="saveModle()"

      >保存并返回</ms-button>

    </a-space>

    <a-image-preview
            :src="previewUrl"
            v-model:visible="visiblePreview"
    />
    <a-modal v-model:visible="exportVisible" title="下载作品" @ok="handleExport()" width="600px" :top="50" :align-center="false">
        <a-form ref="formRef" :model="exportForm" :rules="rules">
            <a-form-item field="fileType" label="导出文件类型">
                <a-radio-group v-model="exportForm.fileType" type="button" :options="exportFileTypes"></a-radio-group>
            </a-form-item>
            <a-form-item field="quality" label="图片质量"  v-if="['jpg','webp'].includes(exportForm.fileType)">
                <a-space>
                    <a-radio-group v-model="exportForm.quality" type="button" :options="scQtaRate"></a-radio-group>
                    <a-input-number v-model="exportForm.quality" mode="button" style="width: 120px" :max="1" :step="0.1" :min="0.1" placeholder="1"></a-input-number>
                </a-space>
            </a-form-item>
            <a-form-item field="scale" label="缩放比例" extra="可用于生成小尺寸的缩略图">
                <a-space>
                    <a-radio-group v-model="exportForm.scale" type="button" :options="scQtaRate"></a-radio-group>
                    <a-input-number v-model="exportForm.scale" mode="button" style="width: 120px" :max="1" :step="0.1" :min="0.1" placeholder="1"></a-input-number>
                </a-space>
            </a-form-item>
            <a-form-item field="pixelRatio" label="像素比" extra="可导出适配高清屏的2倍图、3倍图">
                <a-input-number v-model="exportForm.pixelRatio" allow-clear hide-button style="width: 200px" placeholder="默认为1倍图">
                    <template #suffix>
                        倍
                    </template>
                </a-input-number>
            </a-form-item>
            <a-form-item field="trim" label="裁剪透明像素">
                <a-switch type="round" v-model="exportForm.trim">
                    <template #checked>
                        是
                    </template>
                    <template #unchecked>
                        否
                    </template>
                </a-switch>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import MsLoading from "@/components/msLoading/msLoading.vue";

const router = useRouter()
import {useEditor} from "@/views/Editor/app";
import msButton from "@/components/msButton/msButton.vue";
const {editor,keybinding} = useEditor()
import {downFile} from "@/utils/designUtil.js";
import {v4 as uuidv4} from "uuid";
import {Notification} from "@arco-design/web-vue";
import {upd_preview} from "@/api/ms/project";
import {uploadFile} from "@/utils/minio";
import NP from "number-precision";
let msLoadingText=ref("")
const visiblePreview = ref(false)
const previewUrl = ref()
const userInfo=usesize()
const exportFileTypes = reactive([
    {value: 'jpg', label: 'JPG'},
    {value: 'png', label: 'PNG'},
    {value: 'webp', label: 'WEBP'},
])
const scQtaRate = reactive([
    {value: 1, label: '正常'},
    {value: 0.7, label: '0.7倍'},
    {value: 0.5, label: '0.5倍'},
    {value: 0.3, label: '0.3倍'},
    {value: 0.1, label: '0.1倍'},
])
const exportVisible = ref(false)
const exportForm = ref({
    fileType:'jpg',
    quality: 1,
    scale: 1,
    pixelRatio: 1,
    trim: false,
});
const rules = {

}
const resetForm = () => {
    exportForm.value = {
        fileType:'jpg',
        quality: 1,
        scale: 1,
        pixelRatio: 1,
        trim: false,
    }
}
const backProject=()=>{
  // if(window.location.hostname.indexOf("mochiani.com") > 0 ){
    const route = router.currentRoute.value;
    if(route.query.id){
      window.location.href = "/home?id="+route.query.id
    }
    console.log(route.query.id)


  // }else{
  //   const route = router.currentRoute.value;
  //   if(route.query.id){
  //   window.location.href = "http://localhost:5175/index/myWork?id="+route.query.id
  //   }
  // }
}
const preview = async () => {
    const result = await editor.contentFrame.export('png', {blob: true})
    const url = URL.createObjectURL(result.data);
    previewUrl.value = url
    visiblePreview.value = true
}
const save = () => {
    Notification.info({
        closable:true,
        content:'请到控制台查看打印的JSON值'
    })
    console.log('多页面JSON：',editor.getPages())
    editor.getCurrentPage()
    let json = editor.contentFrame.toJSON()
    console.log('当前页JSON：',json)
}

const handleDownload = () => {
    resetForm()
    exportVisible.value = true
}

const handleExport = () => {
    let fileName = uuidv4()
    editor.contentFrame.export(`${fileName}.${exportForm.value.fileType}`,exportForm.value)
}

const handleSelect = (v) => {
    let fileName = uuidv4()
    switch (v) {
        case 'png':
            editor.contentFrame.export(fileName + '.png')
            break
        case 'jpg':
            editor.contentFrame.export(fileName + '.jpg')
            break
        case 'webp':
            editor.contentFrame.export(fileName + '.webp')
            break
        case 'json':
            saveJson()
            break
        default:
            editor.contentFrame.export(fileName + '.jpg')
            break
    }
};
// saveOper.vue

// ... 其他 import ...
import { ILeaf } from '@leafer-ui/interface';
import {ElMessage} from "element-plus";
import {getUserInfo} from "@/api/ms/user";
import {usesize} from "@/store/modules/usersize";
import Zoom from "@/views/Editor/layouts/header/left/zoom.vue";
import AspectRatio from "@/views/Editor/layouts/header/left/aspectRatio.vue"; // 导入 leafer 的类型
let is_gm=ref(0)
onMounted(()=>{
  getUserInfo().then((res)=>{
    is_gm.value=res.data.is_gm
  })
})
// ...

/**
 * 递归遍历 leafer 树，查找并上传所有 blob URL。
 * @param leaf - 当前遍历的节点 (ILeaf)
 * @returns 返回一个 Promise 数组，每个 Promise 代表一个上传任务
 */
function findAndUploadBlobs(leaf: ILeaf): Promise<void>[] {
  let uploadPromises: Promise<void>[] = [];

  // 检查当前节点是否有需要上传的 blob url
  if (leaf.url && typeof leaf.url === 'string' && leaf.url.startsWith('blob:')) {
    console.log(`发现 blob URL，准备上传: ${leaf.url}`);

    // 创建一个 Promise 来处理这个节点的上传和替换过程
    const uploadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // 1. 使用 fetch 获取 blob 数据
        const response = await fetch(leaf.url);
        const blobData = await response.blob();

        // 2. 准备上传
        const fileName = `asset-${uuidv4()}.png`; // 假设 blob 都是图片，可以根据 blobData.type 改进

        // 3. 调用你的 uploadFile 方法
        const permanentUrl = await uploadFile(
            fileName,
            { file: blobData }, // 注意这里传的是 blobData
            // @ts-ignore
            ({ progress, speed }) => {},
            "assets" // 建议为这些资源指定一个单独的目录，如 "assets"
        );

        // 4. 关键：直接修改 leafer 对象的 url 属性
        leaf.url = permanentUrl;

        resolve(); // 这个文件的处理完成了
      } catch (error) {
        reject(error); // 如果失败，则拒绝 Promise
      }
    });

    uploadPromises.push(uploadPromise);
  }

  // 如果当前节点有子节点，递归遍历
  if (leaf.children && leaf.children.length > 0) {
    leaf.children.forEach(child => {
      // 将子节点返回的 Promise 合并到主数组中
      uploadPromises = uploadPromises.concat(findAndUploadBlobs(child));
    });
  }

  return uploadPromises;
}


async function saveModle() {
  try {
    // Notification.info({
    //   id: 'saving-template',
    //   title: '正在保存模板...',
    //   content: '处理资源链接中...',
    //   duration: 0,
    // });
    //
    // // ================== 核心逻辑开始 ==================
    msLoadingText.value="正在保存模板..."
    // 1. 递归遍历整个画布，找到所有 blob URL 并启动上传
    const allUploads = findAndUploadBlobs(editor.contentFrame);

    if (allUploads.length > 0) {
      console.log(`共找到 ${allUploads.length} 个资源需要上传。`);
      // 2. 等待所有上传任务完成
      await Promise.all(allUploads);
      console.log('所有资源链接已替换完成！');
    } else {
      console.log('未找到需要上传的 blob 资源。');
    }

    // 3. 在所有 URL 都被替换后，现在可以安全地导出最终的 JSON
    const finalJson = editor.contentFrame.toJSON();
    console.log('处理后的画布 JSON 数据:', finalJson);

    // ================== 核心逻辑结束 ==================

    // --- 接下来的逻辑与之前生成预览图的逻辑相同 ---


    const frame = editor.contentFrame;
    const originalWidth = frame.width;
    const originalHeight = frame.height;
    const shorterSide = Math.min(originalWidth, originalHeight);
    let scale = 1;
    if (shorterSide > 200) {
      scale = NP.divide(200, shorterSide);
    }
    const previewResult = await frame.export('webp', { blob: true, scale: scale });

    if (!previewResult || !previewResult.data) {
      msLoadingText.value=""
      throw new Error('导出预览图失败，未返回数据。');
    }

    const previewFileName = `preview-${uuidv4()}.webp`;
    const previewFile = new File([previewResult.data], previewFileName, { type: 'image/webp' });

    console.log('成功生成预览图 File 对象:', previewFile);
    let previewFileurl=await uploadFile(
        previewFileName,
        { file: previewResult.data },
        // @ts-ignore
        ({ progress, speed }) => {},
        "assets"
    );

    const route = router.currentRoute.value;
    msLoadingText.value="正在保存..."
    if(route.query.id){
      upd_preview(Number(route.query.id),JSON.stringify(finalJson),previewFileurl).then(res=>{
        if(res.code==200){
          msLoadingText.value=""
         ElMessage.success('保存成功');
         backProject()
        }else{
          msLoadingText.value =""
        }
      })
    }else{
      msLoadingText.value =""
    }



  } catch (error) {
    console.error('保存模板过程中出错:', error);
    msLoadingText.value =""
  }
}
async function saveJson() {
  const dataUrl = editor.contentFrame.toJSON();
  try {
    // Notification.info({
    //   id: 'saving-template',
    //   title: '正在保存模板...',
    //   content: '处理资源链接中...',
    //   duration: 0,
    // });
    //
    // // ================== 核心逻辑开始 ==================
    msLoadingText.value = "正在下载json..."
    // 1. 递归遍历整个画布，找到所有 blob URL 并启动上传
    const allUploads = findAndUploadBlobs(editor.contentFrame);

    if (allUploads.length > 0) {
      console.log(`共找到 ${allUploads.length} 个资源需要上传。`);
      // 2. 等待所有上传任务完成
      await Promise.all(allUploads);
      console.log('所有资源链接已替换完成！');
    } else {
      console.log('未找到需要上传的 blob 资源。');
    }

    // 3. 在所有 URL 都被替换后，现在可以安全地导出最终的 JSON
    const finalJson = editor.contentFrame.toJSON();
    console.log('处理后的画布 JSON 数据:', finalJson);

    // ================== 核心逻辑结束 ==================
    console.log(finalJson);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(finalJson, null, '\t')
    )}`;
    downFile(fileStr, `${uuidv4()}.json`);
    msLoadingText.value =""

  } catch (error) {

  }

}
</script>

<style scoped>

</style>
