<!-- src/views/Editor/layouts/header/left/AspectRatio.vue -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; // 引入 computed 和 onMounted
import ContextMenu from '@/components/contextMenu';
import { useEditor } from '@/views/Editor/app';
import { useActiveObjectModel } from "@/views/Editor/hooks/useActiveObjectModel";

const { canvas } = useEditor();

// 1. 将所有选项定义为一个数据数组
const aspectRatioOptions = ref([
  { label: '16:9', value: '16:9', width: 1179, height: 663 },
  { label: '3:4', value: '3:4', width: 963, height: 1284 },
  { label: '4:3', value: '4:3', width: 1179, height: 884 },
  { label: '1:1', value: '1:1', width: 1179, height: 1179 },
  { label: '9:16', value: '9:16', width: 722, height: 1284 },
  { label: "哔哩哔哩封面", value: '1179:738', width: 1179, height: 738 },
]);

// 2. 这个 ref 只存储当前选中的 `value`
const selectedValue = ref('3:4'); // 默认选中 '16:9'

// 3. 使用 computed 属性来获取用于显示的 label
const displayLabel = computed(() => {
  const selectedOption = aspectRatioOptions.value.find(
      (option) => option.value === selectedValue.value
  );
  // 如果找到了对应的选项，返回它的 label，否则返回空字符串或一个默认值
  return selectedOption ? selectedOption.label : '选择比例';
});

const width = useActiveObjectModel('width');
const height = useActiveObjectModel('height');

const setCanvasSize = (widthVal: number, heightVal: number) => {
  width.value.setValue(widthVal);
  height.value.setValue(heightVal);
};
import {usesize} from "@/store/modules/usersize";
let cavanssize=usesize()
watch(() => canvas?.contentFrame?.width, (newWidth) => {
  // 确保 canvas 和 newWidth 都有效
  if (!newWidth || !canvas.contentFrame) return;

  const currentWidth = newWidth;
  const currentHeight = canvas.contentFrame.height;

  console.log(`Watch triggered: 检测到画布尺寸变化 - 宽: ${currentWidth}, 高: ${currentHeight}`);

  const matchedOption = aspectRatioOptions.value.find(option =>
      option.width === currentWidth && option.height === currentHeight
  );

  if (matchedOption) {
    console.log(`匹配到预设: ${matchedOption.label}`);
    selectedValue.value = matchedOption.value;
    cavanssize.size=selectedValue.value
  } else {
    console.log('未匹配到任何预设，当前为自定义尺寸。');
    selectedValue.value = '3:4'; // 明确设置为 null
    setCanvasSize(963,1284)
  }
}, {
  immediate: true, // 4. 立即执行一次 watch，以处理初始状态
});
// 点击按钮，打开菜单
const openMenu = (e: MouseEvent) => {
  const buttonEl = e.currentTarget as HTMLElement;
  const rect = buttonEl.getBoundingClientRect();
  const x = rect.left;
  const y = rect.bottom + 4;

  ContextMenu.showContextMenu({
    x,
    y,
    preserveIconWidth: false,
    // 4. 通过 map 动态生成菜单项
    items: aspectRatioOptions.value.map(option => ({
      label: option.label,
      onClick: () => {
        // 更新 value
        selectedValue.value = option.value;
        cavanssize.size=selectedValue.value
        // 使用选项中的数据设置尺寸
        setCanvasSize(option.width, option.height);
      },
    })),
  });
};
</script>

<template>
  <a-button class="icon-btn px2!" @click="openMenu">
    <!-- 5. 绑定到 computed 属性 displayLabel -->
    {{ displayLabel }}
    <icon-down class="ml1" />
  </a-button>
</template>

<style scoped lang="less">
/* 如果需要，可以添加特定样式 */
</style>