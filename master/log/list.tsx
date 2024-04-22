// withHooks
import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibDialog } from 'esoftplay/cache/lib/dialog/import';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibList } from 'esoftplay/cache/lib/list/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LogItem2 } from 'esoftplay/cache/log/item2/import';
import { LogStateProperty } from 'esoftplay/cache/log/state/import';
import { LogTokenProperty } from 'esoftplay/cache/log/token/import';
import { UserClass } from 'esoftplay/cache/user/class/import';

import esp from 'esoftplay/esp';
import useSafeState from 'esoftplay/state';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogListArgs {

}
export interface LogListProps {
  onClose: () => void
}
export default function m(props: LogListProps): any {
  const urlList = LogStateProperty.state().get()
  const user = UserClass.state().useSelector((s: any) => s)
  const urlData = urlList?.reduce?.((r: any, a: any) => {
    r[Object.keys(a)[0]] = [...r[Object.keys(a)[0]] || [], a]
    return r
  }, {});
  const [enableLog, setEnableLog] = LogStateProperty.enableLog().useState()
  const token = LogTokenProperty.state().useSelector(s => s)
  const [counter, setCounter] = useSafeState(0)

  // useEffect(() => {
  //   LogTokenProperty.buildToken([
  //     user?.id || 0,
  //     user?.member_id || 0,
  //     user?.merchant_id || 0,
  //     LibUtils?.getInstallationID(),
  //     user?.mitra_id || 0,
  //     user?.dc_id || 0,
  //   ])
  // }, [])

  function sendToken() {
    // token += "|" + dt.id || 0
    // token += "|" + dt.member_id || 0
    // token += "|" + dt.merchant_id || 0
    // token += "|" + LibUtils?.getInstallationID()
    // token += "|" + dt.mitra_id || 0
    // token += "|" + dt.dc_id || 0
    const _token = token.split('|').map((element: any) => typeof element === 'string' ? `"${element}"` : Number(element))
    let msg = [
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + esp.config().url.replace(/^https?:\/\//, ''),
      'username:' + (user.username).split('@')[0].replace(/\./g, '_'),
      '\n',
      `bun import.js 'token:::` + (user.username).split(`@`)[0].replace(/\./g, `_`) + `~~~[` + _token + `]'`,
    ].join('\n')
    let post = {
      text: msg,
      chat_id: '-610603314',
      disable_web_page_preview: true
    }
    LibProgress.show()
    new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post, () => LibProgress.hide())
  }

  function removeLogItem(item: any) {
    function remove() {
      const indexOfAll = (arr: any, val: any) => arr.reduce((acc: any, el: any, i: any) => (el === val ? [...acc, i] : acc), []);
      const arrayUrl = urlList.map((t: any) => Object.keys(t)?.[0])
      const allIndexToRemove = indexOfAll(arrayUrl, item)
      const indexSet = new Set(allIndexToRemove);
      const arrayWithValuesRemoved = urlList.filter((value: any, i: number) => !indexSet.has(i));
      LogStateProperty.state().set(arrayWithValuesRemoved)
    }

    LibDialog.warningConfirm('Hapus?', "Hapus Log " + item + " ?", 'Hapus', () => {
      remove()
      setCounter(counter + 1)
    }, 'Batal', () => { })
  }

  function renderItems(item: any, i: number) {
    return (
      <LogItem2 item={item} key={i} urlData={urlData} index={i} onClose={props.onClose} onRemoveItem={() => { removeLogItem(item) }} />
    )
  }

  return (
    <View style={{ backgroundColor: "white", height: '100%' }}>
      <View style={{ padding: 10, paddingTop: LibStyle.STATUSBAR_HEIGHT, backgroundColor: 'white', marginBottom: 2, ...LibStyle.elevation(2) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => LibNavigation.back()} style={{ flexDirection: 'row', alignItems: 'center' }} >
            <LibIcon.SimpleLineIcons name='arrow-down' size={16} />
            <Text style={{ marginLeft: 10 }}>{'API DEBUGGER : '}</Text>
          </Pressable>
          <Pressable style={{ marginRight: 10, padding: 10, paddingRight: 30 }} hitSlop={10} onPress={() => setEnableLog(!enableLog)} >
            <Text style={{ fontWeight: "bold", color: enableLog ? '#2CB159' : '#E63A3A' }} >{enableLog ? "ON" : "OFF"}</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 5 }}>
          {
            user?.id &&
            <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
              LibDialog.confirm("Konfirmasi ?", "Kirim User Token?", "KIRIM", () => sendToken(), "BATAL", () => { })
            }} >
              <LibIcon name="account-outline" size={28} color='#004085' />
            </Pressable>
          }
          <Pressable onPress={() => {
            props?.onClose?.()
            LibNavigation.navigate('log/feature')
          }} style={{ alignItems: 'center', justifyContent: 'center' }} >
            <LibIcon name="bug-outline" size={28} color='#004085' />
          </Pressable>
          <Pressable onPress={() => {
            props?.onClose?.()
            LibNavigation.navigate('log/attack_history')
          }} style={{ alignItems: 'center', justifyContent: 'center' }} >
            <LibIcon name="format-list-bulleted" size={28} color='#004085' />
          </Pressable>
          <Pressable onPress={() => {
            props?.onClose?.()
            if (urlList.length > 0) {
              LibDialog.warningConfirm('Hapus?', 'Hapus List Log?', 'Hapus', () => {
                LogStateProperty.state().reset()
                setCounter(counter + 1)
              }, 'Batal', () => { })
            }
          }} style={{ alignItems: 'center', justifyContent: 'center' }} >
            <LibIcon name="delete" size={28} color='#E63A3A' />
          </Pressable>
        </View>
      </View>
      <LibList
        style={{ flex: 1 }}
        extraData={urlList}
        staticHeight={50}
        onRefresh={() => {
          setCounter(counter + 1)
        }}
        data={Object.keys(urlData)}
        renderItem={renderItems}
      />
    </View>
  )
}