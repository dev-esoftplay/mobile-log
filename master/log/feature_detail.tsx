// withHooks
import { applyStyle, esp } from 'esoftplay';
import { LibCurl } from 'esoftplay/cache/lib/curl.import';
import { LibDialog } from 'esoftplay/cache/lib/dialog.import';
import { LibIcon } from 'esoftplay/cache/lib/icon.import';
import { LibList } from 'esoftplay/cache/lib/list.import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation.import';
import { LibObject } from 'esoftplay/cache/lib/object.import';
import { LibProgress } from 'esoftplay/cache/lib/progress.import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar.import';
import { LibStyle } from 'esoftplay/cache/lib/style.import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle.import';
import { LogFeatureProperty } from 'esoftplay/cache/log/feature.import';
import { LogFeature_detail_item } from 'esoftplay/cache/log/feature_detail_item.import';
import { LogLoggerProperty } from 'esoftplay/cache/log/logger.import';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeature_detailArgs {
  title: any
  index: number
}
export interface LogFeature_detailProps {

}
export default function m(props: LogFeature_detailProps): any {
  const { title, index } = LibNavigation.getArgsAll(props)
  const [data, setData] = LogFeatureProperty.state().useState()
  let config = esp.config()

  function sendMsg() {
    const keyT = (st: any) => {
      let re = Object.keys(st)[0]
      return re.replace(/\//g, '.')
    }
    const newParams = (par: any) => {
      let key = Object.keys(par).map((t: any) => ({ [t]: Array.isArray(par[t]) ? par[t] : [par[t]] }))
      return Object.assign({}, ...key)
    }

    let msg: any = [
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + config?.url.replace(/^https?:\/\//, ''),
    ]

    const features = data[title].map((t: any) => [keyT(t), { GET: JSON.stringify(Object.values<any>(t)?.[0]?.get) != '{}' ? newParams(Object.values<any>(t)?.[0]?.get) : undefined, POST: JSON.stringify(Object.values<any>(t)?.[0]?.post) != "{}" ? newParams(Object.values<any>(t)?.[0]?.post) : undefined }])
    const uri = data[title].map((t: any) => (
      `node import.js 'uri:::` + keyT(t) + `~~~const IS_SECURE_POST = ` + JSON.stringify(Object.values<any>(t)?.[0]?.secure) + `|||const EXTRACT = []|||const EXTRACT_CHECK = []|||const GET = {}|||const POST = {}|||module.exports = { POST, GET, IS_SECURE_POST, EXTRACT, EXTRACT_CHECK };'`
    ))
    const featureName = String(title).toLocaleLowerCase().split(' ').join('_')
    const n_features = JSON.parse(JSON.stringify(features))

    msg.push(
      'scenario: ' + featureName,
      '\n',
      ...uri,
      '\n',
      `node import.js 'feature:::` + featureName + `~~~module.exports = ` + JSON.stringify(n_features, undefined, 2) + `'`
    )

    let post = {
      text: msg.join('\n'),
      chat_id: '-610603314',
      disable_web_page_preview: true
    }
    LibProgress.show('Please wait..')
    new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post, () => LibProgress.hide())
  }


  function row(item: any, i: number) {
    return (
      <LogFeature_detail_item key={i} index={index} i={i} item={item} data={data[title]} onChange={() => {
      }} onDelete={() => setData(LibObject.splice(data, i, 1)(title))} />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center" })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'SCENE ' + title} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
        <Pressable onPress={() => {
          LibNavigation.navigateForResult('log/url_list').then((res: any) => {
            const get = res[Object.keys(res)[0]].get
            let post = res[Object.keys(res)[0]].post
            const cGet = Object.keys(get).map((t: any) => ({ [t]: Object.values(get[t])[0] }))
            const cPost = Object.keys(post).map((t: any) => ({ [t]: Object.values(post[t])[0] }))
            const newGET = Object.assign({}, ...cGet)
            const newPOST = Object.assign({}, ...cPost)
            LibProgress.show('Please wait..')
            LogLoggerProperty.doLogger([res], (result: any) => {
              LibProgress.hide
              const idx: any = Object?.keys(res)
              const c = LibObject.assign(res, { get: newGET, post: newPOST, response: result?.[0]?.[idx].RESPONSE })(idx)
              setData(LibObject.push(data, c)(title))
            })
          })
        }} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"plus"} />
        </Pressable>
        <Pressable onPress={() => {
          LibDialog.confirm('SEND', 'Send Scenario to Telegram', "SEND", () => {
            sendMsg()
          }, "CANCEL", () => { })

        }} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"send"} />
        </Pressable>
      </View>
      <LibList
        data={data[title]}
        renderItem={row}
      />
      {
        data?.[title]?.length > 0 &&
        <Pressable onPress={() => {
          const dt = data[title][0]
          const secure = dt[Object.keys(dt)[0]].secure
          const get = dt[Object.keys(dt)[0]].get
          let post = dt[Object.keys(dt)[0]].post
          if (secure) {
            delete post.access_token
            delete post.api_key
          }
          const n_res = [
            { [Object.keys(dt)[0]]: { get, post, secure: secure } }
          ]
          LibDialog.confirm('RUN', 'RUN SCENARIO', "RUN", () => {
            LibProgress.show('Please wait...')
            LogLoggerProperty.doLogger(n_res, (result: any) => {
              LibProgress.hide()
              LibNavigation.navigate('log/detail', { data: result })
            })
          }, "CANCEL", () => { })
        }} style={{ flexDirection: 'row', alignItems: 'center', margin: 15, borderRadius: 5, padding: 10, justifyContent: 'center', backgroundColor: '#95a5a6' }}>
          <LibIcon name='play' color='#2ecc71' />
          <Text style={{ marginLeft: 5, fontSize: 14, color: 'white' }}>{'RUN SCENARIO'}</Text>
        </Pressable>
      }
    </View >
  )
}