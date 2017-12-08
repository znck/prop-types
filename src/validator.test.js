import test from 'ava'
import PropTypes, { runValidation } from './validator'

test('runValidation', t => {
  t.true(runValidation(PropTypes.number.isRequired, 1))

  t.false(runValidation(PropTypes.number.isRequired, null))
  t.true(runValidation(PropTypes.number, null))

  t.false(runValidation(PropTypes.number.isRequired, undefined))
  t.true(runValidation(PropTypes.number, undefined))
})

test('optional types', t => {
  t.deepEqual([String], PropTypes.string._type)
  t.deepEqual([Number], PropTypes.number._type)
  t.deepEqual([Boolean], PropTypes.bool._type)
  t.deepEqual([Object], PropTypes.object._type)
  t.deepEqual([Array], PropTypes.array._type)
  t.deepEqual([Symbol], PropTypes.symbol._type)
})

test('required types', t => {
  t.deepEqual([String], PropTypes.string.isRequired._type)
  t.true(PropTypes.string.isRequired.required)

  t.deepEqual([Number], PropTypes.number.isRequired._type)
  t.true(PropTypes.number.isRequired.required)

  t.deepEqual([Boolean], PropTypes.bool.isRequired._type)
  t.true(PropTypes.bool.isRequired.required)

  t.deepEqual([Object], PropTypes.object.isRequired._type)
  t.true(PropTypes.object.isRequired.required)

  t.deepEqual([Array], PropTypes.array.isRequired._type)
  t.true(PropTypes.array.isRequired.required)

  t.deepEqual([Symbol], PropTypes.symbol.isRequired._type)
  t.true(PropTypes.symbol.isRequired.required)
})

test('instanceOf', t => {
  class Foo {}

  t.deepEqual([Foo], PropTypes.instanceOf(Foo)._type)

  t.deepEqual([Foo], PropTypes.instanceOf(Foo).isRequired._type)
})

test('oneOf', t => {
  t.deepEqual([Number, String], PropTypes.oneOf(1, 'foo', 2, 'bar')._type)

  const prop = PropTypes.oneOf(1, 'foo')

  t.true(prop.validator(1))
  t.false(prop.validator('1'))
  t.false(prop.validator(2))

  t.true(prop.validator('foo'))
  t.false(prop.validator('bar'))
})

test('oneOfType', t => {
  t.deepEqual([Number, String], PropTypes.oneOfType(PropTypes.number, String)._type)
  t.deepEqual([Number, String], PropTypes.oneOfType(PropTypes.number, String, () => false)._type)
  t.deepEqual([Number, String], PropTypes.oneOfType([PropTypes.number, String])._type)

  t.true(PropTypes.oneOfType(PropTypes.number, String).isRequired.required)

  const prop = PropTypes.oneOfType(v => v === 1, v => v === '1').isRequired

  t.true(prop.validator(1))
  t.true(prop.validator('1'))
  t.false(prop.validator(true))
})

test('arrayOf', t => {
  t.deepEqual([Array], PropTypes.arrayOf(PropTypes.number)._type)
  t.deepEqual([Array], PropTypes.arrayOf(PropTypes.number).isRequired._type)

  const prop = PropTypes.arrayOf(PropTypes.number)

  t.true(prop.validator([1, 2, 3]))
  t.false(prop.validator([1, 'foo']))
})

test('objectOf', t => {
  t.deepEqual([Object], PropTypes.objectOf(PropTypes.object)._type)
  t.deepEqual([Object], PropTypes.objectOf(PropTypes.object).isRequired._type)

  const prop = PropTypes.objectOf(PropTypes.number)

  t.true(prop.validator({ foo: 1 }))
  t.false(prop.validator({ foo: 'foo' }))
})

test('shape', t => {
  t.deepEqual([Object], PropTypes.shape({})._type)
  t.deepEqual([Object], PropTypes.shape({}).isRequired._type)

  const prop = PropTypes.shape({ foo: PropTypes.string.isRequired })

  t.true(prop.validator({ foo: 'bar' }))
  t.false(prop.validator({ foo: 1 }))
  t.false(prop.validator({ }))
})

test('nested shape', t => {
  const prop = PropTypes.shape({
    foo: PropTypes.string.isRequired,
    bar: PropTypes.shape({
      bax: PropTypes.number.isRequired
    })
  })

  t.true(prop.validator({ foo: 'bar', bar: { bax: 1 } }))
  t.true(prop.validator({ foo: 'bar' }))
  t.false(prop.validator({ foo: 'bar', bar: { bax: 'bax' } }))
  t.false(prop.validator({ bar: { bax: 1 } }))
  t.false(prop.validator({ foo: 'bar', bar: { } }))
})

test('modifiers', t => {
  const prop = PropTypes.string.modifiers(/* name = */'size', 'mobile', 'desktop')

  t.true('size' in prop)
  t.true('size$mobile' in prop)
  t.true('size$desktop' in prop)
  t.deepEqual([String], prop.size._type)
  t.deepEqual([String], prop.size$mobile._type)
  t.deepEqual([String], prop.size$desktop._type)
})
