<!-- 新建 components/YunFooter.vue -->
<script lang="ts" setup>
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'
</script>
<template>
  <YunFooter>
    <div class="copyright"><a href="https://icp.gov.moe/?keyword=20231227" target="_blank">
        萌ICP备20231227号</a>
    </div>
    <VCLiveTime start-time="2022-12-27">
      <template #live-time-before>
        <span>本站已运行</span>
      </template>
      <template #live-time-after>
        <span>喵~</span>
      </template>
    </VCLiveTime>
  </YunFooter>
</template>
