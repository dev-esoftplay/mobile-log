// withHooks
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibToastProperty } from 'esoftplay/cache/lib/toast/import';
import { LibUtils } from 'esoftplay/cache/lib/utils/import';

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
  const response = {
    ok: props.ok,
    message: props.message,
    status_code: props.status_code,
    result: props.result,
  }

  const data = {
    [props.url]: {
      'url': props.url,
      'uri': props.uri,
      'GET': {
        ...get
      },
      'POST': {
        ...post
      },
      'RESPONSE': response
    }
  }

  function Items(prop: any) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 12, flex: 2, color: '#f33775', fontFamily: 'MonoSpace' }}>{prop?.index}</Text>
        <Text style={{ fontSize: 12 }}>{'='}</Text>
        <Text style={{ fontSize: 12, flex: 6, color: '#3f9822', fontFamily: 'MonoSpace' }}> {prop?.value}</Text>
      </View>
    )
  }

  function renderGet(k: any, i: number) {
    return (
      <Items key={i} index={k} value={get[k]} />
    )
  }

  function renderPost(k: any, i: number) {
    return (
      <Items key={i} index={k} value={post[k]} />
    )
  }

  return (
    <View style={{ paddingVertical: 15, marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }}>
      <Pressable onPress={() => {
        LibNavigation.navigate('log/detail', {
          data: [data]
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
                  {Object.keys(get).map(renderGet)}
                </View>
              </>
            }
            {
              Object.keys(post).length > 0 &&
              <>
                <Text style={{ fontSize: 12, marginTop: 10, fontFamily: 'MonoSpace' }}>{'POST : '}</Text>
                <View style={{ flex: 1 }}>
                  {Object.keys(post).map(renderPost)}
                </View>
              </>
            }
          </View>
          <View style={{ alignItems: 'center' }} >
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{props?.result_length}</Text>
            <Pressable onPress={() => {
              LibUtils.copyToClipboard(JSON.stringify(data || {}, undefined, 2)).then(() => { LibToastProperty.show('result disalin') })
            }} style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 3, borderColor: '#e6e6e6', alignItems: 'center' }}>
              <LibIcon name='content-copy' size={14} />
              <Text style={{ marginLeft: 5, fontSize: 12 }}>{'COPY'}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable >
    </View >
  )
}