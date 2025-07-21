<script setup xmlns="http://www.w3.org/1999/html">
import { ref, computed } from 'vue';
import search from './search.vue'
import history from './history.vue'
import dialog1 from './dialog.vue'

let curKey = ref("");
let dataMap = ref({});

let UUIDs = [];
const currentHistoryLines = computed(() => {
  return dataMap.value[curKey] || [];
})
chrome.storage.local.get("UUIDs", function (result) {
  if (result.UUIDs) {
    result.UUIDs.forEach(UUID => {
      chrome.storage.local.get(UUID, function (result) {
        if (result[UUID] && result[UUID].length !== 0) {
          let data = {};
          result[UUID].forEach(line => {
            const tabId = line[2];
            if (line[1] === "close") {delete data[tabId]; return true}
            if (line[4]) {data[tabId] = [new Date(line[0]), line[5], line[3], line[4]]}
          });
          if (Object.values(data).length > 0) {
            dataMap.value[UUID] = Object.values(data);
          }
        }
      });
    });
  }
})

chrome.storage.local.get("UUIDs", async function (result) {
  if (result.UUIDs) {
    for (const UUID of result.UUIDs) {
      let res = await chrome.storage.local.get(UUID);
      if (!res[UUID] || res[UUID].length === 0) {
        await deleteOne(UUID);
      }
    }
  }
});

async function deleteOne(UUID){
  await chrome.storage.local.get("UUIDs", function (result){
    chrome.storage.local.set({"UUIDs": result.UUIDs.filter(item => item !== UUID)}, function () {
      console.log(`delete UUIDs:${UUID} success`);
      console.log(result.UUIDs.filter(item => item !== UUID));
    });
  })
  await chrome.storage.local.remove(UUID, function () {
    console.log(`delete UUID:${UUID} success`);
  });
}

function deleteAll() {

}

function recoveryOne(UUID){
    if (UUID in dataMap.value) {
      chrome.windows.create({url: dataMap.value[UUID].map(i => i[3])}).then((window) => {
        console.log('窗口创建成功:', window);
        deleteOne(UUID);
      }).catch((error) => {
        console.error('窗口创建失败:', error);
      });
    }
}

function recoveryAll(){
  for (const k in dataMap.value) {
    recoveryOne(k);
  }
}

</script>

<template>
  <div class="history-panel">
    <header class="panel-header">
      <h1 class="title">历史记录</h1>
      <div class="header-icons">
        <div class="icon-btn" title="Delete History" @click="deleteOne(curKey)">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12V17" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 12V17" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 7H20" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="icon-btn" title="Recovery Tab" @click="recoveryOne(curKey)">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10V18C3 19.1046 3.89543 20 5 20H11M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V13" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 14V17M17 20V17M17 17H14M17 17H20" stroke="#5F6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6" cy="7" r="1" fill="#000000"/>
            <circle cx="9" cy="7" r="1" fill="#000000"/>
          </svg>
        </div>
        <div class="icon-btn" title="Recovery All Tab" @click="recoveryAll()">
          <svg width="20px" height="20px" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6 11.5799V14.3099C13.6 16.5899 12.69 17.4999 10.41 17.4999H7.69C5.42 17.4999 4.5 16.5899 4.5 14.3099V11.5799C4.5 9.3099 5.41 8.3999 7.69 8.3999H10.42C12.69 8.3999 13.6 9.3099 13.6 11.5799Z" stroke="#5F6368" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 7.68V10.41C17.5 12.69 16.59 13.6 14.31 13.6H13.6V11.58C13.6 9.31 12.69 8.4 10.41 8.4H8.39999V7.68C8.39999 5.4 9.30999 4.5 11.59 4.5H14.32C16.59 4.5 17.5 5.41 17.5 7.68Z" stroke="#5F6368" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 14C21 17.87 17.87 21 14 21L15.05 19.25" stroke="#5F6368" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 8C1 4.13 4.13 1 8 1L6.95 2.75" stroke="#5F6368" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="icon-btn" title="More options">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </div>


        </div>

    </header>

    <search />

    <nav class="tabs">
<!--      <a href="#" class="tab-item">全部</a>-->
      <a class="tab-item" v-for="(value, key) in dataMap" :key="key" :class="{ active: curKey === key }" @click="curKey = key; console.log(`select UUID:${curKey}`)">
        窗口
      </a>
    </nav>

    <history :historyLines="dataMap[curKey]" />
  </div>
</template>

<style scoped>

.history-panel {
  width: 340px;
  background-color: var(--panel-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /*or use overflow: scroll*/
  margin: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px 2px 16px;
}

.panel-header .title {
  font-size: 16px;
  font-weight: 1000;
  color: var(--text-primary);
  margin: 0;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-icons .icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  fill: var(--text-secondary);
}

.header-icons .icon-btn:hover {
  background-color: var(--hover-bg);
}



.tabs {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
}

.tabs .tab-item {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px; /* To overlap the container's border */
}

.tabs .tab-item.active {
  color: var(--active-blue);
  border-bottom-color: var(--active-blue);
}

.tabs .tab-item:not(.active):hover {
  background-color: var(--hover-bg);
  border-radius: 4px 4px 0 0;
}


</style>