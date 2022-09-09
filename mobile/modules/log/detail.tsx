// withHooks
import { applyStyle, esp } from 'esoftplay';
import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { LibScroll } from 'esoftplay/cache/lib/scroll/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';


export interface LogDetailArgs {
  data: any
}
export interface LogDetailProps {

}
export default function m(props: LogDetailProps): any {
  const data = LibNavigation.getArgs(props, 'data')

  function sendMsg() {
    let config = esp.config()
    let msg = [
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + config?.url.replace(/^https?:\/\//, ''),
      'api:\n',
      '`' + '`',
      '\n',
      '```',

      '```'
    ].join('\n')

    let post = {
      text: msg,
      chat_id: '-610603314',
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    }
    LibProgress.show()
    new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post, () => LibProgress.hide())
  }

  return (
    <View style={{ flex: 1 }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center" })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'Result'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <LibScroll style={{ backgroundColor: '#2c3e50' }}>
          <View style={{ marginHorizontal: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text allowFontScaling={false} style={{ lineHeight: 16, fontSize: 12, fontFamily: 'MonoSpace', color: 'cyan' }} >{String(JSON.stringify(data || {}, undefined, 2))}</Text>
            </ScrollView>
          </View>
          <View />
        </LibScroll>
      </View>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
        <Pressable onPress={() => { }} style={{ flex: 1 }} >
          <View style={[{ height: 40, backgroundColor: "#6c432c", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9 }]} >
            <LibIcon name='send' size={16} color="white" />
            <Text allowFontScaling={false} style={{ fontSize: 14, textAlign: "center", textAlignVertical: 'center', color: 'white', marginLeft: 10 }} >{'Kirim Telegram'}</Text>
          </View>
        </Pressable>
      </View> */}
    </View>
  )
}