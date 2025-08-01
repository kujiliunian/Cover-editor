<template>
  <div class="btn-con">
    <button
        v-prevent-reclick
        type="button"
        :class="['custom-button', type, size, { disabled: disabled, loading: loading }]"
        :disabled="disabled || loading"
        @click="handleClick"
    >
      <span v-if="loading" class="loading-spinner"></span>
      <MSIcon :name="icon" v-if="icon" style="margin-right: 10px;"></MSIcon>
      <slot style="position: absolute"></slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import MSIcon from '../msIcon/MSIcon.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'primary', 'put', 'but', 'danger', "dangercheng"].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small','leftmini' ,'medium', 'mini', 'AIdevise', 'big', 'long', 'cold', 'flattened', 'hint', 'height', "task"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  // 修正：props.loding -> props.loading
  if (props.loading) { return }
  if (!props.disabled && !props.loading) {
    emit('click');
  }
}
</script>

<style scoped>
.msicon {
  color: #00FFCC;
  text-align: center;
  animation: myAnimation 1s infinite;
}

@keyframes myAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7.5px 55.5px;
  border: none;
  border-radius: 51px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, background 0.3s ease; /* 添加 transition */
}


.btn-con {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  border-radius: 51px;
  padding: 1px;
  /*background: linear-gradient(160deg, rgba(251, 251, 251, 0.4) 0%, rgba(48, 49, 54, 1) 35%, rgba(48, 49, 54, 1) 65%, rgba(251, 251, 251, 0.4) 100%);*/
}

.custom-button.small {
  padding: 9.5px 19px;
  font-size: 14px;
}

.custom-button.flattened {
  padding: 4px 19px;
  font-size: 14px;
}

.custom-button.hint {
  padding: 7.5px 43px;
  font-size: 14px;
  border-radius: 51px;
}

.custom-button.height {
  padding: 17.5px 43px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 51px;
}

.custom-button.task {
  padding: 12.5px 70px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 51px;
}

.custom-button.mini {
  padding: 5px 8px;
  font-size: 14px
}
.custom-button.leftmini {
  padding: 9.5px 8px;
  font-size: 14px
}
.custom-button.AIdevise {
  padding: 12.5px 43px;
  font-size: 14px;
  border-radius: 51px;
}

.custom-button.big {
  padding: 12.5px 143px;
  font-size: 14px;
  border-radius: 51px;
}

@media (max-width: 1868px) {
  .custom-button.big {
    padding: 12.5px 103px;
    font-size: 14px;
    border-radius: 51px;
  }
}

@media (max-width: 1468px) {
  .custom-button.big {
    padding: 12.5px 73px;
    font-size: 14px;
    border-radius: 51px;
  }
}

.custom-button.long {
  padding: 7.5px 98px;
  font-size: 14px;
  border-radius: 51px;
}

.custom-button.cold {
  padding: 7.5px 34px;
  font-size: 14px;
  border-radius: 51px;
}

.custom-button.default {
  border-image: linear-gradient(160deg, rgba(251, 251, 251, 0.4) 1%, rgba(251, 251, 251, 0) 35%, rgba(251, 251, 251, 0) 65%, rgba(251, 251, 251, 0.4) 100%) 1;
  background: rgb(48, 49, 54);
  color: #fff;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.4);

  box-shadow: inset 0px -4px 8px 0px rgba(255, 255, 255, 0.05);
}
.custom-button.default:not(:disabled):not(.loading):hover {
  background:
      linear-gradient(160deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%),
      rgb(48, 49, 54);
  color: #fff;
}
.custom-button.default:not(:disabled):not(.loading):active {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.2) 7%, rgba(255, 255, 255, 0.04) 100%);
  color: #fff;
}
.custom-button.primary {
  border: 1px solid rgba(255, 255, 255, 0);
  background: linear-gradient(106deg, #CBFFF8 6%, #21FFF3 36%, #FFF600 98%);
  color: #000;
  border: 1px solid;
  font-weight: 500;
}

/* 悬停效果：:not(:disabled) 确保在禁用状态下不触发 */
.custom-button.primary:not(:disabled):not(.loading):hover {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(106deg, #CBFFF8 6%, #21FFF3 36%, #FFF600 98%);
}

/* 点击效果：:active 伪类 */
.custom-button.primary:not(:disabled):not(.loading):active {
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(106deg, #CBFFF8 6%, #21FFF3 36%, #FFF600 98%);
}

/* === END: 修改和新增的部分 === */


.custom-button.danger {
  background: rgb(75, 26, 49);
  opacity: 20;
  color: #ff005e;
  font-weight: 500;
}

.custom-button.dangercheng {
  background: #ff005e;
  opacity: 20;
  color: #fbfbfb;
  font-weight: 500;
}

.custom-button.but {
  background: #00FFCC;
  color: #000;
  border: 1px solid;
  font-weight: 500;
}

.custom-button.put {
  font-weight: bold;
  background: #fff;
  color: #000;
  padding: 13.5px 29px;
  border: 1px solid;
}

.custom-button.warning {
  background-color: #ffc107;
  color: #333;
}

.custom-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-button.loading {
  cursor: wait;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #000000;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.icon {
  margin-right: 8px;
}
</style>