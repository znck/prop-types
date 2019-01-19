export default function(babel) {
  const { types: t } = babel
  let name = 'PropTypes'
  let hasPropTypes = false

  let newProps = t.objectExpression([])
  let oldProps

  return {
    name: '@znck/prop-types/remove',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === '@znck/prop-types') {
          hasPropTypes = true
          name = path.node.specifiers.find(
            s => s.type === 'ImportDefaultSpecifier'
          ).local.name
        }
      },
      Identifier(path) {
        if (!hasPropTypes) return
        if (!path.isIdentifier({ name })) return
        if (path.node._processed) return

        path.node._processed = true

        let prop = path.findParent(path => path.isObjectProperty())

        if (prop) {
          const props = prop.parentPath
          if (props && props.isObjectExpression()) {
            const api = props.parentPath
            if (
              api &&
              api.isObjectProperty() &&
              api.get('key').isIdentifier({ name: 'props' })
            ) {
              // continue
              prop = prop
            } else prop = null
          } else prop = null
        }

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
                newProps.properties.push(
                  t.objectProperty(
                    t.identifier(prop.node.key.name),
                    t.identifier('Boolean')
                  )
                )
              } else {
                newProps.properties.push(
                  t.objectProperty(
                    t.identifier(prop.node.key.name),
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('type'),
                        t.identifier('Boolean')
                      ),
                      t.objectProperty(
                        t.identifier('default'),
                        t.booleanLiteral(true)
                      ),
                    ])
                  )
                )
              }
            } else {
              newProps.properties.push(
                t.objectProperty(
                  t.identifier(prop.node.key.name),
                  t.identifier('Boolean')
                )
              )
            }
          } else if (info.default) {
            newProps.properties.push(
              t.objectProperty(
                t.identifier(prop.node.key.name),
                t.objectExpression([
                  t.objectProperty(t.identifier('default'), info.default.node),
                ])
              )
            )
          } else {
            newProps.properties.push(
              t.objectProperty(
                t.identifier(prop.node.key.name),
                t.objectExpression([])
              )
            )
          }

          if (prop.container.length === newProps.properties.length) {
            oldProps = prop.findParent(path => path.isObjectExpression())

            if (
              newProps.properties.every(
                prop =>
                  t.isObjectProperty(prop) &&
                  t.isObjectExpression(prop.value) &&
                  (!prop.value.properties || !prop.value.properties.length)
              )
            ) {
              const properties = newProps.properties.map(prop => {
                if (prop.computed) return prop
                else return t.stringLiteral(prop.key.name)
              })

              newProps = t.arrayExpression(properties)
            }

            const node = babel.template
              .ast`process.env.NODE_ENV !== 'production' ? ${
              oldProps.node
            } : ${newProps}`

            oldProps.replaceWith(node)
          }
        } else {
          const statement = path.findParent(path =>
            path.isExpressionStatement()
          )

          if (statement) {
            const node = babel.template
              .ast`if (process.env.NODE_ENV !== 'production') { ${
              statement.node
            } }`
            if (statement.parentPath.isProgram()) {
              statement.remove()
            } else statement.replaceWith(node)
          }
        }
      },
    },
  }
}
