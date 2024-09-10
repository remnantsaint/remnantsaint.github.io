---
categories: 其他
cover: 
date: 2023-04-11 22:39:53
image: 
layout: post
tags: 
time_warning: true
title: missing-semester
top: 
hide: true
---

### Topic 1: The Shell

#### What is the shell?

当我们用各种各样的电脑接口时，我们经常被从根本上限制了。为了充分利用计算机提供的工具，我们不得不走老路下降到文本界面：the Shell

几乎所有的平台都有一个shell，即使他们不同，在各个shell的核心，它们很大程度上相似：它们允许你去运行程序、接受输入、以半结构化的方式检查输出

在这节课，我们将会集中于Bourne Again Shell，即"bash"，它是众多shell中的一员，并且它的语法和其它shell很类似。如果我们想打开一个shell，我们需要一个终端

#### Using the shell

首先，你会看到一个提示，通常看来是这样

```c++
missing:~$
```

"missing"是当前工作目录，"~"是"home"的缩写，"$"指没有root权限。你能输入一个命令，将会被shell解释，例如：

```shell
missing:~$ date
Fri 10 Jan 2020 11:49:31 AM EST
```

在这里，我们执行"data"程序，可以打印当前的事件，我么也可以执行一个带参数的程序：

```shell
missing:~$ echo hello
hello
```

在这个例子中，我们告诉shell使用参数`hello`执行`echo`，`echo`程序可以简单的打印它的参数。shell通过空格分割来解析命令，之后运行运行第一个单词指示的程序，之后的单词作为参数来提供程序访问。如果你想提供一个包括空格或者其他特殊符号（e.g，a directory named "My Photos"）作为参数，你能用`'`或者`"`来包住

但是，shell怎么知道如何去找这个`date`或`echo`程序？shell就是一个变成环境，就像Python和Ruby语言一样，所以它有变量、条件、循环和函数，当用shell执行命令时，实际上是执行一小段shell解释的代码，如果shell被告知要执行一个找不到关键字的命令，它会查询一个名为`$PATH`的环境变量，这个变量列出了收到命令时应该搜索的程序的目录，例如：

```shell
missing:~$ echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
missing:~$ which echo
/bin/echo
missing:~$ /bin/echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

当我们运行`echo`命令，shell会知道它要执行`echo`命令，然后在`PATH`中以`:`为分隔符分离的目录列表中搜索该名称的文件，当它找到后，它会运行命令（假设这个文件可执行）。我们能使用`which`命令找出要执行的程序在哪个目录，我们也能通过给出要执行的文件的路径来绕过`$PATH`。

#### Navigating in the shell

shell上的路径是一个带分隔符的目录列表，在Linux和macOS上用`/`分割，在Windows上用`\ `分割。在Linux中，路径`/`是文件系统的根目录，所有的目录和文件都位于该路径下而windows是`C:\`。可以用`pwd`获取当前目录。在路径中，`.`表示的是当前目录，`..`表示上级目录。



参考：<https://missing.csail.mit.edu/2020/>