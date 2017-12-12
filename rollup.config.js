import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/prop-types.common.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/prop-types.js',
      format: 'es'
    }
  ],
  external: ['lodash-es'],
  plugins: [
    json(),
    babel({
      babelrc: false,
      presets: [
        ['env', { targets: { node: 8 }, modules: false }]
      ],
      plugins: [
        'transform-object-rest-spread',
        'transform-es2015-parameters'
      ]
    })
  ]
}
