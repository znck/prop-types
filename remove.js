export default function(babel) {
  const { types: t } = babel
  let name = 'PropTypes'
  let hasPropTypes = false

  if (process.env.NODE_ENV !== 'production') {
    return {
      name: '@znck/babel-plugin-transform-remove-prop-types',
      visitor: {}
    }
  }

  return {
    name: '@znck/babel-plugin-transform-remove-prop-types',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === '@znck/prop-types') {
          hasPropTypes = true
          name = path.node.specifiers.find(
            s => s.type === 'ImportDefaultSpecifier'
          ).local.name

          path.remove()
        }
      },
      Identifier(path) {
        if (!hasPropTypes) return
        if (!path.isIdentifier({ name })) return

        const prop = path.findParent(path => path.isObjectProperty())
        if (prop) {
          const info = {}

          prop.get('value').traverse({
            Identifier(path) {
              if (path.isIdentifier({ name: 'boolean' })) {
                info.isBoolean = true
              } else if (path.isIdentifier({ name: 'value' })) {
                const call = path.findParent(path => path.isCallExpression())

                info.default = call.get('arguments.0')
              }
            },
            FunctionExpression() {
              path.skip()
            },
            ArrayExpression(path) {
              path.skip()
            },
            ObjectExpression(path) {
              path.skip()
            },
          })

          if (info.isBoolean) {
            if (info.default) {
              if (info.default.isBooleanLiteral({ value: false })) {
                prop.node.value = t.identifier('Boolean')
              } else {
                prop.node.value = t.objectExpression([
                  t.objectProperty(
                    t.identifier('type'),
                    t.identifier('Boolean')
                  ),
                  t.objectProperty(
                    t.identifier('default'),
                    t.booleanLiteral(true)
                  ),
                ])
              }
            } else {
              prop.node.value = t.identifier('Boolean')
            }
          } else if (info.default) {
            prop.node.value = t.objectExpression([
              t.objectProperty(t.identifier('default'), info.default.node),
            ])
          } else {
            prop.node.value = t.objectExpression([])
          }

          if (
            prop.container.every(
              prop =>
                t.isObjectProperty(prop) &&
                t.isObjectExpression(prop.value) &&
                (!prop.value.properties || !prop.value.properties.length)
            )
          ) {
            const props = prop.findParent(path => path.isObjectExpression())

            if (props) {
              const parent = props.findParent(() => true)

              const newProps = props.get('properties').map(prop => {
                if (prop.node.computed) return prop.get('key').node
                else return t.stringLiteral(prop.get('key').node.name)
              })

              parent.node.value = t.arrayExpression(newProps)
            }
          }
        } else {
          const statement = path.findParent(path =>
            path.isExpressionStatement()
          )

          if (statement) statement.remove()
        }
      },
    },
  }
}
