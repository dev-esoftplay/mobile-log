// withHooks
// noPage

import { esp, LibObject, useGlobalReturn, useGlobalState } from 'esoftplay';
import moment from 'esoftplay/moment';
import { } from 'react-native';


export interface LogStateArgs {

}
export interface LogStateProps {

}

const _state = useGlobalState([], { persistKey: 'lib_apitest' })
export function state(): useGlobalReturn<any> {
  return _state
}

const stateIsDebug = useGlobalState(false, { persistKey: 'lib_apitest_debug' })
export function enableLog(): useGlobalReturn<any> {
  return stateIsDebug
}

export function doLogCurl(uri: string, url: string, post: any, isSecure: boolean) {
  if (!!esp.config('log')?.enable) {
    const allData = state().get() || []
    const logEnable = enableLog().get()
    let uriOrigin = uri
    if (uri == '' && url != '') {
      uriOrigin = url.replace(/(https?:\/\/)/g, '')
      let uriArray = uriOrigin.split('/')
      let domain = uriArray[0]
      if (!domain.startsWith('api.')) {
        uriOrigin = ''
      } else {
        let uri = uriArray.slice(1, uriArray.length - 1).join('/')
        let get = uriArray[uriArray.length - 1];
        let newGet = '';
        if (get && get.includes('?')) {
          let rebuildGet = get.split('?')
          for (let i = 0; i < rebuildGet.length; i++) {
            const element = rebuildGet[i];
            if (!element.includes('=')) {
              newGet += '?id=' + element
            } else {
              newGet += (newGet.includes('?') ? '&' : '?') + element
            }
          }
        } else {
          newGet = get;
        }
        uriOrigin = uri + newGet
      }
    }
    const complete_uri = uriOrigin
    const _uri = complete_uri.includes('?') ? complete_uri.split('?')[0] : complete_uri
    const _get = complete_uri.includes('?') ? complete_uri.split('?')[1].split('&').map((x: any) => x.split('=')).map((t: any) => {
      return ({ [t[0]]: [t[1]] })
    }) : []
    const get = Object.assign({}, ..._get)
    const _post = post && Object.keys(post).map((key) => {
      return ({ [key]: [decodeURI(post[key])] })
    }) || []
    const postNew = Object.assign({}, ..._post)

    if (_uri != '') {
      const data = {
        [_uri]: {
          secure: isSecure,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          get: get,
          post: postNew,
        }
      }
      let dt = LibObject.unshift(allData, data)()
      if (logEnable) {
        state().set(dt)
      }
    }
  }
}

export default function m(props: LogStateProps): any {
  return null
}