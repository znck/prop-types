// Type definitions for @znck/prop-types
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

export as namespace PropTypes

export default factory
export const factory: ValidationFactory
export const normalize: ModifierNormalizer

type ModifierNormalizer = (
  props: any,
  transform: (name: string, value: any) => any,
  resolve: (name: string, suffix: string, value: any) => any
) => ((props: any) => ({[key: string]: any}))

type ValidationFunction = (value: any) => boolean

export interface ValidationFactory {
  string: Validator;
  number: Validator;
  array: Validator;
  object: Validator;
  bool: Validator;
  symbol: Validator;
  func: Validator;
  any: Validator;
  shape: (shape: {[key: string]: Validator | ValidationFunction | Contructor}) => Validator;
  objectOf: (type: Validator | ValidationFunction | Contructor) => Validator;
  arrayOf: (type: Validator | ValidationFunction | Contructor) => Validator;
  oneOfType: (...types: Array<Validator | ValidationFunction | Contructor>) => Validator;
  oneOf: (...values: any[]) => Validator;
  instanceOf: (type: Contructor) => Validator;
}

export type ValidatorData = {
  type?: Array<Contructor> | Contructor;
  required?: Boolean;
  default?: Function | any;
  validator?: Function;
}

export interface ValidationFactoryChain {
  isRequired: Validator;
  value: (value: any) => Validator;
  validate: (value: ValidationFunction) => Validator;
  modifiers: (name: string, ...modifiers: string[]) => {[key: string]: Validator}
}

export type Validator = ValidationFactoryChain | ValidatorData

type Contructor =
  ObjectConstructor |
  ArrayConstructor |
  Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor |
  Float32ArrayConstructor | Float64ArrayConstructor |
  DateConstructor |
  ErrorConstructor |
  GeneratorFunctionConstructor |
  MapConstructor |
  PromiseConstructor |
  ProxyConstructor |
  RegExpConstructor |
  SetConstructor |
  Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor |
  WeakMapConstructor |
  WeakSetConstructor |
  ArrayBufferConstructor |
  StringConstructor |
  BooleanConstructor |
  NumberConstructor |
  SymbolConstructor |
  FunctionConstructor |
  { new (): any }
