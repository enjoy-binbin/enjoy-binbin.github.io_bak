# BinBlog

> 谨以此记录自己的做的笔记

项目原出处 [hexo-theme-next](https://github.com/Simpleyyt/jekyll-theme-next) ，基于此进行自己的修改，这里感谢原作者。

Github Page由来。在此之前我根据自己所学的框架技术，进行过Tp-blog、Laravel-blog、Django-blog的开发。由于之前的服务器是部署在腾讯云和亚马逊云上，由于个人原因没有去运维和维护了。虽然博客系统里支持Markdown格式的文章，不过我还是更喜欢本地随手写的一个md笔记，不用考虑排版，就随意自己记录。

对于Python和Django感兴趣的童鞋可以移步，此项目会一直维护，欢迎star和issue呀。 [binblog](https://github.com/enjoy-binbin/Django-blog) ![Binblog-stars](https://img.shields.io/github/stars/enjoy-binbin/binblog-Django.svg?style=social)![binblog-forks](https://img.shields.io/github/forks/enjoy-binbin/binblog-Django.svg?style=social) 。binblog项目实现了基于Py3.6和Django2.1的博客系统，拥有完备的admin后台管理，可以方便的用于个人博客管理。并且里面有使用到部分Django中级用法，我想到啥就会去加啥，并且代码中注释非常完善，很适合有Django经验的朋友~


[Github Page 在线预览 Preview](<https://enjoy-binbin.github.io) 


### Gthub Page使用

```
# https://github.com/enjoy-binbin/enjoy-binbin.github.io
# 直接克隆项目后上传到自己的 github.io 仓库中，上面用户名需要设置成自己的
# 有关github page的使用参阅相关文档百度谷歌资料
```



#### _config.yml文件说明

```
# http://theme-next.simpleyyt.com/getting-started.html
# 直接参照文档自定义。或者试错
```



### yaml+markdown文章(待补充)

```yaml
在 ./_posts/ 目录下写文章，要求是Markdown格式的
在每个md文章的开头需要加上yaml front matter
---
# 这里面是yaml的属性值
---
eg. 属性值介绍，key: value # 注释，写的时候就写key: value
title: post_title  # 文章标题
date: 2019-6-5 14:49:10  # 创建时间，好像是选填的，会根据文件日期
categories:  # 文章所属分类
- Python  # 分类一
- Django  # 分类二
tags:  # 所属标签
- Django  # 标签一
- Python  # 标签二

# 特殊文章
links: http://www.baidu.com/  # 链接文章，提供一个链接，用于跳转，文章只用于跳转到别处
```



## 浏览器支持 Browser support

![Browser support](https://raw.githubusercontent.com/enjoy-binbin/enjoy-binbin.github.io/master/assets/images/browser-support.png)
