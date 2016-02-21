# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import sys


import Model
from  common.common import (logged,Get_breif,response)

render=web.template.render('templates/')
render_B=web.template.render('templates/',base='T_index',globals={'logged':logged})
class index:
    def GET(self):
        print "index函数调用GET"
        data=web.input()
        if '_id' in data:
            article=Model.articleGet(data['_id'])
            return render_B.article_detail(article)
        if 'category' in data:
            category=data['category']
            skip=0 if "skip" not in data else int(data["skip"])
            limit=15 if "limit" not in data else int(data["limit"])
            total=Model.adminGetTotal(category)
            if category != 'plat':
                article=Model.adminGet(category,limit,skip)
                return render_B.articles(article,skip,limit,total)
            else:
                article=Model.adminGet(category)
                return render_B.article_detail(article)
        else:
            article=Model.adminGet('policies',20)
            newMeetting=Model.admin_meeting_Qurery(category="baseInfor",limit=5)
            typeCase=Model.admin_papers_manager_Get(limit=5)
            return render_B.index(article,newMeetting,typeCase) 
        
class register:   
    def POST(self): 
        print 'register函数调用POST'
        content=web.input()                                     #获取提交的内容
        name_id,password,department,email=content.name_id,content.password,content.department,content.email 
        name=content['name']
        if name_id and password and department and email:
            if name=='':
                name='默认名'
            if Model.registerUser(name_id,password,department,email,name):
                return render.jmp_parameter("注册成功")
            else:
                return render.jmp_parameter("数据库忙")
        else:
            return render.jmp_parameter("信息不完整")
class loginCheck:
    def GET(self):
        data=web.input()
        name_id=data['name_id']
        if Model.admin_personnel_info_Get(name_id=name_id):
            return response(False,'已注册')
        else:
            return response(True,'OK')
class login:  
    def GET(self): 
        """接受url参数 用于成功登陆后 转向url"""
        print 'login函数调用GET'
        url=web.input(url='')['url']
        return render.login(url,web.input(fun="login")['fun'])
    def POST(self):
        print 'login函数调用POST'
        content=web.input()  
        url=web.input()['url']  
        print url                                      #获取提交的内容
        name_id,password=content.name_id,content.password                #获取账户和密码
        try:
            person_info=Model.login(name_id)[0]
            if password==person_info['password'] and person_info['pass']=='yes' :
                #html={'user':'user_blog','admin':'admin'}                #角色与模板名之间的映射
                #role=person_info['role']
                #url=html[role]+"?name_id="+name_id
                if not url:     #从页面中获取登陆后的页面  为空则默认下面的    
                    url='user_blog'+"?name_id="+name_id
                web.ctx.session[name_id]=True                           #登陆后会在web.ctx.session中加一个{name_id:True}的标记
                web.ctx.session['isLogged']=name_id                        #后来改的，用于wiki登陆，只能一人使用
                return web.SeeOther(url)
            else :
                return render.login()
        except Exception,e:
            print e
            return render.jmp_parameter("异常登陆失败") 
class In:
    def GET(self,name):
        print "In函数调用GET"
        try:
            data=web.input(name_id=None)
            name_id=data['name_id']
            if not name_id or name_id=='False':
                return render.jmp_parameter('请先登录','/login')
            if logged(name_id): 
                if name=='user_blog':  
                    #若果登陆web.ctx.session中有name_id键，且值为True 若超时值为False                            
                    skip=0 if "skip" not in data else int(data["skip"])
                    limit=6 if "limit" not in data else int(data["limit"])
                    blogs=Model.GetBlogs(sort={"date":-1},limit=limit,skip=skip) 
                    total=Model.GetBlogsTotal()
                    for blog in blogs:
                        parser=Get_breif()
                        parser.feed(blog["content"])
                        parser.close()
                        blog['brief_content']=parser.breif_content
                        blog['brief_content']=parser.imgs+blog['brief_content']
                        blog['content']+=parser.end
                        parser.breif_content=parser.end=parser.imgs=''
                    person_info=Model.login(name_id)[0]
                    return render[name](name_id,person_info,blogs,skip,limit,total) 
                elif name=='admin':
                    return render[name](name_id) 
            else:
                raise
        except Exception,e:
            return e
class reset:
    '''注销后台登陆'''
    def GET(self,name_id):
        print "reset函数调用GET"
        web.ctx.session[name_id]= False
        web.ctx.session['isLogged']= False
        web.ctx.session.kill()      #当多个用户登录一天电脑是，其中一个注销，其它的也会注销
        homedomain= web.ctx.homedomain
        return web.seeother(homedomain)
class find_password:
    def GET(self):
        print "find_password函数调用GET"
        return render.jmp_parameter("密码找回")
    
if  __name__=='__main__': pass
    