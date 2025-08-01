<template>
    <Teleport to="body">
      <div class="loadingBox">
        <img :src="IMGurl" class="loadIMG">
        <div class="loadingText">{{ text }}</div>
    </div>
    </Teleport>

</template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    text: {
      type: String,
      default: ''
    },
    IMGurl: {
      type: String,
      default: "https://storage.mochiani.com/System/Mochi-Icon-Ani/mashu-loading.webp"
    }
  });
  
  </script>
    <style scoped>
    .loadingBox{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.438);
      z-index: 10000;
    }
    .loadIMG {
      transform: scaleX(-1); /* 镜像反转 */
      width: 220px;
      height: 200px;
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%) scaleX(-1); /* 注意合并 transform */
    }
    .loadingText{
      color: #fbfbfb;
      position: absolute;
      left: 50%;
      top: 55%;
      font-size: 20px;
      transform: translate(-50%,-50%);
    }
    </style>