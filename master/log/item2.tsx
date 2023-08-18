// withHooks
// noPage
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogItem2Args {

}
export interface LogItem2Props {
  urlData: any,
  item: any,
  index: number
  onRemoveItem?: () => void
  from?: string
}
export default function m(props: LogItem2Props): any {
  const urlData = props?.urlData
  const item = props?.item

  return (
    <View style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
      <Pressable
        onPress={() => {
          LibNavigation.navigate('log/list_detail', { data: urlData, url: item, index: props?.index })
        }}
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
        <Text style={{ flex: 1, fontSize: 16 }}>{item}</Text>
        <View style={{ backgroundColor: 'orange', minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 10, color: 'white' }}>{Object?.values?.(urlData[item])?.length}</Text>
        </View>
        {
          props?.from != 'url_list' &&
          <Pressable onPress={() => props?.onRemoveItem?.()} style={{ marginLeft: 5, padding: 5 }} >
            <LibIcon name="delete" color='#6e6e6e' />
          </Pressable>
        }
      </Pressable>
    </View>)
}