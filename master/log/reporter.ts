//[moved] test

import { LibCurl } from 'esoftplay/cache/lib/curl/import';
import { LibObject } from 'esoftplay/cache/lib/object/import';
import { LibProgress } from 'esoftplay/cache/lib/progress/import';
import { UserClass } from 'esoftplay/cache/user/class/import';
import useGlobalState, { useGlobalReturn } from 'esoftplay/global';
import moment from 'esoftplay/moment';
import Storage from 'esoftplay/storage';
import { createDebounce } from 'esoftplay/timeout';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
const { expoConfig } = Constants;

const state = useGlobalState<any[]>([], { persistKey: 'log/reporter', inFile: true, jsonBeautify: true })
const isHasAccess = useGlobalState(false, { persistKey: 'log/reporter_access' })
const reporterConfig = useGlobalState<{ module: string, delay: number }>({ module: "", delay: 0 }, { persistKey: "log/config", loadOnInit: true })
const delaySend = useGlobalState<any>(undefined, { persistKey: "log/delay", loadOnInit: true })

export default class m {

  static getAccess(): void {
    new LibCurl('user_reporter', null, (res, msg) => {
      if (res?.module && res?.delay && res?.module != "" && res?.delay != 0) {
        console.log("config set")
        reporterConfig.set({ module: res?.module, delay: res?.delay })
      }
      isHasAccess.set(Number(res?.send) == 0 ? false : true)
    }, (err) => { }, 0)
  }

  static config(): useGlobalReturn<{ module: string, delay: number }> {
    return reporterConfig
  }

  static trigger(delay?: number) {
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
    if (delay && !delaySend.get())
      delaySend.set(moment().add(delay, "seconds").format("YYYY-MM-DD HH:mm:ss"))

    if (!!delaySend.get()) {
      if (currentDate >= delaySend.get()) {
        m.sendReport()
      } else {
        const debounce = createDebounce()
        debounce.set(m.trigger, 10000)
      }
    }
  }

  static accessState(): useGlobalReturn<boolean> {
    return isHasAccess
  }

  static dataState(): useGlobalReturn<any> {
    return state
  }

  static addLog(url: string, post: string, _response: string, module?: string): void {
    if (isHasAccess.get()) {
      var response = typeof _response == 'string' && ((_response.startsWith("{") && _response.endsWith("}")) || (_response.startsWith("[") && _response.endsWith("]"))) ? JSON.parse(_response) : _response
      state.set(LibObject.push(state.get(), { url, post, response, module })())
    }
  }

  static reset(): void {
    reporterConfig.reset()
    delaySend.reset()
    isHasAccess.set(false)
    state.reset()
    Storage.removeItem('log/reporter')
  }

  static deleteReporterEmail(): void {
    new LibCurl('user_reporter_delete', null, (res, msg) => {
      m.reset()
    }, (err) => { }, 1)
  }

  static sendReport(thisDevices?: any, cb?: () => void): void {
    setTimeout(async () => {
      const email = UserClass.state().get().email
      const fileUri = Storage.getDBPath('log/reporter')

      m.config().get().module == "" && LibProgress.show('Mengirim report..')

      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri, {});
        const fileName = fileInfo?.uri?.split('/').pop();
        const formData = new FormData();
        let msg = [
          '#report from ' + email,
          '\nslug: ' + "#" + expoConfig?.slug,
          // 'dev: ' + Platform.OS + ' - ' + Constants.deviceName,
          'device name : ' + (thisDevices?.device_name || Constants?.deviceName),
          'device os - os version : ' + (thisDevices?.device_os || Platform.OS) + " - " + (thisDevices?.os_version || Constants.systemVersion),
          'app version: ' + (thisDevices?.version || Platform.OS == 'android' ? expoConfig?.android?.versionCode : expoConfig?.ios?.buildNumber)
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
        m.reset()
        m.deleteReporterEmail()
        cb?.()
        LibProgress.hide()
      } catch (error) {
        console.log(error)
        LibProgress.hide()
      }
    }, 0);
  };
}


