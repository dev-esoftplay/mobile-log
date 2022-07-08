// withHooks
// noPage

import { esp, LibCurl, LibDialog, LibIcon, LibNavigation, LibProgress, LogDetailArgs, LogLoggerProperty, useSafeState } from 'esoftplay';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogItemArgs {

}
export interface LogItemProps {
  urlData: any,
  item: any,
  index: number
  onClose: () => void
  onRemoveItem?: () => void
  onSelectItem?: (i: number) => void
  from?: string
}
export default function m(props: LogItemProps): any {
  const [expand, setExpand] = useSafeState(false)
  const urlData = props?.urlData
  const item = props?.item
  let config = esp.config()

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
      'domain: ' + config?.url.replace(/^https?:\/\//, ''),
    ]
    if (isUri) {
      msg.push(
        'uri: ' + item.replace(`/`, `.`),
        '\n',
        `node import.js 'uri:::` + item.replace(`/`, `.`) + `~~~const IS_SECURE_POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.secure) + `|||const EXTRACT = []|||const EXTRACT_CHECK = []|||const GET = ` + JSON.stringify(Object.assign(getIDrepaired, Object.values<any>(item2)?.[0]?.get), undefined, 2) + `|||const POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.post, undefined, 2) + `|||module.exports = { POST, GET, IS_SECURE_POST, EXTRACT, EXTRACT_CHECK };'`
      )
    } else {
      msg.push(
        'feature: ' + item.replace(`/`, `.`),
        '\n',
        `node import.js 'uri:::` + item.replace(`/`, `.`) + `~~~const IS_SECURE_POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.secure) + `|||const EXTRACT = []|||const EXTRACT_CHECK = []|||const GET = ` + JSON.stringify(Object.assign(getIDrepaired, Object.values<any>(item2)?.[0]?.get), undefined, 2) + `|||const POST = ` + JSON.stringify(Object.values<any>(item2)?.[0]?.post, undefined, 2) + `|||module.exports = { POST, GET, IS_SECURE_POST, EXTRACT, EXTRACT_CHECK };'`,
        `node import.js 'feature:::` + item.replace(`/`, `.`) + `~~~module.exports = [["` + item.replace('/', '.') + `"]]'`,
        'node index.js ' + item.replace(`/`, `.`)
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
    <View style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
      <Pressable
        onPress={() => { setExpand(!expand) }}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontSize: 16 }}>{item}</Text>
        <View style={{ backgroundColor: 'orange', minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 10, color: 'white' }}>{Object?.values?.(urlData[item])?.length}</Text>
        </View>
        {
          props?.from != 'url_list' &&
          <Pressable onPress={() => props?.onRemoveItem?.()} style={{ marginLeft: 5 }} >
            <LibIcon.AntDesign name="delete" />
          </Pressable>
        }
      </Pressable>
      {
        expand &&
        Object.values(urlData?.[item])?.map?.((item2: any, i2: number) => {
          return (
            <View key={i2} style={{ backgroundColor: 'white', borderColor: "#f1f1f1", borderWidth: 1, padding: 5, borderRadius: 5, marginTop: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <View style={{ flex: 1 }}>
                  {
                    Object.values(item2)?.map((item3: any, i3: number) => (
                      <View key={i3} style={{ marginTop: 5 }}>
                        {
                          Object.keys(item3)?.map?.((item4: any, i4: number) => {
                            return (
                              <View key={i4} style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 12 }}>{item4}</Text>
                                <Text style={{ fontSize: 12 }}>{"= "}</Text>
                                <View style={{ flex: 5 }}>
                                  {
                                    (typeof item3[item4] == 'object' && Object.keys(item3?.[item4])?.length > 0) ? Object.keys(item3?.[item4])?.map?.((item5: any, i5: number) => {
                                      return (
                                        <View key={i5} style={{ flexDirection: 'row', marginBottom: 3 }}>
                                          <Text style={{ flex: 2, fontSize: 12 }}>{item5}</Text>
                                          <Text style={{ fontSize: 12 }}>{" : "}</Text>
                                          <Text style={{ flex: 3, fontSize: 12 }}>{Object.values<any>(item3?.[item4])?.[i5]}</Text>
                                        </View>
                                      )
                                    })
                                      :
                                      <Text style={{ fontSize: 12 }}>{JSON.stringify(Object.values<any>(item3)?.[i4])}</Text>
                                  }
                                </View>
                              </View>
                            )
                          })}
                      </View>
                    ))
                  }
                </View>
                {
                  props?.from != 'url_list' ?
                    <View style={{}}>
                      <Pressable onPress={() => {
                        sendMsg(true, item, item2)
                      }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                        <Text>{'> URI'}</Text>
                      </Pressable>
                      <Pressable onPress={() => {
                        sendMsg(false, item, item2)
                      }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                        <Text>{'> FEATURE'}</Text>
                      </Pressable>
                      <Pressable onPress={() => {
                        if (Object.values(urlData?.[item]?.[0]?.[item]?.get)?.length > 0 || Object.values(urlData?.[item]?.[0]?.[item]?.post)?.length > 0) {
                          props?.onClose?.()
                          LibDialog.warningConfirm('SQL INJECTION', 'Proses inject berlangsung selama kurang lebih 5 menit tergantung dari koneksi. Lanjutkan?', 'Lanjutkan', () => {
                            LibNavigation.navigate('log/progress', {
                              route: [Object.values<any>(urlData)?.[props?.index]?.[i2]]
                            })
                            // LogLoggerProperty.doLogger([Object.values<any>(urlData)?.[props?.index]?.[i2]], (result: any) => {
                            // LibNavigation.navigate('log/attack_list', { data: result })
                            // esp.log(result);
                            // }, true)
                          }, 'Batal', () => { })
                        }
                      }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                        <Text>{'> INTRUDE'}</Text>
                      </Pressable>
                      <Pressable onPress={() => {
                        props?.onClose?.()
                        LogLoggerProperty.doLogger([Object.values<any>(urlData)?.[props?.index]?.[i2]], (result: any) => {
                          LibNavigation.navigate<LogDetailArgs>('log/detail', { data: result })
                        })
                      }} style={{ marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                        <Text>{'RESULT'}</Text>
                      </Pressable>
                    </View>
                    :
                    <View>
                      <Pressable onPress={() => {
                        props?.onSelectItem?.(i2)
                      }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
                        <Text>{'PILIH'}</Text>
                      </Pressable>
                    </View>
                }
              </View>
            </View>
          )
        })
      }
    </View>)
}