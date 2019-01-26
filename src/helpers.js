export const TYPES = {
  string: String,
  number: Number,
  object: Object,
  boolean: Boolean,
  function: Function,
  symbol: Symbol,
  array: Array,
}

export const typeNames = () => Object.keys(TYPES)
export const typeValues = () => Object.values(TYPES)
export function flat(arr) {
  if (typeof arr.flat === 'function') return arr.flat()

  return Array.prototype.concat.apply([], arr)
}

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
    ({ 0: key, 1: TYPE }) => TYPE === type && typeof item === key // eslint-disable-line valid-typeof
  )
}

export function ensureOne(items) {
  if (items.length === 0)
    throw new Error('Atleast one type or value is required')
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : value === undefined ? [] : [value]
}
