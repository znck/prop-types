import test from 'ava'
import createPropTypesShim from './create-shim'

const PropTypes = createPropTypesShim()

test('optional types', t => {
  t.falsy(PropTypes.string.required)
  t.falsy(PropTypes.number.required)
  t.falsy(PropTypes.bool.required)
  t.falsy(PropTypes.object.required)
  t.falsy(PropTypes.array.required)
  t.falsy(PropTypes.symbol.required)
})

test('required types', t => {
  t.true(PropTypes.string.isRequired.required)
  t.true(PropTypes.number.isRequired.required)
  t.true(PropTypes.bool.isRequired.required)
  t.true(PropTypes.object.isRequired.required)
  t.true(PropTypes.array.isRequired.required)
  t.true(PropTypes.symbol.isRequired.required)
  t.true(PropTypes.any.isRequired.required)
})

test('instanceOf', t => {
  class Foo {}

  t.true(PropTypes.instanceOf(Foo).isRequired.required)
})

test('oneOf', t => {
  t.falsy(PropTypes.oneOf(1, 'foo', 2, 'bar').required)
  t.true(PropTypes.oneOf(1, 'foo', 2, 'bar').isRequired.required)
})

test('oneOfType', t => {
  t.true(PropTypes.oneOfType(PropTypes.number, String).isRequired.required)
  t.falsy(PropTypes.oneOfType([PropTypes.number, String]).required)
})

test('arrayOf', t => {
  t.falsy(PropTypes.arrayOf(PropTypes.number).required)
  t.true(PropTypes.arrayOf(PropTypes.number).isRequired.required)
})

test('objectOf', t => {
  t.falsy(PropTypes.objectOf(PropTypes.number).required)
  t.true(PropTypes.objectOf(PropTypes.number).isRequired.required)
})

test('shape', t => {
  t.falsy(PropTypes.shape({}).required)
  t.true(PropTypes.shape({}).isRequired.required)
})
