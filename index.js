function normalizeParams(items) {
  return items.length === 1 && Array.isArray(items[0]) ? items[0] : items
}

function ensureOne(items) {
  if (items.length === 0) throw new Error('Atleast one type or value is required')
}

function toMap(keys) {
  if (typeof Set !== 'undefined') {
    const set = new Set()
    keys.forEach(key => set.add(key))

    return set
  }

  const set = keys.reduce((r, i) => {
    r[i] = true

    return r
  }, {})

  set.has = key => key in set

  return set
}

const typeMap = {
  string: String,
  number: Number,
  object: Object,
  boolean: Boolean,
  function: Function,
  symbol: Symbol,
  array: Array
}

function isType(type, item, nullAllowed = false) {
  if (nullAllowed && (item === null || item === undefined)) return true

  if (Array === type && Array.isArray(item)) return true

  return Object.keys(typeMap).some(
    key => (typeMap[key] === type && typeof item === key) // eslint-disable-line valid-typeof
  )
}

function normalizeType(type) {
  if (type in typeMap) return createType(typeMap[type])
  if (Object.values(typeMap).includes(type)) return createType(type)
  if (typeof type === 'function') return { validator: type }

  return type
}

function typeOf(value) {
  return Array.isArray(value) ? typeMap.array : typeMap[typeof value] || Object
}

function toArray(value) {
  return Array.isArray(value) ? value : (
    value === undefined ? [] : [value]
  )
}

export function runValidation(validator, value) {
  const types = toArray(validator.type)

  return (
    types.length === 0 ||
    types.some(type => isType(type, value, validator.required !== true))
  ) && (
    typeof validator.validator !== 'function' ||
    validator.validator(value)
  )
}

class Prop {
  constructor(type) {
    this.type = toArray(type)
  }

  required() {
    this.required = true

    return this
  }

  default(value) {
    this.default = value

    return this
  }

  validate(cb) {
    const original = typeof this.validator === 'function' ? this.validator : (() => true)

    this.validator = (...args) => {
      return original.apply(this, args) && cb.apply(this, args)
    }

    return this
  }
}

function createType(type) {
  const prop = new Prop(type)

  Object.defineProperties(prop, {
    isRequired: {
      enumerable: false,
      get: () => prop.required()
    }
  })

  return prop
}

const PropTypes = {
  instanceOf: type => createType(type),
  oneOf: (...values) => {
    values = normalizeParams(values)

    ensureOne(values)

    const types = values.reduce((types, value) => {
      const type = typeOf(value)

      if (!types.includes(type)) types.push(type)

      return types
    }, [])

    const prop = createType(types)

    if (values.length > 0) {
      const valuesMap = toMap(values)

      prop.validator = value => {
        if (prop.required !== true && (value === null || value === undefined)) return true

        return valuesMap.has(value)
      }
    }

    return prop
  },
  oneOfType: (...types) => {
    types = normalizeParams(types).map(type => normalizeType(type))

    ensureOne(types)

    const prop = createType(types.filter(type => type.type).map(type => type.type[0]))
    const validators = types.filter(type => type.validator)

    if (validators.length > 0) {
      prop.validator = value => validators.some(
        validator => runValidation(validator, value)
      )
    }

    return prop
  },
  arrayOf: expected => {
    const prop = createType(Array)
    const types = toArray(normalizeType(expected))

    prop.validator = value => value.every(
      item => types.some(type => runValidation(type, item))
    )

    return prop
  },
  objectOf: expected => {
    const prop = createType(Object)
    const types = toArray(normalizeType(expected))

    prop.validator = value => Object.values(value).every(
      item => types.some(type => runValidation(type, item))
    )

    return prop
  },
  shape: shape => {
    const prop = createType(Object)

    Object.keys(shape).forEach(
      key => {
        shape[key] = normalizeType(shape[key])
      }
    )

    prop.validator = value => {
      if (!value) return prop.type.some(type => isType(type, value, prop.required !== true))

      return Object.keys(shape).every(
        key => runValidation(
          shape[key],
          (value && typeof value === 'object') ? value[key] : undefined,
          key
        )
      )
    }

    return prop
  },
  get string() {
    return createType(String)
  },
  get number() {
    return createType(Number)
  },
  get bool() {
    return createType(Boolean)
  },
  get array() {
    return createType(Array)
  },
  get object() {
    return createType(Object)
  },
  get func() {
    return createType(Function)
  },
  get symbol() {
    return createType(Symbol)
  },
  get any() {
    return createType()
  }
}

const shim = {
  required: () => shim,
  default: value => ({ ...shim, default: value }),
  validate: () => shim
}

shim.isRequired = shim

const shimmedPropTypes = {
  instanceOf: () => shim,
  oneOf: () => shim,
  oneOfType: () => shim,
  arrayOf: () => shim,
  objectOf: () => shim,
  get string() {
    return shim
  },
  get number() {
    return shim
  },
  get bool() {
    return shim
  },
  get array() {
    return shim
  },
  get object() {
    return shim
  },
  get func() {
    return shim
  },
  get symbol() {
    return shim
  }
}

export default (process.env.NODE_ENV === 'production' ? shimmedPropTypes : PropTypes)
