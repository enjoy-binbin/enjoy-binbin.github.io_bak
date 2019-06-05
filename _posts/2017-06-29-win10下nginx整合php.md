---
title: win10下nginx整合php
date: 2017-06-29 22:48:37
---

很久以前的笔记拉，很久之前学的php，记录一下。当时由于自己本地80端口上跑着Apache，对于Nginx，需要手动启动PHP和Nginx，所以使用了下面的批处理进行启动和关闭。


```
下载跳过拉,前面有 安装 lamp 基础的应该不打紧
也都是下载 zip 后解压

修改nginx的配置文件 nginx.conf
    监听 8080端口
        listen       8080;

    增加 php入口文件
        location / {
            root   html;
            #index  index.html index.htm;
            index  index.php index.html index.htm;
        }

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


cmd运行 php-cgi.exe 处理php进程 黑窗口需要一直运行
    D:\Abin-web\php>php-cgi.exe -b 127.0.0.1:9000 -c ./php.ini

启动nginx
    直接运行nginx.exe 黑窗口一闪而过即可
    重启的话.　任务管理器找到nginx进程关闭再打开


黑窗口运行-- 需要在当前目录下载 RunHiddenConsole.exe
    启动nginx+php
        @echo off
        REM 用RunHiddenConsole 运行 php-cgi 在 9000端口 
        echo Starting PHP FastCGI...
        RunHiddenConsole D:/Abin-web/php/php-cgi.exe -b 9000 -c D:/Abin-web/php/php.ini
         
        REM 用RunHiddenConsole 运行 nginx 在 8080端口 
        echo Starting nginx...
        RunHiddenConsole D:/Abin-web/nginx/nginx.exe

    关闭nginx+php
        @echo off
        REM 直接杀死 php 和 nginx 的进程
        echo Stopping nginx...  
        taskkill /F /IM nginx.exe > nul
        echo Stopping PHP FastCGI...
        taskkill /F /IM php-cgi.exe > nul
        exit

编写测试文件
    index.php
    <?php
        echo "nginx";
        phpinfo();
    ?>

浏览器访问 127.0.0.1:8080


# 有点点奇怪
# 项目blog配置, rewrite重写隐藏index.php
# 127.0.0.1/blog__close 访问路径
location /blog__close { 
    # 项目目录
    root   D:/Abin-web/web; 
    index  index.php index.html index.htm;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $DOCUMENT_ROOT$fastcgi_script_name;
    include        fastcgi_params;
    # 配置 index.php 重写失败。 
    # 可能因为blog没有放在 nginx/html 下
    # 又或者在window上 我不太会设置。
}

        location ~ \.php$ {
            root           D:/Abin-web/web;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $DOCUMENT_ROOT$fastcgi_script_name;
            include        fastcgi_params;
        }




```


#### 在win上一键启动nginx和php

```powershell
REM 注释，使用RunHiddenConsole，这是一款无界面的命令行工具
REM start_nginx_php.bat

@echo off

REM 用RunHiddenConsole 运行 php-cgi 在 9000端口 
echo Starting PHP FastCGI...
RunHiddenConsole D:/Abin-web/php/php-cgi.exe -b 9000 -c D:/Abin-web/php/php.ini
 
REM 用RunHiddenConsole 运行 nginx 在 8080端口 
echo Starting nginx...
RunHiddenConsole D:/Abin-web/nginx/nginx.exe
```



#### 在win上一键关闭nginx和php

```powershell
REM stop_nginx_php.bat

@echo off
REM 直接杀死 php 和 nginx 的进程
echo Stopping nginx...  
taskkill /F /IM nginx.exe > nul
echo Stopping PHP FastCGI...
taskkill /F /IM php-cgi.exe > nul
exit
```

