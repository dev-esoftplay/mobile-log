// withHooks
// noPage

import { LibDialog } from 'esoftplay/cache/lib/dialog/import';
import { LogReporter } from 'esoftplay/cache/log/reporter/import';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


export interface LogReporter_menuArgs {

}
export interface LogReporter_menuProps {

}
export default function m(props: LogReporter_menuProps): any {
  const logAccess = LogReporter?.accessState?.().useSelector(r => r)
  const logCount = LogReporter?.dataState?.().useSelector(t => t)

  if (logAccess) {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: '#222', }}>
        <View style={{ padding: 10, flex: 1 }} >
          <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold', marginBottom: 10 }}>Anda dalam mode [REPORTER]</Text>
          <Text style={{ fontSize: 12, color: '#fff', marginBottom: 10 }}>Silahkan akses halaman yang tidak sesuai, lalu kirimkan log ke developer, kami akan mengumpulkan data log untuk keperluan pengecekan.</Text>
          <View style={{ flexDirection: 'row' }} >
            <View style={{ flexWrap: 'wrap', paddingHorizontal: 10, height: 24, borderRadius: 12, backgroundColor: '#cce5ff', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#004085', fontSize: 10 }}>{logCount.length} data terkumpul</Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', margin: 10 }} >
          <Pressable onPress={() => {
            LibDialog.warningConfirm('Konfirmasi', 'Yakin untuk mengirimkan data log sekarang? setelah log dikirim, mode REPORTER akan dimatikan.', 'Kirim', () => {
              LogReporter.sendReport()
            }, 'Batal', () => { })
          }} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.9)', marginTop: 10, borderRadius: 5 }}>
            <Text style={{ color: 'red' }}>KIRIM</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return null

}