import PropTypes from './index'

class Foo {
  isValid: boolean
}


const props = {
  string: PropTypes.string.value('foo').validate(value => 'foo' == value).isRequired,
  number: PropTypes.number.value(1).validate(value => 1 == value).isRequired,
  boolean: PropTypes.bool.value(true).validate(value => value).isRequired,
  array: PropTypes.array.value(() => []).validate(value => 1 === value.length).isRequired,
  object: PropTypes.object.value(() => ({})).validate(value => 'foo' in value).isRequired,
  func: PropTypes.func.value(() => (a: string) => null).validate(value => value()).isRequired,
  any: PropTypes.any.value(() => 1).validate(value => value).isRequired,

  arrayOfStrings: PropTypes.arrayOf(String).value(() => ['1']),
  arrayOfNumbers: PropTypes.arrayOf(PropTypes.number).value(() => [1]),
  arrayOfBooleans: PropTypes.arrayOf((value: boolean) => value).value(() => [true]),

  stringOrNumber1: PropTypes.oneOfType(String, Number).value('foo'),
  stringOrNumber2: PropTypes.oneOfType(String, PropTypes.number).value(1),
  
  date: PropTypes.instanceOf(Date).value(() => new Date()).validate(value => value.getTime() > 0).isRequired,
  foo: PropTypes.instanceOf(Foo).value(() => new Foo()).validate(value => value.isValid).isRequired,
  String: PropTypes.instanceOf(String).value(String('str')).validate(value => value.charAt(0) > 'a').isRequired,

  shape: PropTypes.shape({
    foo: PropTypes.bool,
    bar: String,
    baz: PropTypes.instanceOf(Date)
  }).defaultValue(() => ({ foo: true, bar: '' })).customValidator(value => value.foo),

  objectOfNumber: PropTypes.objectOf(PropTypes.number).value(() => ({ foo: 1, bar: 2 })).validate(value => value.foo > 0).isRequired,
  objectOfString: PropTypes.objectOf(Number),
  objectOfValidatorInferredType: PropTypes.objectOf((value: { foo: boolean}) => value.foo).value(() => ({ one: { foo: true } })),
}


const bar = PropTypes.run(({ tip, error, warn }) => {
  return {
    foo: true
  }
})

const z: boolean = bar.foo
