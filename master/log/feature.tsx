// withHooks
import { applyStyle, useGlobalReturn, useGlobalState } from 'esoftplay';
import { LibEditbox } from 'esoftplay/cache/lib/editbox.import';
import { LibIcon } from 'esoftplay/cache/lib/icon.import';
import { LibList } from 'esoftplay/cache/lib/list.import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation.import';
import { LibObject } from 'esoftplay/cache/lib/object.import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar.import';
import { LibStyle } from 'esoftplay/cache/lib/style.import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle.import';
import { LogFeature_detailArgs } from 'esoftplay/cache/log/feature_detail.import';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeatureArgs {

}
export interface LogFeatureProps {

}

const _state = useGlobalState({}, { persistKey: 'log/feature' })
export function state(): useGlobalReturn<any> {
  return _state
}

export default function m(props: LogFeatureProps): any {
  const [data, setData] = _state.useState()

  function renderItems(item: any, i: number) {
    return (
      <View key={i} style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
        <Pressable
          onPress={() => { LibNavigation.navigate<LogFeature_detailArgs>('log/feature_detail', { title: item, index: item }) }}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 16 }}>{item}</Text>
          <Pressable onPress={() => {
            setData(LibObject.unset(data, item)())
          }} style={{ marginLeft: 15 }} >
            <LibIcon.AntDesign name="delete" />
          </Pressable>
        </Pressable>
      </View>
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
          <LibTextstyle text={'Features'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
        <Pressable onPress={() => {
          LibEditbox.show('Tambahkan Skenario', '', 'default', (text: string) => {
            if (text != '') {
              setData(LibObject.assign(data, { [text]: [] })())
            }
          })
        }} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"plus"} />
        </Pressable>
      </View>
      <LibList
        data={Object.keys(data)}
        renderItem={renderItems}
      />
    </View>
  )
}