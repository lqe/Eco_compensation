# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
from sys import path as sys_path
if not '..' in sys_path:sys_path.append("..")   #用于import上级目录的模块

import web
#早起的把一个文件分成多个文件，再把class导入
from login.login  import (index,login,loginCheck,In,reset,register,find_password)
from blog.blog    import (write_blog,upload,blog_content_manage,Get,Del,blog_single_self,blog_single_other)
from admin.admin import  (adminAdd,adminGet,adminDel,adminEdit) 
#后期应用web.py 的子应用
from wiki.view import wiki_app
from download.download import download_app
from meeting.meeting import meeting_app
from bbs.bbs import bbs_app
urls=(
      '/','index',
      '/login','login',
      '/loginCheck','loginCheck',
      '/(admin|user_blog)','In',
      '/reset/(.*)','reset',
      '/register','register',
      '/find_password','find_password',
      '/write_blog','write_blog',
      '/upload','upload',
      '/blog_content_manage','blog_content_manage',
      '/Get/classification','Get',
      '/Del/blog_content','Del',
      '/blog_single_self','blog_single_self',
      '/blog_single_other','blog_single_other',
      '/admin/add','adminAdd',
      '/admin/get','adminGet',
      '/admin/del','adminDel',
      '/admin/edit','adminEdit',
      '/wiki',wiki_app,
      '/download',download_app,
      '/meeting',meeting_app,
      '/bbs',bbs_app,
)

app = web.application(urls ,locals()) 

#session 在web.config.debug = False模式下可用 可以用一下方式解决 生产中 一般设置web.config.debug = False
web.config.debug = True    
if web.config.get('_session') is None:
    session = web.session.Session(app,web.session.DiskStore('sessions'))
    web.config._session=session
    
else:
    session=web.config._session
    
#用以下方式可以解决多文件之间传递session的问题  
def session_hook():web.ctx.session=session
app.add_processor(web.loadhook(session_hook))

if  __name__=='__main__':
    app.run()
