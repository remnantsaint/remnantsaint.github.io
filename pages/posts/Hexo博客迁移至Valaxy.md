---
categories: 其他
cover: https://cdn.jsdelivr.net/gh/remnantsaint/hexoImage@main/valaxy.png
date: 2024-09-07 21:50:59
image: 
layout: post
tags: 
time_warning: true
title: Hexo博客迁移至Valaxy
top: 1
---
Valaxy框架真的超棒   
尤其是主题配置和方便多台电脑开发！
<!-- more -->

## 安装

以下纪录我开始用Valaxy框架，yun主题重新建站的过程
valaxy官方文档：<https://valaxy.site/guide/getting-started>
首先下载nvm，然后用nvm下载18版本的node.js，再下载pnpm，其中得把node.js加入环境变量
运行命令`pnpm create valaxy`来安装valaxy，默认主题是`yun`  
> 很好看！ 

配置一下pnpm环境变量：`pnpm setup`

`pnpm run dev`为开启本地开发环境
`pnpm new post-title`为新建文章
`pnpm run build`为构建静态文件  也可以`valaxy build --ssg`

然后下载valaxy命令行：`pnpm add -g valaxy`  全局安装

## 部署
参考：<https://valaxy.site/guide/deploy>
第一个部署在github的一个仓库里很简单
我每次要三步提交：`git add .`  and   `git commit -m '说明'`  and  `git push`
git艺不精见谅


## 使用及遇到的问题和解决办法
`valaxy` 预览界面（本地开发
`valaxy new name`创建新文章

在主题配置文件中，背景图片可以用`/bgimage/x.jpg`来设置，其中`bgimage`是`public`下的一个文件夹

边栏之类的在自定义设置里，在`styles/css-vars.scss`
以下是大佬的配置：
```css
// styles/css-vars.scss
:root {
    // 白天模式下文章框的底色
    --va-c-bg-light: rgba(255, 255, 255, 0.7);
    // 边栏背景图片
    --yun-sidebar-bg-img: url('');
    // 边栏背景颜色透明
    --yun-sidebar-bg-color: rgba(255, 255, 255, 0);
}

// 夜晚模式下文章框的底色
html.dark{
    --va-c-bg-light:rgba(5, 16, 29, 0.7);
}

// 首页大字两边的背景
.char-left {
    border-right:0px solid rgba(255,255,255, 0)
}
.char-right {
    border-left:0px solid rgba(255,255,255, 0)
}
```


设置waline评论系统：<https://waline.js.org/guide/get-started/#html-%E5%BC%95%E5%85%A5-%E5%AE%A2%E6%88%B7%E7%AB%AF>
跟着这个教程走

在页面设置中，边栏是整个右边栏，关闭目录是右边栏内的目录   nav是导航下一页文章
image是文章中的顶图   cover是显示在主页的图

girls添加头像时直接在百度搜图片，然后复制链接，挂了再补

新建了个scaffolds文件夹，里面放`post.md`名字的模板，用`valaxy new --layout post name`命令创建新文件，缩写是`valaxy new -l post name`
> 貌似创建模板后，直接valaxy new name即可
标签要类似这样创建
```
tags:
  - valaxy
  - 笔记
```
字数统计和阅读时长不用写在FrongMatter
标签最好换行用`  - `来写

转移文章时候用karu大佬给的脚本来进行，代码如下,自己修改对应的frontmatter：
需要先安装依赖：`pip3 install python-frontmatter`
```python
import frontmatter
import glob

path = 'posts/' #你的文章路径，相对于该脚本
mds = glob.glob(f'./{path}/*.md')

def del_metedata(md: str, key: str):
    post = frontmatter.load(md)
    metedata = post.metadata
    try:
        if isinstance(key, list):
            for k in key:
                try:
                    del metedata[k]
                except:
                    continue
        elif isinstance(key, str):
            del metedata[key]
        else:
            raise TypeError('key 是 str 或 list')
        frontmatter.dump(post, md)
    except Exception as e:
        print(f'{e} 在 {md}')


def add_metedata(md: str, key: str, value: str):
    post = frontmatter.load(md)
    metedata = post.metadata
    try:
        metedata[key] = value
        frontmatter.dump(post, md)
    except Exception as e:
        print(f'{e} 在 {md}')

def main():
    del_keys = [
        #要删除的项，你可以根据需要修改
        'toc',
        'mathjax',
    ]
    for md in mds:
        del_metedata(md,del_keys)
        #添加你需要的项,如添加 layout: post
        add_metedata(md, 'layout', 'post')
        add_metedata(md, 'time_warning', 'true')
        add_metedata(md, 'image', ' ')
        add_metedata(md, 'cover', ' ')
        add_metedata(md, 'top', ' ')
        add_metedata(md, 'categories', ' ')

if __name__ == '__main__':
    main()
```

自定义域名失效问题：在public文件夹创建`CNAME`文件，里面有不带https和www的域名

经过测试，貌似valaxy的yun主题只支持2、3、4级的多级目录，我原来的博客文章都是4、5级啊啊啊啊   啊啊啊 啊啊啊啊

原来valaxy支持多级分类，舒服了💆‍

可以看看其他人`valaxy`框架的博客，哪里泄愤好看直接去github上下源码看，爽

想把博客加入必应站长平台，要下载一个 .xml 文件放入根目录，那么这个根目录在哪呢？  
答案是 public 文件夹！  public文件夹内的文件会直接上传到网站 gh 分支







好难啊，暂时不想改主题了(艰难花费两天时间改完了），以后有时间系统学习一下vue相关的。没有前端基础，自己创个新界面都费劲。
原hexo界面仍然部署在github-page上，想用原来的也很简单，因为是两个库，主要是迁移文章太麻烦啦！！




参考链接：
[karu的博客](https://krau.top/posts/hexo-migrate-to-valaxy)
[yuumi的博客](https://www.yuumi.link/posts/valaxy)
[valaxy框架](https://valaxy.site/addons/gallery)