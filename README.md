# PropTypes for Vue

Fluent prop validation for Vue that won't land in you production code.

> It uses `process.env.NODE_ENV` to detect production build.

## Installation

```shell
npm install --save @znck/prop-types
```

## Importing

```js
import PropTypes from '@znck/prop-types'; // ES6
var PropTypes = require('@znck/prop-types'); // ES5 with npm
```

## Usage

Here is an example of using PropTypes with a Vue component, which also
documents the different validators provided:

<!-- Example borrowed from facebook/prop-types -->

```vue
<script>
import PropTypes from 'prop-types';

export default {
  props: {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
    optionalArray: PropTypes.array,
    optionalBool: PropTypes.bool,
    optionalFunc: PropTypes.func,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
    optionalString: PropTypes.string,
    optionalSymbol: PropTypes.symbol,

    // You can also declare that a prop is an instance of a class. This uses
    // JS's instanceof operator.
    optionalMessage: PropTypes.instanceOf(Message),

    // You can ensure that your prop is limited to specific values by treating
    // it as an enum.
    optionalEnum: PropTypes.oneOf(['News', 'Photos']),

    // An object that could be one of many types
    optionalUnion: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Message)
    ]),

    // An array of a certain type
    optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

    // An object with property values of a certain type
    optionalObjectOf: PropTypes.objectOf(PropTypes.number),

    // An object taking on a particular shape
    optionalObjectWithShape: PropTypes.shape({
      color: PropTypes.string,
      fontSize: PropTypes.number
    }),

    // You can chain any of the above with `isRequired` to make sure a warning
    // is shown if the prop isn't provided.
    requiredFunc: PropTypes.func.isRequired,

    // A value of any data type
    requiredAny: PropTypes.any.isRequired,

    // You can also supply a custom validator.
    customArrayProp: PropTypes.string.validate(value => value === 'foo')
  }
}
</script>
```

## Built With

* [Babel](http://babeljs.io/) - Transpiling
* [Ava](https://github.com/avajs/ava) - Testing

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Rahul Kadayn** - *Initial work* - [znck](https://github.com/znck)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
