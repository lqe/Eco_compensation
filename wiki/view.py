# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import Model
import json
from Urls import wiki_Urls
from  common.common import (response,logged,upload)

def islogged(func):
    def _call(*args,**kwargs):
        try:
            if logged():
                result = func(*args,**kwargs)
            else:
                result = render_s.jmp_parameter('请先登录','/login')
        except:
            result=None
            print func.__name__+"函数调用失败"
        finally:
            return result
    return _call

def gettype(obj):
    return type(obj)

def getPerson():
    name_id=logged()
    res=Model.admin_personnel_info_Get(name_id=name_id)
    if len(res):
        return res[0]
    else:
        return False
    
def getNav(postion,all=False):
    '''通过位置postion,返回一个元组（当前位置的记录，当前位置后代的记录，词条级别与其位置）
           当 all=False 当前位置后代 不包含 更改版本
            词条级别与其位置的映射 是指 位置root/a/b 生成的有序列表[('root','root'),('root/a','root'),('root/a/b','root')])
    '''
    articles=Model.wiki_article_get(postion=postion,using='yes')
    childrens,postions=Model.wiki_article_get_all_childrens_postion(postion,all,)
    #遍历列表，获取其中的字典元素，生成列表lis
    lis=[]
    def g(li):
        if type(li)==list:
            for i in li:
                g(i)
        elif type(li)==dict:
            lis.append(li)
        else:
            pass
    g(childrens)
    #形成文章级别的各个连接对应关系,并形成有序元组的列表
    i2,count,pos=0,postion.count('/'),{'root':'root'}
    while count :
        i1=postion.find('/',i2)
        i2=postion.find('/',i1+1)
        if i2==-1:i2=None
        pos.update({postion[:i2]:postion[i1+1:i2]})
        count-=1  
    temp=sorted(pos.items(),key=lambda e:e[0],reverse =False)
    pos=temp
    return articles,lis,pos   
render_s=web.template.render('templates/')
render=web.template.render('wiki/templates/')
render_base=web.template.render('wiki/templates/',base='wiki_base',globals={'mytype':gettype,'getPerson':getPerson,'getNav':getNav,'logged':logged})
wiki_app =web.application(wiki_Urls , locals()) 


class wiki:
    def GET(self):
        postion=str(web.input(postion='root')['postion'])
        articles,lis,pos=getNav(postion)
        return render_base.wiki(articles,lis,pos)
class wiki_create:
    @islogged
    def GET(self):
        data=web.input()
        postion=data['postion']
        return render_base.wiki_create(postion)
    @islogged
    def POST(self):
        data=web.input(act='create')
        for i in data:
            print i,'--->',data[i]
        #act=data['act'] #标识是创作还是修改
        kw={}
        kw['content']=data['content']
        kw['reason']=data['reason']
        kw['postion']=data['_postion']+data['postion']
        kw['title']=data['title']
        #author=data['author']
        #flag=data['flag'] 用于扩展标签
        kw['author']='Marco'
        kw['flag']=[]
        #if act=='edit':
        #    kw['article_id']=data['_id']
        if not  kw['title']:
            return render_s.jmp_parameter('标题不完整','/wiki/')
        if '_id' not in data:
            if not data['postion']:
                return render_s.jmp_parameter('位置不完整','/wiki/')
        yes=Model.wiki_article_create_or_edit(**kw)
        if yes  :
            return render_s.jmp_parameter('操作成功','/wiki?postion='+kw['postion'])
        else:
            return render_s.jmp_parameter('数据库忙','/wiki/')
class createCheck:
    def GET(self):
        data=web.input()
        if Model.wiki_article_get(postion=data['postion']):
            return response(True,'NO')
        else:
            return response(True,'OK')
            
class wiki_edit:
    @islogged
    def GET(self):
        if not logged():
            return render_s.jmp_parameter('请先登录','/login')
        _id=web.input()['_id']
        article=Model.wiki_article_create_or_edit(_id=_id)[0]
        return render_base.wiki_create(article['postion'],article)
class wiki_catalog:
    def GET(self):
        '''返回同一目录下的符合 适配器 Filter 的所有文章列表 限制10条记录'''
        data=web.input(query='',limit=10,skip=0)
        Filter=data['query'].strip()
        limit=int(data['limit'])
        skip=int(data['skip'])
        lgh=len(Filter)
        postion=web.input(postion='root')['postion']
        articles,lis,pos=getNav(postion)
        temp=[i for i in lis if Filter==i['title'][:lgh]]
        return render_base.catalog(articles,temp,pos,limit,skip)
class wiki_del:
    def GET(self):
        _id=web.input(id='-1')['_id']
        record=Model.wiki_article_get(_id=_id)
        if getNav(record[0]['postion'])[1]: #此次条下不能有文章
            return response(False,'删除失败')
        if Model.wiki_del(_id):
            return response(True,'删除成功')
        else:
            return response(False,'删除失败')
        
class wiki_history:
    def GET(self): 
        data=web.input(postion=None,limit=10,skip=0)
        limit=int(data['limit'])
        skip=int(data['skip'])
        if '_id' in data:
            kw={'using':'yes'}
            yes=Model.wiki_set(_id=data['_id'],**kw)
            if yes:
                return json.dumps({'success':True, 'msg':'OK'})
            else :
                return json.dumps({'success':False, 'msg':'OK'})
        postion=data['postion']
        versions=Model.wiki_article_get(postion=postion)
        articles,lis,pos=getNav(versions[0]['postion'])
        return render_base.history(articles,lis,pos,versions,limit,skip)
  
class wiki_search:
    def GET(self):
        filter=web.input(query='')['query'].strip()   
        results= Model.wiki_re_find(filter)
        return render_base.search(results)
            
if __name__=='__main__':
    pass
        
    
    
    
    
    
    
    