// withHooks
// noPage

import { esp, LibProgress, LogFetcherProperty, LogProgressProperty, LogSql_inject, LogTokenProperty } from 'esoftplay';


export interface LogLoggerArgs {

}
export interface LogLoggerProps {

}

let forceStop = false

export function forceStopLog(stop: boolean) {
  forceStop = stop
}

function curl(uri: string, post: any): Promise<any> {
  return new Promise((resolve, reject) => {
    LibProgress.show()
    LogFetcherProperty.curl(uri, post, (uri: string, res: any) => {
      resolve(res)
      LibProgress.hide()
    })
  })
}

function secure(uri: string, post: any, apikey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    LibProgress.show()
    LogFetcherProperty.secure(uri, post, apikey, (uri: string, res: any) => {
      resolve(res)
      LibProgress.hide()
    })
  })
}


export function doLogger(data: any, callback: (result: any, url?: string) => void, intrude?: boolean) {
  let allroutes = buildCombinatios(data)
  let resume = ''
  let inject = LogSql_inject()

  function addResume(param: any) {
    console.log(param);
    resume += param + '\n'
  }

  let scene = -1
  next(allroutes, 0, 0)

  function next(allroutes: any, index: number, _idx: number) {
    if (scene != index)
      addResume('SCENE ' + index)
    scene = index
    let route = allroutes[index]
    let routeKeys = Object.keys(route)
    let currentRouteKey = routeKeys[_idx]
    let routeKeysSize = routeKeys.length
    let currentRoute = route[currentRouteKey]
    let POST: any = {}
    let GET: any = {}

    if (currentRoute?.POST) {
      Object.keys(currentRoute.POST).map((key) => {
        let value = currentRoute.POST[key]
        POST[key] = replaceWithVariable(value, route)
      })
      allroutes[index][currentRouteKey]['POST'] = POST
    }
    if (currentRoute?.GET) {
      Object.keys(currentRoute.GET).map((key) => {
        let value = currentRoute.GET[key]
        GET[key] = replaceWithVariable(value, route)
      })
      allroutes[index][currentRouteKey]['GET'] = GET
    }

    function execPOST_RESPONSE(response: any) {
      if (currentRoute.POST_RESPONSE) {
        const fn = new Function('return ' + currentRoute.POST_RESPONSE)();
        return fn(response)
      }
      return response
    }

    // if (currentRoute.USE_TOKEN) {
    //   if (fs.existsSync('./tokens/' + currentRoute.USE_TOKEN)) {
    //     const token = require('./tokens/' + currentRoute.USE_TOKEN)
    //     const config = JSON.parse(fs.readFileSync('./config.json', { encoding: 'utf-8' }))
    //     config.token = token
    //     fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    //   } else {
    //     console.log('File ' + currentRoute.USE_TOKEN + ' not found in tokens/')
    //     return
    //   }
    // }

    function fixUris(uri: string) {
      return uri.replace(/\*\*[0-9]+/, '')
    }

    const userToken = LogTokenProperty.state().get()
    let token = LogFetcherProperty.getTimeByTimeZone("Asia/Jakarta") + "|" + userToken
    let artoken = token.split('|')

    if (currentRoute.IS_SECURE_POST) {
      // esp.log(fixUris(currentRouteKey) + objectToUrlParam(GET), POST, artoken[1]);
      secure(fixUris(currentRouteKey) + objectToUrlParam(GET), POST, artoken[1]).then((r) => {
        allroutes[index][currentRouteKey]['USER_ID'] = artoken[1]
        allroutes[index][currentRouteKey]['RESPONSE'] = r
        addResume('\t\t\t' + currentRouteKey + ' :  ' + r)

        if (_idx < routeKeysSize - 1) {
          next(allroutes, index, _idx + 1)
        } else if (index < allroutes.length - 1) {
          next(allroutes, index + 1, 0)
        } else {
          logResults(allroutes)
        }
      })
    } else {
      if (intrude) {
        let newResult: any = []
        intrude(fixUris(currentRouteKey), GET, POST, inject, 0)

        function result(res: any) {
          let restructure = res.map((item: any, i: number) =>
          (
            {
              id: i + 1,
              message: item.message,
              uri: item.uri,
              url: item.url,
              ok: item.ok,
              status_code: item.status_code,
              result: item.result,
              result_length: item.result_length,
              get: Object.assign({}, ...item?.get_key?.map?.((t: any) => ({ [t]: item?.get }))) || {},
              post: Object.assign({}, ...item?.post_key?.map?.((t: any) => ({ [t]: item?.post }))) || {},
            }
          )
          )
          logResults(restructure)
        }

        function intrude(url: string, get: any, post: any, value: any, index: number) {
          const currentValue = value[index]
          const maxLength = value.length - 1
          // const maxLength = 10
          let GET = get
          let POST = post

          Object.keys(GET).map((key) => {
            GET[key] = currentValue
          })
          Object.keys(POST).map((key) => {
            POST[key] = currentValue
          })
          LogFetcherProperty.curl(url + objectToUrlParam(GET), post, (uri: string, res: any) => {
            if (index < maxLength && !forceStop) {
              newResult.push({
                uri,
                url,
                get: currentValue,
                get_key: Object.keys(GET),
                post: currentValue,
                post_key: Object.keys(POST),
                result_length: JSON.stringify(res).length,
                ...res
              })
              esp.log(esp.logColor.green, uri);
              LogProgressProperty.curValue().set({ current_value: currentValue, result_length: JSON.stringify(res).length })
              LogProgressProperty.state().set(newResult.length)
              intrude(url, GET, POST, value, index + 1)
            } else {
              result(newResult)
            }
          })
        }

      } else {
        curl(fixUris(currentRouteKey) + objectToUrlParam(GET), POST).then((r) => {
          allroutes[index][currentRouteKey]['USER_ID'] = artoken[1]
          allroutes[index][currentRouteKey]['RESPONSE'] = r
          addResume('\t\t\t' + currentRouteKey + ' :  ' + r)

          if (_idx < routeKeysSize - 1) {
            next(allroutes, index, _idx + 1)
          } else if (index < allroutes.length - 1) {
            next(allroutes, index + 1, 0)
          } else {
            logResults(allroutes)
          }
        })
      }
    }
  }

  function logResults(allroutes: any) {
    callback(allroutes, allroutes?.[0]?.url)
  }

  function buildCombinatios(APIS: any) {
    let features: any = {}
    APIS.map((api: any) => {
      let uri = Object.keys(api)[0]
      let GET = Object.values<any>(api)[0].get
      let POST = Object.values<any>(api)[0].post
      let IS_SECURE_POST = Object.values<any>(api)[0].secure

      let objGET: any = []
      let objPOST: any = []
      let combined = []
      if (Object.keys(POST).length > 0 && Object.keys(GET).length > 0) {
        objPOST = combine(POST)
        objGET = combine(GET)
        objPOST.map((post: any) => {
          objGET.map((get: any) => {
            combined.push({ GET: get, POST: post, IS_SECURE_POST })
          })
        })
      } else if (Object.keys(GET).length > 0) {
        objGET = combine(GET)
        objGET.map((get: any) => {
          combined.push({ GET: get, IS_SECURE_POST })
        })
      } else if (Object.keys(POST).length > 0) {
        objPOST = combine(POST)
        objPOST.map((post: any) => {
          combined.push({ POST: post, IS_SECURE_POST })
        })
      } else {
        combined.push({ IS_SECURE_POST })
      }
      function check_uri(originalUri: string, uri: string, defaultAdder = 1): string {
        if (features.hasOwnProperty(uri)) {
          return check_uri(originalUri, originalUri + '**' + defaultAdder, defaultAdder + 1)
        } else {
          return uri
        }
      }
      features[check_uri(uri, uri)] = combined
    })
    return combine(features)
  }

  function combine(options: any, optionIndex = 0, results: any = [], current: any = {}) {
    let allKeys = Object.keys(options);
    let optionKey = allKeys[optionIndex];
    let vals = options[optionKey];
    if (vals)
      for (let i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i];
        if (optionIndex + 1 < allKeys.length) {
          combine(options, optionIndex + 1, results, current);
        } else {
          let res = JSON.parse(JSON.stringify(current));
          results.push(res);
        }
      }
    return results;
  }

  function replaceWithVariable(value: any, route: any) {
    if (typeof value == 'string') {
      if (value.startsWith('@') && value.includes(":")) {
        let arrValue = value.split(':')
        const uriName = arrValue[0].replace('@', '')
        const from = arrValue[1]
        const cursors = arrValue[2]
        value = readDeepObj(route[uriName][from])(...cursors.split('.'))
        return value
      }
    }
    return String(value)
  }

  function objectToUrlParam(obj: any) {
    if (!obj)
      return ''
    return Object.keys(obj).map((key, index) => {
      let out = ''
      out += index == 0 ? '?' : '&'
      out += [key] + '=' + obj[key]
      return out
    }).join('')
  }

  function readDeepObj(obj: any): any {
    return function (param: any, ...params: any) {
      let out = obj
      if (param) {
        var _params = [param, ...params]
        if (_params.length > 0)
          for (let i = 0; i < _params.length; i++) {
            const key = _params[i];
            if (out?.hasOwnProperty?.(key)) {
              out = out[key];
            } else {
              out = undefined;
            }
          }
      }
      return out;
    }
  }

}

export default function m(props: LogLoggerProps): any {
  return null
}