// withHooks
import { esp, useSafeState } from 'esoftplay';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LogFeature_detail_edit_paramProperty } from 'esoftplay/cache/log/feature_detail_edit_param/import';
import { LogItem_array } from 'esoftplay/cache/log/item_array/import';
import { LogItem_object } from 'esoftplay/cache/log/item_object/import';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogItem1Args {

}
export interface LogItem1Props {
  item: any
  item3: any
  params: any
  onPress?: () => void
}
export default function m(props: LogItem1Props): any {
  const { item, item3 } = props
  const [selected, setSelected] = useSafeState(false)
  const [dt, setdt] = LogFeature_detail_edit_paramProperty.state().useState()

  function renderObject(x: any, i: number) {
    return (
      <LogItem_object
        key={i}
        item={x}
        data={item[props.params][item3][x]}
        onPress={() => {
          esp.log(esp.logColor.backgroundMagenta, x);
          const index = Object.keys(dt)[0]
          const c = LibObject.assign(dt, { [2]: x })(index)
          setdt(c)
        }}
      />
    )
  }

  function renderArray(x: any, i: number) {
    return (
      <LogItem_array
        key={i}
        index={i}
        data={x}
        onPress={() => {
          esp.log(esp.logColor.backgroundBlue, x);
          const index = Object.keys(dt)[0]
          const c = LibObject.assign(dt, { [2]: x })(index)
          setdt(c)
        }}
      />
    )
  }

  function RenderText(props: any) {
    if (props?.text != "") {
      return (
        <View style={{ marginLeft: 5, padding: 10 }} >
          <Text style={{ textDecorationLine: 'underline', fontSize: 12, color: '#3498db' }}>{props?.text || ""}</Text>
        </View>
      )
    } else {
      return null
    }
  }

  return (
    <View style={{ flexDirection: 'row', marginRight: 5, marginBottom: 10 }} >
      <View>
        <Pressable onPress={() => {
          setSelected(!selected);
          props?.onPress?.()
        }} style={{ padding: 10, borderWidth: 0.5, borderRadius: 5 }}>
          <Text style={{ fontFamily: 'MonoSpace', fontSize: 16, color: '#f33775' }} >{item3}</Text>
        </Pressable>
      </View>
      {
        selected &&
        <View style={{ marginLeft: 5, justifyContent: 'center' }}>
          {
            Array.isArray(item?.[props?.params]?.[item3]) ?
              <>
                {item?.[props?.params]?.[item3]?.map?.(renderArray)}
              </>
              :
              (typeof item?.[props?.params]?.[item3] == "object" && item?.[props?.params]?.[item3] != null) ?
                Object.keys(item?.[props?.params]?.[item3])?.map?.(renderObject)
                :
                <RenderText text={String(item?.[props?.params]?.[item3])} />
          }
        </View>
      }
    </View>
  )
}