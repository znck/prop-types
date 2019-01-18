import PropType from './index'

export const TYPES = {
  string: String,
  number: Number,
  object: Object,
  boolean: Boolean,
  function: Function,
  symbol: Symbol,
  array: Array,
}

export const typeNames = Object.keys(TYPES)
export const typeValues = Object.values(TYPES)

export function runValidation(validator, value, strict = false) {
  const types = ensureArray(validator.type)

  return (
    (types.length === 0 ||
      types.some(type =>
        isType(type, value, strict || validator.required !== true)
      )) &&
    (typeof validator.validator !== 'function' || validator.validator(value))
  )
}

export function isType(type, item, nullAllowed = false) {
  if (nullAllowed && (item === null || item === undefined)) return true

  if (Array === type && Array.isArray(item)) return true

  return Object.entries(TYPES).some(
    ([key, TYPE]) => TYPE === type && typeof item === key // eslint-disable-line valid-typeof
  )
}

export function ensureOne(items) {
  if (items.length === 0)
    throw new Error('Atleast one type or value is required')
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : value === undefined ? [] : [value]
}

export function normalizeType(type) {
  if (type instanceof PropType) return type

  if (type in TYPES) return PropType.create(TYPES[type])

  if (typeValues.includes(type)) return PropType.create(type)

  if (typeof type === 'function') return { validator: type, type: [] }

  return type
}
