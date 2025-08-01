<template>
    <div id="text-list-wrap" style="margin-top: 0.5rem">
        <div class="basic-text-wrap">
            <div
                    v-for="(item, index) in basicTextList"
                    :key="index"
                    class="basic-text-item"
                    :style="{
                  fontSize: 14 + 'px',
                  fontWeight: item.json.fontWeight,
                }"
                    draggable="true"
                    @click="handleClick(item)"
            >
                {{ item.title }}
            </div>
        </div>
        <comp-list2-wrap :data="page.dataList" :no-more="page.noMore"
                         :option="{coverKey:'cover'}"
                         @fetch-data="fetchData"
                         @item-click="handleClick"
        >
        </comp-list2-wrap>
        <!--        <div class="other-text-wrap">-->
        <!--            -->
        <!--            <comp-list-wrap @fetchData="fetchData"-->
        <!--                            :config="config"-->
        <!--                            :data="page.dataList" :noMore="page.noMore" max-height="calc(100vh - 115px)">-->
        <!--                <template #item="{ item, url, index }">-->
        <!--                    <a-card hoverable @click="handleClick(item)" class="cursor-pointer drop-shadow" :body-style="{ padding: '0px' }">-->
        <!--                        <div class="">-->
        <!--                            <LazyImg :url="url" class="img" />-->
        <!--                        </div>-->
        <!--                        &lt;!&ndash;                      <div class="p5px">&ndash;&gt;-->
        <!--                        &lt;!&ndash;                          <span class="name truncated">{{ item.name }}</span>&ndash;&gt;-->
        <!--                        &lt;!&ndash;                      </div>&ndash;&gt;-->
        <!--                    </a-card>-->
        <!--                </template>-->
        <!--            </comp-list-wrap>-->
        <!--        </div>-->
    </div>
</template>

<script setup lang="ts">
import {Group, Text} from "leafer-ui";
import {useEditor} from "@/views/Editor/app";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompList2Wrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompList2Wrap.vue";
import {LazyImg} from "@/components/vue-waterfall-plugin-next";
import {queryTextMaterialList} from "@/api/editor/materials";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import HTMLText from "@/views/Editor/core/shapes/HTMLText2";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import {TextListType} from "@/views/Editor/layouts/panel/leftPanel/wrap/wrapType";

const {editor} = useEditor()
const NAME = 'text-list-wrap'
const config = {
    imgSelector: 'cover',
    gutter: 2,
    breakpoints: {
        1200: {
            // 当屏幕宽度小于等于1200
            rowPerView: 4
        },
        800: {
            // 当屏幕宽度小于等于800
            rowPerView: 3
        },
        500: {
            // 当屏幕宽度小于等于500
            rowPerView: 3
        }
    },
}
const basicTextList = ref<TextListType[]>([
    {
        title: '+ 添加普通文字',
        json: {
            tag: 'Text',
            text: '输入文本',
            fontSize: 40,
            fontWeight: 'normal',
        }
    },
    {
        title: '+ 添加富文本',
        json: {
            tag: 'HTMLText',
            name: '富文本',
            text: `<span style="font-size: 40px">输入文本</span>`,
            fontWeight: 'normal',
        }
    },
])
function downloadObjectAsJson(jsonObject: object, filename: string) {
  // 1. 将对象转换为格式化的JSON字符串
  // 使用 null, 2 参数可以让下载的JSON文件有缩进，更易读
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // 2. 创建一个Blob对象 (二进制大对象)
  // 'application/json' 是标准的JSON文件MIME类型
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 3. 创建一个指向该Blob的URL
  const url = URL.createObjectURL(blob);

  // 4. 创建一个临时的<a>标签用于下载
  const a = document.createElement('a');
  a.href = url;
  a.download = filename; // 设置下载的文件名

  // 5. 将<a>标签添加到页面并模拟点击
  // (添加到body是为了确保在所有浏览器中都能正常工作)
  document.body.appendChild(a);
  a.click();

  // 6. 清理工作，用完后即刻移除
  // 从页面中移除<a>标签
  document.body.removeChild(a);
  // 释放之前创建的URL对象，避免内存泄漏
  URL.revokeObjectURL(url);
}
const handleClick = (item: any) => {
    // editor.add(item.json)
    let text
    if (editor.objectIsTypes(item.json, 'Text')) {
        text = new Text({
            name: getDefaultName(editor.contentFrame),
            // draggable: true,
            editable: true,
            x: 0,
            y: 0,
            fill: [
                {
                    type: 'solid',
                    color: 'rgba(0,0,0,1)',
                },
            ],
            ...item.json,
        })
    } else if (editor.objectIsTypes(item.json, 'HTMLText')) {
        text = new HTMLText({
            name: getDefaultName(editor.contentFrame),
            editable: true,
            x: 0,
            y: 0,
            ...item.json,
        })
    } else {
        text = new Group(item.json)
    }

    console.log('text=', text)
    editor.add(text)
}
const {page} = usePageMixin()
page.pageSize = 30
const fetchData = () => {
    queryTextMaterialList(page).then(res => {
        if (res.success) {
          // downloadObjectAsJson(res.data, 'textMaterialList')
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

    // if (current.value <= 5) {
    //     data.push(...imageData.list)
    //     current.value += 1
    // } else {
    //     bottom.value = true
    // }
}
</script>

<style lang="less" scoped>
// Color variables (appears count calculates by raw css)
@color0: #3b74f1; // Appears 2 times

#text-list-wrap {
  .basic-text-wrap {
    padding: 10px;

    .basic-text-item {
      color: #33383e;
      background-color: #f1f2f4;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      border-top: 1px solid rgba(255, 255, 255, 0);
      // color: @color-black;
      padding: 10px 0;
      text-align: center;
      margin-bottom: 5px;

      &:hover {
        // background-color: rgba(0, 0, 0, 0.07);
        // border-bottom: 1px solid @color0;
        // border-top: 1px solid @color0;
      }
    }
  }
}
</style>
