import PropTypes from '../src'
import { runValidation } from '../src/helpers'

test('runValidation', () => {
  expect(runValidation(PropTypes.number.isRequired, 1)).toEqual(true)

  expect(runValidation(PropTypes.number.isRequired, null)).toEqual(false)
  expect(runValidation(PropTypes.number, null)).toEqual(true)

  expect(runValidation(PropTypes.number.isRequired, undefined)).toEqual(false)
  expect(runValidation(PropTypes.number, undefined)).toEqual(true)
})

test('optional types', () => {
  expect([String]).toEqual(PropTypes.string._type)
  expect([Number]).toEqual(PropTypes.number._type)
  expect([Boolean]).toEqual(PropTypes.bool._type)
  expect([Object]).toEqual(PropTypes.object._type)
  expect([Array]).toEqual(PropTypes.array._type)
  expect([Symbol]).toEqual(PropTypes.symbol._type)
})

test('required types', () => {
  expect([String]).toEqual(PropTypes.string.isRequired._type)
  expect(PropTypes.string.isRequired.required).toEqual(true)

  expect([Number]).toEqual(PropTypes.number.isRequired._type)
  expect(PropTypes.number.isRequired.required).toEqual(true)

  expect([Boolean]).toEqual(PropTypes.bool.isRequired._type)
  expect(PropTypes.bool.isRequired.required).toEqual(true)

  expect([Object]).toEqual(PropTypes.object.isRequired._type)
  expect(PropTypes.object.isRequired.required).toEqual(true)

  expect([Array]).toEqual(PropTypes.array.isRequired._type)
  expect(PropTypes.array.isRequired.required).toEqual(true)

  expect([Symbol]).toEqual(PropTypes.symbol.isRequired._type)
  expect(PropTypes.symbol.isRequired.required).toEqual(true)
})

test('instanceOf', () => {
  class Foo {}

  expect([Foo]).toEqual(PropTypes.instanceOf(Foo)._type)

  expect([Foo]).toEqual(PropTypes.instanceOf(Foo).isRequired._type)
})

test('oneOf', () => {
  expect([Number, String]).toEqual(PropTypes.oneOf(1, 'foo', 2, 'bar')._type)

  const prop = PropTypes.oneOf(1, 'foo')

  expect(prop.validator(1)).toEqual(true)
  expect(prop.validator('1')).toEqual(false)
  expect(prop.validator(2)).toEqual(false)

  expect(prop.validator('foo')).toEqual(true)
  expect(prop.validator('bar')).toEqual(false)
})

test('oneOfType', () => {
  expect([Number, String]).toEqual(
    PropTypes.oneOfType(PropTypes.number, String)._type
  )
  expect([Number, String]).toEqual(
    PropTypes.oneOfType(PropTypes.number, String, () => false)._type
  )
  expect([Number, String]).toEqual(
    PropTypes.oneOfType([PropTypes.number, String])._type
  )

  expect(
    PropTypes.oneOfType(PropTypes.number, String).isRequired.required
  ).toEqual(true)

  const prop = PropTypes.oneOfType(v => v === 1, v => v === '1').isRequired

  expect(prop.validator(1)).toEqual(true)
  expect(prop.validator('1')).toEqual(true)
  expect(prop.validator(true)).toEqual(false)
})

test('arrayOf', () => {
  expect([Array]).toEqual(PropTypes.arrayOf(PropTypes.number)._type)
  expect([Array]).toEqual(PropTypes.arrayOf(PropTypes.number).isRequired._type)

  const prop = PropTypes.arrayOf(PropTypes.number)

  expect(prop.validator([1, 2, 3])).toEqual(true)
  expect(prop.validator([1, 'foo'])).toEqual(false)
})

test('objectOf', () => {
  expect([Object]).toEqual(PropTypes.objectOf(PropTypes.object)._type)
  expect([Object]).toEqual(
    PropTypes.objectOf(PropTypes.object).isRequired._type
  )

  const prop = PropTypes.objectOf(PropTypes.number)

  expect(prop.validator({ foo: 1 })).toEqual(true)
  expect(prop.validator({ foo: 'foo' })).toEqual(false)
})

test('shape', () => {
  expect([Object]).toEqual(PropTypes.shape({})._type)
  expect([Object]).toEqual(PropTypes.shape({}).isRequired._type)

  const prop = PropTypes.shape({ foo: PropTypes.string.isRequired })

  expect(prop.validator({ foo: 'bar' })).toEqual(true)
  expect(prop.validator({ foo: 1 })).toEqual(false)
  expect(prop.validator({})).toEqual(false)
})

test('nested shape', () => {
  const prop = PropTypes.shape({
    foo: PropTypes.string.isRequired,
    bar: PropTypes.shape({
      bax: PropTypes.number.isRequired,
    }),
  })

  expect(prop.validator({ foo: 'bar', bar: { bax: 1 } })).toEqual(true)
  expect(prop.validator({ foo: 'bar' })).toEqual(true)
  expect(prop.validator({ foo: 'bar', bar: { bax: 'bax' } })).toEqual(false)
  expect(prop.validator({ bar: { bax: 1 } })).toEqual(false)
  expect(prop.validator({ foo: 'bar', bar: {} })).toEqual(false)
})
