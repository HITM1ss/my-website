---
title: 利用AI agent解决iCloud Drive功能在Windows平台下无法使用的问题
published: 2026-08-25
description: AI-agnet在日常问题中的实际应用
image: 'images/icloud-cover.avif'
tags: [AI, 生活]
category: Agent应用
draft: false
---

# 问题描述

看到大佬使用Onedrive后受到启发，想使用iCloud Drive来进行文件的跨平台快速传输。奈何win系统下的iCloud工作异常。

![无法开启iCloud功能](<iCloud Drive功能在Windows平台下无法使用/images/iCloud界面.avif>)

具体表现为：点击iCloud Drive开关后自动关闭（应该是服务启动失败），无论重新安装还是管理员启动都不能解决。

# 解决方案

网路上搜集结局方案基本都是一些几年前的话题，充斥着垃圾信息，解决无门。

如果咨询AI的话应该也无法解决，所以打算使用Agent直接操作电脑，读取本地文件和配置环境，还能自己看log，肯定比我一句一句问AI要高效很多。

由于Opencode自带免费Deepseek V4 flash模型，所以就选他了。

![opencode](<iCloud Drive功能在Windows平台下无法使用/images/Opencode界面1.avif>)

可以看到我仅仅几句提示词他就理解了我的意思，自己跑去查看PATH和报错日志，只需要在需要的时候给他一定的外部读取权限即可，还是相对安全的，BASH中的风险指令也能自己审批，只要不开全自动审批应该不会有大乱子。

# 最终结果

跑了一会，中途断连了一波，告诉他继续就行，完美解决。DS依旧稳定发挥，梁圣！

![alt text](<iCloud Drive功能在Windows平台下无法使用/images/Opencode结果.avif>)