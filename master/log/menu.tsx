// withHooks
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { UserRoutes } from 'esoftplay/cache/user/routes/import';
import esp from 'esoftplay/esp';

import React from 'react';
import { Pressable, Text } from 'react-native';


export interface LogMenuArgs {

}
export interface LogMenuProps {

}
export default function m(props: LogMenuProps): any {
  const enableLog = esp.modProp('log/state').enableLog().useSelector((s: any) => s)
  let routes = UserRoutes.state().useSelector(s => s)

  if (!!esp.config('log')?.enable) {
    return (
      <Pressable
        style={{ marginVertical: 1, paddingHorizontal: 15, borderRadius: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: enableLog ? "#2CB159" : "#E63A3A" }}
        onPress={() => {
          LibNavigation.navigate('log/list')
        }}>
        <LibIcon.SimpleLineIcons name='arrow-up' size={10} color='white' />
        <Text style={{ fontSize: 14, color: 'white', flex: 1 }} >  API DEBUGGER</Text>
        <Text style={{ fontSize: 14, color: 'white' }} >{routes?.routes?.[routes?.routes?.length - 1]?.name || 'root'}</Text>
      </Pressable>
    )
  }

  return null
}
