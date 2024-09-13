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
    <div class="support" style="display: inline-flex; align-items: center;">
      本网站由
      <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank">
        <img src="/photo/youpaiyun.png" alt="又拍云" style="height: 20px; vertical-align: middle;" />
      </a>
      提供支持
    </div>
  </YunFooter>
</template>
