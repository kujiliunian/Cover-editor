<!-- cloudSpace.vue -->
<template>
  <div class="wrap">
    <comp-cate-list-wrap
        :data="page.dataList"
        :cate-list="cateList"
    :current-cate="currentCate"
    :no-more="page.noMore"
    @fetch-data="loadList"
    @back-cate="backCate"
    @item-click="handleClick"
    @select-cate="selectCate"
    ></comp-cate-list-wrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useEditor } from "@/views/Editor/app";
import { Image } from "leafer-ui";
import { getDefaultName } from "@/views/Editor/utils/utils";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import { queryGraphCategory, queryGraphList } from "@/api/editor/materials";
// import SearchHeader from "@/components/editorModules/searchHeader.vue"; // 确保导入了 SearchHeader
// import axios from "axios"; // 如果没用到可以移除
import { cloudList } from "@/api/ms/file";
// import { material_coverlist } from "@/api/ms/project"; // 如果没用到可以移除
// import { keys } from "lodash"; // 如果没用到可以移除


const { editor } = useEditor();

const keyword = ref(''); // 初始值最好是字符串
const currentCate = ref(null);
// 将 cateList 初始值设置为一个空数组，与 fullTransformation 的输出保持一致
const cateList = ref([]);

// 原始转换函数 - 将对象分类转换为数组
function transformData(originalData: any) {
  if (typeof originalData !== 'object' || originalData === null) {
    console.error("transformData: 输入的数据不是一个有效的对象。");
    return [];
  }
  const categories = Object.keys(originalData);

  const transformedArray = categories.map((categoryName, index) => {
    const list = originalData[categoryName];

    return {
      name: categoryName,
      id: index + 1, // 确保有id
      list: list,
    };
  });
  return transformedArray;
}

// 新转换函数 - 转换资源对象的字段
function transformResourceData(resourceList: any[]) {
  if (!Array.isArray(resourceList)) {
    console.error("transformResourceData: 输入的数据不是一个有效的数组。");
    return [];
  }
  return resourceList.map(resource => ({
    type: resource.type || 'image',
    thumb: resource.thumbnail_path || resource.preview, // 根据你的数据结构，可能是 thumbnail_path
    url: resource.file_path || resource.resource, // 根据你的数据结构，可能是 file_path
    width:  100, // 这些值可能需要根据实际需求从资源对象中获取
    height:  100 // 否则可能会导致图片显示比例不正确
  }));
}

// 完整转换流程
function fullTransformation(originalData: any) {
  // 第一步：按分类转换
  const categorizedData = transformData(originalData);

  // 第二步：转换每个分类中的资源对象
  return categorizedData.map(category => ({
    ...category,
    // 对 category.list 再次进行 transformResourceData 转换
    list: transformResourceData(category.list)
  }));
}

const onSearch = (value, ev) => {
  console.log('value=', value);
  console.log('keyword=', keyword.value);
  console.log('ev=', ev);
};

const { page } = usePageMixin();
page.pageSize = 30;

const fetchData = async () => {
  try {
    const res = await cloudList(1000, 1, "", 0, "file", 1, 0, 1);
    console.log("API 响应:", res);

    if (res.code === 200 && res.data && Array.isArray(res.data.list)) {
      // 临时构建一个符合 fullTransformation 期望的原始数据结构
      let rawCategorizedData = {
        个人空间: []
      };
      for (let i = 0; i < res.data.list.length; i++) {
        const item = res.data.list[i];
        // 原始API返回的数据结构，fullTransformation 会处理这些字段
        let rawItem = {
          "type": "image",
          "thumbnail_path": item.thumbnail_path || '',
          "file_path": item.file_path || ''
        };
        rawCategorizedData.个人空间.push(rawItem);
      }

      // 使用 fullTransformation 将原始分类数据转换成 CompCateListWrap 期望的数组结构
      cateList.value = fullTransformation(rawCategorizedData);
      console.log("处理后的 cateList (array 结构):", cateList.value);
    } else {
      console.warn("API 响应不符合预期或 data.list 为空/无效:", res);
      cateList.value = []; // 设置一个安全的空数组
    }
  } catch (error) {
    console.error("获取云列表数据失败:", error);
    cateList.value = []; // 发生错误时，也设置一个安全的空数组
  }
};
/**
 * 从图片 URL 获取图片的宽度和高度。
 * @param {string} imageUrl 图片的 URL。
 * @returns {Promise<{width: number, height: number}>} 一个 Promise，解析为包含图片宽度和高度的对象。
 */
function getImageDimensionsFromUrl(imageUrl:string) {
  return new Promise((resolve, reject) => {
    // 明确使用全局的 Image 构造函数，而不是任何导入的 Image 类型
    const img = new (window.Image || globalThis.Image)();
    // 也可以直接写 new Image()，但为了明确性，加上 window. 或 globalThis. 更好

    // TypeScript 可能会抱怨 img.onload，此时可以进行类型断言
    const htmlImgElement = img as HTMLImageElement;

    htmlImgElement.onload = () => {
      resolve({
        width: htmlImgElement.naturalWidth,
        height: htmlImgElement.naturalHeight
      });
    };

    htmlImgElement.onerror = (error) => {
      reject(new Error(`无法加载图片或获取尺寸: ${imageUrl}. 错误: ${error}`));
    };

    htmlImgElement.src = imageUrl;

    // 如果图片已经加载完成（可能是缓存），onload 可能不会触发
    if (htmlImgElement.complete && htmlImgElement.naturalWidth > 0) {
      resolve({
        width: htmlImgElement.naturalWidth,
        height: htmlImgElement.naturalHeight
      });
    }
  });
}
const handleClick = (item) => {
  console.log( item);
  getImageDimensionsFromUrl(item.url)
      .then(dimensions => {
        console.log(`图片的宽度: ${dimensions.width}px`);
        console.log(`图片的高度: ${dimensions.height}px`);
        let ta=1
        if(dimensions.width>dimensions.height){
          ta=600/dimensions.width
        }else{
          ta=600/dimensions.height
        }
        const image = new Image({
          name: getDefaultName(editor.contentFrame),
          editable: true,
          x: 0,
          y: 0,
          thumb: item.thumb,
          url: item.url,
          width: dimensions.width*ta,
          height: dimensions.height*ta,// item 现在包含了 url, thumb, width, height 等属性
        });
        editor.add(image);
      })
      .catch(error => {
        console.error(error);
      });

};

const backCate = () => {
  currentCate.value = null;
  page.dataList = [];
};

const selectCate = (cate) => {
  currentCate.value = cate;
  page.query.categoryId = cate.id; // currentCate 现在会是一个包含 id 的对象
  page.pageNum = 1;
  page.noMore = false;
  loadList(); // 选中分类后应该加载列表
};

const loadList = () => {
  if (!currentCate.value || !currentCate.value.id) {
    console.warn("未选择分类或分类ID无效，无法加载列表。");
    return;
  }
  page.query.categoryId = currentCate.value.id;
  queryGraphList(page).then(res => {
    console.log("图表列表响应:", res);
    if (res.success) {
      const newDataList = res.data.records;
      if (newDataList && newDataList.length > 0) {
        // 对newDataList中的每个item也进行必要的转换，确保与handleClick期望的item结构一致
        const transformedNewDataList = newDataList.map(item => ({
          type: item.type || 'image', // 假设有type，否则默认image
          thumb: item.thumbnail_path || '',
          url: item.file_path || '',
          width: item.width || 100, // 从数据中获取或给默认值
          height: item.height || 100, // 从数据中获取或给默认值
          // ...其他需要的属性
        }));
        page.dataList.push(...transformedNewDataList);
        page.pageNum += 1;
      }
      if (page.dataList.length >= res.data.total) {
        page.noMore = true;
      } else {
        page.noMore = false;
      }
    } else {
      console.warn("获取图表列表失败:", res);
    }
  }).catch(error => {
    console.error("获取图表列表时发生错误:", error);
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>