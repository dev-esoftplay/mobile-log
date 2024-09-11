// withHooks

import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibDialog } from 'esoftplay/cache/lib/dialog/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { LogHeader } from 'esoftplay/cache/log/header/import';
import esp from 'esoftplay/esp';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';


export interface LogList_detailArgs {
}
export interface LogList_detailProps {
}
export default function m(props: LogList_detailProps): any {
  const { data, url, index } = LibNavigation.getArgsAll<any>(props)

  function sendMsg(isUri: boolean, item: any, item2: any) {
    let repaired = item.split('/')
    let getIDrepaired: any = {}
    if (repaired.length > 1) {
      const lastIdx = repaired.length - 1
      if (!isNaN(Number(repaired[lastIdx]))) {
        getIDrepaired['id'] = [repaired[lastIdx]];
        item = repaired.slice(0, lastIdx).join('/')
      }
    }

    let msg = [
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + esp.config()?.url.replace(/^https?:\/\//, ''),
    ]
    if (isUri) {
      msg.push(
        'uri: ' + item.replace(`/`, `.`),
        '\n',
        `bun import.js 'uri:::` + item.replace(`/`, `.`) + `~~~const IS_SECURE_POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.secure) + `|||const EXTRACT = []|||const EXTRACT_CHECK = []|||const GET = ` + JSON.stringify(Object.assign(getIDrepaired, Object.values<any>(item2)?.[0]?.get), undefined, 2) + `|||const POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.post, undefined, 2) + `|||module.exports = { POST, GET, IS_SECURE_POST, EXTRACT, EXTRACT_CHECK };'`
      )
    } else {
      const get = Object.assign(getIDrepaired, Object.values<any>(item2)?.[0]?.get)
      const post = Object.values<any>(item2)?.[0]?.post

      let params: any = {}
      if (Object.keys(get).length > 0) {
        params["GET"] = get
      }
      if (Object.keys(post).length > 0) {
        params["POST"] = post
      }
      const _params = Object.keys(params).length > 0 ? ", " + JSON.stringify(params, undefined, 2) : ""

      msg.push(
        'feature: ' + item.replace(`/`, `.`),
        '\n',
        // `bun import.js 'uri:::` + item.replace(`/`, `.`) + `~~~const IS_SECURE_POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.secure) + `|||const EXTRACT = []|||const EXTRACT_CHECK = []|||const GET = ` + JSON.stringify(Object.assign(getIDrepaired, Object.values<any>(item2)?.[0]?.get), undefined, 2) + `|||const POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.post, undefined, 2) + `|||module.exports = { POST, GET, IS_SECURE_POST, EXTRACT, EXTRACT_CHECK };'`,
        `bun import.js 'feature:::` + item.replace(`/`, `.`) + `~~~module.exports = [["` + item.replace('/', '.') + `"` + _params + `]]'`,
        // `bun import.js 'feature:::` + item.replace(`/`, `.`) + `~~~module.exports = [["` + item.replace('/', '.') + `",{ "GET": ` + get + `, "POST": ` + post + ` }]]'`,
        'bun index.js ' + item.replace(`/`, `.`)
      )
    }

    let post = {
      text: msg.join('\n'),
      chat_id: '-610603314',
      disable_web_page_preview: true
    }
    LibProgress.show()
    new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post, () => LibProgress.hide())
  }

  return (
    <View style={{ flex: 1 }}>
      <LogHeader title={url} />
      <ScrollView>
        {
          Object.values(data?.[url])?.map?.((item2: any, i2: number) => {
            return (
              <View key={i2} style={{ backgroundColor: 'white', borderColor: "#ccc", borderWidth: 1, padding: 8, borderRadius: 8, marginVertical: 5, marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    {
                      Object.values(item2)?.map((item3: any, i3: number) => (
                        <View key={i3} style={{}}>
                          {
                            Object.keys(item3)?.map?.((item4: any, i4: number) => {
                              if (item4 != "response") {
                                return (
                                  <View key={i4} style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    {
                                      item4 == "size" ?
                                        <View style={{ marginTop: 5, borderWidth: 0.5, borderColor: "#ccc", borderRadius: 5, padding: 3, paddingHorizontal: 8 }}>
                                          <Text allowFontScaling={false} style={{ fontSize: 12, color: "#333" }}>response size
                                            <Text style={{ fontWeight: "bold" }}> {JSON.stringify(Object.values<any>(item3)?.[i4])}</Text>
                                          </Text>
                                        </View>
                                        :
                                        <>
                                          <Text allowFontScaling={false} style={{ flex: 1, fontSize: 12, color: "#333" }}>{item4}</Text>
                                          <Text allowFontScaling={false} style={{ fontSize: 12, color: "#333" }}>{"= "}</Text>
                                          <View style={{ flex: 5 }}>
                                            {
                                              (typeof item3[item4] == 'object' && Object.keys(item3?.[item4])?.length > 0) ? Object.keys(item3?.[item4])?.map?.((item5: any, i5: number) => {
                                                return (
                                                  <View key={i5} style={{ flexDirection: 'row', marginBottom: 3 }}>
                                                    <Text allowFontScaling={false} style={{ flex: 2, fontSize: 12, color: "#333" }}>{item5}</Text>
                                                    <Text allowFontScaling={false} style={{ fontSize: 12, color: "#333" }}>{" : "}</Text>
                                                    <Text allowFontScaling={false} style={{ flex: 3, fontSize: 12, color: "#333" }}>{Object.values<any>(item3?.[item4])?.[i5]}</Text>
                                                  </View>
                                                )
                                              })
                                                :
                                                <Text allowFontScaling={false} style={{ fontSize: 12, color: "#333" }}>{JSON.stringify(Object.values<any>(item3)?.[i4])}</Text>
                                            }
                                          </View>
                                        </>
                                    }
                                  </View>
                                )
                              } else {
                                return null
                              }
                            })}
                        </View>
                      ))
                    }
                  </View>
                  <View style={{}}>
                    <Pressable onPress={() => {
                      sendMsg(false, url, item2)
                    }} style={{ marginTop: 5, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                      <Text allowFontScaling={false} style={{ fontSize: 14 }}>{'> FEATURE'}</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                      if (Object.values(data?.[url]?.[0]?.[url]?.get)?.length > 0 || Object.values(data?.[url]?.[0]?.[url]?.post)?.length > 0) {
                        LibDialog.warningConfirm('SQL INJECTION', 'Proses inject berlangsung selama kurang lebih 5 menit tergantung dari koneksi. Lanjutkan?', 'Lanjutkan', () => {
                          LibNavigation.navigate('log/progress', {
                            route: [Object.values<any>(data)?.[index]?.[i2]]
                          })
                        }, 'Batal', () => { })
                      }
                    }} style={{ marginTop: 5, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                      <Text allowFontScaling={false} style={{ fontSize: 14 }}>{'> INTRUDE'}</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                      LibNavigation.navigate('log/detail', { data: item2 })
                    }} style={{ marginTop: 15, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                      <Text allowFontScaling={false} style={{ fontSize: 14 }}>{'RESULT'}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}