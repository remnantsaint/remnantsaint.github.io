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
&emsp; 但是 vercel 网站上的应用有可能因为 dns 污染而被墙，以下是只能将一者能在无 VPN 下访问的解决办法。

<!-- more -->

---

1. 在域名网站上进行 DNS 解析，主机记录为 `comment`(可设)，记录类型为 `CNAME`，记录值为 `cname.vercel-dns.com.`。
2. 在 vercel 部署的网站的设置页中，添加刚才设置的域名，如 `comment.example.com`
3. 更改主题设置中的字段
4. `bangumi`的设置同理

    
   
> 不知道怎么样才能让两个都能用，但是waline有时不翻墙也是能用的，bilibili确必须翻墙


最后我放弃了 bangumi 的不翻墙访问（悲            
以后尝试用其他方法