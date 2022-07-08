// withHooks

import { applyStyle, LibIcon, LibList, LibNavigation, LibObject, LibProgress, LibStatusbar, LibStyle, LibTextstyle, LogFeatureProperty, LogFeature_detail_item, LogLoggerProperty } from 'esoftplay';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogFeature_detailArgs {
  title: any
  index: number
}
export interface LogFeature_detailProps {

}
export default function m(props: LogFeature_detailProps): any {
  const { title, index } = LibNavigation.getArgsAll(props)
  const [data, setData] = LogFeatureProperty.state().useState()

  function row(item: any, i: number) {
    return (
      <LogFeature_detail_item key={i} index={index} i={i} item={item} data={data[title]} onChange={() => {
      }} onDelete={() => setData(LibObject.splice(data, i, 1)(title))} />
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
          <LibTextstyle text={'SCENE ' + title} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
        <Pressable onPress={() => {
          LibNavigation.navigateForResult('log/url_list').then((res: any) => {
            const get = res[Object.keys(res)[0]].get
            const post = res[Object.keys(res)[0]].post
            const cGet = Object.keys(get).map((t: any) => ({ [t]: Object.values(get[t])[0] }))
            const cPost = Object.keys(post).map((t: any) => ({ [t]: Object.values(post[t])[0] }))
            const newGET = Object.assign({}, ...cGet)
            const newPOST = Object.assign({}, ...cPost)
            LibProgress.show('Please wait..')
            LogLoggerProperty.doLogger([res], (result: any) => {
              LibProgress.hide
              const idx: any = Object?.keys(res)
              const c = LibObject.assign(res, { get: newGET, post: newPOST, response: result?.[0]?.[idx].RESPONSE })(idx)
              setData(LibObject.push(data, c)(title))
            })
          })
        }} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"plus"} />
        </Pressable>
      </View>
      <LibList
        data={data[title]}
        renderItem={row}
      />
      {
        data?.[title]?.length > 0 &&
        <Pressable onPress={() => {
          LogLoggerProperty.doLogger(data[title], (result: any) => {
            LibNavigation.navigate('log/detail', { data: result })
          })
        }} style={{ flexDirection: 'row', alignItems: 'center', margin: 15, borderRadius: 5, padding: 10, justifyContent: 'center', backgroundColor: '#95a5a6' }}>
            <LibIcon name='play' color='#2ecc71' />
          <Text style={{ marginLeft: 5, fontSize: 14, color: 'white' }}>{'RUN SCENARIO'}</Text>
        </Pressable>
      }
    </View >
  )
}