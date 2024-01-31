// withHooks
import { applyStyle } from 'esoftplay';
import { LibEditbox } from 'esoftplay/cache/lib/editbox/import';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibList } from 'esoftplay/cache/lib/list/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import { LibToastProperty } from 'esoftplay/cache/lib/toast/import';
import { LogFeature_recordProperty } from 'esoftplay/cache/log/feature_record/import';
import { LogStateProperty } from 'esoftplay/cache/log/state/import';
import useGlobalState, { useGlobalReturn } from 'esoftplay/global';

import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';


export interface LogFeatureArgs {

}
export interface LogFeatureProps {

}

const _state = useGlobalState({}, { persistKey: 'log/feature', inFile: true })
export function state(): useGlobalReturn<any> {
  return _state
}

export default function m(props: LogFeatureProps): any {
  const [data, setData] = _state.useState()

  function showConfirm(key: string) {
    Alert.alert("Rekam Skenario", "Mulai Rekam Skenario?", [
      { text: "Nanti Saja", style: "cancel" },
      {
        text: "Mulai", style: 'default', onPress: () => {
          if (LogStateProperty.enableLog().get()) {
            LogFeature_recordProperty.recordState.set(true)
            LogFeature_recordProperty.recordedKey.set(key)
            LibNavigation.back(2)
          } else {
            LibToastProperty.show('Tidak dapat merekam karena Debugger OFF')
          }
        }
      }
    ])
  }

  function doAdd(item: any) {
    setData((old) => LibObject.unset(old, item)())
  }

  function doDelete(text: string) {
    setData((old) => LibObject.assign(old, { [text]: [] })())
  }

  function renderItems(item: any, i: number) {
    return (
      <View key={i} style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
        <Pressable
          onPress={() => { LibNavigation.navigate('log/feature_detail', { title: item, index: item }) }}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
          <Text style={{ flex: 1, fontSize: 16 }}>{item}</Text>
          <Pressable onPress={() => {
            doAdd(item)
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
              doDelete(text)
            }
          })
        }} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"plus"} />
        </Pressable>
      </View>
      <LibList
        data={Object.keys(data)}
        extraData={data}
        renderItem={renderItems}
      />
      <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
        <Pressable onPress={() => {
          LibEditbox.show('Tambahkan Skenario', '', 'default', (text: string) => {
            if (text != '') {
              doDelete(text)
              showConfirm(text)
            }
          })
        }} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#ecf0f1', alignItems: 'center', justifyContent: 'center' }}>
          <LibIcon.AntDesign name='plus' size={30} color='#2c3e50' />
        </Pressable>
      </View>
    </View>
  )
}