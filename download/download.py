# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import os
import Model
from Urls import download_Urls 
from  common.common import logged,download

render_base=web.template.render('download/templates',base='../../templates/T_index',globals={'logged':logged})
render=web.template.render('templates')

download_app =web.application(download_Urls  , locals()) 

class download_papers:
    def GET(self):
        papers=Model.admin_papers_manager_Get()
        try :
            name_id=web.input()['name_id']
        except:
            name_id=logged()
        return render_base.download_papers(papers,name_id)

class load:
    def GET(self):
        name_id=web.input()['name_id']
        path=web.input()['href']
        if not logged(name_id):
            return   render.jmp_parameter('先登录',"/login?url=/download/papers")
        user=Model.admin_personnel_info_Get(name_id=name_id)[0]
        paper=Model.admin_papers_manager_Get(href=path)[0]
        if int(user['credit']) < int(paper['value']):
            return render.jmp_parameter('积分不够','/download/papers')
        downlo= download(path).next()
        if  downlo:
            user['credit']=int(user['credit']) - int(paper['value'])
            if "_id" in user:user.pop("_id")
            Model.admin_personnel_info_Edit(user)
            return downlo
        
