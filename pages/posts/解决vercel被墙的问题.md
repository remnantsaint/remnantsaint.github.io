---
layout: post
title: 解决vercel被墙的问题
date: 2024-09-11 20:29:26
updated: 2025-08-19
time_warning: true
cover: 
top: 
tags: valaxy
categories: 
  - 其他
# author: @Remsait
---
## 前言
&emsp; 我在使用 valaxy 框架，搭配 yun 主题来搭建自己的博客，根据官方文档，把评论插件`waline`和追番插件`bangumi`都配置好后，两者都部署在`vercel`网站上。
&emsp; 但是 vercel 网站上的应用有可能因为 dns 污染而被墙，以下是让其在国内能访问的办法  

<!-- more -->

---

1. 在域名网站上进行 DNS 解析，主机记录为 `comment`(可设)，记录类型为 `CNAME`，记录值为 `cname-china.vercel-dns.com`。
2. 在 vercel 部署的网站的**设置**页中，添加刚才设置的域名，如 `bilibili.remsait.com`
3. 更改主题设置中的字段

  

comment 准备部署在 Netlify 网站，[教程](https://waline.js.org/guide/deploy/netlify.html)  
1. 使用国际版 `leancloud` 作为数据库，只需要其提供：`AppID`、`AppKey`、`MasterKey`
2. 在 netlify 上新建站点，连接 github，选择 fork 的 netlify 脚手架
3. 配置环境变量
4. 用给的网址+`/.netlify/functions/comment`访问，例如`https://celadon-florentine-94df5b.netlify.app/.netlify/functions/comment`  

评论系统的后端进入链接是`https://celadon-florentine-94df5b.netlify.app/.netlify/functions/comment/ui`  

评论和追番总算全部部署完成啦！！！  👏  

> 为啥要加   /.netlify/functions/comment  啊  
> 

这个 comment 是 github 上 fork 的项目的`netlify/functions/comment.js`  



