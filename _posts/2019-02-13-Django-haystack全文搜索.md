---
title: Django-haystack全文搜索
date: 2019-02-13 19:42:43
categories:
- django
tags:
- django
---



﻿### 使用django-haystack进行全局文章搜索

```python
pip install django-haystack==2.8.1
```

### githu地址和文档地址

​	https://github.com/django-haystack/django-haystack

​	https://django-haystack.readthedocs.io/en/v2.4.1/tutorial.html

### 安装搜索引擎

文档:https://django-haystack.readthedocs.io/en/v2.4.1/installing_search_engines.html

这里选择 Whoosh，Tolearn: Elasticsearch

```pip install whoosh==2.7.4```



### 这里注意 :

haystack只对在安装完毕后，重新添加的有效，之前创建的数据是没有建立索引无法搜索出来的(测试了好久/捂脸)



### 添加jieba作为中文分词

pip install jieba==0.39

复制一份 haystack.backends.whoosh_backend.py出来到utils目录下 `个人设置`

```python
# 修改其源代码
from jieba.analyse import ChineseAnalyzer
......
......
# 找到build_schema这个函数的
schema_fields[field_class.index_fieldname] = TEXT(stored=True, analyzer=StemmingAnalyzer()
# 将StemmingAnalyzer替换为jieba的ChineseAnalyzer
schema_fields[field_class.index_fieldname] = TEXT(stored=True, analyzer=ChineseAnalyzer()
```



添加 haystack 到 `INSTALLED_APPS`

settings里设置引擎:

```python
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}

# 如果要使用jieba的
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'utils.whoosh_cn_backend.WhooshEngine',  # 自定义使用jieba进行中文分词
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}
```



在blog目录下创建 search_indexes.py(看文档)

```python
from haystack import indexes
from .models import Article


class ArticleIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    def get_model(self):
        return Article
```

url设置

```path('search', include('haystack.urls'))	```



模板文件:

`search/indexes/myapp/aitilce_text.txt`

```
{{ object.title }}
{{ object.author.username }}
{{ object.content }}
```



模板文件 search.html，代码{-% extends 'base.html' %-} 标签去掉-，因为跟会liquid冲突。

```html
# 去掉 -
{-% extends 'base.html' %-}

# 去掉 -
{-% block content %-}
    <h2>Search</h2>
	
	# 去掉 -
    <form method="get" action="{-% url 'haystack_search' %-}> 
        <table>
            {{ form.as_table }}
            <tr>
                <td>&nbsp;</td>
                <td>
                    <input type="submit" value="Search">
                </td>
            </tr>
        </table>

        {% if query %}
            <h3>Results</h3>

            {% for result in page.object_list %}
                <p>
                    <a href="{{ result.object.get_absolute_url }}">{{ result.object.title }}</a>
                </p>
            {-% empty %-}  # 去掉 -
                <p>No results found.</p>
            {% endfor %}

            {% if page.has_previous or page.has_next %}
                <div>
                    {% if page.has_previous %}<a href="?q={{ query }}&amp;page={{ page.previous_page_number }}">{% endif %}&laquo; Previous{% if page.has_previous %}</a>{% endif %}
                    |
                    {% if page.has_next %}<a href="?q={{ query }}&amp;page={{ page.next_page_number }}">{% endif %}Next &raquo;{% if page.has_next %}</a>{% endif %}
                </div>
            {% endif %}
        {% else %}
            {# Show some example queries to run, maybe query syntax, something else? #}
        {% endif %}
    </form>
{-% endblock %-}  # 去掉 -
```



重建索引 `./manage.py rebuild_index`
更新索引 `./manage.py update_index`

### 进阶吧

```
# 设置自动更新索引
# settings
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'
```



```python
# search_indexes.py
 
from haystack import indexes

from .models import Topic


class TopicIndex(indexes.ModelSearchIndex, indexes.Indexable):
    class Meta:
        model = Topic
        fields = ['title', 'markdown_content']
```





###  问题

他的分页，可以自己重写SearchView来进行分页的实现

参考: https://blog.csdn.net/caca95/article/details/84893990



