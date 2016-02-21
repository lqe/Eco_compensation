# -*- coding:utf-8 -*-
'''Created on 2014-8-7 @author: Administrator '''
import web
import os
from sgmllib import SGMLParser
from json import dumps
from json import JSONEncoder

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def download(path):
            f=None
            try:
                path=os.path.normpath(os.path.join(os.getcwd(),path))
                filename=os.path.basename(path)
                web.header('Content-Type','application/octet-stream')
                web.header('Content-disposition', 'attachment; filename=%s'%filename)
                f = open(path, "rb")
                while True:
                    c = f.read()
                    if c:
                        yield c
                    else:
                        break

            except Exception, e:
                print e
                yield None
            finally:
                if f:
                    f.close()
class object_encoder(JSONEncoder): 
    def default(self, obj, **kwargs):
        from bson.objectid import ObjectId
        import datetime
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:            
            return JSONEncoder.default(obj, **kwargs)
        
def response(success,msg):
    message = {'success':success, 'msg':msg}
    return dumps(message)

def logged(name_id=''):
    if name_id:
        try:
            return web.ctx.session[name_id]                            #若果登陆web.ctx.session中有name_id键，且值为True 若超时值为False
        except:
            return False
    else:
        try:
            return web.ctx.session['isLogged']                            #若果登陆web.ctx.session中有"isLogged"键，且值为True 若超时值为False
        except:
            return False
    
class upload:
    def POST(self):
        print 'upload函数调用POST'
        data = web.input(blog_content_img={},filedir="")
        filedir='./static/upload/%s/' % data['filedir']
        if 'blog_content_img' in data:
            filename=data.blog_content_img.filename.decode('utf-8')
            fout=open(filedir+filename,'wb')
            fout.write(data.blog_content_img.file.read())
            fout.close()
        msg={"explain":data['explain'],'width':data['width'],'height':data['height'],'src':filedir+filename}
        return response(True,msg)  
        
class Get_breif(SGMLParser):
    '''解析html 获取标签内容的前250个字符，并获取其中的前3张图片  用于生成博客的内容简要 '''
    def reset(self):
        print 'Get_breif函数调用reset'
        SGMLParser.reset(self)
        self.imgs=''
        self.breif_content=''
        self.end=''
        self.flag=True
    def handle_data(self, data):
        i=0
        while (i<len(data) and self.flag):
            if len(self.breif_content)>250:
                self.breif_content+='<span style="font-weight: bold">...</span><input class="show_all_content" type="button" value="展开全文"/>'
                self.end='<input class="show_all_content" type="button" value="收起全文"/>'
                self.flag=False
                break
            self.breif_content+=data[i]
            i+=1  
    def start_img(self,attrs):
        img='<img '
        for k,v in attrs:
            if k not in ["width","height"]:
                img+=(' ' +k+'="'+v+'" ')
        img+='width="40" height="40" style=""/>'
        self.imgs+=img       

if  __name__=='__main__':pass
    