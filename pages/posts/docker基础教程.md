---
layout: post
title: docker基础教程
date: 2025-05-15 11:40:45
cover: 
top: 
tags: 
- docker
categories: 其他
# author: @Remsait
---

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
##### 调试配置
找到Docker Desktop设置  
在`Docker engine`中修改如下代码来更改`DNS`和镜像仓库
```
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "dns": [
    "1.1.4.4",
    "8.8.8.8"
  ],
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://docker.m.daocloud.io/",
    "https://huecker.io/",
    "https://dockerhub.timeweb.cloud",
    "https://noohub.ru/",
    "https://dockerproxy.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://docker.nju.edu.cn",
    "https://xx4bwyg2.mirror.aliyuncs.com",
    "http://f1361db2.m.daocloud.io",
    "https://registry.docker-cn.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```
##### docker 常用命令
1. docker ps：显示正在运行的容器
2. docker ps -a ：显示所有容器
3. docker images：查看本地已有镜像和大小
4. docker pull <镜像名>：从Docker Hub下载镜像
5. docker rmi <镜像名或ID>：删除镜像
6. docker build -t <镜像名>：构建镜像
7. docker run -it --name <自定义容器名> <镜像名>：以交互方式运行一个新容器
8. docker run -d <镜像名>：后台运行容器
9. docker start <容器ID>：启动已停止容器
10. docker exec -it <容器ID> /bin/bash 或/bin/sh ：进入交互模式
11. docker start -ai <容器ID>：启动并进入交互模式
10. docker stop <容器ID>：停止正在运行容器
11. rm：删除容器
12. restart：重启容器
13. docker save -o xxx.tar 镜像名：导出镜像文件
14. docker load -i xxx.tar：从tar文件加载镜像
15. docker builder prune：删除build cache
16. docker system df：查看当前缓存大小
17. docker cp linux中文件路径  容器id:容器中路径：复制粘贴文件
18. docker stats：查看当前容器性能
19. docker ps -a -s：查看所有容器大小
##### 构建镜像
首先需要一个`Dockerfile`文件，文件具体编写方法暂略  
然后在`Dockerfile`文件所在目录构建镜像：`docker build -t imagename .`，这样就生成了一个镜像，可以在Docker Desktop的镜像栏中看到  
##### 用镜像构建容器
用镜像构建容器：`docker run -it imagename`  
进入镜像会，会看到如下格式：`root@<容器ID>:/#`，Docker Desktop的容器栏也能看到，用`exit`即可退出  

> 接下来就是随便用不同容器来进行linux环境管理等需求了
