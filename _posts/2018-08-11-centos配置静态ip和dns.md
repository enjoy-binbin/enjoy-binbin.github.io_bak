---
title: centos配置静态ip和dns
date: 2018-08-11 16:09:24
---















Centos7下配置静态ip和dns，用于当时测试mysql主从复制，配的三台虚拟机用于实验。当时也有笔记的，保存在云服务器上，销毁没了的。



﻿# 设置为 net, 启动 vm8网卡

vi /etc/sysconfig/network-scripts/ifcfg-ens33

ONBOOT=yes
BOOTPROTO=static
IPADDR=192.168.88.100
NETMASK=255.255.255.0
GATEWAY=192.168.88.2
NM_CONTROLLED=no

systemctl restart network.service
sevice network restart


ipaddr

# 配置dns
vi /etc/NetworkManager/NetworkManager.conf
dns=none

vi /etc/resolv.conf
nameserver 8.8.8.8
nameserver 8.8.4.4

ping www.baidu.com