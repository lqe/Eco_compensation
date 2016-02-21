# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import sys
from json import dumps

if not '..' in sys.path:sys.path.append("..")   #用于import上级目录的模块
import Model
from  common.common import (response,logged,upload)

render=web.template.render('templates/')
class Del:
    def GET(self):
        data=web.input()
        _id=data['_id']
        if _id:
            return Model.DelSingleBlog(_id=_id) 
class blog_single_self:
    def GET(self):
        print 'blog_single_self函数调用GET'
        data=web.input()
        _id=data['_id']
        blog=Model.GetBlogs(_id=_id)
        name_id=blog[0]['author']
        classification=Model.GetClassification(name_id)
        return render.blog_single_self(name_id,classification,blog)
class blog_single_other:
    def GET(self):
        print 'blog_single_other函数调用GET'
        data=web.input()
        visitors=data['visitors']
        article_id=data['article_id']
        article_author=data['article_author']
        if 'comment' in data:
            comment={}
            comment['content']=data['comment']
            comment['author']=visitors
            import time
            comment['date']=time.strftime('%Y-%m-%d',time.localtime(time.time()))
            Model.Add_OR_Edit_blog_articles(article_id,comment=comment)
            web.seeother('/blog_single_other?visitors='+visitors+'&&article_author='+article_author+'&&article_id='+article_id)
        #获取所看文章信息
        blog=Model.GetBlogs(_id=article_id)
        #获取文章作者信息
        person_info=Model.login(article_author)[0]
        classification=Model.GetClassification(article_author)
        return render.blog_single_other(person_info,classification,blog,visitors)
class Get:
    def GET(self):
        print 'Get函数调用GET'
        data=web.input()
        name_id=data["name_id"]
        mylist=Model.GetClassification(name_id).keys()
        mydict=[]
        for i in mylist:mydict.append({"value":i})
        t='{' + 'data:' + dumps(mydict)+'}'
        return t
class blog_content_manage:
    def GET(self):
        print 'blog_content_manage函数调用GET'
        data=web.input()
        name_id=data['name_id']
        skip=0 if "skip" not in data else int(data["skip"])
        limit=10 if "limit" not in data else int(data["limit"])
        if 'classification' in data:    #说明是blog_content_manage页面中通过发送   带有classification 分类参数  获取页面的
            classification=data["classification"]
            total=Model.GetBlogsTotal(author=name_id,classification=classification)
            blogs=Model.GetBlogs(author=name_id,classification=classification,sort={"date":-1},limit=limit,skip=skip)  
        else:
            total=Model.GetBlogsTotal(author=name_id)
            blogs=Model.GetBlogs(author=name_id,sort={"date":-1},limit=limit,skip=skip)
        classification=Model.GetClassification(name_id)
        return render.blog_content_manage(name_id,classification,blogs,skip,limit,total)
class upload(upload):
    pass
class write_blog:  
    def GET(self):
        print 'write_blog函数调用GET'
        data=web.input()
        if "_id" in data:
            blog=Model.GetBlogs(_id=data["_id"])
            name_id=blog[0][u'author']
            blog[0][u'_id']=str(blog[0][u'_id'])    #把objected对象转化为字符串 ，否则不能 装成json格式
            return render.write_blog(name_id=name_id,blog=dumps(blog))
        elif "name_id" in data:
            name_id=data["name_id"]
            if logged(name_id):  
                return render.write_blog(name_id=name_id)
        else:
            pass
    def POST(self):
        print 'write_blog函数调用POST'
        GetDict=web.input()
        #for i in web.input():
        #    print type(i),type(web.input()[i]),i,'-->',GetDict[i]
        try:
            _id,name_id,date,title,content=GetDict["_id"],GetDict["name_id"],GetDict["date"],GetDict["title"],GetDict["content"]
            try:classification=GetDict["classification"]
            except:classification="未分类博客" 
            if name_id and date and title and content:
                T=Model.Add_OR_Edit_blog_articles(_id,name_id,date,title,content,classification)
                return response(True,"操作成功！") if T else response(False,"数据库忙")
                #return web.seeother('/user_blog?name_id='+name_id)
            else:
                return response(False,"内容不能为空")
        except:
            raise '发博文请求错误'

if  __name__=='__main__':
    pass
    