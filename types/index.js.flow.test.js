// @flow
import PropTypes, { normalize } from './index.js.flow'

class Foo {}

PropTypes.any
PropTypes.array
PropTypes.arrayOf(PropTypes.any)
PropTypes.arrayOf(String)
PropTypes.arrayOf(Foo)
PropTypes.arrayOf(Int16Array)
PropTypes.bool
PropTypes.func
PropTypes.instanceOf(Array)
PropTypes.instanceOf(Foo)
PropTypes.number
PropTypes.object
PropTypes.objectOf(PropTypes.any)
PropTypes.objectOf(String)
PropTypes.objectOf(Foo)
PropTypes.objectOf(Int16Array)
PropTypes.oneOf('foo', 1, false)
PropTypes.oneOfType(PropTypes.any, String, Foo, Int16Array)
PropTypes.shape({ foo: PropType.any, bar: String, baz: Foo, qux: Int16Array })
PropTypes.string
PropTypes.symbol
