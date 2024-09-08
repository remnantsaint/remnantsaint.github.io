---
categories: 其他
comments: 
cover: 
date: 2023-04-18 19:12:39
image: 
layout: post
tags: 
time_warning: true
title: Git基础教程
top: 
---

### Git命令简易汇总
``` shell
#初始化
git init

#添加到暂存区
git add <filename>

#提交文件
git commit -m "<commit descriptrion>"

#查看文件修改
git diff <filename>

#查看暂存区和工作区状态
git status

#查看历史提交/快照
git log

#查看历史命令
git relog

#回退到某一版本
git reset --hard <commit_id>/<HEAD^>

#比较工作区与版本库最新文件的区别
git diff HEAD -- <filename>

#撤销文件还未添加的修改（丢弃工作区的修改）
git checkout -- <filename>

#把上次添加进入暂存区修改的撤销掉，重新加入暂存区（丢弃暂存区的修改）
git reset HEAD <file>

#删除版本库中文件
git rm <filename>

#连接远程库
git remote add origin git@github.com:<username>/<repositoriyname>.git
git remote add origin git@gitee.com:<username>/<repositoryname>.git

#将本地库推送到远程库(分支名可选，只有第一次需要 -u，可加--force强制推送)
git push -u origin main

#抓取分支
git pull

#创建并抓取dev分支
git checkout -v dev origin/dev

#查看远程库信息
git remote -v

#切断与远程库的连接
git remote rm <name>

#将远程库克隆到本地
git clone git@github.com:<githubname>/<repositoryname>.git

#创建分支
git branch <branchname>

#切换分支
git checkout <branchname>

#创建并切换分支
git switch -c <branchname>

#查看当前分支
git branch

#合并某分支
git merge <branchname>

#禁用Fast forward模式来合并分支
git merge --no-ff -m "description" <branchname>

#删除某分支
git branch -d <branchname>

#更改分支名称
git branch -m master main

#分支合并图
git log --graph

#设置本地dev和远程dev分支的链接
git branch --set-upstream-to=origin/dev dev

#打标签
git tag -a <name> -m <description>

#查看所有标签
git tag

#查看标签信息
git show <tagname>

#推送本地标签
git push origin <tagname>

#推送全部未推送过的本地标签
git push origin --tags

#删除标签
git tag -d <tagname>

#远程删除标签
git push origin :refs/tags/<tagname>

#解决警告
git config --global core.autocrlf true

git pull --allow-unrelated-histories

#暴力推送直接覆盖，不管拉没拉取
git push -f
```
### Git简介
Git是目前世界上最先进的分布式版本控制系统，能自动记录每次文件的改动

CVS和SVN都是集中式的版本控制系统，版本库集中存放在中央服务器，最大的毛病是必须联网才能工作。

Git是分布式版本控制系统，没有中央服务器，每个人的电脑都是一个完整的版本库，使用git不需要联网。分布式控制系统安全性更高，因为一个电脑坏掉后，可以复制其他人的版本库
### 安装Git
1.在Linux上安装Git

若在Debian和Ubuntu上，直接用`sudo apt-get install git`就能安装，若在老版本的Debian和Ubuntu，用`sudo apt-get install git-core`下载

其它版本可以直接通过源码安装。先从Git官网下载源码，然后解压，依次输入`./config` `make` `sudo make install`即可

2.在Windows上安装Git

在官网下载安装程序，然后默认选项安装，有Git Bash就说明安装成功

安装完成后还需要最后一步配置，在命令行输入：
`$ git config --global user.name "Your Name"（GitHub用户名）`
`$ git config --global user.email "email@example.com"（GitHub邮箱）`
因为Git是分布式版本控制，所以，每个机器都必须自报家门：你的名字和Email地址。

注意`git config`命令的`--global`参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址

### 创建版本库
版本库即repository，可以简单理解成一个目录，这个目录里所有的文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时候都可以追踪历史，或者在将来某个时刻可以还原。

所以，创建一个版本库非常简单，首先选择一个合适的地方，创建一个空目录，以下操作都在该目录中进行：
` $ mkdir learngit`
` $ cd learngit`
第二步，用`git init`命令把这个目录变成Git可以管理的仓库：
` $ git init`
初始化后，目录下会多一个`.git`目录，默认隐藏，这个目录是来跟踪管理版本库的，不要改动。

所有的版本控制系统，只能跟踪文本文件的改动，比如在一个文件的第几行盖了什么。而图片、视频这些二进制文件，虽然也能由版本控制系统管理，但没法跟踪文件的变化，只能把二进制文件每次改动串起来，也就是只知道图片从100KB改成了120KB

不幸的是，Microsoft的Word格式是二进制格式，因此，版本控制系统是没法跟踪Word文件的改动的。

强烈建议使用UTF-8编码来编写文件。使用windows需要注意千万不要使用Windows自带的记事本编辑任何文本文件，原因是Microsoft开发记事本的团队在每个文件开头添加了0x3fbbbf的字符，会导致错误

首先编写一个`readme.txt`文件，用`git add readme.txt`命令告诉Git将该文件添加到仓库，用`git commit -m "wrote a readme file"`告诉Git，把文件提交到仓库，`-m`后面输入的是本次提交的说明
### 时光机穿梭
我们已经成功添加并提交了一个readme.txt文件，现在，可以继续修改readme.txt文件，然后运行`git status`查看结果

`git status`命令让我们时刻掌握仓库当前的状态，命令的输出告诉我们呢，`readme.txt`被改动过了，但还没有准备提交的修改

如果想查看怎么修改的`readme.txt`文件，可以使用`git diff`这个命令，结果如下
```shell
$ git diff readme.txt 
diff --git a/readme.txt b/readme.txt
index 46d49bf..9247db6 100644
--- a/readme.txt
+++ b/readme.txt
@@ -1,2 +1,2 @@
-Git is a version control system.
+Git is a distributed version control system.
 Git is free software.
```
`git diff`顾名思义就是查看different，显示的格式正是Unix通用的diff格式，可以从上面的命令输出看到，我们在第一行添加了一个`distributed`单词。

知道了对`readme.txt`文件作了什么修改后，再添加到仓库就会很放心，先添加`git add readme.txt`，然后用`git status`查看状态，会告诉我们添加的修改包括`readme.txt`

下一步就可以放心提交`$ git commit -m "add distributed"`，提交后再用`git status`查看状态，会告诉我们当前没有需要提交的修改，而且工作目录是干净的
#### 版本回退
现在已经学会了修改文件后提交到Git版本库，就像打游戏一样，每一次存档都相当于一次快照这个快照相当于`commit`，每次把文件改乱了，或误删了文件，可以从最近的一个`commit`恢复，然后继续工作，而不是丢失成果。

在Git中，可以使用`git log`命令查看历史快照记录，若嫌输出信息太多，可以加上参数`git log --pretty=oneline`，每一个`commit id`都是独一无二的

要想回退版本，首先要知道在Git中，用`HEAD`表示当前版本，用`HEAD^`表示上一个版本，用`HEAD~10`表示上十个版本。接着用命令`git reset --hard HEAD^`回退到上一版本，这时若查看历史记录，会发现回退前的版本已经不见了，不过只要窗口还没有关掉，记录回退前版本的`commit id`，就可用命令`git reset --hard 1094a`来反回退，版本号没必要写全，Git会自动寻找版本。

Git的版本回退非常快，因为在Git内部使用了指向当前版本的`HEAD`指针，回退版本时，Git仅仅移动指针，然后顺便把工作区的文件更新。

若第二天回退后悔了，可以用`git reflog`命令查看使用过历史命令
#### 工作区和暂存区
工作区（Working Directory）就是在电脑中能看到的目录，比如创建的gitlearn文件夹。

版本库（Repository），工作区有一个隐藏目录`.git`，这个不算工作区，而是Git的版本库。Git的版本库存了很多东西，其中最重要的就是称为stage（或叫index）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`

前面讲了，把文件往Git版本库添加的时候，是分`add`和`commit`两步执行的，`git add`实际就是把文件修改添加到暂存区，`git commit`实际就是把暂存区的所有内容提交到当前分支。因为创建Git版本库的时候，Git自动创建了唯一一个`master`分支，所以现在`git commit`就是往`master`分支提交更改

可以简单理解为，需要提交的文件修改通通放到暂存区，然后一次性提交暂存区的所有修改。一旦将暂存区内容提交后，`git status`显示的暂存区就是干净的。

#### 管理修改
Git比其他版本控制系统优秀的原因是：Git跟踪并管理的是修改，而非文件。

若先修改一次文件，然后`git add`添加，然后第二次修改，然后直接`git commit`提交，这时会发现第二次修改的进入暂存区内，也就是没有被提交，可用命令`git diff HEAD -- readme.txt`查看工作区和版本库里面最新版本的区别

那么，怎么提交第二次修改呢？先`git add`就行了

#### 撤销修改
若大意修改了文件但还没`add`，使用命令`git checkout -- <filename>`就能撤销所有修改，回到最近的一次`git add`时间的状态，即丢弃工作区的修改。

若修改已经放入了暂存区，但还没有提交，Git告诉我们，用命令`git reset HEAD <file>`可以把暂存区的修改撤销掉。

`git reset`既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用`HEAD`时，表示最新的版本

小结：
（1）若乱改了某个文件内容，想丢弃工作区的修改，用命令`git checkout -- <file>`
（2）若不但乱改了内容，还添加到了暂存区，想丢弃修改，第一步用命令`git reset HEAD <file>`，就回到场景一，第二部按场景一操作`git checkout -- <file>`
（3）已经提交了不合适的修改到版本库时，想要撤销本次提交，参考版本回退，前提是没有推送到远程仓库。

#### 删除文件
在Git中，删除文件也是一个修改操作。当我们用`git add`提交后，一般情况下用`rm`来删除文件，这个时候本地的文件删除了，但版本库中还没删除该文件。

此时有两种选择：
	（1）在版本库中，用`git rm <filename>`来删除文件，之后再`git commit -m <description>`即可
	（2）删错了，版本库中还有该文件用`git checkout`即可一键还原
	（3）用命令`git commit -am ""`来实现更新暂存区，再提交就会在远程删除文件

### 远程仓库
Git是分布式版本控制系统，同一个Git仓库，可以分不到不同的机器上。最早只有一台机器有一个原始版本库，此后别的机器可以“克隆”这个机器的版本库，而且每台机器的版本库其实都是一样的，并没有主次之分。

Github提供Git仓库托管服务，可以用作远程仓库，只需要一点设置

首先得创建私钥和公钥，在shell里输入`ssh-keygen -t rsa -C "youremail@example.com"`然后一路回车，会得到`id_rsa`和`id_rsa.pub`文件，前者是私钥，后者是公钥，将公钥添加到Github的key里即可。

Github可以添加多个KEY，假设你有若干电脑，一会在家提交，一会在公司提交，只要把每台电脑的KEY添加到Github即可
#### 添加远程库
Github上的Git仓库，既可以作为备份，又可以让其他人通过该仓库来协作

首先创建一个名为`learngit`的仓库，然后再本地的`learngit`仓库中运行命令`git remote add origin git@github.com:<username>/<repositoriyname>.git`来连接远程库

添加后，远程库的名字就是`origin`，这是Git默认的叫法。

下一步，将本地库的所有内容推送到远程库上：先将文件添加到本地库，然后用命令`git push -u origin main`推送到远程库。把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`main`推送到远程。

由于远程库是空的，我们第一次推送`main`分支时，加上了`-u`参数，Git不但会把本地的main分支内容推送到远程新的`main`分支，还会把本地的`main`分支和远程的`main`分支关联起来，在以后的推送或者拉取时就可以简化命令，即`git push origin main`

如果添加的时候地址写错了，可以先用`git remote -v`查看远程库信息，再用`git remote rm <name>`来删除远程库，其实就是切断与远程库的连接

分布式版本系统的最大好处之一是在本地工作不需要考虑联网，只要在有网络的时候推送一下就完成同步
#### 从远程库克隆
用克隆命令：`git clone git@github.com:<githubname>/<repositoryname>.git`即可将远程库的文件克隆到本地
### 分支管理
Git可以创建分支，自己在自己的分支干活，想提交就提交，最后和主分支合并。这样会使过程更安全。
#### 创建和合并分支
在版本回退中，每次提交，Git都会把它们串成一条时间线，这条时间线就是一个分支，这个分支叫主分支。

用命令`git branch <branchname>`来创建分支，`git checkout <branchname>`来切换分支，这两个命令可以结合成一个命令`git checkout -b <branchname>`

用`git branch`查看分支，当前分支前会标一个`*`·。之后正常修改提交，再切换到主分支会发现文件并没有改动，因为提交后的dev指针在master指针前边，这时候可以选择将dev分支合并到master：`git merge <branchname>` 

合并完成后，可以用`git branch -d <branchname>`来删除分支
#### 解决冲突
合并分支不会一帆风顺。当master分支和dev分支分别有各自新的提交，Git无法快速合并，只能试图把各自的修改合并起来，但是这种合并就可能发生冲突。

解决冲突就是把Git合并失败的文件手动编辑为我们希望的内容再提交。用`git log --graph`命令可以看到分支合并图
#### 分支管理策略
如果想要合并后保留分支信息，可以禁用`Fast forward`模式，Git就会在merge时产生一个新的commit，如命令`git merge --no-ff -m "description" <branchname>`

实际开发中，我们应该按照几个基本原则进行分支管理：

首先`master`分支应该是非常稳定，也就是仅用来发布新版本，平时不能在上面干活；

干活都在`dev`分支上，也就是说，工作完成后把`dev`分支合并到`master`分支上；所有人创自己的分支，然后合并到`dev`分支上就行了。
#### 多人协作
当你从远程仓库克隆时，实际上Git自动把本地的`master`分支和远程`master`分支对应起来了，且远程仓库的默认名称是`origin`。

并不是一定要把本地分支往远程推送

* `master`分支是主分支，因此要时刻与远程同步；
* `dev`分支是开发分支，团队所有成员都需要在上面工作，所以也需要与远程同步；
* `bug`分支只用于在本地修复bug，没必要推送到远程
* `feature`分支是否推送到远程，取决于你是否和你的小伙伴合作在上面开发

#### 抓取分支
如果只是用`git clone ~`命令把库克隆到本地，就只能看到`master`分支。如果想在`dev`分支上开发，那么必须创建远程`origin`的`dev`分支到本地，用命令`git checkout -v dev origin/dev`即可创建`dev`一样的分支。

如果你也修改了`dev`分支，那么提交的时候会提醒冲突，这时只要用`git pull`把最新的`dev`提交抓取下来在本地合并，就可以解决冲突。

如果`git pull`失败，原因是没有指定本地`dev`分支与远程`origin/dev`分支的链接，设置`dev`和`origin/dev`的链接即可：`git branch --set-upstream-to=origin/dev dev`

`git pull`前注意要把本地库的修改提交一下，或者用`git checkout .`撤回修改

### 标签管理
发布一个版本时，我们通常先在版本库中打一个标签(tag)，这样就唯一确定了打标签时刻的版本，所以标签也是版本库的一个快照。

标签可以代替`commit`号的那一长串数字，是一个有意义的名字
#### 创建标签 
在Git中打标签十分简单，首先用`git checkout <branchname>`切换到要打标签的分支。然后命令`git tag <name>`打标签即可。可用`git tag`查看所有标签。

默认标签是打在最新提交的commit上的，如果忘记打以前的标签，可以先用`git log --pretty=oneline --abbrev-commit`查看历史提交，然后用`git tag v1.4 f52c633`即可将f52c633的commit号打上标签v1.4

可用`git show <tagname>`查看标签信息。打标签时，可以加参数`-m`带有说明，`-a`指向标签名
#### 操作标签
如果标签打错，可以删除：`git tag -d v0.1`

如果要推送某个标签到远程，使用命令`git push origin <tagname>`。或者一次性推送尚未推送到远程的本地标签：`git push origin --tags`。

如果标签已经推送到远程，想要删除标签，首先要从本地删除：`git tag -d v0.9`，然后从远程删除`git push origin :refs/tags/v0.9`
### 使用Gitee 
使用Github时，国内用户经常会访问太慢，就可以用国内的Gitee托管服务

和Github相比，Gitee也提供免费的Git仓库。使用Gitee和Github类似，都需要先绑定公钥。

创建一个和本地库名相同的远程库，用命令`git remote add origin git@gitee.com:<username>/<repositoryname>.git`将它和Gitee的远程库关联，之后就可以正常用`git push`和`git pull`推送了

若报错说已经关联一个名叫`origin`的远程库，可以用`git remote -v`查看远程库信息，然后删除与Github远程库的联系，再关联Gitee的远程库。也可以通过改远程库origin的名称来关联不同的远程库 
### 参考
[廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496)