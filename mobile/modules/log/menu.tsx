// withHooks

import { esp, LibIcon, LibNavigation, LogStateProperty } from 'esoftplay';
import React from 'react';
import { Pressable, Text } from 'react-native';


export interface LogMenuArgs {

}
export interface LogMenuProps {

}
export default function m(props: LogMenuProps): any {
  const [enableLog, setEnableLog] = LogStateProperty.enableLog().useState()

  if (!!esp.config('log')?.enable) {
    return (
      <Pressable
        style={{ marginVertical: 1, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: enableLog ? "#2CB159" : "#E63A3A" }}
        onPress={() => {
          LibNavigation.navigate('log/list')
        }}>
        <LibIcon.SimpleLineIcons name='arrow-up' size={16} color='white' />
        <Text style={{ color: 'white' }} >  API DEBUGGER</Text>
      </Pressable>
    )
  }

  return null
}