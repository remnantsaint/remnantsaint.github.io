---
categories: Linux
cover: 
date: 2023-01-08 12:18:22
updated: 2023-01-09
image: 
layout: post
tags: 
time_warning: true
title: 使用archlinux参考文章
top: 
---

arch wiki：<https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97>

安装参考：<https://blog.linioi.com/posts/18/>

连网参考：
* <https://blog.csdn.net/bangren3304/article/details/101078641>
* <https://blog.csdn.net/ZHISHAN_IoT/article/details/123453619>

字体参考：<https://blog.csdn.net/m0_47627464/article/details/113790309>

安装manjora参考：https://zhuanlan.zhihu.com/p/462061314

安装下载失败参考：https://blog.csdn.net/weixin_44757863/article/details/120235365

安装软件参考：[Arch系下的软件安装配置 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/588401074)

安装deb包：首先安装用`yay -S debtap`安装debtap，然后升级debtap：`sudo debtap -u`，用`sudo debtap xxx.deb`解压，license填GPL，然后用`sudo pacman -U xxx.tar.xz`来安装软件

使用xshell远程连接：先在manjaro启动ssh服务：`systemctl start sshd.service`，然后将其设置成开机自启`systemctl enable sshd.service`，现在就可以直接用xsehll通过ip连接，端口是22。会报错reject X11 forwarding request，这时修改`/etc/ssh/sshd_config`文件，将X11Forwarding no 改成 X11Forwarding yes，然后重启服务`systemctl restart sshd.service`即可

linux配置vscode c++踩坑：manjaro系统没有gdb，找了半天，得先`yay -S gdb`

当yay -Syyu更新失败时，尝试以下方法：
编辑/etc/pacman.d/mirrorlist
编辑/etc/pacman.conf

manjaro解决nodejs20版本不兼容问题：
  我的做法：因为下载npm的同时也会下载Nodejs20，yay nodejs -lts命令不能下载14版本，所以我在官网下载了压缩包，解压后进入bin目录，有node命令，给这个命令创建一个软链接到/usr/bin/来替换原来的20版本的node

启动redis可以直接在redis的根目录的src目录下运行redis-server
安装mysql，在命令行下用source就能运行sql文件