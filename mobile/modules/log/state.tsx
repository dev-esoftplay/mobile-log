// withHooks
// noPage
import { esp, useGlobalReturn, useGlobalState } from 'esoftplay';
import { LibObject } from 'esoftplay/cache/lib/object.import';

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

function doRepairUrl(url: string) {
  let repaired = url.split('/')
  if (repaired.length > 1) {
    const lastIdx = repaired.length - 1
    const uriParam = repaired[lastIdx].split("?")[0]
    const fixGET = repaired[lastIdx].split('?').join('&')

    if (!isNaN(Number(uriParam))) {
      url = repaired.slice(0, lastIdx).join('/')
      url += "?id=" + [fixGET];
    }
  }
  return url
}

function fixUrl(url: string) {
  let fullUrl = url
  const nurl = url.replace(/(https?:\/\/)/g, '')
  const spath = nurl.split('/').slice(1, nurl.length - 1).join('/')
  let host = nurl.split('/')[0] + '/'
  let path = doRepairUrl(spath)
  fullUrl = host + path

  return fullUrl
}

export function doLogCurl(uri: string, url: string, post: any, isSecure: boolean) {
  if (!!esp.config('log')?.enable) {
    const allData = state().get() || []
    const logEnable = enableLog().get()

    const fullURL = url + uri
    let uriOrigin = ''

    if (fullURL != '') {
      const urls = fixUrl(fullURL)
      uriOrigin = urls.replace(/(https?:\/\/)/g, '')
      let uriArray = uriOrigin.split('/')
      let domain = uriArray[0]

      if (!domain.startsWith('api.')) {
        uriOrigin = ''
      } else {
        let uri = uriArray.slice(1, uriArray.length - 1).join('/')
        let get = uriArray[uriArray.length - 1];
        let newURI = uri != "" ? uri + '/' : uri
        uriOrigin = newURI + get
      }
    }
    const complete_uri = uriOrigin
    const _uri = complete_uri.includes('?') ? complete_uri.split('?')[0] : complete_uri
    const _get = complete_uri.includes('?') ? complete_uri.split('?')[1].split('&').map((x: any) => x.split('=')).map((t: any) => {
      return ({ [t[0]]: [t[1]] })
    }) : []
    const get = Object.assign({}, ..._get)
    const _post = post && Object.keys(post).map((key) => {
      return ({ [key]: [decodeURIComponent(post[key])] })
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