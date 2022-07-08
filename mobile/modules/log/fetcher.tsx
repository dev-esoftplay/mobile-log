// withHooks

import { esp, LibCrypt, LogTokenProperty } from "esoftplay";



export interface LogFetcherArgs {

}
export interface LogFetcherProps {

}

export function secure(uri: string, post: any, apikey: string, log: (url: string, result: any) => void) {
  uri = uri.replace(/\./g, '/')

  // delete post.api_key
  // delete post.access_token

  Object.keys(post).forEach((key) => {
    const postkey = post[key]
    post[key] = (typeof postkey == 'string') && postkey.includes('\\') && (postkey.startsWith("{") || postkey.startsWith("[")) ? JSON.parse(postkey) : postkey
  })
  let _payload: any = {}
  Object.keys(post).map((key) => {
    _payload[decodeURIComponent(encodeURIComponent(key))] = decodeURIComponent(encodeURIComponent(post[key]))
  })
  let _post: any = { payload: JSON.stringify(_payload) }
  if (apikey) {
    post.api_key = apikey
    _post.api_key = apikey
  }
  let ps = Object.keys(_post).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(_post[key])).join('&');

  const userToken = LogTokenProperty.state().get()
  let token = getTimeByTimeZone("Asia/Jakarta") + "|" + userToken

  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      token: new LibCrypt().encode(token)
    },
    cache: "no-store",
    Pragma: "no-cache",
    ["Cache-Control"]: 'no-cache, no-store, must-revalidate',
    ["Expires"]: 0,
    body: ps,
  }

  fetch(esp.config('url') + 'get_token', options).then(async (res) => {
    let resText = await res.text()
    const isValidJSON = (resText.startsWith("{") && resText.endsWith("}")) || (resText.startsWith("[") && resText.endsWith("]"))
    const resJson = isValidJSON ? JSON.parse(resText) : resText
    post.access_token = resJson?.result
    curl(uri, post, log);
  })
}

export function curl(uri: string, post: any, log: (uri: string, result: any) => void, is_upload?: boolean) {
  uri = uri.replace(/\./g, '/')
  if (post) {
    if (is_upload) {
      let fd = new FormData();
      Object.keys(post).map(function (key) {
        if (key !== undefined) {
          fd.append(key, post[key])
        }
      });
      post = fd
    } else {
      let ps = Object.keys(post).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(post[key]);
      }).join('&');
      post = ps
    }
  }
  let headers: any = {}
  if (!is_upload)
    headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"

  const userToken = LogTokenProperty.state().get()
  let token = getTimeByTimeZone("Asia/Jakarta") + "|" + userToken

  fetch(esp.config('url') + uri, {
    method: !post ? "GET" : "POST",
    headers: {
      ...headers,
      token: new LibCrypt().encode(token)
    },
    // data: !post ? undefined : post,
    cache: "no-store",
    Pragma: "no-cache",
    ["Cache-Control"]: 'no-cache, no-store, must-revalidate',
    ["Expires"]: 0,
    mode: "cors",
    body: post,
    _post: post,
  }).then((res) => res.text()).then((resText) => {
    const isValidJSON = (resText.startsWith("{") && resText.endsWith("}")) || (resText.startsWith("[") && resText.endsWith("]"))
    const resJson = isValidJSON ? JSON.parse(resText) : resText
    log(esp.config('url') + uri, resJson)
  })
}

export function getTimeByTimeZone(timeZone: string): number {
  let localTimezoneOffset = new Date().getTimezoneOffset()
  let serverTimezoneOffset = -420 // -420 for Asia/Jakarta
  let diff
  if (localTimezoneOffset < serverTimezoneOffset) {
    diff = localTimezoneOffset - serverTimezoneOffset
  } else {
    diff = (serverTimezoneOffset - localTimezoneOffset) * -1
  }
  let time = new Date().getTime() + (diff * 60 * 1000 * -1);
  return time;
}

export default function m(props: LogFetcherProps): any {
  return null
}