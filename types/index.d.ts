// Type definitions for @znck/prop-types
// Project: @znck/prop-types
// Definitions by: Rahul Kadyan <https://znck.me>

import { PropOptions } from 'vue'
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
  
  validate(fn: () => void): void
}

export interface PropTypesChain<
  T,
  U = T extends string
    ? string
    : T extends StringConstructor
    ? string
    : T extends number
    ? number
    : T extends NumberConstructor
    ? number
    : T extends boolean
    ? boolean
    : T extends BooleanConstructor
    ? boolean
    : T extends Symbol
    ? Symbol
    : T extends SymbolConstructor
    ? Symbol
    : (() => T)
> {
  isRequired: PropOptions<T>
  value(value: U): PropValidator<T>
  validate: (value: ValidatorFn<T>) => PropValidator<T>
}

export type PropValidator<T> = PropTypesChain<T> & PropOptions<T>

type Constructor<T> = { new (...args: any[]): T } | { (): T }
