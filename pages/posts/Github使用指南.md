---
categories: 其他
date: 2023-06-20 07:51:51
image: 
layout: post
tags: 
time_warning: true
title: Github使用指南
top: 
---

#### 创建Github账号，记住Github用户名、邮箱、密码（略）
#### 下载安装Git（略）
#### 配置Git
打开git bash（可以在开始界面找到，或者在文件夹空白处右键选择打开git bash），接下来的命令都在git bash内完成

连接Github：
`git config --global user.name "你的Github用户名"`
`git config --global user.email "你的Github邮箱"`

创建密匙，来让本机能绑定访问Github，能在你的Github上传文件：
`ssh-keygen -t rsa -C "你的Github邮箱"`

添加公钥：
在Github网页端，头像——>Settings——>SSH and GPG keys——>New SSH key
Title随便写，Key处要找到你刚才创建的密匙文件，一般在：C盘——>用户——>用户名——>.ssh文件夹，打开id_rsa.pub文件，将内容复制到Key处

验证连接："ssh -T git@github.com"

#### 使用Git
参考链接：[Git基础教程 | Remsait](https://www.remsait.com/2023/04/18/git基础教程/)

#### Github网页端的使用
（1）在别人的项目处，右上角找到fork，就能克隆一个他人的仓库到自己的仓库
（2）在本地的dev分支用git提交完修改后，能看到自己网页端的dev分支已经变化，一般会弹出一个绿色的合并按钮，点击然后检查后就能合并到主分支
（3）将自己fork后的参仓库的修改提交，申请主仓库合并

#### 2023.6 用Github和自己的域名创建多个网站
仅记录我的做法：
我的域名在腾讯云解析，添加一个主机记录为acg，记录类型为A

在Github上创建一个仓库，进入仓库设置，点击Pages，将Branch设置为main分支，将Custom domain设置为新的域名，例如我的`acg.remsait.com`

然后等待一会，浏览器输入`acg.remsait.com`就能显示index.html指向的网页了。

#### 同步提交gitee和github仓库
首先保证两个平台都有本地电脑的公钥，在.git文件夹的config文件的remote中添加url指向新的仓库，然后暴力推送一次同步`\^o^/`