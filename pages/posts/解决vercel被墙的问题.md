---
layout: post
title: 解决vercel被墙的问题
date: 2024-09-11 20:29:26
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
2. 在 vercel 部署的网站的**设置**页中，添加刚才设置的域名，如 `comment.remsait.com`与`bilibili.remsait.com`
3. 更改主题设置中的字段

两者的 DNS 都目标为`cname-china.vercel-dns.com`，区别在 vercel 网站设置页的域名设置  