// withHooks
import { applyStyle } from 'esoftplay';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibInput } from 'esoftplay/cache/lib/input/import';
import { LibList } from 'esoftplay/cache/lib/list/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import { LogFeatureProperty } from 'esoftplay/cache/log/feature/import';
import { LogFeature_detail_edit_param_item } from 'esoftplay/cache/log/feature_detail_edit_param_item/import';
import useGlobalState, { useGlobalReturn } from 'esoftplay/global';
import useSafeState from 'esoftplay/state';

import React, { useEffect, useRef } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';


export interface LogFeature_detail_edit_paramArgs {
  data: any,
  item: any,
  index: number,
  i: number,
  select: any
}
export interface LogFeature_detail_edit_paramProps {

}

const _state = useGlobalState<any>(undefined)
export function state(): useGlobalReturn<any> {
  return _state
}

export default function m(props: LogFeature_detail_edit_paramProps): any {
  const { data, item, index, i, select } = LibNavigation.getArgsAll(props)
  const [selected, setSelected] = useSafeState<any>(select)
  const [globalData, setGlobalData] = LogFeatureProperty.state().useState()
  const [itemData, setItemData, getItemData] = useSafeState(item)
  const [dt, setdt] = _state.useState()
  const textInputRef = useRef<LibInput>(null)
  let textInput = useRef('').current

  useEffect(() => {
    textInput = selected?.value
    return () => LibNavigation.cancelBackResult(LibNavigation.getResultKey(props))
  }, [])

  function renderItems(item: any, i: number) {
    return (
      <View key={i} style={{ backgroundColor: 'white', marginHorizontal: 15, marginBottom: 10, marginTop: 5, padding: 5, borderRadius: 5, ...LibStyle.elevation(3) }}>
        <Text style={{ fontFamily: 'mono', fontSize: 16, color: '#f33775', padding: 10 }}>{Object.keys(item)}</Text>
        {
          Object.values(item).length > 0 && Object.values(item)?.map?.((t: any, idx: number) => (
            <View key={idx} style={{ borderTopColor: '#e6e6e6', borderTopWidth: 1, paddingTop: 10 }}>
              <ScrollView horizontal>
                <View>
                  {
                    Object.keys(t).map((item2: any, id: number) => {
                      if (item2 === 'get' || item2 === 'post' || item2 === 'response') {
                        return (
                          <LogFeature_detail_edit_param_item
                            onPress={() => {
                              // Object.keys(item)[0] + ':' + String(item2).toUpperCase() + ':'
                              const idxs = Object.keys(item)[0]
                              setdt((old: any) => LibObject.set(old, { [idxs]: { 0: String(item2).toUpperCase() } })())
                              // esp.log(esp.logColor.cyan, Object.keys(item)[0], item2)
                            }}
                            key={id}
                            item={t}
                            params={item2}
                          />
                        )
                      } else {
                        return null
                      }
                    })
                  }
                </View>
              </ScrollView>
            </View>
          ))
        }
      </View>
    )
  }

  const indexs = dt && Object.keys(dt)?.[0]

  return (
    <View style={{ flex: 1 }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center" })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'CHANGE PARAMS VALUE'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <View style={{ backgroundColor: 'white', padding: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontFamily: 'mono' }}>{selected?.title}</Text>
          <View style={{ marginLeft: 10, flex: 1, borderWidth: 1, borderRadius: 4, borderColor: '#c4c4c4', flexDirection: 'row', alignItems: 'center' }}>
            <LibInput
              ref={textInputRef}
              base
              style={{ flex: 1, paddingHorizontal: 10, marginVertical: Platform.OS == 'ios' ? 10 : 5 }}
              defaultValue={String(selected?.value)}
              onChangeText={(t) => {
                textInput = t
              }}
            />
            {
              textInput != '' || textInputRef.current?.getText() != '' &&
              <Pressable onPress={() => {
                textInput = ''
                textInputRef?.current?.setText('');
              }} style={{ marginRight: 5 }} >
                <LibIcon name='close' />
              </Pressable>
            }
          </View>
          <Pressable onPress={() => {
            const a = LibObject.set(LogFeatureProperty.state().get(), [textInput])(index, i, String(Object.keys(getItemData())), selected.par, selected.title)
            const b = LibObject.set(getItemData(), [textInput])(String(Object.keys(getItemData())), selected.par, selected.title)
            setGlobalData(a)
            setItemData(b)
            LibNavigation.sendBackResult(textInput, LibNavigation.getResultKey(props))
          }} style={{ padding: 10, borderRadius: 4, backgroundColor: '#95a5a6', ...LibStyle.elevation(3), marginLeft: 10 }} >
            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>SIMPAN</Text>
          </Pressable>
        </View>
        {
          indexs &&
          <View style={{ marginTop: 10, borderWidth: 0.5, padding: 10, borderColor: '#e6e6e6', borderRadius: 5 }}>
            <Text style={{ fontSize: 14 }}>{'Selected Indexs : '}</Text>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Text style={{ fontFamily: 'mono', fontSize: 16 }}>@{indexs + ":"}</Text>
              {
                indexs && dt && Object.values(dt[indexs]).map((t: any, i: number) => {
                  let lastIndex = (Object.values(dt[indexs]).length - 1) == i
                  return (
                    <Text key={i} style={{ fontFamily: 'mono', fontSize: 16, color: '#f33775' }}>
                      {i == 0 ? (String(t).toUpperCase() + ":") : t}
                      <Text style={{ fontFamily: 'mono', fontSize: 16, color: '#3f9822' }}>{(lastIndex || i == 0) ? '' : '.'}</Text>
                    </Text>
                  )
                })
              }
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Pressable onPress={() => {
                const url: any = Object.values(dt[indexs]).map((t: any, i: number) => {
                  let lastIndex = (Object.values(dt[indexs]).length - 1) == i
                  return (
                    i == 0 ? (String(t).toUpperCase() + ":") : lastIndex ? t : (t + '.')
                  )
                })
                const val = '@' + indexs + ":" + '' + url.join('')
                if (dt && indexs) {
                  textInput = val
                  textInputRef.current?.setText(val)
                }
              }} style={{ padding: 10, borderRadius: 4, backgroundColor: '#95a5a6', ...LibStyle.elevation(3) }} >
                <Text style={{ fontSize: 14, color: 'white' }}>USE as Value</Text>
              </Pressable>
            </View>
          </View>
        }
      </View>
      <LibList
        data={data?.slice(0, i)}
        renderItem={renderItems}
      />
    </View >
  )
}