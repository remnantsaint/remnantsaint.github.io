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

    liveTime.value = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`
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

    <div class="icp-badges">
      <a href="https://icp.gov.moe/?keyword=20231227" title="萌ICP备20231227号" target="_blank">
        <img src="https://img.shields.io/badge/%E8%90%8CICP%E5%A4%87-20231227%E5%8F%B7-ff69b4?style=flat-square&labelColor=6b7280&logo=data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%2016%2016%27%3E%3Cpath%20fill%3D%27%23ff3b30%27%20d%3D%27M8%2014s6-3.33%206-8a3.5%203.5%200%200%200-6-2.5A3.5%203.5%200%200%200%202%206c0%204.67%206%208%206%208z%27/%3E%3C/svg%3E" alt="萌ICP备20231227号">
      </a>
      <a href="https://icp.redcha.cn/beian/ICP-2025080112.html" title="茶ICP备2025080112号" target="_blank">
        <img src="https://img.shields.io/badge/%E8%8C%B6ICP%E5%A4%87-2025080112%E5%8F%B7-7474e1?style=flat-square&labelColor=6b7280" alt="茶ICP备2025080112号">
      </a>
    </div>

    <div class="footer-stats">本站总访问量 <span id="busuanzi_value_site_pv" /> 次   &emsp;  本站访客数 <span id="busuanzi_value_site_uv" /> 人次</div>

    <div class="live-time-container">
      <span class="live-time-text">本站已运行 {{ liveTime }} 喵~</span>
    </div>
  </YunFooter>
</template>

<style scoped>

.icp-badges {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}
.icp-badges img {
  height: 18px;
}

.footer-stats {
  color: #9aa0a6;
  font-size: 13px;
  margin-top: 4px;
}

.live-time-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.live-time-text {
  font-size: 13px;
  color: #9aa0a6;
  /* 去掉动画，更简洁 */
}

</style>
