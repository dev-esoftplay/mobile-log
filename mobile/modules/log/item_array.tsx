// withHooks
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LogFeature_detail_edit_paramProperty } from 'esoftplay/cache/log/feature_detail_edit_param/import';
import { LogItem_array } from 'esoftplay/cache/log/item_array/import';
import { LogItem_object } from 'esoftplay/cache/log/item_object/import';
import esp from 'esoftplay/esp';
import useSafeState from 'esoftplay/state';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogItem_arrayArgs {

}
export interface LogItem_arrayProps {
  index: number
  data: any,
  onPress?: () => void
}
export default function m(props: LogItem_arrayProps): any {
  const [selected, setSelected] = useSafeState(false)
  const [dt, setdt] = LogFeature_detail_edit_paramProperty.state().useState()

  function renderObject(x: any, i: number) {
    return (
      <LogItem_object
        key={i}
        item={x}
        data={props?.data[x]}
        onPress={() => {
          esp.log(esp.logColor.yellow, x)
          const index = Object.keys(dt)[0]
          const c = LibObject.assign(dt, { [4]: x })(index)
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
          esp.log(esp.logColor.backgroundGreen, i)
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
    <View style={{ flexDirection: 'row' }}>
      <View>
        <Pressable onPress={() => {
          setSelected(!selected);
          props?.onPress?.()
        }} style={{ padding: 10, marginLeft: 10, flexDirection: 'row', borderWidth: 0.5, borderRadius: 5, marginBottom: 10 }}>
          <Text style={{ fontFamily: 'MonoSpace', fontSize: 16, color: '#f33775' }} >{props?.index}</Text>
        </Pressable>
      </View>
      {
        selected && props?.data != null &&
        <View style={{ marginLeft: 5, justifyContent: 'center' }}>
          {
            Array.isArray(props.data) ?
              <>
                {props.data.map(renderArray)}
              </>
              :
              (typeof props.data == "object" && props.data != null) ? Object.keys(props.data).map(renderObject)
                :
                <RenderText text={String(props.data)} />
          }
        </View>
      }
    </View >
  )
}