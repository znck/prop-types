// Type definitions for @znck/prop-types 0.0.0
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

export as namespace PropTypes

export default factory
export const factory: ValidationFactory

export interface ValidationFactory {
  string: Validator;
  number: Validator;
  array: Validator;
  object: Validator;
  bool: Validator;
  symbol: Validator;
  func: Validator;
  any: Validator;
  shape: (shape: {[key: string]: ValidationFactory | function}) => Validator;
  objectOf: (type: ValidationFactory | function) => Validator;
  arrayOf: (type: ValidationFactory | function) => Validator;
  oneOfType: (...types: Array<ValidationFactory | function> | ValidationFactory | function) => Validator;
  oneOf: (...values: any) => Validator;
  instanceOf: (type: function) => Validator;
}

export type ValidatorData = {
  type?: Array | function;
  required?: Boolean;
  default?: function;
  validator?: function;
}

export interface ValidationFactoryChain {
  isRequired: Validator;
  required: () => Validator;
  default: (value: any) => Validator;
  validate: (value: function) => Validator;
} 

export type Validator = ValidationFactoryChain | ValidatorData
