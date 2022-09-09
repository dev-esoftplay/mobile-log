// withHooks
import { applyStyle } from 'esoftplay';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibList } from 'esoftplay/cache/lib/list/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import { LogItem } from 'esoftplay/cache/log/item/import';
import { LogStateProperty } from 'esoftplay/cache/log/state/import';

import React from 'react';
import { Pressable, View } from 'react-native';


export interface LogUrl_listArgs {

}
export interface LogUrl_listProps {

}
export default function m(props: LogUrl_listProps): any {
  const [urlList, setUrlList] = LogStateProperty.state().useState()
  const urlData = urlList?.reduce?.((r: any, a: any) => {
    r[Object.keys(a)[0]] = [...r[Object.keys(a)[0]] || [], a]
    return r
  }, {});

  function renderItems(item: any, i: number) {
    return (
      <LogItem item={item} key={i} urlData={urlData} index={i} onClose={() => { }} from={'url_list'} onSelectItem={(i2: number) => {
        LibNavigation.sendBackResult(Object.values<any>(urlData)?.[i]?.[i2])
      }} onRemoveItem={() => { }} />
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
          <LibTextstyle text={'List URL'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <LibList
        data={Object.keys(urlData)}
        keyExtractor={(t: any, i: number) => i.toString()}
        renderItem={renderItems}
      />
    </View>
  )
}