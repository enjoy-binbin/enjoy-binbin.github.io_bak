---
title: Centos下安装git环境
date: 2016-12-20 19:36:56
---



以前的笔记拉。格式排版有点不好，单纯记录拉，有个印象，现在都是哪里不会再查哪里



# 在Centos下安装git环境

直接yum安装git

​	yum install git

安装成功后输入命令:	

​	ssh-keygen -t rsa -C"binloveplay1314@qq.com"

​	后面填写你的git邮箱账号

这时会生成一个 ssh-key  一路默认回车就行

​	最后生成密钥文件 默认放在  /root/.ssh/id_rsa.pub

cat打开，将里面的内容复制 出来

进入github官网,登陆账号,打开设置

左侧栏会有个 SSH and GPG keys 
New SSH key
Title  标题
Key   将复制的内容复制进去

Add SSH key
输入github密码 确认即可

上述步骤完成后, linux终端下输入 
ssh -T git@github.com

出现 Hi enjoy-binbin! You've successfully authenticated, but GitHub does not provide shell access.

即成功, 有时候反应会迟钝, 确认步骤无误后, 可以等待几分钟后在试
git remote add myblog git@github.com:enjoy-binbin/blog.git
git remote -v

设置username, email
git config --global user.name "enjoy-binbin"
git config --global user.email "binloveplay1314@qq.com"


将远程仓库克隆到本地
git clone git@github.com:enjoy-binbin/chaoxing
更新本地仓库
	git remote -v 
	git fetch origin master
	git merge

以后更新远程仓库
git add .
git commit -m "更新内容"
git push



中间也搞的迷迷糊糊... 都试试吧. 我也萌萌逼的 最后总能成功的
我个人用法: 先init初始化, 然后add, commit, 关联仓库, push

git init
git add .
git commit -m "myBlog"
git remote add origin https://github.com/enjoy-binbin/blog.git
git push -u origin master


push后 可能会有延迟 等5-10分钟即可


弄了也挺久的,头疼,访问速度也不理想,翻墙用蓝灯..

添加代码对应git add

提交代码对应git commit

抓取代码对应git fetch

拉取代码对应git pull

推送代码对应git push



    add->commit->fetch->pull->push
    
    换成中文
    
    添加代码->提交代码->抓取代码->拉取代码->推送代码
git checkout .


本地删除文件后:
	想恢复文件: git checkout .

真正删除文件 也需要push的:
	git add -A
	git commit -m "delete some files"
	git push


为远程服务器添加一个别名
git remote add nickname https://...........

git push origin master
         远程    本地

一行行查看日志   ( 版本号  commit注释 )
git log --pretty=oneline

HEAD 相当于 C的指针  一般指向当前最新的
向HEAD 往后走5个版本
git reset --hard HEAD^^^^^
git reset --hard 版本号

git reflog


分支:
	查看所有分支
	git branch

	创建分支
	git branch Name
	
	切换分支
	git checkout Name
	
	git add .
	git commit -m "Name分支"
	git checkout master
	
	git branch Name2
	git checkout Name2
	...
	git add .
	git commit -m ""
	合并分支
	git checkout master
	git merge Name2
	
	删除分支
	git branch -d Name

远程仓库
	查看远程仓库
	git remote

	查看仓库地址
	git remote -v
	
	删除仓库
	git remote remove Name
	
	添加远程库
	git remote add Name https://...
	git remote add myblog git@github.com:enjoy-binbin/blog.git

git remote -v  // 查看远程仓库地址 ,  出现中的  origin 是默认本地仓库别名

git remote add NickName https地址或者shh地址 // 为远程仓库添加一个别名