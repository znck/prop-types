import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/prop-types.common.js',
    format: 'cjs',
    exports: 'named'
  },
  external: ['lodash'],
  plugins: [
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
