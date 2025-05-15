---
layout: post
title: docker基础教程
date: 2025-05-15 11:40:45
cover: 
top: 
tags: 
categories: 
# author: @Remsait
---

参考网站：[菜鸟网](https://www.runoob.com/docker/docker-tutorial.html)

#### Docker简介

Docker可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版）  

#### Windows 安装
首先安装WSL2 ，在管理员命令符中运行一下命令启用功能：  
```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

wsl --set-default-version 2
```
然后安装ubuntu
```
wsl --install -d Ubuntu-20.04
```
如果遇到网络问题，就去控制面板网络中心改DNS，参考：(https://cn.windows-office.net/?p=26397#google_vignette)  

具体安装WSL2并且安装到D盘的方法参考链接：(https://blog.csdn.net/Natsuago/article/details/145594631?spm=1001.2014.3001.5501)  

安装 docker desktop ，官网：(https://www.docker.com/products/docker-desktop/)

注册账号后即可使用  

#### Docker 使用
##### Docker Hello World
