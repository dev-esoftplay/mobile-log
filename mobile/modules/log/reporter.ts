

import { useGlobalReturn } from 'esoftplay';
import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { UserClass } from 'esoftplay/cache/user/class/import';
import esp from 'esoftplay/esp';
import useGlobalState from 'esoftplay/global';
import Storage from 'esoftplay/storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
const { manifest } = Constants;


const state = useGlobalState<any[]>([], { persistKey: 'log/reporter', inFile: true, jsonBeautify: true })
const isHasAccess = useGlobalState(false, { persistKey: 'log/reporter_access' })
export default class m {

  static getAccess(): void {
    new LibCurl('user_reporter', null, (res, msg) => {
      isHasAccess.set(Number(res?.send) == 0 ? false : true)
    }, (err) => { }, 0)
  }

  static accessState(): useGlobalReturn<boolean> {
    return isHasAccess
  }

  static dataState(): useGlobalReturn<any> {
    return state
  }

  static addLog(url: string, post: string, _response: string): void {
    if (isHasAccess.get()) {
      var response = typeof _response == 'string' && ((_response.startsWith("{") && _response.endsWith("}")) || (_response.startsWith("[") && _response.endsWith("]"))) ? JSON.parse(_response) : _response
      state.set(LibObject.push(state.get(), { url, post, response })())
    }
  }

  static reset(): void {
    isHasAccess.set(false)
    state.reset()
    Storage.removeItem('log/reporter')
  }

  static deleteReporterEmail(): void {
    new LibCurl('user_reporter_delete', null, (res, msg) => {
      this.reset()
    }, (err) => { }, 1)
  }

  static sendReport(cb?: () => void): void {
    setTimeout(async () => {
      const email = UserClass.state().get().email
      const fileUri = Storage.getDBPath('log/reporter')

      LibProgress.show('Mengirim report..')
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri, {});
        const fileName = fileInfo?.uri?.split('/').pop();
        const formData = new FormData();
        let config = esp?.config?.()
        let msg = [
          '#report from ' + email,
          '\nslug: ' + "#" + manifest?.slug,
          'dev: ' + Platform.OS + ' - ' + Constants.deviceName,
          'app/pub_id: ' + Constants.appOwnership + '/' + (config?.publish_id || '-'),
        ].join('\n')
        formData.append('caption', msg);
        formData.append('chat_id', '-1001737180019');
        formData.append('document', {
          uri: fileUri,
          name: email + '-' + fileName,
          type: 'text/csv',
        });
        const response = await fetch(
          `https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendDocument`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const result = await response.json();
        this.reset()
        this.deleteReporterEmail()
        cb?.()
        LibProgress.hide()
      } catch (error) {
        LibProgress.hide()
      }
    }, 0);
  };
}


