<script lang="ts" setup>
import { useScriptTag } from '@vueuse/core'
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'
import { onMounted, ref } from 'vue'

// 加载 Busuanzi 统计
useScriptTag('//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js')

const liveTime = ref('')

onMounted(() => {
  const startTime = new Date('2022-12-27').getTime()
  const updateLiveTime = () => {
    const now = new Date().getTime()
    const diff = now - startTime
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    liveTime.value = `${days}天${hours}小时${minutes}分钟${seconds}秒`
  }

  // 初始更新
  updateLiveTime()

  // 每秒更新一次
  setInterval(updateLiveTime, 1000)
})
</script>

<template>
  <YunFooter> 
    <!-- 添加新的版权信息和样式 -->
    <div class="footer-info">
      <span>由 </span>
      <a href="https://github.com/YunYouJun/valaxy" target="_blank" style="color: #ff69b4; text-decoration: none;">Valaxy</a>
      <span> v0.19.12 驱动 | 主题 - </span>
      <a href="https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-yun" target="_blank" style="color: #ff69b4; text-decoration: none;">Yun</a>
      <span> v0.19.12</span>
    </div>

    <div class="copyright"><a href="https://icp.gov.moe/?keyword=20231227" target="_blank">
        萌ICP备20231227号</a>
    </div>

    <div>本站总访问量 <span id="busuanzi_value_site_pv" /> 次   &emsp;  本站访客数 <span id="busuanzi_value_site_uv" /> 人次</div>

    <div class="live-time-container">
      <span class="live-time-text">本站已运行 {{ liveTime }} 喵~</span>
    </div>
<!--
    <footer style="display: flex; justify-content: center; align-items: center;">
      <a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力">
        <img src="https://www.travellings.cn/assets/logo.gif" alt="开往-友链接力" width="80">
      </a>
    </footer>
  
    <footer style="display: flex; justify-content: center; align-items: center;">
      <a href="https://clustrmaps.com/site/1c1rl"  title="Visit tracker"><img src="//www.clustrmaps.com/map_v2.png?d=SdKJZpvyUWUfIW1vNm9mAQXARJ7Aa9Nmga5DueqJAk0&cl=ffffff" /></a>
    </footer>
  -->
  </YunFooter>
</template>

<style scoped>

.live-time-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.live-time-text {
  font-size: 16px;
  color: #ff69b4;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  animation: bounce 1s infinite;
}

</style>
