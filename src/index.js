import {
  runValidation,
  ensureArray,
  normalizeType,
  ensureOne,
  TYPES,
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
    this.default = value && typeof value === 'object' ? () => value : value

    return this
  }

  validate(cb) {
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
    return this.create(String)
  }

  static get number() {
    return this.create(Number)
  }

  static get bool() {
    return this.create(Boolean)
  }

  static get array() {
    return this.create(Array)
  }

  static get object() {
    return this.create(Object)
  }

  static get func() {
    return this.create(Function)
  }

  static get symbol() {
    return this.create(Symbol)
  }

  static get any() {
    return this.create()
  }

  static instanceOf(type) {
    return this.create(type)
  }

  static oneOf(...values) {
    values = values.flat()

    ensureOne(values)

    const types = [
      ...new Set(values.map(value => TYPES[typeof value] || Object)),
    ]
    const prop = this.create(types)
    const setOfValues = new Set(values)

    prop.validator = value => {
      return setOfValues.has(value)
    }

    return prop
  }

  static oneOfType(...types) {
    types = types.flat().map(normalizeType)

    ensureOne(types)

    const prop = this.create(types.map(type => ensureArray(type.type)).flat())

    prop.validator = value =>
      types.some(validator => runValidation(validator, value))

    return prop
  }

  static arrayOf(...expected) {
    return this.collectionOf(Array, expected)
  }

  static objectOf(...expected) {
    return this.collectionOf(Object, expected)
  }

  /** @private */
  static collectionOf(type, expected) {
    const prop = this.create(type)
    const types = expected.flat().map(normalizeType)

    prop.validator = value =>
      Object.values(value).every(item =>
        types.some(type => runValidation(type, item))
      )

    return prop
  }

  static shape(shape) {
    const prop = this.create(Object)
    const shapeType = {}

    Object.entries(shape).forEach(([key, value]) => {
      shapeType[key] = normalizeType(value)
    })

    prop.validator = value => {
      if (!(value && typeof value === 'object')) return prop.required !== true

      return Object.entries(shapeType).every(([key, type]) =>
        runValidation(type, value[key])
      )
    }

    return prop
  }

  static validate(fn) {
    try {
      if (fn() === false) {
        console.error('There are some failing validation.')
      }
    } catch (e) {
      console.error(e)
    }
  }
}
