let dataList = [];
let UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
console.log(`extension is already running UUID: ${UUID}`);
refresh();

function refresh() {
    chrome.storage.local.get(["UUIDs"], function (result) {
        let UUIDs = []
        if (result.UUIDs){UUIDs= result.UUIDs}
        if (UUIDs.indexOf(UUID) === -1) {UUIDs.push(UUID);}
        chrome.storage.local.set({"UUIDs":UUIDs})
        chrome.storage.local.set({[UUID]:dataList})
    })
}

// 监听Tab打开事件
// chrome.tabs.onCreated.addListener(function(tab) {
//     if(tab && tab.url && tab.url.startsWith("edge")){return}
//     dataList.push([new Date().toISOString(), "open", tab.id, tab.title, tab.url, tab.favIconUrl ? tab.favIconUrl : ""]);
//     refresh();
// });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status === 'complete'){
        if(tab && tab.url && tab.url.startsWith("edge")){return}
        dataList.push([new Date().toISOString(), "update", tab.id, tab.title, tab.url, tab.favIconUrl ? tab.favIconUrl : ""]);
        refresh();
    }});

// 监听Tab关闭事件
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    dataList.push([new Date().toISOString(), "close", tabId]);
    // 延迟写入使得当整个窗口被关闭不写入close
    setTimeout(function() {
        refresh();
    }, 5000);
});
