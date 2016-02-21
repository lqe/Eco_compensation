# -*- coding:utf-8 -*-
import pymongo
import time
import re
from bson.objectid import ObjectId
from json import  dumps
import pdb
from bson.code import Code

'''初始化 连接到数据库'''
conn=pymongo.Connection('127.0.0.1', 27017)
db=conn.Eco_Compensation    #生态补偿数据库

def getId():
    return str(ObjectId())
def getTime():
    now=time.localtime()
    return "%s-%s-%s %s-%s-%s" % \
            (
              now.tm_year,
              now.tm_mon,
              now.tm_mday,
              now.tm_hour,
              now.tm_min,
              now.tm_sec ) 
              
def MyPrint(func):
    def _call(*args,**kwargs):
        try:
            #print "*" * 30 +"\n" + func.__name__ + "函数别调用"
            
            ##print args,kwargs
            #pdb.set_trace()
            result = func(*args,**kwargs)
            #print "返回结果:\n" + str(result)
        except Exception,e:
            result=None
            #print func.__name__+"函数调用失败-->"+str(e)
        finally:
            return result
    return _call

"""未加说明返回的值除单个数字外，都是以列表的形式存在"""

@MyPrint
def perInfoCreditEdit(name_id,value):
    db.personnel_info.update({"name_id":name_id},{"$inc":{"credit":value}})
@MyPrint
def RAdd(*arg,**kw):
    rowNum=db.bbs.insert(kw)
    return rowNum
@MyPrint
def REdit(_id,*arg,**kws):
    rowNum=db.bbs.update({"_id":_id},
                  {"$set":kws
                   },safe=True)[u'n']
    return rowNum
@MyPrint
def RDel(_id):
    rowNum=db.bbs.remove({"_id":_id},safe=True)[u'n']
    return rowNum

@MyPrint
def RGet(_id=None,TId=None):
    params={}
    if _id:
        params={"_id":_id}
    elif  TId:
        params={"TId":TId}
    else:
        return False
    recs=list(db.bbs.find(params))
    return recs

@MyPrint
def TAdd(SName,*arg,**kw):
    rowNum=db.bbs.update({"SName":SName},
                  {"$push":{"STopic":kw}
                   },safe=True)[u'n']
    return rowNum
@MyPrint
def TEdit(TId,*arg,**kws):
    for i in kws:
        rowNum=db.bbs.update({"STopic.TId":TId},
                      {"$set":
                            {"STopic.$.%s" % i:kws[i]}
                       },safe=True)[u'n']
    return rowNum
@MyPrint
def TEdit_AddTClickCount(TId):
    db.bbs.rowNum=db.bbs.update({"STopic.TId":TId},
                      {"$inc":
                            {"STopic.$.TClickCount":1}
                       })

@MyPrint
def TDel(TId):
    #删除主题下的所有回复      
    hasReply=db.bbs.find_one({"TId":TId})
    if hasReply:
        rowNum=db.bbs.remove({"TId":TId},safe=True)[u'n']
    if not hasReply or rowNum:
        #删除主题
        rowNum=db.bbs.update({"STopic.TId":TId},
              {"$pull":
                    {"STopic":{"TId":TId}}
               },safe=True)[u'n']
    return rowNum
@MyPrint
def TGet(SName=None,TId=None,skip=0,limit=1):
    '''如果 limit小于0 返回 全部'''
    if TId:
        params={"STopic.TId":TId}
        showList={"STopic.$":1}
    elif  SName:
        params={"SName":SName}
        showList={"STopic":1}   
    recs=list(db.bbs.find(params,showList))
    if recs:
        Topic=recs[0]['STopic']
        #定义排序函数 按照 置顶'TRecommend',时间'TTime' 有大到小 true-->false  
        def fn(y,x):
            if x['TRecommend']==y["TRecommend"]:
                return cmp(x['TTime'],y['TTime'])
            else:
                return cmp(x['TRecommend'],y["TRecommend"])
        Topic.sort(cmp=fn)
        #返回跳过后 limit个数据 或最后少于limit数据
        #如果 limit小于0 返回 全部
        if limit<0:
            return Topic
        else:
            return Topic[skip:skip+limit]
    else:
        return []

@MyPrint
def SAdd(Gid,**kw):
    get=list(db.bbs.find({'SName':kw['SName']}))
    if get:
        return {'msg':'版块名称冲突'}
    rowNum=db.bbs.insert(kw)
    if rowNum:
        rowNum=db.bbsG.update( 
            {'_id':Gid},
            {'$addToSet':{'GSection':kw['SName']}
            },safe=True)[u'n']
        if not rowNum:
            db.bbs.remove(kw)
    return rowNum
@MyPrint
def SDel(SName):
    GId=db.bbsG.find({"GSection":{"$in":[SName]}},{"_id":1}).next()['_id']
    # 更新Group中GSection中的信息
    rowNum=db.bbsG.update({"_id":GId},{"$pull":{"GSection":SName}},safe=True)[u'n']
    if rowNum:
        #获取版块下所有的主题
        TopicTidList=TGet(SName)
        #删除版块下所有的主题
        for topic in TopicTidList:
            TDel(topic['TId'])
        #删除版块
        rowNum=db.bbs.remove({"SName":SName},safe=True)[u'n']
        if not rowNum:
            db.bbsG.update({"_id":GId},{"$push":{"GSection":SName}},safe=True)[u'n']
    return rowNum
@MyPrint
def SEdit(**kw):
    GId=kw.pop('GId')
    STime=kw.pop("STime")  #唯一 且能标示 一条记录
    rec=db.bbs.find({"STime":STime}).next()
    if rec['SName']!=kw['SName']:
        db.bbsG.update({"GSection":{"$in":[rec['SName']]}},{"$set":{"GSection.$":kw['SName']}})
    rowNum=db.bbs.update({"STime":STime},
                          {"$set":kw
                           },safe=True)[u'n']
    return rowNum

  
@MyPrint
def SGetStore():
    '''
    获取所有版块  
    按照主题拆分成单个文档
    以名称分组 并统计主题中的点击数
    返回{u'total': 8, u'_id': u'HTML'} 版块中所有主题点击数之和  主题名称
    '''
    t=db.bbs.aggregate([{"$match":{"STopic":{"$exists":True}}},
                    {"$unwind":"$STopic"},
                    {"$group":{"_id":"$SName",
                               "total":{"$sum":"$STopic.TClickCount"}}}
                    ])["result"]
    return list(t)               
@MyPrint
def SGet(SName=None):
    '''SName 唯一'''
    kw={"STopic":{"$exists":True}}
    if SName:
        kw['SName']=SName
    records=list(db.bbs.find(kw,{"STopic":0}))
    for index in range(len(records)):
        rec=records[index]
        SName=rec['SName']
        Grec=db.bbsG.find({'GSection':{"$in":[SName]}}).next()
        rec['GId']=Grec['_id']
        rec['SId']=rec['_id']
    return records

@MyPrint
def GGetSName(GName):
    '''获取GName下的版块名称
        返回[{"SName":"name1"},{"SName":"name2"},.....]
    '''
    SNameList=db.bbsG.find({'GName':GName}).next()['GSection']
    return [{"SName":i} for i in SNameList]
@MyPrint
def GGetGName():
    '''获取所有GName名称
            返回[{"GName":"name1"},{"GName":"name2"},.....]
    '''
    GNameList=db.bbsG.distinct('GName')
    return [{"GName":i} for i in GNameList]
@MyPrint
def GGet(GId=None,GFeatured=False):
    kw={}
    if GId:
        kw['_id']=GId
    if GFeatured:
        kw['GFeatured']=GFeatured
    return list(db.bbsG.find(kw))
@MyPrint
def GEdit_GName(Gid,GName):
    rowNow=db.bbsG.update( 
                {'_id':Gid},
                {'$set':{'GName':GName}},
                safe=True)[u'n']
    return rowNow
@MyPrint
def GEdit(_id,*arg,**kw):
    rowNow=db.bbsG.update( 
                {'_id':_id},
                {'$set':kw},
                safe=True)[u'n']
    return rowNow
@MyPrint
def GDel(Gid):
    GSection= GGet(Gid)[0]['GSection']
    for SName in GSection:
        SDel(SName)
    db.bbsG.remove({"_id":Gid},safe=True)[u'n']
    return True
@MyPrint
def GAdd(**kw):
    return db.bbsG.insert(kw)

@MyPrint
def login(name):
    #print "参数-->",dumps({"name_id":name})
    t=list(db.personnel_info.find({"name_id":name}))
    return t
@MyPrint
def Add_OR_Edit_blog_articles(_id=None,name_id=None,date=None,title=None,content=None,classification=None,comment=None):
    #print "参数-->",dumps({"_id":_id,"author":name_id,"title":title,"content":content,"date":date,"classification":classification})
    if not _id:
        #print 1
        _id=str(ObjectId())
        result=db.blog.insert({'_id':_id,"author":name_id,"title":title,"content":content,"date":date,"classification":classification})
        return True if result else False
    else:
        #print 2
        if not comment:
            result=db.blog.update({'_id':_id},{"author":name_id,"title":title,"content":content,"date":date,"classification":classification},safe=True)
        else:
            #print type(comment),comment
            result=db.blog.update({'_id':_id},{"$push":{'comments':comment}})
              
        return result['n'] 
    
@MyPrint
def GetBlogs(skip=None,limit=None,sort={},fields=[],**kw):
    '''通过键值对查询   sort={}包含了要排序的字段   键值为  1 或 -1  fields=[] 包含返回所需的字段    kw中包含了查询的条件
         例如： GetBlog(author="Marco",sort={"date":-1},fields=["title"],skip=3,limit=4)
    '''
    #print "参数:  skip=",skip,",limit=",limit,",sort=",sort,",fields=",fields,",kw=",kw  
    if not fields: 
        temp=db.blog.find(kw)
    else:
        field={}
        for i in fields:
            field[i]=1;
        temp=db.blog.find(kw,field) 
    result=temp if not skip  else temp.skip(skip)
    result=temp if not limit else temp.limit(limit)
    if sort!={}:
        for key in sort:
            #print {key:sort[key]}
            result=result.sort(key,sort[key])
    return list(result)
@MyPrint
def GetBlogsTotal(**kw):
    #print "参数-->",dumps(kw) 
    total=db.blog.find(kw).count()
    return total
def registerUser(name_id,password,department,email,name):
    #print "参数-->",dumps(name_id,password,department,email,name)
    result=db.personnel_info.insert({'_id':name_id,"name_id":name_id,'name':name,'role':'user','department':department,
                                     "password":password,"pass":'waiting','data_access':1,"credit":50,
                                     'email':email})
    return True if result else False
@MyPrint
def GetClassification(name_id):
    '''返回字典'''
    result={}
    classification=db.blog.find({"author":name_id}).distinct("classification")
    for cfn in classification:
        total=db.blog.find({"author":name_id,"classification":cfn}).count()
        result[cfn]=total
    return  result
@MyPrint
def DelSingleBlog(**kw):
    #print "参数-->",dumps(kw)
    result=db.blog.remove(kw,safe=True)
    return True if result[u'n'] else False
   
@MyPrint
def adminAdd(kw={}):
    #print "参数-->",dumps(kw)
    if not kw: return False
    kw['_id']=str(ObjectId())
    result=db.articles.insert(kw)
    return True if result else False
@MyPrint
def adminGet(category,Limit=0,Skip=0):
    result=db.articles.find({'category':category}).sort('date',-1).skip(Skip)
    if Limit:
        result=result.limit(Limit)
    return  list(result)
@MyPrint
def adminGetTotal(category):
    result=db.articles.find({'category':category}).count()
    return  result
@MyPrint
def adminDel(_id):
    #print "参数-->",dumps(_id)
    result=db.articles.remove({"_id":_id},safe=True)
    return result
@MyPrint
def adminEdit(kw):
    #print "参数-->",dumps(kw)
    _id=kw['_id']
    kw.pop("_id")
    if '_dc' in kw: kw.pop("_dc")
    #print _id,dict(kw)
    result=db.articles.update({"_id":_id},kw,safe=True)
    #print result
    return True if result[u'n'] else False
@MyPrint
def admin_personnel_info_Get(**kw):
    result=db.personnel_info.find(kw)
    return list(result)
@MyPrint
def admin_personnel_info_GetTotal():
    return db.personnel_info.find().count()
@MyPrint
def admin_personnel_info_Edit(kw):
    #print "参数-->",dumps(kw)
    name_id=kw['name_id']
    if '_dc' in kw: kw.pop("_dc")
    #print name_id,dict(kw)
    result=db.personnel_info.update({"_id":name_id},kw,safe=True)
    return True if result[u'n'] else False
@MyPrint
def admin_personnel_info_Add(kw):
    _id=kw['name_id']
    kw["_id"]=_id
    result=db.personnel_info.insert(kw)
    return True if result else False
@MyPrint
def admin_personnel_info_Del(_id):
    result=db.personnel_info.remove({'_id':_id},safe=True)
    return result
@MyPrint
def admin_papers_manager_Add(kw):
    kw['_id']=str(ObjectId())
    result=db.papers_manager.insert(kw)
    return True if result else False
#@MyPrint
#def admin_papers_manager_Get(**kw):
#    result=db.papers_manager.find(kw).sort('date',-1)
#    return list(result)

@MyPrint
def admin_papers_manager_Get(skip=None, limit=None, sort={'date':-1}, fields=[], **kw):
    #print "参数:  skip=", skip, ",limit=", limit, ",sort=", sort, ",fields=", fields, ",kw=", kw
    if not fields:
        temp = db.papers_manager.find(kw)
    else:
        field = {}
        for i in fields:
            field[i] = 1
        temp = db.papers_manager.find(kw, field)
    result = temp if not skip else temp.skip(skip)
    result = temp if not limit else temp.limit(limit)
    if sort != {}:
        for key in sort:
            #print {key:sort[key]}
            result = result.sort(key, sort[key])
    return list(result)

@MyPrint
def admin_papers_manager_GetTotal(**kw):
    return db.papers_manager.find(kw).count()
@MyPrint
def admin_papers_manager_Edit(kw):
    #print "参数-->",dumps(kw)
    _id=kw.pop('_id')
    result=db.papers_manager.update({"_id":_id},kw,safe=True)
    return True if result[u'n'] else False 
@MyPrint
def admin_papers_manager_Del(_id):
    #print "参数-->",_id
    result=db.papers_manager.remove({'_id':_id},safe=True)
    return result
@MyPrint
def articleGet(_id):
    return list(db.articles.find({"_id":_id}))
@MyPrint
def wiki_article_get_all_childrens_postion(postion,all=False):
    '''获取postion的直接后代，返回后代信息列表 和所有的 位置'''
    postions=db.wiki.distinct('postion')
    ps=[]
    t=postion.count('/')
    for i in postions:
        if  postion in i and i.count('/')-t==1 :
            if all:
                res=wiki_article_get(postion=i)
            else:
                res=wiki_article_get(postion=i,using='yes')
            ps.append(res)
    return ps,postions
@MyPrint
def wiki_re_find(filter):
    result=db.wiki.find({"using":"yes",'title':{'$regex': filter}})
    return list(result)
    
@MyPrint
def wiki_article_get(skip=None,limit=None,sort={'date':-1},fields=[],**kw):
    #print "参数:  skip=",skip,",limit=",limit,",sort=",sort,",fields=",fields,",kw=",kw  
    if not fields: 
        temp=db.wiki.find(kw)
    else:
        field={}
        for i in fields:
            field[i]=1;
        temp=db.wiki.find(kw,field) 
    result=temp if not skip  else temp.skip(skip)
    result=temp if not limit else temp.limit(limit)
    if sort!={}:
        for key in sort:
            #print {key:sort[key]}
            result=result.sort(key,sort[key])
    return list(result)
@MyPrint
def wiki_article_create_or_edit(**kw):
    #print '参数-->',kw
    if '_id' in kw:
        _id=kw['_id']
        result=list(db.wiki.find({"_id":_id}))
        #print result
    else:
        kw['_id']=str(ObjectId())
        kw['date']=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
        kw['using']='no'
        #if 'article_id' not in kw:
        #    kw['article_id']=kw['_id']
        articles=wiki_article_get(postion=kw['postion'])
        if not articles: #articles为空 说明是第一片文章
            kw['using']='yes'
            result=db.wiki.insert(kw)
            return result
        else: #articles不为空 是修改文章，插入后要把原来版本的using设置为no 插入的文章的using为yes
            result=db.wiki.insert(kw)
            if result :
                result=wiki_set(_id=kw['_id'],using='yes')
            else:
                db.wiki.remove({'_id':kw['_id']})
                result=False
    return result
@MyPrint
def wiki_set(_id,**kw):
    #print '参数-->',"_id=",_id,'kw=',kw
    art=wiki_article_get(_id=_id)[0]
    result=db.wiki.update({'postion':art['postion'],'using':'yes'},{'$set':{'using':'no'}},safe=True)
    if result['n']:
        result=db.wiki.update({"_id":_id},{'$set':kw},safe=True)
        return result['n']
    else:
        return False
   
def wiki_del(_id):
    result=db.wiki.remove({'_id':_id},safe=True) 
    return result['n']

@MyPrint
def admin_meeting_Qurery(skip=None,limit=None,sort={'date':-1},fields=[],**kw):
    #print "参数:  skip=",skip,",limit=",limit,",sort=",sort,",fields=",fields,",kw=",kw  
    if not fields: 
        temp=db.meeting.find(kw)
    else:
        field={}
        for i in fields:
            field[i]=1;
        temp=db.meeting.find(kw,field) 
    result=temp if not skip  else temp.skip(skip)
    result=temp if not limit else temp.limit(limit)
    if sort!={}:
        for key in sort:
            #print {key:sort[key]}
            result=result.sort(key,sort[key])
    return list(result)
@MyPrint
def admin_meeting_add(kw):
    #print "参数:  kw->",kw
    kw['_id']=str(ObjectId())
    return db.meeting.insert(kw)
@MyPrint
def admin_meeting_update(_id,kw):
    #print "参数:  kw->",kw
    return db.meeting.update({"_id":_id},kw,safe=True)['n']
@MyPrint
def admin_meeting_del(_id):
    #print "参数:  kw->",_id
    return db.meeting.remove({"_id":_id},safe=True)['n']
###############################################################

@MyPrint
def RankTFocus(num=10):
    reducer = Code("""
                    function(obj, prev){
                      prev.count++;
                    }
                """)
    results = db.bbs.group(key={"TId":1}, 
                           condition={"TId":{"$exists":True}}, 
                           initial={"count": 0}, 
                           reduce=reducer
                           )
    results=sorted(results,key=lambda rec:rec['count'],reverse=True)[:num]
    for i in results:
        T=TGet(TId=i['TId']) #如果返回空，说明主题不存在，则要把相应的回复的贴的删除，之所会有这种情况，可能是删除版块或主题时，没有删除干净所致
        if T:
            i['TTitle']=TGet(TId=i['TId'])[0]['TTitle']
        else:
            db.bbs.remove({"TId":i['TId']},safe=True) 
    return results 
@MyPrint
def RankTRecommend():
    #获得的记录是 以 版块为单位 一条一条的
    recs=list(db.bbs.find({"STopic.TRecommend":True},{"STopic.TRecommend.$":1,'SName':1,'SMasterId':1}))
    #整理成以主题为单位 一条一条的
    #整理成[{SName:SName,TId:TId,TUid:TUid .... },{}],把所有的推荐主题放到一个列表中，并增加属性SName
    topicList=[]
    for rec in  recs:
        for topic in rec["STopic"]:
            topic["SName"]=rec['SName']
            topic["SMasterId"]=rec['SMasterId']
            topicList.append(topic)
    return topicList           
@MyPrint
def RankTHot(num):
    #获得的记录是 以 版块为单位 一条一条的
    recs=list(db.bbs.find({"SName":{"$exists":True}},{"STopic":1,'SName':1}))
    #整理成以主题为单位 一条一条的
    #整理成[{SName:SName,TId:TId,TUid:TUid .... },{}],把所有的推荐主题放到一个列表中，并增加属性SName
    for i in recs:
        i
        #print i
    topicList=[]
    for rec in  recs:
        for topic in rec["STopic"]:
            topic["SName"]=rec['SName']
            topicList.append(topic)
    topicList=sorted(topicList,key=lambda rec:rec['TClickCount'],reverse=True)
    return topicList[:num]
@MyPrint
def RankUScore(num):
    recs=list(db.personnel_info.find({"pass":"yes"},{'name_id':1,'credit':1}))
    recs=sorted(recs,key=lambda rec:rec['credit'],reverse=True)
    return recs[:num]
if __name__=="__main__" :
    pass    