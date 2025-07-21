<script setup>

</script>

<template>
  <div class="search-container">
    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    <input type="text" placeholder="搜索 最近关闭">
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  padding: 0 16px;
  margin-bottom: 8px;
}

.search-container .search-icon {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  fill: var(--text-secondary);
}

.search-container input {
  width: 100%;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 0 16px 0 42px;
  font-size: 14px;
  background-color: transparent;
  outline: none;
  box-sizing: border-box;
}

.search-container input:focus {
  border-color: var(--active-blue);
}

.search-container input::placeholder {
  color: var(--text-secondary);
}
</style>