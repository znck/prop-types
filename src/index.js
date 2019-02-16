import {
  runValidation,
  ensureArray,
  ensureOne,
  TYPES,
  typeValues,
  flat,
} from './helpers'

/** @type {import('../types/index')} */
export default class PropTypes {
  /** @private */
  constructor(type) {
    this.type = type
  }

  get type() {
    return this._type
  }
  set type(value) {
    this._type = ensureArray(value)
  }

  get isRequired() {
    this.required = true

    return this
  }

  value(value) {
    console.warn(`'PropType.[type].value' is deprecated. Use 'PropType.[type].defaultValue' instead.`)

    return this.defaultValue(value)
  }

  defaultValue(value) {
    this.default = value

    return this
  }

  description(description) {
    this.description = description

    return this
  }

  validate(cb) {
    console.warn(`'PropType.[type].validate' is deprecated. Use 'PropType.[type].customValidator' instead.`)

    return this.customValidator(cb)
  }

  customValidator(cb) {
    if (!(typeof cb === 'function')) return this

    const validator = this.validator

    this.validator = (...args) => {
      try {
        return (
          (!(typeof validator === 'function') || validator.call(this, args)) &&
          cb.apply(this, args)
        )
      } catch (err) {
        return false
      }
    }

    return this
  }

  /** @private */
  static create(type) {
    return new PropTypes(type)
  }

  /** @private */
  static clone(prop) {
    const type = this.create(prop.type)

    type.validate(prop.validator)

    return type
  }

  static get string() {
    const prop = this.create(String)
    
    prop.__meta__ = {
      custom: 'any',
    }

    return prop
  }

  static get number() {
    const prop = this.create(Number)

    prop.__meta__ = {
      custom: 'number',
    }

    return prop
  }

  static get bool() {
    const prop = this.create(Boolean)

    prop.__meta__ = {
      custom: 'bool',
    }

    return prop
  }

  static get array() {
    const prop = this.create(Array)

    prop.__meta__ = {
      custom: 'array',
    }

    return prop
  }

  static get object() {
    const prop = this.create(Object)

    prop.__meta__ = {
      custom: 'object',
    }

    return prop
  }

  static get func() {
    const prop = this.create(Function)

    prop.__meta__ = {
      custom: 'func',
    }

    return prop
  }

  static get symbol() {
    const prop = this.create(Symbol)

    prop.__meta__ = {
      custom: 'any',
    }

    return prop
  }

  static get any() {
    const prop = this.create()

    prop.__meta__ = {
      custom: 'any',
    }

    return prop
  }

  static instanceOf(type) {
    const prop = this.create(type)

    prop.__meta__ = {
      custom: 'instanceOf',
      type
    }

    return prop
  }

  static oneOf(...values) {
    values = flat(values)

    ensureOne(values)

    const types = Array.from(
      new Set(values.map(value => TYPES[typeof value] || Object))
    )
    const prop = this.create(types)
    const setOfValues = new Set(values)

    prop.__meta__ = {
      custom: 'oneOf',
      values
    }

    prop.validator = value => {
      return setOfValues.has(value)
    }

    return prop
  }

  static oneOfType(...types) {
    types = flat(types).map(normalizeType)

    ensureOne(types)

    const prop = this.create(flat(types.map(type => ensureArray(type.type))))

    prop.__meta__ = {
      custom: 'oneOfType',
      types,
    }

    prop.validator = value =>
      types.some(validator => runValidation(validator, value))

    return prop
  }

  static arrayOf() {
    return this.collectionOf(Array, Array.from(arguments))
  }

  static objectOf() {
    return this.collectionOf(Object, Array.from(arguments))
  }

  /** @private */
  static collectionOf(type, expected) {
    const prop = this.create(type)
    const types = flat(expected).map(normalizeType)

    prop.__meta__ = {
      custom: 'collection',
      type,
      item: types,
    }

    prop.validator = value =>
      (type === Array ? value : Object.values(value)).every(item =>
        types.some(type => runValidation(type, item))
      )

    return prop
  }

  static shape(shape) {
    const prop = this.create(Object)
    const shapeType = {}

    Object.entries(shape).forEach(({ 0: key, 1: value }) => {
      shapeType[key] = normalizeType(value)
    })

    prop.validator = value => {
      if (!(value && typeof value === 'object')) return prop.required !== true

      return Object.entries(shapeType).every(({ 0: key, 1: type }) =>
        runValidation(type, value[key])
      )
    }

    return prop
  }

  static validate(fn) {
    console.warn(`'PropType.validate' is deprecated. Use 'PropType.run' instead.`)

    return this.run(null, fn)
  }

  static run(context, fn) {
    if (arguments.length === 1) {
      fn = context
      context = null
    }

    const logger = createLogger(context)
    
    try {
      return fn(logger)
    } catch (e) {
      logger.error(e.message)
    }
  }
}

import * as logger from './logger'
function createLogger(context) {
  return {
    error: message => logger.error(message, context),
    tip: message => logger.tip(message, context),
    warn: message => logger.warn(message, context),
  }
}

function normalizeType(type) {
  if (type instanceof PropTypes) return type

  if (type in TYPES) return PropTypes.create(TYPES[type])

  if (typeValues().includes(type)) return PropTypes.create(type)

  if (typeof type === 'function') return { validator: type, type: [] }

  return type
}
