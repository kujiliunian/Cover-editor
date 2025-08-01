<template>
    <div class="wrap">
<!--        <search-header :cateList="cateList" v-model="keyword" @changeCate="changeCate" @search="onSearch"/>-->
        <comp-cate-list-wrap :data="page.dataList" :cate-list="cateList" :current-cate="currentCate" :no-more="page.noMore"
                             @fetch-data="loadList"
                             @back-cate="backCate"
                             @item-click="handleClick"
                             @select-cate="selectCate"
        ></comp-cate-list-wrap>
    </div>
</template>

<script lang="ts" setup>

import {useEditor} from "@/views/Editor/app";
import {Image} from "leafer-ui";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryGraphCategory,queryGraphList} from "@/api/editor/materials";
import SearchHeader from "@/components/editorModules/searchHeader.vue";
import axios from "axios";
const {editor} = useEditor()

const keyword = ref();
const currentCate = ref(null);
const cateList = ref([])
// 原始转换函数 - 将对象分类转换为数组
function transformData(originalData: any) {
  if (typeof originalData !== 'object' || originalData === null) {
    console.error("输入的数据不是一个有效的对象。");
    return [];
  }

  const categories = Object.keys(originalData);

  const transformedArray = categories.map((categoryName, index) => {
    const list = originalData[categoryName];

    return {
      name: categoryName,
      id: index + 1,
      list: list,
    };
  });

  return transformedArray;
}

// 新转换函数 - 转换资源对象的字段
function transformResourceData(resourceList: any[]) {
  if (!Array.isArray(resourceList)) {
    console.error("输入的数据不是一个有效的数组。");
    return [];
  }

  return resourceList.map(resource => ({
    type: resource.type || 'image',
    thumb: resource.preview,
    url: resource.resource,
    width:  100,
    height:  100
  }));
}

// 完整转换流程
function fullTransformation(originalData: any) {
  // 第一步：按分类转换
  const categorizedData = transformData(originalData);

  // 第二步：转换每个分类中的资源对象
  return categorizedData.map(category => ({
    ...category,
    list: transformResourceData(category.list)
  }));
}
const onSearch = (value,ev) => {
    console.log('value=',value)
    console.log('keyword=',keyword.value)
    console.log('ev=',ev)
}
const { page } = usePageMixin()
page.pageSize = 30
let urljson="https://storage.mochiani.com/System/cover_resources.json"
const fetchData = async () => {
  const response = await fetch(urljson);
  console.log(response)
  const json = await response.json();
  console.log(json)
  const transformedRecords = fullTransformation(json);
  console.log(transformedRecords)
  cateList.value = transformedRecords
  // console.log(json)
  // cateList.value = json
  queryGraphCategory().then(res =>{
    console.log('res=',res)

    // downloadObjectAsJson(res,"aaaa.json")
    //   if (res.success) {
    //       const list = res.data.records
    //       cateList.value = list
    //   }
  })
}
const handleClick = (item) => {
    const image = new Image({
        name:getDefaultName(editor.contentFrame),
        editable: true,
        x:0,
        y:0,
        ...item,
    })
    editor.add(image)
}
const backCate = () => {
    currentCate.value = null
    page.dataList = []
}
const selectCate = (cate) => {
    currentCate.value = cate
    page.query.categoryId = cate.id
    page.pageNum = 1
    page.noMore = false
    // loadList()
}
const loadList = () => {
    page.query.categoryId = currentCate.value.id
    queryGraphList(page).then(res =>{
      console.log(res)
        if (res.success) {
            const newDataList = res.data.records
            if (newDataList.length > 0) {
                page.dataList.push(...newDataList)
                page.pageNum += 1
            }
            if (page.dataList.length >= res.data.total) {
                page.noMore = true
            } else {
                page.noMore = false
            }
        }
    })
}
fetchData()
</script>
