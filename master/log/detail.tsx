// withHooks
import { applyStyle } from 'esoftplay';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { LibScroll } from 'esoftplay/cache/lib/scroll/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import esp from 'esoftplay/esp';
import Storage from 'esoftplay/storage';

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';


export interface LogDetailArgs {
  data: any
}
export interface LogDetailProps {

}
export default function m(props: LogDetailProps): any {
  const data = LibNavigation.getArgs(props, 'data')

  const sendToTelegram = () => {
    let config = esp.config()
    const api = Object.keys(data)[0]

    let notes: string[] = [
      '#debugger_result',
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + config?.url.replace(/^https?:\/\//, ''),
      'api: ' + api,
    ]

    let msg: string[] = []
    msg.push(
      JSON.stringify(data, undefined, 2)
    )

    LibProgress.show('Sedang mengirim result API ke Telegram..')
    Storage.setItem('log_result_api', msg.join('\n')).then((v) => {
      Storage.sendTelegram('log_result_api', notes.join('\n'), () => {
        LibProgress.hide()
      }, () => {
        LibProgress.hide()
      }, '-1001737180019', () => api)
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#2c3e50' }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ backgroundColor: 'white', paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center" })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'Result'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <LibScroll>
          <View style={{ marginHorizontal: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text allowFontScaling={false} selectable style={{ lineHeight: 18, fontSize: 12, fontFamily: 'mono', color: 'cyan' }} >{String(JSON.stringify(data || {}, undefined, 2))}</Text>
            </ScrollView>
          </View>
          <View />
        </LibScroll>
      </View>
      <Pressable onPress={() => {
        sendToTelegram()
      }} style={{ height: 40, backgroundColor: LibStyle.colorPrimary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5, margin: 10 }} >
        <LibIcon name='send' size={20} color="white" />
        <Text allowFontScaling={false} style={{ fontSize: 14, textAlign: "center", textAlignVertical: 'center', color: 'white', marginLeft: 10 }} >{'send to esp dev-error'}</Text>
      </Pressable>
    </View>
  )
}