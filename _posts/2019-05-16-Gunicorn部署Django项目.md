---
title: Gunicorn部署Django项目
date: 2019-05-16
categories:
- django
tags:
- gunicorn
- nginx
---

之前用uswgi+nginx部署自己的Django博客，发现，好像不太方便，而且时常挂，还没Django自己的runserver服务器稳定，可能是自己配置不当，后来使用了Gunicorn，这里记录一下下配置文件



#### 配置Nginx站点配置信息(环境是Ubuntu)

```nginx
# shell下执行，添加自己站点的server块配置信息
# vim /etc/nginx/sites-available/binblog
# 添加软连接到enabled启动当前配置项
# ln -s /etc/nginx/sites-available/binblog /etc/nginx/sites-enabled/binblog
# 修改/etc/nginx/sites-available/default默认监听的80
# systemctl restart nginx

server {
    listen         80;  # 监听的端口，80端口，同时需要修改nginx默认的80页面
    server_name    bin.lotiger.cn;  # 名称
    charset UTF-8;

    location /static{
        # django静态文件路径 url里 /static 都指向文件路径.../collectedstatic目录
        alias /var/www/html/binblog-Django/collectedstatic;
    }
	
	location /media{
        # django媒体文件路径 url里 /media 都指向文件路径.../media目录
		alias /var/www/html/binblog-Django/media;
	}

	location / {
        # 其他/下的就转发给socket处理
		proxy_set_header Host $host;
		proxy_pass http://unix:/tmp/bin.lotiger.cn.socket;  # 固定格式 修改对应的server_name
	}
 }
```



#### 安装Gunicorn和启动

```
# 直接pip安装即可
pip install gunicorn

# 进入自己的项目目录  daemon设置为守护进程，bind绑定socket
gunicorn --daemon --workers 2 --bind unix:/tmp/bin.lotiger.cn.socket binblog.wsgi:application
```

