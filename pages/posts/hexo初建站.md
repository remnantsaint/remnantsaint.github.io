---
categories: 其他
cover: 
date: 2022-12-29 16:30:48
updated: 2022-12-31
image: 
layout: post
tags: 
time_warning: true
title: hexo初建站
top: 
---
1.下载安装git与node.js

2.配置nodejs环境(略)
用nvm管理node.js版本

3.连接github ：  
`git config --global user.name "GitHub用户名"`
`git config --global user.email "GitHub邮箱"`

4.创建密匙`ssh-keygen -t rsa -C "Github邮箱"`，在github中添加密匙

5.验证连接`ssh -T git@github.com`

6.创建`username.github.io`（username为github用户名）

7.在本地创建hexo文件夹，进入文件夹内，右键git bash here

8.使用`npm install`将按照package.json安装所需要的组件放在生成的node_modules文件夹中

9.安装hexo：  
npm install -g hexo-cli  
hexo init  
git init
hexo g #生成页面  
hexo s #本地预览，用loacalhost:4000  
npm install hexo-deployer-git --save  
修改`\_config.yml`文件末尾部分为：

```c++  
deploy:  
  type: git  
  repository: git@github.com:用户名/用户名.github.io.git  
  branch: main  
```

注意：main是主分支，以前主分支是master

10.上传hexo：  
hexo clean  
hexo d -g  
hexo new name创建文章
在github.io页面就能显示hexo了

11.绑定域名：  
解析域名到github.io的ip地址上  
在hexo根目录的source目录下创建CNAME文件，内容为`http://域名`
重新上传网页

11.域名开启https  
在仓库的settings中pages栏目找到Enforce Https勾选

12.个人博客主题配置（略）

13.github+picgo+typora使用图床（用typora没有vscode的报错黄色提醒真好 `\^o^/~`）（注意用shift+enter换行同段写字，类似于wordpress）
&emsp; 补充：[picx](https://picx.xpoet.cn/)上传图片更好用，github的token我这种小白直接全勾选，就没有图片上传错误了      
后面遇到图片查看失败的情况，重新下载了picgo的最新版，然后在github上创建私人令牌添加上去就好使了

> gitee图床不好用   不知道为什么本地能看的图片，到网站上就看不到了

14.解决数学公式渲染问题，用kramed，完美解决之前的分数线消失、下标上标显示位置不正确、重复出现公式等问题（有个坑地方需要注意，markdown_it_plus一栏name: markdown-it-katex的设置enable: false，否则不能正确显示）

15.pure主题的代码不好看，可以修改一下（注意highlight一栏的hljs: true开启）


参考：
&emsp; <https://hexo.io/zh-cn/docs/>
&emsp; [github+picgo+typora](https://zhuanlan.zhihu.com/p/489236769)
&emsp; [kramed代替marked](https://www.jianshu.com/p/93c2a7862244)
&emsp; [优化pure、修改pure代码和增加复制](http://blog.iwwee.com/posts/hexo-optimize.html#%E4%B8%BA%E4%BB%A3%E7%A0%81%E5%9D%97%E5%A2%9E%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE)