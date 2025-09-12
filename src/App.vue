<script setup lang="ts">
import {onMounted,onBeforeUnmount} from "vue";

const blockBack = () => {
  // 每次用户点击返回，其实就触发 popstate
  // 我们再 pushState 把当前地址重新压回去
  history.pushState(null, '', location.href)
  alert('此页面禁止返回')
}

onMounted(() => {
  // 进入页面时先压一次，防止直接能返回
  history.pushState(null, '', location.href)
  // 监听浏览器返回事件
  window.addEventListener('popstate', blockBack)
})

onBeforeUnmount(() => {
  // 离开时移除监听，避免影响其他页面
  window.removeEventListener('popstate', blockBack)
})
</script>

<template>
    <a-config-provider>
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </a-config-provider>
</template>

<style scoped>

</style>
