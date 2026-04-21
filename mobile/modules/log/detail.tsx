// withHooks
import { applyStyle } from 'esoftplay';
import { LibIcon } from 'esoftplay/cache/lib/icon/import';
import { LibNavigation } from 'esoftplay/cache/lib/navigation/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { LibStatusbar } from 'esoftplay/cache/lib/statusbar/import';
import { LibStyle } from 'esoftplay/cache/lib/style/import';
import { LibTextstyle } from 'esoftplay/cache/lib/textstyle/import';
import esp from 'esoftplay/esp';
import Storage from 'esoftplay/storage';
import { useCallback } from 'react';

import { FlashList } from '@shopify/flash-list';
import { LibToastProperty } from 'esoftplay/cache/lib/toast/import';
import { LibUtils } from 'esoftplay/cache/lib/utils/import';
import useSafeState from 'esoftplay/state';
import React from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';


export interface LogDetailArgs {
  data: any
}
export interface LogDetailProps {

}

type JsonRow = {
  id: string;
  lookupPath: string;
  key: string;
  value: any;
  isObject: boolean;
  brackets: string;
  depth: number;
  isOpen: boolean;
  type: 'node' | 'closing';
  bracket?: string;
};

const getNestedValue = (obj: any, lookupPath: string) => {
  if (!lookupPath) return obj;
  const parts = lookupPath.split('|');
  return parts.reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj);
};

const flattenJson = (data: any, path = '', idPath = '', depth = 0) => {
  if (data === null || typeof data !== 'object') return [];

  return Object.entries(data).map(([key, value], index) => {
    const isArray = Array.isArray(value);
    const size = value ? Object.keys(value).length : 0;
    const isObject = typeof value === 'object' && value !== null && size > 0;
    const lookupPath = path ? `${path}|${key}` : key;
    const id = idPath ? `${idPath}|${key}|${index}` : `${key}|${index}`;

    let brackets = "";
    if (typeof value === 'object' && value !== null) {
      if (isArray) brackets = size > 0 ? "[..]" : "[ ]";
      else brackets = size > 0 ? "{..}" : "{ }";
    }

    return {
      id,
      lookupPath,
      key,
      value: isObject ? null : value,
      isObject,
      brackets,
      depth,
      isOpen: false,
      type: 'node' as const
    };
  });
};

const getInitialData = (data: any) => {
  const rootRows = flattenJson(data);
  const initialData: JsonRow[] = [];

  rootRows.forEach((item) => {
    const isOpening = item.isObject;
    initialData.push({ ...item, isOpen: isOpening });

    if (isOpening) {
      const nestedValue = getNestedValue(data, item.lookupPath);
      const children = flattenJson(nestedValue, item.lookupPath, item.id, item.depth + 1);

      const isArray = item.brackets.includes('[');
      const closingNode: JsonRow = {
        id: `${item.id}|close`,
        lookupPath: `${item.lookupPath}|close`,
        key: '',
        value: null,
        isObject: false,
        brackets: '',
        depth: item.depth,
        isOpen: false,
        type: 'closing',
        bracket: isArray ? ']' : '}',
      };

      initialData.push(...children, closingNode);
    }
  });
  return initialData;
};

export default function m(props: LogDetailProps): any {
  const data = LibNavigation.getArgs(props, 'data')
  const [displayData, setDisplayData] = useSafeState<JsonRow[]>(getInitialData(data));

  const toggleNode = useCallback((item: JsonRow, index: number) => {
    if (!item.isObject || item.type === 'closing') return;

    const isOpening = !item.isOpen;
    const newDisplayData = [...displayData];
    newDisplayData[index] = { ...item, isOpen: isOpening };

    if (isOpening) {
      const nestedValue = getNestedValue(data, item.lookupPath);
      if (nestedValue === undefined) return;

      const children = flattenJson(nestedValue, item.lookupPath, item.id, item.depth + 1);

      const isArray = item.brackets.includes('[');
      const closingNode: JsonRow = {
        id: `${item.id}|close`,
        lookupPath: `${item.lookupPath}|close`,
        key: '',
        value: null,
        isObject: false,
        brackets: '',
        depth: item.depth,
        isOpen: false,
        type: 'closing',
        bracket: isArray ? ']' : '}',
      };

      newDisplayData.splice(index + 1, 0, ...children, closingNode);
    } else {
      const prefix = `${item.id}|`;
      const nextData = newDisplayData.filter(node => !node.id.startsWith(prefix));
      setDisplayData(nextData);
      return;
    }

    setDisplayData(newDisplayData);
  }, [displayData, data]);

  const renderItem = ({ item, index }: { item: JsonRow, index: number }) => {
    if (item.type === 'closing') {
      return (
        <View style={[{
          height: 28,
          justifyContent: 'center',
        }, { paddingLeft: (item.depth * 18) + 12 }]}>
          <Text style={{
            color: '#ffd700',
            fontWeight: 'bold'
          }}>{item.bracket}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!item.isObject}
        onPress={() => toggleNode(item, index)}
        style={[{ paddingBottom: 5, alignItems: 'center', flexDirection: "row", paddingRight: 20, paddingLeft: (item.depth * 18) + 12 }]} >
        <Text selectable style={{ flexDirection: "row", fontFamily: 'monospace', fontSize: 14, color: '#ccc' }} >
          {/* <Text style={{ fontSize: 10, color: '#666' }}> {item.isObject ? (item.isOpen ? '▼ ' : '▶ ') : '     '} </Text> */}
          <Text selectable style={{ color: '#9cdcfe', fontWeight: '500' }}>{item.key} : </Text>
          {item.brackets ? (
            <Text style={{ color: '#ffd700', fontWeight: 'bold' }}>
              {item.isOpen
                ? (item.brackets.includes('[') ? '[' : '{')
                : item.brackets
              }
            </Text>
          ) : (
            <Text selectable style={{ color: '#ce9178' }}>
              {JSON.stringify(item.value)}
            </Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  };


  const sendToTelegram = () => {
    let config = esp.config()
    const api = Object.keys(data)[0]

    let notes: string[] = [
      '#debugger_result',
      'slug: ' + '#' + esp?.appjson()?.expo?.slug,
      'domain: ' + config?.url.replace(/^https?:\/\//, ''),
      'api: ' + api,
    ]

    let msg: string[] = []
    msg.push(
      JSON.stringify(data, undefined, 2)
    )

    LibProgress.show('Sedang mengirim result API ke Telegram..')
    Storage.setItem('log_result_api', msg.join('\n')).then((v) => {
      Storage.sendTelegram('log_result_api', notes.join('\n'), () => {
        LibProgress.hide()
      }, () => {
        LibProgress.hide()
      }, '-1001737180019', () => api)
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#2c3e50' }}>
      <LibStatusbar style='dark' />
      <View style={applyStyle({ backgroundColor: 'white', paddingTop: LibStyle.STATUSBAR_HEIGHT, borderBottomWidth: 0.5, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center", marginBottom: 10 })} >
        <Pressable onPress={() => LibNavigation.back()} style={applyStyle({ alignItems: "center", justifyContent: "center", height: 50, width: 50 })} >
          <LibIcon name={"arrow-left"} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }} >
          <LibTextstyle text={'Result'} textStyle={"headline"} style={applyStyle({ textAlign: "left" })} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ minWidth: '100%' }}>
            <FlashList
              data={displayData}
              renderItem={renderItem}
              estimatedItemSize={32}
              keyExtractor={(item) => item.id}
              extraData={displayData}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScrollView>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => {
            LibUtils.copyToClipboard(JSON.stringify(data, undefined, 2)).then(() => {
              LibToastProperty.show("Copied to clipboard")
            })
          }} style={{ width: (LibStyle.width - 40) * 0.5, margin: 15, marginRight: 5, height: 40, backgroundColor: LibStyle.colorPrimary, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} >
            <LibIcon name='clipboard-outline' size={20} color="white" />
            <Text allowFontScaling={false} style={{ fontSize: 14, textAlign: "center", textAlignVertical: 'center', color: 'white', marginLeft: 5 }} >{'copy to clipboard'}</Text>
          </Pressable>
          <Pressable onPress={() => {
            sendToTelegram()
          }} style={{ width: (LibStyle.width - 40) * 0.5, margin: 15, marginLeft: 5, height: 40, backgroundColor: LibStyle.colorPrimary, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} >
            <LibIcon name='send' size={20} color="white" />
            <Text allowFontScaling={false} style={{ fontSize: 14, textAlign: "center", textAlignVertical: 'center', color: 'white', marginLeft: 5 }} >{'send to esp dev-error'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
