class PropShim {
  _required() {
    this.required = true

    return this
  }

  get isRequired() {
    return this._required()
  }

  use(value) {
    this.default = value

    return this
  }

  validate() {
    return this
  }
}

const getShim = () => new PropShim()

export default function () {
  const PropTypes = {}
  const methods = ['instanceOf', 'oneOf', 'oneOfType', 'arrayOf', 'objectOf', 'shape']
  const types = ['string', 'number', 'bool', 'array', 'object', 'func', 'symbol', 'any']

  methods.forEach(b => {
    PropTypes[b] = getShim
  })
  types.forEach(b => Object.defineProperty(PropTypes, b, { get: getShim, enumerable: false }))

  return PropTypes
}
