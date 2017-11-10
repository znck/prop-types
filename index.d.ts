// Type definitions for @znck/prop-types
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

export as namespace PropTypes

export default factory
export const factory: ValidationFactory

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
  shape: (shape: {[key: string]: ValidationFactory | ValidationFunction}) => Validator;
  objectOf: (type: ValidationFactory | ValidationFunction) => Validator;
  arrayOf: (type: ValidationFactory | ValidationFunction) => Validator;
  oneOfType: (...types: Array<ValidationFactory | ValidationFunction>) => Validator;
  oneOf: (...values: any[]) => Validator;
  instanceOf: (type: Function) => Validator;
}

export type ValidatorData = {
  type?: Array<Function> | Function;
  required?: Boolean;
  default?: Function | any;
  validator?: Function;
}

export interface ValidationFactoryChain {
  isRequired: Validator;
  required: () => Validator;
  default: (value: any) => Validator;
  validate: (value: ValidationFunction) => Validator;
}

export type Validator = ValidationFactoryChain | ValidatorData
