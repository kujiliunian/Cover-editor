<template>
  <span class="mochiani-icon" v-html="fontName" :style="{fontSize:props.size+'px',color:props.color}"></span>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import fontJson from "@/utils/MSIconType.json"

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 16
  },
  color: {
    type: String,
    default: '#FBFBFB'
  }
})

const fontName = computed(() => {
  let icoName : string = props.name
  return fontJson[icoName as keyof typeof fontJson] 
})

</script>

<style scoped>

.mochiani-icon {
  font-family: 'AmsIcon';
}
</style>