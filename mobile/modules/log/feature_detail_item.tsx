// withHooks
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeature_detail_itemArgs {

}
export interface LogFeature_detail_itemProps {
  item: any,
  data: any,
  index: number
  i: number
  onDelete: () => void
  onChange: () => void
}
export default function m(props: LogFeature_detail_itemProps): any {
  const item = props.item;

  function renderItems(x: any, index: number) {
    return (
      <Pressable key={index} onPress={() => { }}>
        {
          Object.keys(x).map((t: any, index2: number) => {
            if (t !== 'response') {
              return (
                <View key={index2} style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, fontSize: 12 }}>{String(t).toUpperCase()}</Text>
                  <Text style={{ marginHorizontal: 10 }}>{"="}</Text>
                  <View style={{ flex: 5 }}>
                    {
                      typeof x[t] == 'object' && Object.keys(x[t]).length > 0 ? Object.keys(x[t]).map((k: any, i2: number) => {
                        if (k == 'api_key' || k == 'access_token') {
                          return null
                        } else {
                          return (
                            <View key={i2} style={{ flexDirection: 'row', marginBottom: 5 }}>
                              <Text style={{ flex: 2, fontSize: 12 }}>{k}</Text>
                              <Text style={{ marginHorizontal: 10 }}>{':'}</Text>
                              <Text style={{ flex: 3, fontSize: 12 }}>{Object.values<any>(x[t])[i2]}</Text>
                            </View>
                          )
                        }
                      })
                        :
                        <Text style={{ fontSize: 12 }}>{JSON.stringify(x[t])}</Text>
                    }
                  </View>
                </View>
              )
            } else {
              return null
            }
          })
        }
      </Pressable>
    )
  }

  return (
    <View style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
      <Pressable
        onPress={() => { }}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontSize: 16 }}>{Object.keys(item)}</Text>
        <Pressable onPress={props?.onDelete} style={{ marginLeft: 5 }} >
          <LibIcon.AntDesign name="delete" />
        </Pressable>
      </Pressable>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <View style={{ flex: 1 }} >

          {Object.values(item).map(renderItems)}

        </View>
        <View style={{}}>
          <Pressable onPress={() => {
            LibNavigation.navigate('log/feature_detail_edit', { data: item, allData: props.data, index: props.index, i: props.i })
          }} style={{ marginBottom: 5, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
            <Text>{'EDIT Params'}</Text>
          </Pressable>
          {/* <Pressable onPress={() => {
            // LogLoggerProperty.doLogger([item], (result: any) => {
              LibNavigation.navigate<LogDetailArgs>('log/detail', { data: result })
            // })
          }} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
            <Text>{'RESULT'}</Text>
          </Pressable> */}
        </View>
      </View>
    </View>
  )
}