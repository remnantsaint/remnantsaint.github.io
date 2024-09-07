import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'

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

  themeConfig: {
    banner: {
      enable: true,
      title: '期待明天',
      cloud: {
        enable: true,
      },
    },
    bg_image:{
      enable: true,
      url: '',
    },
    colors:{
      primary: '#FFC0CB',
    },
    pages: [
      {
        name: '友人帐',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: 'My love',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2022,
      beian: {
        enable: true,
        icp: '萌ICP备20231227号',
      },
    },
  },

  unocss: { safelist },
  
})
