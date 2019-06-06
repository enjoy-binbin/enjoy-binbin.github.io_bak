---
title: Django中使用memache缓存
date: 2019-02-27 16:25:35
categories:
- django
tags:
- django
---

在自己博客系统中，使用缓存将一些文章缓存起来。一天刷新一次或者啥的，对于管理员可以多设置一个接口，点击后就刷新一下缓存。



### 在django中使用缓存

文档地址：https://docs.djangoproject.com/en/2.1/topics/cache/

中文文档：http://djangobook.py3k.cn/2.0/chapter15/

django的缓存系统中有基于全站，有基于视图等不同粒度的缓存

下面我根据自己的想法，只使用了最基本的，cache.get和cache.set两个接口

一般缓存处理逻辑，在缓存中查找数据，有则返回，否则则从数据库获取数据并写入缓存

### 使用本地内存缓冲

```python
# settings.py里配置
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',  # 本地内存缓存
        'TIMEOUT': 60 * 60 * 1,  # 过期时间 秒, 一个钟过期
        'LOCATION': 'unique-snowflake',
    }
}

# views.py中
from django.core.cache import cache
from django.views.generic import ListView

from blog.models import Article

class IndexView(ListView):
    """ 首页view，返回一些文章列表 """
    model = Article  # 指定的model
    template_name = 'blog/index.html'  # 渲染的模板
    context_object_name = 'article_list'  # 在模板中使用的上下文变量，默认为 object_list
    page_kwarg = 'page'  # 前端约定好的页码的key

    def get_queryset(self):
        queryset = cache.get(self.cache_key)  # 查询缓存
        if not queryset:  # 缓存没命中会返回 None
            queryset = super().get_queryset()  # 调用父类的方法
            cache.set(self.cache_key, queryset)  # 设置缓存
        return queryset

    @property
    def page_value(self):
        """ 前端页码值，用于做缓存key的拼接 """
        page = self.request.GET.get(self.page_kwarg) or 1
        return page

    @property
    def cache_key(self):
        """ 缓存里的key """
        return 'index_%s' % self.page_value
    
 # 缓存设置,想在本地看到是否有效,可以实时更改数据库里的数据,缓存里的数据不会变
```



### 使用Memcached进行缓存

首先安装memcached (本机win10 64位)

下载地址：http://static.runoob.com/download/memcached-win64-1.4.4-14.zip

参考连接：http://www.runoob.com/memcached/window-install-memcached.html

按照链接下载符合版本的文件，解压后，进入命令行，注意使用管理员命令行

```
# 安装服务，之后可以在 我的电脑>管理>服务和应用程序中查看，可以这样启动或关闭
d:\memcached>memcached.exe -d install

# 启动服务
d:\memcached>memcached.exe -d start

# 关闭服务
d:\memcached\memcached.exe -d stop

# 卸载
d:\memcached\memcached.exe -d uninstall

# 设置 memcached 最大的缓存配置为512M
d:\memcached>memcached.exe -d runserver -m 512
```

```shell
# 一些命令行操作，连接 set get
telnet 127.0.0.1 11211

# 设置一个缓存, key为bin，flag为0（不懂） 10s过期，存储5个字节
< set bin 0 10 5
> abcde
> STORED

# 获取一个缓存
< get bin
> VALUE bin 0 5
> abcde
> END

其他略。
```



#### 在django中使用memcached缓存

安装python-memcached `pip install python-memcached`，记得安装和启动memached服务

```python
# settings.py里配置
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',  # 连接主机和端口
        'TIMEOUT': 60 * 60 * 1,  # 过期时间 单位为秒
    }
}

# views中的逻辑和之前的一样
from django.core.cache import cache
from django.views.generic import ListView

from blog.models import Article

class IndexView(ListView):
    """ 首页view，返回一些文章列表 """
    model = Article  # 指定的model
    template_name = 'blog/index.html'  # 渲染的模板
    context_object_name = 'article_list'  # 在模板中使用的上下文变量，默认为 object_list
    page_kwarg = 'page'  # 前端约定好的页码的key

    def get_queryset(self):
        queryset = cache.get(self.cache_key)  # 查询缓存
        if not queryset:  # 缓存没命中会返回 None
            queryset = super().get_queryset()  # 调用父类的方法
            cache.set(self.cache_key, queryset)  # 设置缓存
        return queryset

    @property
    def page_value(self):
        """ 前端页码值，用于做缓存key的拼接 """
        page = self.request.GET.get(self.page_kwarg) or 1
        return page

    @property
    def cache_key(self):
        """ 缓存里的key """
        return 'index_%s' % self.page_value
    
# 缓存设置,想在本地看到是否有效,可以实时更改数据库里的数据,缓存里的数据不会变
# 对于 memcached服务，需要开启服务，而后重启Django项目，查看效果。
```



#### 管理员刷新缓存接口，配置一个url，点击后调用视图就可以手动刷新缓存

```python
@login_required
def refresh_cache(request):
    """ 清空缓存 """
    if request.user.is_superuser:
        from django.core.cache import cache
        if cache and cache is not None:
            cache.clear()

        messages.success(request, '缓存刷新成功')
        return redirect(reverse('blog:index'))
    else:
        return HttpResponseForbidden()  # 403封装的HttpResponse
```

