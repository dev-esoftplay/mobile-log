// withHooks
import { applyStyle, useGlobalReturn } from 'esoftplay';
import { LibDialog } from 'esoftplay/cache/lib/dialog/import';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibList } from 'esoftplay/cache/lib/list/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import useGlobalState from 'esoftplay/global';

import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogAttack_listArgs {

}
export interface LogAttack_listProps {

}

const _state = useGlobalState<any>({}, { persistKey: 'log/attack_history' })

export function state(): useGlobalReturn<any> {
  return _state
}

export default function m(props: LogAttack_listProps): any {
  const [state, setState] = _state.useState()

  function renderItems(item: any, i: number) {
    return (
      <View key={i} style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
        <Pressable
          onPress={() => { LibNavigation.navigate('log/attack_list', { data: Object.values(state[item]) }) }}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 16, fontFamily: 'MonoSpace' }}>{item}</Text>
          <Pressable onPress={() => {
            LibDialog.warningConfirm('Hapus?', "Hapus Log " + item + " ?", 'Hapus', () => {
              setState(LibObject.unset(state, item)())
            }, 'Batal', () => { })
          }} style={{ marginLeft: 5 }} >
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
          <LibTextstyle text={'Riwayat Attack'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <LibList
        data={Object.keys(state)}
        renderItem={renderItems}
      />

    </View>
  )
}