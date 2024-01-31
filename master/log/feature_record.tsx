// withHooks

import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import useGlobalState from 'esoftplay/global';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';


export interface LogFeature_recordArgs {

}
export interface LogFeature_recordProps {

}
export const recordState = useGlobalState(false)
export const recordedKey = useGlobalState('')

export default function m(props: LogFeature_recordProps): any {

  function BlinkingIcon() {
    const opacity = useSharedValue(0);
    opacity.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.ease }), -1, true);
    const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);
    return (
      <Animated.View style={style}>
        <LibIcon name='stop' size={34} color='#ecf0f1' />
      </Animated.View>
    );
  }

  return (
    <View style={{ position: 'absolute', right: 25, bottom: LibStyle.width * 0.5 }}>
      <Pressable onPress={() => {
        Alert.alert("Rekam Skenario", "Berhenti Rekam Skenario?", [
          { text: "BATAL", style: "cancel" },
          {
            text: "BERHENTI", style: 'default', onPress: () => {
              recordState.set((o) => !o)
              const key: any = recordedKey.get()
              LibNavigation.navigate('log/feature')
              LibNavigation.navigate('log/feature_detail', { index: key, title: key })
              recordedKey.reset()
            }
          }
        ])
      }} style={[{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#c0392b', alignItems: 'center', justifyContent: 'center' }, LibStyle.elevation(2)]}>
        <BlinkingIcon />
      </Pressable>
    </View>
  )
}