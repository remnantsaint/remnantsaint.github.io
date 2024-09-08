---
categories: 其他
comments: 
cover: 
date: 2024-09-07 21:50:59
image: 
layout: post
tags: 
time_warning: true
title: valaxy建站
top: 
---

以下纪录我开始用Valaxy框架，yun主题重新建站的过程
valaxy官方文档：<https://valaxy.site/guide/getting-started>
首先下载nvm，然后用nvm下载18版本的node.js，再下载pnpm，其中得把node.js加入环境变量
`pnpm run dev`为开启本地开发环境
`pnpm new post-title`为新建文章
`pnpm run build`为构建静态文件  也可以`valaxy build --ssg`

配置一下pnpm环境变量：`pnpm setup`
然后下载valaxy命令行：`pnpm add -g valaxy`  全局安装

自定义域名失效问题：在public文件夹创建`CNAME`文件，里面有不带https和www的域名

`valaxy` 预览界面
`valaxy new name`创建新文章

在主题配置文件中，背景图片可以用`/bgimage/x.jpg`来设置，其中`bgimage`是`public`下的一个文件夹

边栏之类的在自定义设置里，在`styles/css-vars.scss`

```
"scripts": {
    "build": "npm run build:ssg",
    "build:spa": "valaxy build",
    "build:ssg": "valaxy build --ssg",
    "dev": "valaxy",
    "rss": "valaxy rss",
    "serve": "vite preview"
  },
```
这个是package.json脚本，可以直接添加快捷方式

设置waline评论系统：<https://waline.js.org/guide/get-started/#html-%E5%BC%95%E5%85%A5-%E5%AE%A2%E6%88%B7%E7%AB%AF>
跟着这个教程走

在页面设置中，边栏是整个右边栏，关闭目录是右边栏内的目录   nav是导航下一页文章
image是文章中的顶图   cover是显示在主页的图

girls添加头像时直接在百度搜图片，然后复制链接，挂了再补

新建了个scaffolds文件夹，里面放`post.md`名字的模板，用`valaxy new --layout post name`命令创建新文件，缩写是`valaxy new -l post name`
标签要类似这样创建
```
tags:
  - valaxy
  - 笔记
```
字数统计和阅读时长不用写在FrongMatter









好难啊，暂时不想改主题了，以后有时间系统学习一下vue相关的再改吧。没有前端基础，自己创个新界面都费劲。
慢慢在本地修改界面，最后再设置成用域名访问吧，反正hexo部署在xxx.github.io上，valaxy可以随便建库，用域名访问。




参考链接：
[karu的博客](https://krau.top/posts/hexo-migrate-to-valaxy)
[yuumi的博客](https://www.yuumi.link/posts/valaxy)
[valaxy框架](https://valaxy.site/addons/gallery)