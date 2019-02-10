import {
  runValidation,
  ensureArray,
  ensureOne,
  TYPES,
  typeValues,
  flat
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

  description(description) {
    this.description = description

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
    values = flat(values)

    ensureOne(values)

    const types = Array.from(new Set(values.map(value => TYPES[typeof value] || Object)))
    const prop = this.create(types)
    const setOfValues = new Set(values)

    prop.validator = value => {
      return setOfValues.has(value)
    }

    return prop
  }

  static oneOfType(...types) {
    types = flat(types).map(normalizeType)

    ensureOne(types)

    const prop = this.create(flat(types.map(type => ensureArray(type.type))))

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

    prop.validator = value =>
      (type === Array ? value : Object.values(value)).every(item =>
        types.some(type => runValidation(type, item))
      )

    return prop
  }

  static shape(shape) {
    const prop = this.create(Object)
    const shapeType = {}

    Object.entries(shape).forEach(({0: key, 1: value}) => {
      shapeType[key] = normalizeType(value)
    })

    prop.validator = value => {
      if (!(value && typeof value === 'object')) return prop.required !== true

      return Object.entries(shapeType).every(({0: key, 1: type}) =>
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

function normalizeType(type) {
  if (type instanceof PropTypes) return type

  if (type in TYPES) return PropTypes.create(TYPES[type])

  if (typeValues().includes(type)) return PropTypes.create(type)

  if (typeof type === 'function') return { validator: type, type: [] }

  return type
}
