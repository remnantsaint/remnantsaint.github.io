---
layout: post
title: Valaxy博客光标美化
date: 2024-10-18 11:21:15
cover: 
top: 
tags: 
  - valaxy
categories: 其他
# author: @Remsait
---

## 前言
&emsp; 早就想换换网页的光标了，但是网络上找到的方法在 valaxy-yun 主题博客里没法完美应用，接下来会介绍怎么完美的解决网页替换光标样式的方法。
<!-- more -->

&emsp; 网络上有很多 hexo 博客美化的方法，大致就是用到以下代码
```css
body {
	cursor: url(https://cdn.jsdelivr.net/gh/kaix2301/pictures/img202201071208706.cur), auto;
}
a {
	cursor: url(https://cdn.jsdelivr.net/gh/kaix2301/pictures/img202201071205091.cur), auto!important;
}
```

但是 valaxy 根本没有，只能结合官方文档来自己修改。也不困难，只是把上面这个代码放在`/styles/css-vars.scss`中，就可以在博客中看到效果啦！   

> 这么简陋就能满足吗？

&emsp; 显然不能，我们要替换自己喜欢的光标样式，经过和`chatgpt`的一顿 battle 后，给出了替换自己光标的代码。  

&emsp; 经过测试，`.ani`的动态光标没法显示到博客中，会显示电脑的默认光标，所以只能用`.cur`的静态光标。  

&emsp; 重新找了一组静态光标后，发现网页上的一些地方没有被选择器选择到，这又难倒我这个前端小白了......  但是没关系，在网页中 `f12` 打开检查界面，点击元素，再点击布局，找到未正常显示的地方，查看其 `class` 单独选择，（配合AI）就可以完美的实现博客光标全替换了，我的代码如下所示：   
```css
//主光标样式
body {
    cursor: url(/douni/小豆泥%20正常选择.cur), auto;
}
/* 特定元素的光标样式 */
a,
img {
    cursor: url(/douni/链接选择.cur), pointer;
}
//左侧栏
a.site-link-item.yun-icon-btn  {
    cursor: url(/douni/链接选择.cur), pointer;
}
a.link-item.yun-icon-btn  {
    cursor: url(/douni/链接选择.cur), pointer;
}
a.links-of-author-item.yun-icon-btn {
    cursor: url(/douni/链接选择.cur), pointer;
}
button.yun-icon-btn {
    cursor: url(/douni/链接选择.cur), pointer;
}
//底部页面导航栏
nav.pagination a.page-number, nav.pagination a[aria-label="next"] {
    cursor: url(/douni/链接选择.cur), pointer;
}
a.router-link-active.router-link-exact-active.page-number.active {
    cursor: url(/douni/小豆泥%20正常选择.cur), pointer;
}
//下拉上划
button.go-down {
    cursor: url(/douni/链接选择.cur), pointer;
}
a.back-to-top.yun-icon-btn.show {
    cursor: url(/douni/链接选择.cur), pointer;
}
//文章标题
a.post-title-link.cursor-pointer {
    cursor: url(/douni/链接选择.cur), pointer;
}
//输入栏样式
input[type="text"],
textarea {
    cursor: url(/douni/后台运行.cur), text;
}
//代码栏的拷贝和下拉
button.copy {
    cursor: url(/douni/链接选择.cur), pointer !important;
}
button.collapse {
    cursor: url(/douni/链接选择.cur), pointer !important;
}
//分类+标签选项
ul.category-list li.category-list-item.inline-flex.items-center.cursor-pointer {
    cursor: url(/douni/链接选择.cur), pointer !important;
}
span.post-tag.cursor-pointer.items-baseline.leading-4 {
    cursor: url(/douni/链接选择.cur), pointer !important;
}
//!important可以覆盖样式
```

> 大功告成啦！



