// withHooks

import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { LibCurl, LibDialog, LibIcon, LibList, LibNavigation, LibProgress, LibStyle, LogItem, LogStateProperty, LogTokenProperty, UserClass } from 'esoftplay';
import esp from 'esoftplay/esp';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogListArgs {

}
export interface LogListProps {
  onClose: () => void
}
export default function m(props: LogListProps): any {
  const [urlList, setUrlList] = LogStateProperty.state().useState()
  const user = UserClass.state().useSelector((s) => s)
  const urlData = urlList?.reduce?.((r: any, a: any) => {
    r[Object.keys(a)[0]] = [...r[Object.keys(a)[0]] || [], a]
    return r
  }, {});
  const [enableLog, setEnableLog] = LogStateProperty.enableLog().useState()
  const token = LogTokenProperty.state().useSelector(s => s)

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
    let n_token = token.split('|').join(',')
    let msg = [
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + esp.config().url.replace(/^https?:\/\//, ''),
      'username:' + (user.username).split('@')[0].replace(/\./g, '_'),
      '\n',
      `node import.js 'token:::` + (user.username).split(`@`)[0].replace(/\./g, `_`) + `~~~[` + n_token + `]'`,
      // `node import.js 'token:::` + (user.username).split(`@`)[0].replace(/\./g, `_`) + `~~~[` + String(user.id || 0) + `,` + (user.member_id || ``) + `,` + (user.merchant_id || ``) + `,` + `null` + `,` + (user.mitra_id || 0) + `,` + (user.dc_id || 0) + `]'`,
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
    }, 'Batal', () => { })
  }

  function renderItems(item: any, i: number) {
    return (
      <LogItem item={item} key={i} urlData={urlData} index={i} onClose={props.onClose} onRemoveItem={() => { removeLogItem(item) }} />
    )
  }

  return (
    <View style={{ backgroundColor: "white", height: '100%' }}>
      <View style={{ flexDirection: 'row', padding: 10, paddingTop: LibStyle.STATUSBAR_HEIGHT, alignItems: 'center', backgroundColor: 'white', marginBottom: 2, ...LibStyle.elevation(2) }}>
        <Pressable onPress={() => LibNavigation.back()} style={{ flexDirection: 'row', alignItems: 'center' }} >
          <LibIcon.SimpleLineIcons name='arrow-down' size={16} />
          <Text style={{ marginLeft: 10 }}>{'API DEBUGGER : '}</Text>
        </Pressable>
        <Pressable style={{ marginRight: 10 }} onPress={() => setEnableLog(!enableLog)} >
          <Text style={{ fontWeight: "bold", color: enableLog ? '#2CB159' : '#E63A3A' }} >{enableLog ? "ON" : "OFF"}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        {
          user?.id &&
          <Pressable style={{ marginHorizontal: 10 }} onPress={() => {
            LibDialog.confirm("Konfirmasi ?", "Kirim User Token?", "KIRIM", () => sendToken(), "BATAL", () => { })
          }} >
            <LibIcon.AntDesign name="user" />
          </Pressable>
        }
        <Pressable onPress={() => {
          props?.onClose?.()
          LibNavigation.navigate('log/feature')
        }} style={{ marginRight: 10 }} >
          <LibIcon name="bug-outline" />
        </Pressable>
        <Pressable onPress={() => {
          props?.onClose?.()
          LibNavigation.navigate('log/attack_history')
        }} style={{ marginRight: 10 }} >
          <LibIcon name="format-list-bulleted" />
        </Pressable>
        <Pressable onPress={() => {
          props?.onClose?.()
          LibDialog.warningConfirm('Hapus?', 'Hapus List Log?', 'Hapus', () => {
            AsyncStorageLib.removeItem('lib_apitest').then(() => { LogStateProperty.state().reset() })
          }, 'Batal', () => { })
        }} >
          <LibIcon.AntDesign name="delete" />
        </Pressable>
      </View>
      <LibList
        style={{ flex: 1 }}
        data={Object.keys(urlData)}
        keyExtractor={(t: any, i: number) => i.toString()}
        renderItem={renderItems}
      />
    </View>
  )
}