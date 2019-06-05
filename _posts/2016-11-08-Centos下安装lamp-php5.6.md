---
title: Centos下安装lamp-php5.6
date: 2016-11-06 22:01:41
---

以前的老文章拉，直接就拿过来了。格式不改了



系统 centos7.2 下安装 php开发环境  by 飞翔的渣神丶 2016年11月8日
apache2.4.6
php5.6.27
mariadb  (mysql的一个分支)

0. 设置源
   rpm -Uvh https://dl.Fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
   rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
1. yum 一键安装环境
  yum install httpd mariadb-server php56w php56w-mysql php56w-mcrypt php56w-dom php56w-mbstring
  安装gd库
  yum install php56w-gd
2. 设置 apache和mysql 开机自启
  systemctl start httpd
  systemctl enable httpd
  *****************说明*********************
  mariadb是mysql的一个分支,由mysql创始人带队
  由于mysql闭源了,mariadb兼容mysql,且开源
  所以现在也开始使用mariadb,mysql转mariadb
  ******************************************
  systemctl start mariadb(mysql)
  systemctl enable mariadb(mysqld)
3. 设置mariadb密码
  mysql_secure_installation
  输入当前密码  默认为空
  设置密码 和 确认密码
  移除匿名用户 y
  禁止root远程登陆 n
  删除测试表并访问 n
  重新加载权限表 y

编写测试文件:
cd /var/www/html
vi index.php

<?php 
	phpinfo();
?>



扩展1:
	修改php.ini文件
	cd /
	find -name php.ini
	cd 进入目录
	cp php.ini ./php.ini.bak
	vi php.ini
	使用vi的 /string/ 搜索
	/display_errors/  再按键盘 n 下翻一页
	display_errors = Off
	display_startup_errors = Off
	off修改为on 提示错误



扩展2:
	设置 mariaDB数据库 允许 远程登陆

	host 183.36.65.xxx is not allowed to connect to ... server
	本机IP: 183.36.65.xxx 广东省广州市 电信 
	
	给root允许在所有IP上远程登陆  有所有的权限
	mysql -uroot -p
	grant all privileges on *.* to root@'%' identified by '1123';
	flush privileges;
	        
	 all privileges   所有权限   
	 *.*              数据库.表  
	 root@'%'         用户@'ip(%表示不限制)'  
	 '1123' 密码

扩展3:
	安装laravel  (建议看着文档进行安装)

	先安装 composer
	#下载composer安装文件并使用php执行，以便生成一个composer.phar包
	curl -sS https://getcomposer.org/installer | php
	
	# 将生成的composer包放到一个存放命令包的目录，以便系统的$PATH能够搜索到这个命令，这样就可以在命令行直接使用composer命令了。
	mv composer.phar /usr/local/bin/composer 
	
	需要注意composer的执行权限
	chmod +x /usr/local/bin/composer
	
	终端上输入　composer  显示提示信息 安装成功
	
	设置全局配置:  composer从中国镜像packagist
	composer config -g repo.packagist composer https://packagist.phpcomposer.com
	
	创建project:
	cd 指定项目目录
	composer create-project laravel/laravel --prefer-dist
	#composer create-project laravel/laravel blog --prefer-dist
	
	安装 Laravel 之后，可能需要你配置一下目录权限。
	web 服务器需要拥有 storage 目录下的所有目录和 bootstrap/cache 目录的写权限。
	同理 tp框架下的 runtime目录也需要读写权限
	
	之后 ip/laravel 后看到欢迎界面  安装成功
	
	laravel路由失效, 开启 apache的重写
	模块文件在 httpd中, 里面有多个配置文件
	修改httpd.conf  中的 AllowOverride All