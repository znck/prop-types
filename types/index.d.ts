// Type definitions for @znck/prop-types
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

export as namespace PropTypes

export default factory
export const factory: PropTypesStatic
export const normalize: ModifierNormalizer

type ModifierNormalizer = (
  props: any,
  transform: (name: string, value: any) => any,
  resolve: (name: string, suffix: string, value: any) => any
) => ((props: any) => { [key: string]: any })

type ValidationFunction = (value: any) => boolean

export interface PropTypesStatic {
  string: PropType
  number: PropType
  array: PropType
  object: PropType
  bool: PropType
  symbol: PropType
  func: PropType
  any: PropType
  shape: (
    shape: { [key: string]: PropType | ValidationFunction | ConstructorType }
  ) => PropType
  objectOf: (type: PropType | ValidationFunction | ConstructorType) => PropType
  arrayOf: (type: PropType | ValidationFunction | ConstructorType) => PropType
  oneOfType: (
    ...types: Array<PropType | ValidationFunction | ConstructorType>
  ) => PropType
  oneOf: (...values: any[]) => PropType
  instanceOf: (type: ConstructorType) => PropType
  validate(fn: () => void): void
}

export type ValidatorData = {
  type?: Array<ConstructorType> | ConstructorType
  required?: Boolean
  default?: Function | any
  validator?: Function
}

export interface ValidationFactoryChain {
  isRequired: PropType
  value: (value: any) => PropType
  validate: (value: ValidationFunction) => PropType
  modifiers: (
    name: string,
    ...modifiers: string[]
  ) => { [key: string]: PropType }
}

export type PropType = ValidationFactoryChain & ValidatorData

type ConstructorType =
  | ObjectConstructor
  | ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | DateConstructor
  | ErrorConstructor
  | GeneratorFunctionConstructor
  | MapConstructor
  | PromiseConstructor
  | ProxyConstructor
  | RegExpConstructor
  | SetConstructor
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | WeakMapConstructor
  | WeakSetConstructor
  | ArrayBufferConstructor
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | SymbolConstructor
  | FunctionConstructor
  | Number
  | String
  | Object
  | Symbol
  | Array
  | Function
  | Boolean
  | { new (): any }
