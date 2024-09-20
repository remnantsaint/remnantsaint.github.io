<script lang="ts" setup>
import { useScriptTag } from '@vueuse/core'
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

useScriptTag('//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js')
</script>

<template>
  <YunFooter> 
    <div class="copyright"><a href="https://icp.gov.moe/?keyword=20231227" target="_blank">
        萌ICP备20231227号</a>
    </div>
    <div>本站总访问量 <span id="busuanzi_value_site_pv" /> 次   &emsp;  本站访客数 <span id="busuanzi_value_site_uv" /> 人次</div>
    <VCLiveTime start-time="2022-12-27">
      <template #live-time-before>
        <span>本站已运行</span>
      </template>
      <template #live-time-after>
        <span>喵~</span>
      </template>
    </VCLiveTime>
    <footer style="display: flex; justify-content: center; align-items: center;">
      <a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力">
        <img src="https://www.travellings.cn/assets/logo.gif" alt="开往-友链接力" width="80">
      </a>
    </footer>
  </YunFooter>
</template>
