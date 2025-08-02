<!-- src/views/Editor/layouts/header/left/AspectRatio.vue -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; // 引入 computed 和 onMounted
import ContextMenu from '@/components/contextMenu';
import { useEditor } from '@/views/Editor/app';
import { useActiveObjectModel } from "@/views/Editor/hooks/useActiveObjectModel";
const { canvas,keybinding,undoRedo } = useEditor();

// 1. 将所有选项定义为一个数据数组
const aspectRatioOptions = ref([
  // { label: '16:9', value: '16:9', width: 1179, height: 663 },
  { label: '3:4', value: '3:4', width: 963, height: 1284 },
  // { label: '4:3', value: '4:3', width: 1179, height: 884 },
  // { label: '1:1', value: '1:1', width: 1179, height: 1179 },
  // { label: '9:16', value: '9:16', width: 722, height: 1284 },
  // { label: "哔哩哔哩封面", value: '1179:738', width: 1179, height: 738 },
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

const  setCanvasSize = async (widthVal: number, heightVal: number) => {
  undoRedo.disabledPropertyChangeWatch();
  width.value.setValue(widthVal);
  height.value.setValue(heightVal);
  undoRedo.reset();
  undoRedo.enablePropertyChangeWatch();
};
import {usesize} from "@/store/modules/usersize";
let cavanssize=usesize()
watch(() => canvas?.contentFrame?.width, (newWidth) => {
  if (!newWidth || !canvas.contentFrame) return;

  const currentWidth = Math.round(newWidth); // 使用 Math.round 避免浮点数精度问题
  const currentHeight = Math.round(canvas.contentFrame.height);

  const matchedOption = aspectRatioOptions.value.find(option =>
      option.width === currentWidth && option.height === currentHeight
  );

  // 如果能匹配到预设项
  if (matchedOption) {
    console.log(`匹配到预设: ${matchedOption.label}`);
    // 只有当当前选中的值和匹配到的值不同时，才更新
    if (selectedValue.value !== matchedOption.value) {
      selectedValue.value = matchedOption.value;
      cavanssize.size = selectedValue.value;
    }
  }
  // 如果不能匹配到预设项
  else {
    console.log(`未匹配到预设，将重置为默认值 3:4`);

    // 【核心修改】检查当前尺寸是否已经是你要设置的目标尺寸
    if (currentWidth !== 963 || currentHeight !== 1284) {

      // 因为我们要修改画布尺寸，这个操作需要被记录到历史记录中
      // 所以【不要】使用 disable/enable/reset 这一套！
      // 直接修改尺寸，让 undo/redo 服务去记录这个变化

      selectedValue.value = '3:4';
      setCanvasSize(963, 1284); // 这个操作会被 UndoRedoService 监听到并保存
      cavanssize.size = selectedValue.value;

    } else {
      // 如果尺寸已经是目标尺寸了，但 selectedValue 不对，只更新UI，不操作画布
      if (selectedValue.value !== '3:4') {
        selectedValue.value = '3:4';
        cavanssize.size = selectedValue.value;
      }
    }
  }
}, {
  immediate: true,
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