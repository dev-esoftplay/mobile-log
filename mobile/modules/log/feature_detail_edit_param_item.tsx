// withHooks
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LogFeature_detail_edit_paramProperty } from 'esoftplay/cache/log/feature_detail_edit_param/import';
import { LogItem1 } from 'esoftplay/cache/log/item1/import';
import useSafeState from 'esoftplay/state';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeature_detail_edit_param_itemArgs {

}
export interface LogFeature_detail_edit_param_itemProps {
  item: any
  params: string
  onPress?: () => void
}
export default function m(props: LogFeature_detail_edit_param_itemProps): any {
  const item = props.item
  const [dt, setdt] = LogFeature_detail_edit_paramProperty.state().useState()
  const [selected, setSelected] = useSafeState(false)

  function renderItems(item3: any, id2: number) {
    return (
      <LogItem1 key={id2} item={item} params={props.params} item3={item3} onPress={() => {
        const index = Object.keys(dt)[0]
        const c = LibObject.assign(dt, { [1]: item3 })(index)
        setdt(c)
      }} />
    )
  }

  return (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <View>
        <View style={{ marginHorizontal: 10, padding: 10, borderWidth: 0.5, borderRadius: 5 }}>
          <Pressable onPress={() => {
            setSelected(!selected);
            props?.onPress?.()
          }} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'mono', fontSize: 14, color: '#3f9822' }} >{String(props?.params).toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View>
          {
            selected && Object.keys(item?.[props?.params])?.length > 0 && Object.keys(item?.[props?.params])?.map?.(renderItems)
          }
        </View>
      </View>
    </View>
  )
}