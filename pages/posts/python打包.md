---
categories: 人工智能
cover: 
date: 2023-12-30 17:51:32
image: 
layout: post
tags: 
time_warning: true
title: python打包
top: 
---

将一个python程序转为应用不难，只需要用工具就可以
1.配置python环境变量
2.使用pip安装pyinstaller  `pip install pyinstaller`
3.在项目的根目录下，运行 `pyinstaller --onefile --noconsole main.py`
4.在生成的disk文件夹中，就可以找到可运行的.exe文件
5.不使用`--onefile`参数，就会生成一个文件夹，不使用`--noconsole`参数，就会在打开.exe文件时出现命令行程序