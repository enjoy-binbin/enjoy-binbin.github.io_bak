---
title: 在页面中引入github-star
date: 2019-02-08 21:30:45
categories:
- 其他
---

哈哈哈，遇到个想法，需要在html页面中插入关于自己的github仓库的图片信息，搜索了相关的资料，记录下来，网上已经有相对应的开源链接。可以直接根据自己的用户名和仓库渲染出相应的图片。



github丝绸图片地址:

​	https://github.blog/2008-12-19-github-ribbons/



iframe引入

<iframe frameborder="0" scrolling="0" width="91px" height="20px"
    src="https://ghbtns.com/github-btn.html?user=enjoy-binbin&repo=django-blog&type=star&count=true" >
</iframe>	




推荐图片引入:https://shields.io/category/social，修改对应的用户和仓库名

<a href="https://github.com/enjoy-binbin"><img src="https://img.shields.io/github/stars/enjoy-binbin/django-blog.svg?style=social"></a>

<a href="https://github.com/enjoy-binbin"><img src="https://img.shields.io/github/forks/enjoy-binbin/django-blog.svg?style=social"></a>

