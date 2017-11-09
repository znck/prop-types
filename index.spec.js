import test from 'ava'
import PropTypes, { runValidation } from './'

test('runValidation', t => {
  t.true(runValidation(PropTypes.number.isRequired, 1))
  
  t.false(runValidation(PropTypes.number.isRequired, null))
  t.true(runValidation(PropTypes.number, null))
  
  t.false(runValidation(PropTypes.number.isRequired, undefined))
  t.true(runValidation(PropTypes.number, undefined))
})

test('optional types', t => {
  t.deepEqual([String], PropTypes.string.type)
  t.deepEqual([Number], PropTypes.number.type)
  t.deepEqual([Boolean], PropTypes.bool.type)
  t.deepEqual([Object], PropTypes.object.type)
  t.deepEqual([Array], PropTypes.array.type)
  t.deepEqual([Symbol], PropTypes.symbol.type)
})

test('required types', t => {
  t.deepEqual([String], PropTypes.string.required().type)
  t.true(PropTypes.string.required().required)
  
  t.deepEqual([Number], PropTypes.number.required().type)
  t.true(PropTypes.number.required().required)
  
  t.deepEqual([Boolean], PropTypes.bool.required().type)
  t.true(PropTypes.bool.required().required)
  
  t.deepEqual([Object], PropTypes.object.required().type)
  t.true(PropTypes.object.required().required)
  
  t.deepEqual([Array], PropTypes.array.required().type)
  t.true(PropTypes.array.required().required)
  
  t.deepEqual([Symbol], PropTypes.symbol.required().type)
  t.true(PropTypes.symbol.required().required)

  t.deepEqual([String], PropTypes.string.isRequired.type)
  t.true(PropTypes.string.isRequired.required)

  t.deepEqual([Number], PropTypes.number.isRequired.type)
  t.true(PropTypes.number.isRequired.required)

  t.deepEqual([Boolean], PropTypes.bool.isRequired.type)
  t.true(PropTypes.bool.isRequired.required)

  t.deepEqual([Object], PropTypes.object.isRequired.type)
  t.true(PropTypes.object.isRequired.required)

  t.deepEqual([Array], PropTypes.array.isRequired.type)
  t.true(PropTypes.array.isRequired.required)

  t.deepEqual([Symbol], PropTypes.symbol.isRequired.type)
  t.true(PropTypes.symbol.isRequired.required)

})

test('instanceOf', t => {
  class Foo {}

  t.deepEqual([Foo], PropTypes.instanceOf(Foo).type)
  
  t.deepEqual([Foo], PropTypes.instanceOf(Foo).isRequired.type)
})

test('oneOf', t => {
  t.deepEqual([Number, String], PropTypes.oneOf(1, 'foo', 2, 'bar').type)

  const prop = PropTypes.oneOf(1, 'foo')

  t.true(prop.validator(1))
  t.false(prop.validator('1'))
  t.false(prop.validator(2))

  t.true(prop.validator('foo'))
  t.false(prop.validator('bar'))
})

test('oneOfType', t => {
  t.deepEqual([Number, String], PropTypes.oneOfType(PropTypes.number, String).type)
  t.deepEqual([Number, String], PropTypes.oneOfType([PropTypes.number, String]).type)
  
  t.true(PropTypes.oneOfType(PropTypes.number, String).isRequired.required)
  t.true(PropTypes.oneOfType([PropTypes.number, String]).required().required)

  const prop = PropTypes.oneOfType(v => v === 1, v => v === '1').isRequired

  t.true(prop.validator(1))
  t.true(prop.validator('1'))
  t.false(prop.validator(true))
})

test('arrayOf', t => {
  t.deepEqual([Array], PropTypes.arrayOf(PropTypes.number).type)
  t.deepEqual([Array], PropTypes.arrayOf(PropTypes.number).isRequired.type)

  const prop = PropTypes.arrayOf(PropTypes.number)

  t.true(prop.validator([1, 2, 3]))
  t.false(prop.validator([1, 'foo']))
})

test('objectOf', t => {
  t.deepEqual([Object], PropTypes.objectOf(PropTypes.object).type)
  t.deepEqual([Object], PropTypes.objectOf(PropTypes.object).isRequired.type)

  const prop = PropTypes.objectOf(PropTypes.number)

  t.true(prop.validator({ foo: 1 }))
  t.false(prop.validator({ foo: 'foo' }))
})

test('shape', t => {
  t.deepEqual([Object], PropTypes.shape({}).type)
  t.deepEqual([Object], PropTypes.shape({}).isRequired.type)

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
