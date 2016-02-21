# -*- coding:utf-8 -*-
'''Created on 2015-2-5 @author: Administrator '''

import pdb
import web
import Model
import os
from Urls import bbs_Urls
import common.common as COM
from json import dumps
from time import localtime,strftime
from bson.objectid import ObjectId

globals={"logged":COM.logged,
         'mystr':lambda x:str(x),
         "rfind":lambda x,y:x.rfind(y),
         'time':lambda x: strftime('%Y-%m-%d %H:%M:%S',localtime(os.stat(x).st_ctime)),
         #获取精选的分组 用在导航中 bbs_content_base
         'getGroupFeated':lambda:Model.GGet(GFeatured=True)
         }
render= web.template.render("bbs/templates/",globals=globals)
render_B= web.template.render("bbs/templates/",base="bbs_content_base",globals=globals)
bbs_app= web.application(bbs_Urls,locals())

class base(object):
    def __init__(self):
        '''把web.input()获得的数据 转化为 对象的属性，
                            并输出
        '''
        print self.__class__.__name__+'调用'
        self.oriData=web.input()
        for i in self.oriData.keys():
            self.__dict__[i]=self.oriData[i]
        #如果含有page分页属性 增加 skip属性
        if hasattr(self, 'page'):
            limit=getattr(self,'limit',25)
            self.limit=int(limit)
            self.__dict__['skip']=(int(self.page)-1) * self.limit
        self.showAttr()
    def addDefaultAttr(self,*args,**kws):
        '''增加默认属性
            eg: 
                self.addDefaultAttr('a','b',c=2,d=3)
                            返回  {a:None,b:None}  {c:2,d:3} web.input() 合并后的字典
                            注释：后面的字典会 覆盖前面的字典内容
        '''
        tempDict=dict.fromkeys(args) 
        tempDict.update(kws)
        for i in tempDict.keys():
            if i not in self.__dict__:
                self.__dict__[i]=tempDict[i]
    def getAttrDict(self,*arg):
        dic={}
        for i in arg:
            if not hasattr(self,i):continue
            dic[i]=getattr(self,i)
            #转换boolean 传过来的是字符串 
            if dic[i]=='true':
                dic[i]=True
            elif dic[i]=='false':
                dic[i]=False
        return dic
    def showAttr(self):
        '''显示对象属性'''
        print '函数:'+self.__class__.__name__
        print '属性:'
        for i in self.__dict__:
            print " "*3 ,i,'-->',self.__dict__[i]
    def resAjax(self,Info,msg=""):
        '''返回对ajax请求的回应
            Model.fun 返回  
                                        空值  为失败
                                       数值   小于0 为失败  否则为成功
                                     字典   为失败  Info['msg']中包含出错信息             
        '''
        if not Info:
            success=False
            msg=msg or '返回信息为空' 
        elif isinstance(Info,(int,float)) and Info<0:
            success=False
            msg=msg or '返回数值小于0' 
        elif isinstance(Info,dict):
            success=False
            msg=Info['msg']
        else:
            success=True
            msg=msg or "操作成功"
        message={'success':success,'msg':msg}
        return dumps(message)  
    def resForm(self,text):
        '''返回对form的submit 或 load 请求的回应'''
        success= text and True or False
        message={'success':success,'data':text}
        return dumps(message)
    def resJson(self,**kw):
        return dumps(kw)
    def getId(self):
        return str(ObjectId())
    def getTime(self):
        now=localtime()
        return "%s-%s-%s %s:%s:%s" % \
            (
              now.tm_year,
              now.tm_mon,
              now.tm_mday,
              now.tm_hour,
              now.tm_min,
              now.tm_sec )   
    def dup(self,*kws,**kwargs):
        return dumps(*kws,**kwargs) 
    def focusTopic(self,num=10):
        '''根据帖子回复数量  返回前十名主题列表'''
        return Model.RankTFocus(num)
    def recommedTopic(self):
        '''根据版块楼主的推荐 返回主题列表'''
        return Model.RankTRecommend()
    def hotTopic(self,num=6):
        '''根据帖子的点击率 返回主题的前六名主题列表'''
        return Model.RankTHot(num)
    def scoreRank(self,num=5):
        '''根据积分的排名 返回前5名选手列表'''
        return Model.RankUScore(num)
class bbs(base):
    def __init__(self):
        super(self.__class__,self).__init__()
    def getTxt(self,path):
        ''''获取path下的所有jpg文件'''
        DAT_list=[]
        for (path,d,filenames) in os.walk(path):
            for filename in filenames:
                absolute_name=os.path.join(path,filename)
                begin=filename.rfind('.')
                dat=filename[(begin+1):]
                if dat =='jpg':
                #exec("absolute_name=u'%s'" % absolute_name)
                    DAT_list.append(absolute_name.decode('gbk').decode('utf-8'))
            return DAT_list
    def GET(self):
        """处理的url中的参数 要有
            htmlName = bbs_content 或 bbs_banner
             SName 版块的名称  默认是论坛首页
        """
        #设置SName的默认值
        self.addDefaultAttr(SName="论坛首页")
        if hasattr(self,'htmlName'):
            if self.htmlName=='bbs_banner':
                htmlPostion="bbs/templates/%s.html"
                frender=web.template.frender(htmlPostion % self.htmlName,globals=globals)
                groups=Model.GGet()
                return frender(groups)
            elif self.htmlName=='bbs_content':
                paths=[]  
                #论坛首页
                if self.SName=='论坛首页':           
                    path=r'.\static\bbs\images\showPic'
                    paths=self.getTxt(path)
                    sectionInfo={
                                 'SName':"homePage",
                                 'fousTopic':self.focusTopic() or [] ,
                                 'recommedTopic':self.recommedTopic() or [] ,
                                 'hotTopic':self.hotTopic() or [] ,
                                 'scoreRank':self.scoreRank() or [] 
                    }
                #版块
                else:
                    STopic=Model.TGet(self.SName,limit=-1)
                    count=len(STopic)
                    #返回的版块信息中增加 replyCount属性  回复的次数
                    for topic in STopic:
                        topic['replyCount']=len(Model.RGet(TId=topic['TId']))
                    #构造版块信息
                    sectionInfo={'SName':self.SName,
                                 'STopic':STopic[self.skip:self.skip+self.limit],
                                 'maxPage':count%self.limit and count/self.limit or count/self.limit + 1,
                                 'total':count
                                 }
                return render_B.bbs_content(sectionInfo,paths)
            
        return render.bbs(self.SName)

class Grub(base):
    def __init__(self):
        super(Grub,self).__init__()
    def GET(self,fun):
        return getattr(self,"GET"+fun[0].capitalize()+fun[1:])()
    def POST(self,fun):
        return getattr(self,"POST"+fun[0].capitalize()+fun[1:])()
    def GETGet(self):pass  
    def GETEdit(self):pass 
    def GETDel(self):pass 
    def GETAdd(self):pass 
    def POSTGet(self):pass  
    def POSTEdit(self):pass 
    def POSTDel(self):pass 
    def POSTAdd(self):pass 

class sectionGrub(Grub): 
    def __init__(self):
        super(self.__class__,self).__init__()
    def GETGetStore(self):
        data=Model.SGetStore()
        kw={"data":data}
        return self.resJson(**kw)
    def POSTAdd(self): 
        kw={}
        attrName=['SName','SMasterId','SClickCount','STime','SStatement']
        for i in attrName:
            kw[i]=getattr(self,i)
        kw['_id']=self.getId()
        kw['STopic']=[]
        rows=Model.SAdd(self.GId,**kw)
        return self.resAjax(rows,"创建成功")  
    def POSTEdit(self):
        kw={}
        attrName=['GId','SName','SMasterId','SClickCount','STime','GStatement']
        for i in attrName:
            kw[i]=getattr(self,i)
        rows=Model.SEdit(**kw)
        return self.resAjax(rows,"创建成功")  
    def POSTGet(self):
        records=Model.SGet(self._id) #_id 其实是SName的值
        return self.resForm(records and records[0] )
    def POSTDel(self):
        rows=Model.SDel(self._id)
        return  self.resAjax(rows,'删除成功' )

class groupGrub(Grub):
    def __init__(self):
        super(self.__class__,self).__init__()  
    def GETGet(self):
        if hasattr(self,'node'):
            if self.node=='root':
                records=Model.GGet()
                if records:
                    for group in records:
                        if group['GFeatured']:
                            group['GName']='''<font color="#FF0080">%s<font/>''' % group['GName']
            else:
                GSection=Model.GGet(self.node)[0]['GSection']
                records=[]
                for SName in  GSection:
                    records.append({'GName':SName,'_id':SName,'leaf':True})
        return self.dup({'data':records})
    def POSTAdd(self):
        sql={'_id':self.getId(),
             'GName':self.GName,
             'GTime':self.getTime(),
             'GSection':[],
             'GFeatured':False
             }
        rows=Model.GAdd(**sql)
        return self.resAjax(rows,'插入成功' )
    def POSTDel(self):
        rows=Model.GDel(self._id)
        return self.resAjax(rows,'删除成功' )
    def POSTEdit(self):
        kw=self.getAttrDict('GFeatured')
        rows=Model.GEdit(self._id,**kw)
        return self.resAjax(rows,'设置成功' )
    def GETGetSName(self):
        kw={"data":Model.GGetSName(self.GName)}
        return self.resJson(**kw)
    def GETGetGName(self):
        kw={"data":Model.GGetGName()}
        return self.resJson(**kw)
class topicGrub(Grub):
    def __init__(self):
        super(self.__class__,self).__init__()
    def GETGet(self):
        if not hasattr(self, "SName"):
            return 
        #limit==-1 表示获取全部 主题
        topics=Model.TGet(self.SName,limit=-1)
        kw={'data':topics[self.skip:self.skip+self.limit],
            'total':len(topics),
            'SName':self.SName
            }
        return self.resJson(**kw)   
    def POSTDel(self):
        rowsNum=Model.TDel(self.TId)
        return self.resAjax(rowsNum)
    def POSTEdit(self):
        kw=self.getAttrDict('TTitle','TContents','TRecommend','TFlag','TScore')
        rowNum=Model.TEdit(self.TId,**kw) 
        return self.resAjax(rowNum)
    def POSTGet(self):
        if not hasattr(self, "SName"):
            return 
        topics=Model.TGet(self.SName)
        kw={'data':topics,'total':len(topics)}
        return self.resJson(**kw)      
          
class posted(base):
    def __init__(self):
        super(self.__class__,self).__init__()
    def GET(self): 
        name_id=COM.logged()
        if not name_id:
            return render.jmp_parameter('请先登录',r'\login?url=bbs\posted')
        record=Model.admin_personnel_info_Get(name_id=name_id)
        if record:
            return render_B.bbsPosted(record[0]['credit'])
    def POST(self):
        SName=self.SName
        kw=self.getAttrDict('TFalg','TUid','TTitle','TContents','TScore','TTime')
        kw['TId']=self.getId()
        kw['TRecommend']=False
        kw['TClickCount']=0
        Model.perInfoCreditEdit(self.TUid,int("-"+self.TScore))
        rowNum=Model.TAdd(SName,**kw)
        return self.resAjax(rowNum,kw['TId'])
    
class reply(Grub):
    def __init__(self):
        super(self.__class__,self).__init__()
    def GETReplyPage(self):
        topicInfo=Model.TGet(TId=self.TId)[0]
        replyInfo=Model.RGet(TId=self.TId)
        Model.TEdit_AddTClickCount(self.TId)
        return render_B.bbsReply(topicInfo,replyInfo or [])
    def POSTAddReply(self):
        if not COM.logged():
            return '请先登录'
        kw=self.getAttrDict('RContents','TId','RUid')
        kw['RTime']=self.getTime()
        kw['_id']=self.getId()
        kw['RGoodComment']=0
        kw['RNegativeComment']=0
        kw['RAeecpted']=False
        n=Model.RAdd(**kw)
        return self.resAjax(n)
    def POSTAddNegativeComment(self):
        kw={"RNegativeComment":int(self.value)}
        n=Model.REdit(self._id,**kw)
        return self.resAjax(n)
    def POSTAddGooodComment(self):
        kw={"RGoodComment":int(self.value)}
        n=Model.REdit(self._id,**kw)
        return self.resAjax(n)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    