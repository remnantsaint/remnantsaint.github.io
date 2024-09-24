---
layout: post
title: valaxy版本升级指南
date: 2024-09-24 12:40:40
cover: 
top: 
tags: 
  - valaxy
categories: 
  - 其他
# author: @Remsait
---
## 前言
&emsp; 我刚开始使用`valaxy`框架，并搭配`yun`主题时，这两者的版本都是`0.19.9`，此时在分类和标签界面会有一点小bug，当云游君推出新版本修复这个bug后，我迫不及待的想要更新版本，但是却没有更新博客框架和主题的经验，屡次碰壁后尝试更新`hexo`博客的方法并成功，以下为纪录。
<!-- more -->
&emsp; 按以下步骤运行即可升级成功，具体原理我也不懂，照做就 OK 了。
1. pnpm list valaxy      查看valaxy版本
2. pnpm i valaxy@版本号   or    pnpm i valaxy -g   安装最新版本
3. pnpm i -g npm-check        安装npm-check，若已安装可以跳过
4. npm-check          检查系统插件是否需要升级
5. pnpm i -g npm-upgrade    安装npm-upgrade，若已安装可以跳过
6. npm-upgrade           更新package.json
7. pnpm update -g      更新全局插件
8. pnpm update --save    更新系统插件
9. pnpm list valaxy     再次查看版本，判断是否升级成功












