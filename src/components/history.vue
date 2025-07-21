<script setup>
import { toRefs, defineProps } from 'vue'
const props = defineProps({
  //子组件接收父组件传递过来的值
  historyLines: Array,
})
//使用父组件传递过来的值
const {historyLines} =toRefs(props)
function faviconURL(u) {
  if (u[1] === "") {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', `https://${new URL(u[3]).hostname}`); // this encodes the URL as well
    url.searchParams.set('size', '16');
    return url.toString();
  }
  return u[1];
}
</script>
<template>

  <ul class="history-list">
    <li class="history-item" v-for="item in historyLines" :key="index">
      <img :src="faviconURL(item)" class="favicon">
      <div class="item-content">{{ item[2] }}</div>
      <span class="item-time">{{new Date(item[0]).getHours()}}:{{String(new Date(item[0]).getMinutes()).padStart(2, "0")}}</span>
    </li>
  </ul>
</template>

<style scoped>
.history-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  max-height: 460px;
  margin: 0 0 0 12px;
}

/* Custom Scrollbar */
.history-list::-webkit-scrollbar {
  width: 14px; /* 滚动条宽度 */
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 20px;
  border: 4px solid var(--panel-bg);
}

.history-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  cursor: pointer;
}

.history-item.hovered,
.history-item:hover {
  background-color: var(--hover-bg);
}

.history-item .favicon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}

.history-item .item-content {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  color: var(--text-primary);
}

.history-item .item-time {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0 10px;
  flex-shrink: 0;
}
</style>