// withHooks
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LogAttack_historyProperty } from 'esoftplay/cache/log/attack_history/import';
import { LogLoggerProperty } from 'esoftplay/cache/log/logger/import';
import { LogSql_inject } from 'esoftplay/cache/log/sql_inject/import';
import useGlobalState, { useGlobalReturn } from 'esoftplay/global';

import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';


export interface LogProgressArgs {
  route: string
}
export interface LogProgressProps {

}

const _state = useGlobalState(0)

export function state(): useGlobalReturn<any> {
  return _state
}

const _value = useGlobalState({ current_value: '', result_length: 0 })

export function curValue(): useGlobalReturn<any> {
  return _value
}

export default function m(props: LogProgressProps): any {
  const route = LibNavigation.getArgs(props, 'route')
  const maxLength = LogSql_inject().length - 1
  const [state, setState] = _state.useState()
  const [value, setValue] = _value.useState()
  const barWidth = LibStyle.width - 40

  useEffect(() => {
    LogLoggerProperty.forceStopLog(false)
    LogLoggerProperty.doLogger(route, (r: any, url) => {
      if (url) {
        const old = LogAttack_historyProperty.state().get()
        LogAttack_historyProperty.state().set({ ...old, [url]: r })
        LibNavigation.replace('log/attack_list', { data: r })
      }
    }, true)
    return () => LogLoggerProperty.forceStopLog(true)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <LibStatusbar style='dark' />
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text style={{ fontSize: 14, marginTop: 5, fontFamily: 'MonoSpace' }}>{state == maxLength ? 'Selesai' : 'Sedang memproses..'} {state}/{maxLength}</Text>
        <View style={{ overflow: 'hidden', marginTop: 10, marginHorizontal: 20, width: barWidth, height: 20, flexDirection: "row", backgroundColor: 'white', borderColor: '#000', borderWidth: 1, borderRadius: 10 }}>
          <View style={{ backgroundColor: "#8BED4F", width: state / maxLength * barWidth - 2, borderRadius: 10 }} />
        </View>
        <Text style={{ fontSize: 20, marginTop: 10, fontFamily: 'MonoSpace' }}>{Math.floor(state / maxLength * 100)}%</Text>
        <Pressable onPress={() => {
          LogLoggerProperty.forceStopLog(true)
        }} style={{ marginTop: 20, backgroundColor: 'red', padding: 8, borderRadius: 5 }} >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', fontFamily: 'MonoSpace' }}>STOP ATTACK</Text>
        </Pressable>
      </View>
      <View style={{ backgroundColor: '#2c3e50', height: 90, paddingHorizontal: 15 }}>
        <Text style={{ marginTop: 10, fontSize: 12, fontFamily: 'MonoSpace', color: 'cyan' }}>{'attacking ' + Object.keys(route[0])} ...</Text>
        <ScrollView>
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 12, fontFamily: 'MonoSpace', color: 'cyan' }}>{value?.current_value}</Text>
            <Text style={{ marginLeft: 10, fontSize: 12, fontFamily: 'MonoSpace', color: 'cyan' }}>{value?.result_length}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}