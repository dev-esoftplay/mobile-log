// withHooks

import { applyStyle, LibEditbox, LibIcon, LibList, LibNavigation, LibObject, LibStatusbar, LibStyle, LibTextstyle, LogFeature_detailArgs, useGlobalReturn, useGlobalState } from 'esoftplay';
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