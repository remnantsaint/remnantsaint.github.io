import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://remsait.com/',
  favicon: "https://fastly.jsdelivr.net/gh/remnantsaint/hexoImage@main/QQ图片20240908121531.jpg",
  lang: 'zh-CN',
  title: "-Remsait's Blog-",
  subtitle: '折枝的树也能开花',
  author: {
    name: 'Remsait',
    avatar: "https://fastly.jsdelivr.net/gh/remnantsaint/hexoImage@main/QQ图片20240908121531.jpg",	//头像链接
    status: {
      emoji: '♥'	// 头像旁边的emoji
    },
  },
  description: '',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/remnantsaint',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=405460530',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/275862280',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
  ],

  search: {
    enable: true,
  },
  
  
  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: '/photo/zhifubao.png',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: '微信支付',
        url: '/photo/weixin.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
