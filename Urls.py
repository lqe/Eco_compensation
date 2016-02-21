# -*- coding:utf-8 -*-
'''Created on 2014-8-16 @author: Administrator '''
#'/bbs。bb'
#'/bbs',bbs_app,      
bbs_Urls=('','bbs',
          '/group/(add|del|edit|get|getSName|getGName)','groupGrub',
          '/section/(add|del|edit|get|getStore)','sectionGrub',
          '/topic/(add|del|edit|get)','topicGrub',
          '/posted','posted',
          '/reply/(replyPage|addReply|addGooodComment|addNegativeComment)','reply'
          )

#'/wiki',wiki_app,
wiki_Urls=(
           '','wiki',
           '/','wiki',
           '/create','wiki_create',
           '/createCheck','createCheck',
           '/edit','wiki_edit',
           '/catalog','wiki_catalog',
           '/history','wiki_history',
           '/del','wiki_del',
           '/search','wiki_search'
           )
#'/download',download_app,
download_Urls=(
               '','load',
               '/papers','download_papers',
               )
#'/meeting',meeting_app,
meeting_Urls=(
              '','meeting',
              '/get/(.*)','meeting_get',
              '/add/(.*)','meeting_add',
              '/update/(.*)','meeting_update',
              '/del/(.*)','meeting_del',
              '/export','meeting_export'
              )

