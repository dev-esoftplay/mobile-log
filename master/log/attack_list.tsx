// withHooks

import { applyStyle, LibIcon, LibList, LibNavigation, LibSlidingup, LibStatusbar, LibStyle, LibTextstyle, LogAttack_item, useSafeState } from 'esoftplay';
import React, { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';


export interface LogAttack_listArgs {
  data: any
}
export interface LogAttack_listProps {

}
const colors = ['black', 'blue', 'fuchsia', 'gray', 'green',
  'maroon', 'navy', 'olive', 'orange', 'purple',
  'silver'];

export default function m(props: LogAttack_listProps): any {
  const { data } = LibNavigation.getArgsAll(props)
  const [resLength, setResLength] = useSafeState('0')
  const slidingRes = useRef<LibSlidingup>(null)

  const unique = data.map((t: any) => t.result_length).filter((x: any, i: number, a: any) => a.indexOf(x) == i)
  const filtered = unique.map((t: any) => (
    { ['color']: colors[Math.floor(Math.random() * colors.length)], ['id']: t }
  ))

  const newFiltered = filtered.reduce(
    (obj: any, item: any) => Object.assign(obj, { [item.id]: item.color }), {});

  const filteredData = resLength != "0" ? data.filter((t: any) => t.result_length == resLength) : data

  return (
    <View style={{ flex: 1 }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center" })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'Attack [ ' + data?.[0]?.url + ' ]'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#ddd' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1 }}>Filter</Text>
          <Pressable onPress={() => {
            slidingRes?.current?.show()
          }} style={{ backgroundColor: '#e6e6e6', padding: 5, paddingHorizontal: 10 }} >
            <Text>By Result Length</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          {
            resLength != "0" &&
            <Pressable onPress={() => { setResLength("0") }} style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6e6e6', padding: 5, borderRadius: 5 }}>
              <Text style={{ fontSize: 14 }}>{resLength}</Text>
              <LibIcon size={18} name='close' />
            </Pressable>
          }
          <Text style={{}}>Total Result : </Text>
          <Text style={{ marginLeft: 5 }}>{filteredData?.length}</Text>
        </View>
      </View>
      <LibList
        data={filteredData}
        renderItem={(item: any, i: number) => (
          <LogAttack_item key={i} {...item} index={item} color={newFiltered?.[item?.result_length]} />
        )}
      />
      <LibSlidingup ref={slidingRes}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, paddingHorizontal: 15, paddingBottom: 20 }}>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ textAlign: 'center', fontSize: 14 }}>Result Length</Text>
          </View>
          <ScrollView style={{ maxHeight: LibStyle.height * 0.7, minHeight: 100 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
              {
                unique.map((x: any, i: number) => (
                  <Pressable key={i} onPress={() => { setResLength(x); slidingRes?.current?.hide() }} style={{ marginBottom: 10, marginRight: 10, borderRadius: 5, padding: 5, paddingHorizontal: 10, backgroundColor: resLength == x ? LibStyle.colorPrimary : '#e6e6e6' }}>
                    <Text>{x}</Text>
                  </Pressable>
                ))
              }
            </View>
          </ScrollView>
        </View>
      </LibSlidingup>
    </View>
  )
}