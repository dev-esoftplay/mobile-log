// withHooks
import { applyStyle } from 'esoftplay';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibScroll } from 'esoftplay/cache/lib/scroll/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import useSafeState from 'esoftplay/state';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeature_detail_editArgs {
  data: any,
  allData: any,
  index: number,
  i: number
}
export interface LogFeature_detail_editProps {

}
export default function m(props: LogFeature_detail_editProps): any {
  const item = LibNavigation.getArgs(props, 'data')
  const data = LibNavigation.getArgs(props, 'allData')
  const { index, i } = LibNavigation.getArgsAll(props)
  const [itemData, setItemData] = useSafeState(item)

  function renderItems(x: any, index1: number) {
    return (
      <View key={index1}>
        {
          Object.keys(x).map((t: any, index2: number) => {
            if (t == 'post' || t == 'get') {
              return (
                <View key={index2} style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, fontSize: 12 }}>{String(t).toUpperCase()}</Text>
                  <Text>{"="}</Text>
                  <View style={{ flex: 5 }}>
                    {
                      typeof x[t] == 'object' && Object.keys(x[t]).length > 0 ? Object.keys(x[t]).map((k: any, i2: number) => (
                        <View key={i2} style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{k}</Text>
                          <Text>{':'}</Text>
                          <Pressable onPress={() => {
                            LibNavigation.navigateForResult('log/feature_detail_edit_param',
                              { data: data, item: item, index: index, i: i, select: { par: t, index: i2, title: k, value: Object.values<any>(x[t])[i2] } }, 8722)
                              .then((res) => {
                                const key = Object.keys(itemData)[index1]
                                const c = LibObject.set(itemData, res)(key, t, k)
                                setItemData(c)
                              })
                          }} style={{ flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 5, paddingVertical: 8, paddingHorizontal: 5, borderWidth: 1, borderRadius: 4, borderColor: '#c4c4c4' }}>
                            <Text style={{ fontSize: 12, flex: 1 }}>{Object.values<any>(x[t])[i2]}</Text>
                            <LibIcon name='pencil' size={12} color='#e74c3c' />
                          </Pressable>
                        </View>
                      ))
                        :
                        <Text style={{ fontSize: 12, marginLeft: 10 }}>{JSON.stringify(x[t])}</Text>
                    }
                  </View>
                </View>
              )
            } else {
              return null
            }
          })
        }
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
          <LibTextstyle text={String(Object.keys(itemData))} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <LibScroll>
        <View style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
          <Text style={{ fontSize: 16 }}>{Object.keys(itemData)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ flex: 1 }} >
              {
                Object.values(itemData).map(renderItems)
              }
            </View>
          </View>
        </View>
        <View />
      </LibScroll>
    </View>
  )
}