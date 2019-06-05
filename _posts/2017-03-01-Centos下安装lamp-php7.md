---
title: Centos下安装lamp-php5.6
date: 2017-03-01 20:17:11
---

以前的老文章拉，直接就拿过来了。格式不改了



Centos7.2 下配置  nginx-1.42. 和 php-7.0.16 + mysql 源码编译安装方式 2017年3月1日

#### 安装编译工具
    yum install gcc automake autoconf libtool gcc-c++

#### 安装基础库 ( 无则安装，有则更新)
    yum install gd zlib zlib-devel openssl openssl-devel libxml2 libxml2-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libmcrypt libmcrypt-devel

#### 安装mysql ( 原先lamp中有了mysql，所以这部可以不用 )
    yum install mysql mysql-server

#### nginx依赖 正则PCRE库
```shell
yum install pcre pcre-devel
```

#### 编译nginx
```shell
cd /usr/local/src
wget http://nginx.org/download/nginx-1.4.2.tar.gz
tar zxvf nginx-1.4.2.tar.gz

cd nginx-1.4.2/
./configure --prefix=/usr/local/nginx
make && make install

# 启动nginx
cd /usr/local/nginx
./sbin/nginx
```

#### 编译php
```shell
# 源码编译php7.0.16 
    cd /usr/local/src
    wget http://cn2.php.net/get/php-7.0.16.tar.gz/from/this/mirror
    mv ./mirror ./php-7.0.16.tar.gz
    tar zxvf php-7.0.16.tar.gz
    cd php-7.0.16/

    ./configure --prefix=/usr/local/php7 \
    --with-gd \
    --with-freetype-dir \
    --enable-gd-native-ttf \
    --enable-mysqlnd \
    --with-pdo-mysql=mysqlnd \
    --with-openssl \
    --with-mcrypt \
    --enable-mbstring \
    --enable-zip \
    --enable-fpm

# 这里编译安装时间会很长
    make && make install
    
# 复制配置文件
    cp /usr/local/src/php-7.0.16/php.ini-development /usr/local/php7/lib/php.ini
    cp /usr/local/php7/etc/php-fpm.conf.default /usr/local/php7/etc/php-fpm.conf
    cp /usr/local/php7/etc/php-fpm.d/www.conf.default /usr/local/php7/etc/php-fpm.d/www.conf
    
# 启动php
/usr/local/php7/sbin/php-fpm
```


#### nginx和php的整合
```nginx
# 整合nginx+php
# 编辑nginx的配置文件 找到如下代码段,去掉注释和修改
# 将.php文件的请求转发给 php进程
location ~ \.php$ {
    root           html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $DOCUMENT_ROOT$fastcgi_script_name;
    include        fastcgi_params;
}

# 修改nginx配置文件后记得reload
/usr/local/nginx/sbin/nginx -t
/usr/local/nginx/sbin/nginx -s reload
```

#### 编写测试文件
```php
编写测试PHP页面
/usr/local/nginx/html/index.php

<?php
    phpinfo();
?>

出现phpinfo即可
```


nginx日志

nginx启动后在 nginx目录下会产生个logs 文件夹里面保存着一些日志文件

其中nginx.pid 中记录了nginx的pid    cat /usr/local/nginx/logs/nginx.pid

access.log 中记录了 用户访问nginx的信息      error.log 中记录了 错误信息



#### 80端口占用

   ps -aux | grep 80    
   ps -aux | grep nginx

        因为在自己服务器上有着之前配置的 lamp 环境, 所以存在着 apache占用了80端口的情况
    
        #修改nginx配置文件 监听端口 8000

   cd /usr/local/nginx
   cd conf
   vi nginx.conf
   36行 listen 8000
   cd ../sbin
   ./nginx

#### nginx 的命令参数

   # nginx主程序在 /nginx/sbin目录下
   进入目录  ./nginx      启动nginx

   ./nginx -t        测试配置是否正确
   ./nginx -s reload    加载最新配置     kill -HUP nginx.pid
   ./nginx -s stop    立即停止nginx     kill -TERM
   ./nginx -s quit     优雅停止nginx
   ./nginx -s reopen    重新打开日志文件

#### yum安装时提示保护多库版本的解决

   yum install --setopt=protected_multilib=false zlib



#### nginx下支持 blog/index.php  -> blog
```nginx
location / {    
  root   html;
  index  index.php index.html index.htm;
}
# 重新reload加载配置文件
/usr/local/nginx/sbin/nginx -s reload
```



#### nginx 支持pathinfo
```nginx
#  nginx默认不支持 pathinfo , 这样像thinkphp中的路由便无法支持 
#  index.php/Admin/Index/index
# 这里提供了两种方法 第一种为典型配置, 第二种来自燕十八老师

# 典型配置
location ~ \.php$ {
    root           html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $DOCUMENT_ROOT$fastcgi_script_name;
    include        fastcgi_params;
}

# 修改第1,6行,支持pathinfo (from 十八哥)
location ~ \.php(.*)$ { # 正则匹配.php后的pathinfo部分
    root html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $DOCUMENT_ROOT$fastcgi_script_name;
    fastcgi_param PATH_INFO $1; # 把pathinfo部分赋给PATH_INFO变量
    include        fastcgi_params;
}
```

#### nginx 重写rewrite隐藏index.php
 ```nginx
  location /blog {  # 项目目录
      root   html;
      index  index.php index.html index.htm;
      # url重写规则 注意空格
      if ( !-e $request_filename) {
          rewrite (.*)$ /blog/index.php/$1;
      }
    }
 ```

#### laravel框架需要 stroage目录权限, bootstrap/cache目录权限