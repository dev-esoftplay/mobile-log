// withHooks
import { useGlobalReturn, useGlobalState } from 'esoftplay';



export interface LogTokenArgs {

}
export interface LogTokenProps {

}

const _state = useGlobalState('')

export function state(): useGlobalReturn<any> {
  return _state
}

export function buildToken(token: any[]) {
  _state.set(token.join("|"))
}

export default function m(props: LogTokenProps): any {
  return null
}