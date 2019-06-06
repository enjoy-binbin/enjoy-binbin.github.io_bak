---
title: 在外部使用Django的ORM
date: 2018-12-02
categories:
- django
tags:
- django
---

在以前写的商城项目中，有自己的json格式的数据，需要将json格式的数据写入数据库中，下面记录了当时如何使用Django-ORM写入数据。



#### 调用django的ORM

一吧可以直接 python manage shell 进入django环境进行调试



单纯记录一下

```python
# 独立使用django的model
import sys
import os

# 获取当前目录的绝对路径, __file__是本文件的 绝对路径
pwd = os.path.dirname(os.path.realpath(__file__))
# print(pwd)  # D:\A-python\MxShop\db_tools

sys.path.append(pwd + "../")  # 当前的项目目录，加到根搜索路径
# 设计配置文件的 环境变量， 上面设置了项目根目录
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shop.settings")

import django

django.setup()

from goods.models import GoodsCategory
from db_tools.data.category import row_data

for lev1_cat in row_data:
    lev1_intance = GoodsCategory()
    lev1_intance.code = lev1_cat["code"]
    lev1_intance.name = lev1_cat["name"]
    lev1_intance.category_type = 1
    lev1_intance.save()

    for lev2_cat in lev1_cat["sub_categorys"]:
        lev2_intance = GoodsCategory()
        lev2_intance.code = lev2_cat["code"]
        lev2_intance.name = lev2_cat["name"]
        lev2_intance.category_type = 2
        lev2_intance.parent_category = lev1_intance
        lev2_intance.save()

```


​	

​	



