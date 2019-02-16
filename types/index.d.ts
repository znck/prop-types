// Type definitions for @znck/prop-types
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

import Vue, { PropOptions } from 'vue'
import { Prop } from 'vue/types/options'

export as namespace PropTypes

export default factory
export const factory: PropTypes

type ValidatorFn<T> = PropOptions<T>['validator']
type PropLike<T> = PropValidator<T> | ValidatorFn<T> | Prop<T>

type Infer<U> = U extends PropValidator<infer T>
  ? T
  : U extends ValidatorFn<infer T>
  ? T
  : U extends Prop<infer T>
  ? T
  : never

export interface PropTypes {
  string: PropValidator<string>
  number: PropValidator<number>
  bool: PropValidator<boolean>
  symbol: PropValidator<Symbol>
  array: PropValidator<Array<any>>
  object: PropValidator<{ [key: string]: any }>
  func: PropValidator<(...args: any[]) => any>
  any: PropValidator<any>

  arrayOf<T>(type: Prop<T>): PropValidator<Array<T>>
  arrayOf<T>(type: PropValidator<T>): PropValidator<Array<T>>
  arrayOf<T>(type: ValidatorFn<T>): PropValidator<Array<T>>

  oneOf<T>(...args: T[]): PropValidator<T>
  oneOf<T1>(arg1: T1): PropValidator<T1>
  oneOf<T1, T2>(arg1: T1, arg2: T2): PropValidator<T1 | T2>
  oneOf<T1, T2, T3>(arg1: T1, arg2: T2, arg3: T3): PropValidator<T1 | T2 | T3>
  oneOf<T1, T2, T3, T4>(arg1: T1, arg2: T2, arg3: T3, arg4: T4): PropValidator<T1 | T2 | T3 | T4>
  oneOf<T1, T2, T3, T4, T5>(arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): PropValidator<T1 | T2 | T3 | T4 | T5>
  oneOf<T1, T2, T3, T4, T5, T6>(arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): PropValidator<T1 | T2 | T3 | T4 | T5 | T6>

  oneOfType<T1>(t1: T1): PropValidator<Infer<T1>>
  oneOfType<T1, T2>(t1: T1, t2: T2): PropValidator<Infer<T1 | T2>>
  oneOfType<T1, T2, T3>(
    t1: T1,
    t2: T2,
    t3: T3
  ): PropValidator<Infer<T1 | T2 | T3>>
  oneOfType<T1, T2, T3, T4>(
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4
  ): PropValidator<Infer<T1 | T2 | T3 | T4>>
  oneOfType<T1, T2, T3, T4, T5>(
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4,
    t5: T5
  ): PropValidator<Infer<T1 | T2 | T3 | T4 | T5>>
  oneOfType<T1, T2, T3, T4, T5, T>(
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4,
    t5: T5,
    ...types: T[]
  ): PropValidator<Infer<T1 | T2 | T3 | T4 | T5 | T>>

  instanceOf<T>(type: Constructor<T>): PropValidator<T>

  shape: <T, S = { [key: string]: PropLike<T> }>(
    shape: S
  ) => PropValidator<Partial<{ [key in keyof S]: Infer<typeof shape[key]> }>>

  objectOf<T>(type: Prop<T>): PropValidator<{ [key: string]: T }> 
  objectOf<T>(type: PropValidator<T>): PropValidator<{ [key: string]: T }> 
  objectOf<T>(type: ValidatorFn<T>): PropValidator<{ [key: string]: T }> 
  
  validate(fn: (logger: ContextLogger) => void): void
  run<R = any>(fn: (logger: ContextLogger) => R): R
  run<R = any>(context: Vue, fn: (logger: ContextLogger) => R): R
}

export interface ContextLogger {
  error(message: string): void
  tip(message: string): void
  warn(message: string): void
}

export interface PropTypesChain<
  T,
  U = T extends string
    ? string
    : T extends String
    ? string
    : T extends number
    ? number
    : T extends Number
    ? number
    : T extends boolean
    ? boolean
    : T extends Boolean
    ? boolean
    : T extends symbol
    ? symbol
    : T extends Symbol
    ? symbol
    : (() => T)
> {
  isRequired: PropOptions<T>
  value(value: U): PropValidator<T>
  defaultValue(value: U): PropValidator<T>
  validate: (value: ValidatorFn<T>) => PropValidator<T>
  customValidator: (value: ValidatorFn<T>) => PropValidator<T>
  description: (value: string) => PropValidator<T> & { description: string }
}

export type PropValidator<T> = PropTypesChain<T> & PropOptions<T>

type Constructor<T> = { new (...args: any[]): T } | { (): T }
