import { defineValaxyConfig, random } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from "valaxy-addon-waline";
import { addonLightGallery } from 'valaxy-addon-lightgallery'
import { addonBangumi } from 'valaxy-addon-bangumi'
import { addonLive2d } from 'valaxy-addon-live2d'
import { addonMeting } from 'valaxy-addon-meting'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  theme: 'yun',
  siteConfig: {
    // 启用评论
    comment: {
      enable: true
    },
  },
  // 设置 valaxy-addon-waline 配置项
  addons: [
    addonLightGallery(),
    addonWaline({
      locale: {
        placeholder: "欢迎写下您的留言！",
      },
      pageview: true,
      serverURL: 'comment.remsait.com/',
    }),
    addonBangumi({
      api: 'https://bilibili-bangumi-component-one.vercel.app/api',
      bilibiliUid: '275862280',
      bgmEnabled: false,
    }),
    addonLive2d({
      enableLive2D: ['Tia', 'Pio'],
      live2DCollection: {
        // https://github.com/fghrsh/live2d_api
        Tia: {
          message: '来自 Potion Maker 的 Tia 酱 ~',
          models: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Tia/index.json',
          textures: 'https://api.github.com/repos/fghrsh/live2d_api/contents/model/Potion-Maker/Tia/textures',
        },
        Pio: {
          message: '来自 Potion Maker 的 Pio 酱 ~',
          models: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Pio/index.json',
          textures: 'https://api.github.com/repos/fghrsh/live2d_api/contents/model/Potion-Maker/Pio/textures',
        },
      },
      skipHello: true,
    }),
    addonMeting({
      global: true,
      /** @see https://github.com/metowolf/MetingJS */
      props: {
        id: '2233528190',
        server: 'netease',
        type: 'playlist',
        autoplay: false,
        order: 'random',
        theme: 'pink',
      }
    })
  ],

  

  themeConfig: {
    banner: {
      enable: true,
      title: ['Remsait','の','幻','想','鄉'],
      cloud: {
        enable: true,
      },
    },

    colors:{
      primary: '#FF66B2',
    },

    fireworks: {
      enable: true,
      colors: ['#98F5FF', '#FF1493', '#FFFF00']
    },

    pages: [  //链接下面添加界面
      {
        name: '友人帐',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '相册',
        url: '/albums/',
        icon: 'i-ri-gallery-line',
        color: '#43abee',
      },
      {
        name: 'My love',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    menu: {
      custom: {
        title: '追番',
        url: '/fan/',
        icon: 'i-ri-folder-line'
      }
    },

    bg_image: {
      enable: true,
      url: 'https://cdn.jsdelivr.net/gh/remnantsaint/hexoImage@main/aluona.jpg',	// 白日模式背景
      dark: "https://cdn.jsdelivr.net/gh/remnantsaint/hexoImage@main/bilan.jpg",	// 夜间模式背景
      opacity: 0.8
    },

    say: {
      enable: true,
      api: "https://el-bot-api.vercel.app/api/words/young",
      hitokoto: {
        enable: true,
        api: "https://v1.hitokoto.cn/?c=k&c=d&c=i",
      },
    },



    footer: {
      since: 2022,
      icon: {
        enable: true,
        name: 'i-ri-heart-line',
        animated: true,
        color: '#d69b54',
        url: 'https://remsait.com',	//图标链接
        title: '回到首页'		//鼠标悬停注释
      },
      beian: {
        enable: false,
        icp: '萌ICP备20231227号',
      },
    },
  },


  unocss: {
    safelist: [
      'i-ri-home-line',
    ],
  },
  
  

})
