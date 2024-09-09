---
title: 我的小伙伴们
color: '#87CEEB'
keywords: 链接
description: 云游的小伙伴们
aside: false	# 关闭目录边栏
nav: false
links: 
  - url: https://www.remsait.com                                                                    #网站地址
    avatar: https://fastly.jsdelivr.net/gh/remnantsaint/hexoImage@main/QQ图片20240908121531.jpg     #头像链接  
    name: Remsait                                                                                   #名字
    blog: Remsait's 小站                                                                            #网站名
    desc: 折枝的树也能开花                                                                           #个签 or 描述
    email: remnantsaint@163.com                                                                     #个人邮箱
    color: "#0078e7"                                                                                #想要友链显示的颜色
  - url: https://moriatyss.github.io
    avatar: https://fastly.jsdelivr.net/gh/remnantsaint/hexoImage@main/QQ图片20240908121531.jpg 
    name: 
    blog: 挂机博客
    desc: その美しさ、その哀れみ
    email: moriatysss@126.com
    color: "#4F2F4F"
random: true
---

<YunLinks :links="frontmatter.links" :random="frontmatter.random" />
