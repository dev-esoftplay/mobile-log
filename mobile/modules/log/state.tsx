// withHooks
// noPage

import { useGlobalReturn, useGlobalState } from 'esoftplay';
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

export default function m(props: LogStateProps): any {
  return null
}