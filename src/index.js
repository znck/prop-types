import Validator from './validator'
import createValidatorShim from './validator-shim'
import normalize from './normalize-modifiers'

const PropTypes = (process.env.NODE_ENV === 'production' ? createValidatorShim() : Validator)

export {
  PropTypes,
  normalize
}

export default PropTypes
