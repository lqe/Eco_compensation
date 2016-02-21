# -*- coding:utf-8 -*-
'''Created on 2014-9-27 @author: Administrator'''

import web
import Model
import json
import os
import xlwt
from Urls import meeting_Urls
from  common.common import (object_encoder,response,logged,upload,download)

render_com=web.template.render('templates/')
render=web.template.render('meeting/templates/')
render_base=web.template.render('meeting/templates/',base='../../templates/T_index',globals={'logged':logged})
meeting_app =web.application(meeting_Urls , locals())

class meeting:
    def GET(self):
        _id=web.input(_id=None)['_id']
        res=Model.admin_meeting_Qurery(category='baseInfor')
        re=Model.admin_meeting_Qurery(_id=_id)
        if not res:
            kw={'category':'baseInfo'}
            ll=['_id','title','editor','content','holder','city','cyc','date','addr','start','deadline','linkman','phone']
            for i in ll:
                kw[i]=''*14
        if not re:
            re=(not res) and [kw] or [res[0]]
        return  render_base.meeting(res,re[0])
class meeting_get:
    def GET(self,category):
        if category=='baseInfor':
            res=Model.admin_meeting_Qurery(category=category)
        elif category=='participants':
            res=Model.admin_meeting_Qurery(meetingID=web.input()['_id']) #参加同一个会议的人员信息的meetingID值相同等于会议记录的_id
        if res:
            count=len(res)
            t = '{' + 'data:' + json.dumps(res, cls=object_encoder) + ',total:'+str(count)+'}'
            return t
class meeting_add:
    def POST(self,category):
        data=web.input()
        yes=0
        if category=='baseIfor':
            yes=Model.admin_meeting_add(data)
        elif category=='participants':
            data['category']='participants'
            yes=Model.admin_meeting_add(data)
        if yes:
            return response(True,'Ok')
        else:
            return response(False,'数据库忙')
            
class meeting_update:
    def POST(self,categroy):
        data=web.input()
        yes=0
        _id=data.pop('_id')
        print _id
        if categroy=='baseIfor':
            yes=Model.admin_meeting_update(_id,data)
        if yes:
            return response(True,'Ok')
        else:
            return response(False,'数据库忙')           

class meeting_del:
    def POST(self,category):
        data=web.input()
        yes=0
        _id=data.pop('_id')
        print _id
        if category=='baseIfor':
            yes=Model.admin_meeting_del(_id)
        elif category=='participants':
            yes=Model.admin_meeting_del(_id)
        if yes:
            return response(True,'Ok')
        else:
            return response(False,'数据库忙')  

class meeting_export:
    def GET(self):
        meeting=Model.admin_meeting_Qurery(_id=web.input()['_id'])[0]
        participants=Model.admin_meeting_Qurery(meetingID=web.input()['_id'])
        count = len(participants)
        filename = meeting['title']+'.xls'
        wbk =xlwt.Workbook()
        get_cwd=lambda: os.path.normpath(os.getcwd())
        cwd = get_cwd()
        output_path='/static/temp' 
        sheet =wbk.add_sheet('sheet 1')
        path=cwd+output_path+'/'+filename
        alist2=['p_name','p_linkman','p_tel','p_mobile','p_fax','p_email','p_province','p_city','p_addr','p_zip','p_homepage','p_qq','p_job','p_detail']
        alist1=['公司名称','联系人','电话','手机','传真','Email','省份','城市','地址','邮编','网址','QQ','职务','与会要求']
        for i in range(0,14):
            sheet.write(0,i,u'%s'%alist1[i])
        for i in range(0,count):
            for j in range(0,14):
                sheet.write(i+1,j,u'%s'%participants[i][alist2[j]])
        wbk.save("%s" %path)
        downlo= download(path).next()
        os.remove(path)
        if  downlo:
            return downlo
        





