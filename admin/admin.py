# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import sys
from json import dumps
from json import JSONEncoder

import Model
from  common.common import (response)
render=web.template.render('templates/')

class adminGet:
    def GET(self):
        '''参数中没有collection默认是对article集合获取操作'''
        print 'adminGet函数调用GET'
        data=web.input()
        if 'collection' in data:
            collection=data.pop('collection')
            if collection== 'personnel_info':
                kw={}
                if "name_id" in data:
                    kw["name_id"]=data["name_id"]
                list_info=Model.admin_personnel_info_Get(**kw)
                total=Model.admin_personnel_info_GetTotal()
            elif collection=='papers_manager':
                category=data['category']
                list_info=Model.admin_papers_manager_Get(category=category)
                total=Model.admin_papers_manager_GetTotal(category=category)
            else:
                pass
        else:
            category=data['category']
            list_info=Model.adminGet(category)
            total=Model.adminGetTotal(category)
        result= '{' + 'data:' + dumps(list_info, cls=JSONEncoder) + ',total:'+str(total)+'}'
        return result

class adminAdd:
    def POST(self):
        data=web.input(myfile={})
        yes=False
        myfile=data.pop("myfile")
        if 'collection' in  data :
            collection=data.pop('collection')
            if collection=='personnel_info':
                data['data_access']=int(data['data_access'])
                data['credit']=int(data['credit'])
                yes = Model.admin_personnel_info_Add(data)
            elif collection=='papers_manager':
                filedir='static/upload/papers_research/'
                filename=myfile.filename.decode('utf-8')
                fout=open(filedir+filename,'wb')
                fout.write(myfile.file.read())
                fout.close()
                data['href']=filedir+filename
                yes = Model.admin_papers_manager_Add(data)
            else:
                pass
        else:
            yes = Model.adminAdd(data)
        
        return response(True,'adminAdd成功') if yes else response(False,'adminAdd操作失败')
   
class adminDel:
    def POST(self):
        data=web.input()  
        yes=False
        _id=data["_id"]
        if 'collection' in  data :
            collection=data['collection']
            if collection =='personnel_info':
                yes=Model.admin_personnel_info_Del(_id)
            elif collection=='papers_manager':
                try:
                    #删除文件
                    from os import remove
                    href=data['href']
                    remove(href)
                    yes=Model.admin_papers_manager_Del(_id)
                except  WindowsError:
                    pass
            else:
                pass
        else: 
            yes = Model.adminDel(_id)
            
        return response(True,'del删除成功') if yes else response(False,'del删除失败')
    
class adminEdit:
    def POST(self):
        data=web.input()  
        yes=False
        if 'collection' in  data :
            collection=data.pop('collection')
            if collection=='personnel_info':
                data['data_access']=int(data['data_access'])
                data['credit']=int(data['credit'])
                yes=Model.admin_personnel_info_Edit(data)
            elif collection=='papers_manager':
                yes=Model.admin_papers_manager_Edit(data)
        else: 
            yes=Model.adminEdit(data)
        
        return response(True,'编辑成功') if yes else response(False,'编辑失败')
    
if  __name__=='__main__':
    pass
    