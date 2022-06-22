// withHooks

import { LibNavigation, LogDetailArgs } from 'esoftplay';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogAttack_itemArgs {

}
export interface LogAttack_itemProps {
  get: any
  post: any,
  uri: string,
  url: string,
  message: string
  ok: string
  status_code: string
  result: any,
  index: number,
  id: number,
  result_length: number,
  filtered: any,
  color: string
}
export default function m(props: LogAttack_itemProps): any {
  const get = props?.get
  const post = props?.post

  return (
    <View style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
      <Pressable onPress={() => {
        LibNavigation.navigate<LogDetailArgs>('log/detail', {
          data: [{
            [props.url]: {
              'uri': props.uri,
              'GET': {
                ...get
              },
              'POST': {
                ...post
              },
              'RESPONSE': {
                ok: props.ok,
                message: props.message,
                status_code: props.status_code,
                result: props.result,
              }
            }
          }]
        })
      }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: 10 }}>
            <View style={{ marginRight: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{props?.id}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {
              Object.keys(get).length > 0 &&
              <>
                <Text style={{ fontSize: 12, marginBottom: 10, fontFamily: 'MonoSpace' }}>{'GET : '}</Text>
                <View style={{ flex: 1 }}>
                  {
                    Object.keys(get).map((k: any, i: number) => (
                      <View key={i} style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, flex: 2, color: '#f33775', fontFamily: 'MonoSpace' }}>{k}</Text>
                        <Text style={{ fontSize: 12 }}>{'='}</Text>
                        <Text style={{ fontSize: 12, flex: 6, color: '#3f9822', fontFamily: 'MonoSpace' }}> {get[k]}</Text>
                      </View>
                    ))
                  }
                </View>
              </>
            }
            {
              Object.keys(post).length > 0 &&
              <>
                <Text style={{ fontSize: 12, marginTop: 10, fontFamily: 'MonoSpace' }}>{'POST : '}</Text>
                <View style={{ flex: 1 }}>
                  {
                    Object.keys(post).map((k: any, i: number) => (
                      <View key={i} style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, flex: 2, color: '#f33775' }}>{k}</Text>
                        <Text style={{ fontSize: 12 }}>{'='}</Text>
                        <Text style={{ fontSize: 12, flex: 5, color: '#3f9822' }}> {post[k]}</Text>
                      </View>
                    ))
                  }
                </View>
              </>
            }
          </View>
          <View>
            <View style={{ padding: 4, borderRadius: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{props?.result_length}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
}