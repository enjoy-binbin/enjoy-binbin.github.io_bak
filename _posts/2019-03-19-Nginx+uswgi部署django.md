---
title: Nginx+uswgi部署django
date: 2019-03-19
categories:
- django
tags:
- django
- uswgi
---



这篇记录 如何在一个全新的Ubuntu18.04系统上使用 nginx+uswgi部署本博客项目，感觉很麻烦。后面都会使用gunicorn进行Django项目的部署，后面会再写一篇用于记录



#### 1. 安装虚拟环境

```
# 假定已经安装了 python3 pip3 mysql等环境

pip3 install virtualenv
pip3 install virtualenvwrapper

# 默认下virtualenvwrapper会安装到 /usr/local/bin目录下
# 新建一个文件夹存放虚拟环境，自定义
mkdir -p /var/www/envs

# 接着需要配置下 ~/.bashrc
vim ~/.bashrc

# 在末尾将虚拟环境目录添加进去
export WORKON_HOME=/var/www/envs
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
source /usr/local/bin/virtualenvwrapper.sh

# 使bashrc生效
source ~/.bashrc

# 创建虚拟环境
mkvirtualenv binblog

# 删除虚拟环境
rm /var/www/envs/binblog

# 查看虚拟环境列表
workon

# 激活虚拟环境
workon binblog

# 离开虚拟环境
deactivate binblog
```



#### 2. 安装博客项目

```
cd /var/www/html
# 克隆项目
git clone https://github.com/enjoy-binbin/binblog-Django.git

# 安装依赖
cd binblog-Django
workon binblog
pip install -r requirement.txt

# 设置配置文件，在里面配置自己的数据库连接信息
cp settings.py.example settings.py

# 数据迁移
python manage.py migrate

# 用django.runserver启动项目, 记得设置服务器上相关安全组
python manage.py runserver 0.0.0.0:8081
```

![image](https://raw.githubusercontent.com/enjoy-binbin/enjoy-binbin.github.io/master/assets/images/post/190319-1.png)

#### 3. nginx+uswgi部署Django项目

当然线上环境，得关闭DEBUG，使用nginx来代理静态文件

##### 3.1 安装uswgi

```
workon binblog
pip3 install uwsgi

# 收集静态文件 （这部分需要去看settings里的 STATIC_ROOT等设置项）
python manage.py collectstatic
```

##### 3.2 创建uswgi配置文件

vim /var/www/html/binblog-Django/binblog/uwsgi.ini

```
# binblog-Django/binblog/uswgi.ini
[uwsgi]

# Django-related settings

# 当用 uSWGI作为单独的web server时使用
# http = :8000

# 当配置 nginx + uSWGI时, 使用socket
socket = :8000

# The base directory(Full path)
chdir = /var/www/html/binblog-Django

# binblog.wsgi.py 项目目录下的wsgi文件
module = binblog.wsgi

# Process-related settings
master = true

# Maximum number of worker process
processes = 4

vacuum = True
```

##### 3.3 用配置文件启动 uwsgi

```
workon binblog

# 关闭django项目里的 DEBUG
DEBUG = False

uwsgi --ini /var/www/html/binblog-Django/binblog/uwsgi.ini

# 关闭 uwsgi
killall -9 uwsgi
```



##### 3.4 安装nginx

```
apt install nginx
```



##### 3.5 nginx的配置

```
# 启动、关闭、重启 nginx (start, stop, restart)
systemctl restart nginx

# nginx的配置文件位于 /etc/nginx目录下
```



**在sites-available目录下添加自己站点的配置文件**

`vim /etc/nginx/sites-available/binblog`

```
# 添加下面的信息，使用nginx代理 80端口
server {
        listen         80;
        server_name    bin.lotiger.cn
        charset UTF-8;
        access_log      /usr/local/nginx/logs/myweb_access.log;
        error_log       /usr/local/nginx/logs/myweb_error.log;

        client_max_body_size 75M;

        location / {
            include  uwsgi_params;
            uwsgi_pass  127.0.0.1:8000;
            uwsgi_read_timeout 30;
        }

        location /static{
            alias /var/www/html/binblog-Django/collectedstatic;
        }
        	
        location /meida{
            alias /var/www/html/binblog-Django/media;
        }
 }
```



**创建软连接，因为nginx默认会加载所有sites-enabled/*下的配置信息文件 **

`ln -s /etc/nginx/sites-available/binblog /etc/nginx/sites-enabled/binblog`



**修改nginx默认的default配置信息，将其默认监听端口为改了**

`vim /etc/nginx/sites-available/default`

```
listen 8080 default_server;
listen [::]:8080 default_server;
```

**重启nginx和强制刷新浏览器，访问**

![image](https://raw.githubusercontent.com/enjoy-binbin/enjoy-binbin.github.io/master/assets/images/post/190319-2.png)