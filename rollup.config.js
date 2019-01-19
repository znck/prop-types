import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const banner = `
/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}> (${
  pkg.author.url
})
 * @license ${pkg.license}
 */`.trim()

export default [
  {
    input: 'src/index.js',
    output: [
      {
        banner,
        file: pkg.main,
        format: 'cjs',
      },
      {
        banner,
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [babel()],
  },
  {
    input: 'src/remove.js',
    output: {
      banner,
      file: 'remove.js',
      format: 'cjs',
    },
    plugins: [babel()],
  },
]
