const isDot = /\./

function toArray(any) {
  return Array.isArray(any) ? any : (
    any === undefined ? [] : [any]
  )
}

export default function normalizer(
  meta,
  transform = (name, value) => value,
  resolve = (name, suffix, value) => value
) {
  const keys = Object.keys(meta)
  const base = keys.filter(key => !isDot.test(key))
  const modifiers = {}

  keys.forEach(key => {
    if (!isDot.test(key)) return
    const [name, modifier] = key.split('$')

    modifiers[name] = modifiers[name] || []
    modifiers[name].push(modifier)
  })

  return props => {
    const normalized = {}

    base.forEach(
      name => {
        normalized[name] = props[name] === undefined ? undefined : transform(name, props[name])
        modifiers[name] && modifiers[name].forEach(
          suffix => {
            const key = `${name}$${suffix}`
            if (props[key] !== undefined) {
              normalized[name] = [
                ...toArray(normalized[name]),
                ...toArray(resolve(name, suffix, props[key]))
              ]
            }
          }
        )
      }
    )

    return normalized
  }
}
