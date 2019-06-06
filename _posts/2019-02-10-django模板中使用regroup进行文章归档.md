---
title: django模板中使用regroup进行文章归档
date: 2019-02-10
categories:
- django
tags:
- django
---

文章归档的实现有好几种方式，可以在View视图中根据日期先找出来，下面使用了regroup模板标签在模板中方便的对object_list进行归档。注意下面的{-% regroup %-}标签需要去掉-，因为跟liquid标签冲突了。



### 博客文章按日期归档

基本用法为 `{-% regroup 类列表对象 by 列表中元素的某个属性 as 模板变量 %-}`

下例中根据 `aritlce_list`列表中元素的 `add_time.year`  属性  `regroup`  了 `cities`，并通过 as 将分组后的结果保存到了 `country_list` 模板变量中。

然后可以循环这个分组后的列表。被循环的元素包含两个属性：

- `grouper`，就是分组依据的属性值，例如下面中的 19年 18年
- `list`，属于该组下原列表中元素



```python
# model
from django.db import models
	class Article(models.Model):
		title = models.CharField(max_length=100)
    	add_time = models.DatetimeField()

# view，这里如果不用通用视图，只需要view里能返回一个有序的article_list即可
class ArchivesView(ListView):
    template_name = 'blog/archives.html'  # 渲染的模板
    context_object_name = 'article_list'  # 模板中上下文调用的对象名称
    queryset = Article.objects.all().order_by('-add_time')  # 这里需要排好序
    
# template 
{-% regroup article_list by add_time.year as year_list %-}
<ul>
    {% for year in year_list %}
        <li>{{ year.grouper }} 年
            {-% regroup year.list by add_time.month as month_list %-}
            <ul>
                {% for month in month_list %}
                    <li>{{ month.grouper }} 月
                        <ul>
                            {% for article in month.list %}
                                <li><a href="{{ article.get_absolute_url }}">{{ article.title }}</a></li>
                            {% endfor %}
                        </ul>
                    </li>
                {% endfor %}
            </ul>
        </li>
    {% endfor %}
</ul>

```

## 总结

`regroup` 模板标签对于需要层级分组显示的对象十分有用。但有一点需要注意，**被分组的对象一定要是已经有序排列的**，否则 `regroup` 无法正确地分组。相信从以上两个示例中你可以很容易地总结出 `regroup` 模板标签的用法，从而用于自己的特定需求中，例如像知乎一样对用户每天的通知进行分组显示。