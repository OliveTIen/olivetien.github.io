---
title: 如何创建个人主页
categories: 
  - web
date: 2023-11-23 11:16:50
tags:
  - web
---
# 用Hexo创建静态博客网站

[网站1](http://tanglab.pku.edu.cn/2022/11/24/R&D/2022/GitHub_pages_tutorial_sequel/)详细讲解了如何用hexo创建个人主页
[网站2](https://easyhexo.com/2-Theme-use-and-config/)hexo主题集锦
[网站3](https://www.runoob.com/markdown/md-tutorial.html)Markdown教程

踩坑记录：
1. 先用hexo生成，再推送到github。因为hexo初始化需要保证是空目录
2. 发现" [https://olivetien.github.io/](https://olivetien.github.io/) "显示404。原因根目录没有index.html。应该将public文件夹推送上去，而不是将整个项目目录推送上去

为避免丢失，我将源码放在github私有目录中(当作网盘使用了)

工作流程：
1. 用vscode打开本地源码目录，编写md
2. 根目录打开终端，输入“hexo s”，实时修改，查看效果
3. 根目录打开终端，输入“hexo clean” “hexo g”编译
4. 将代码复制到public，用github客户端推送两个respectory
5. 推送完成后，等待2分钟(等网页更新)


其他感受：
git作为网盘还挺好用的

问题：
按照网站1的教程，用markdown格式插入图片，好像无法直接显示为图片，只能显示为超链接
[img](./How-to-create-a-personal-homepage.md/img.png) <!--没有“!”则是超链接-->
或许可以用我的图床(忘记了，好像是raw.github之类的网站，可以直接链接到图片)
也可以用hexo格式。
{% asset_img img.png This is an example image %}