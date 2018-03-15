import { getOptions } from 'loader-utils'

export default function(source) {
    this.cacheable
    const query = getOptions(this)
    if (typeof(query.replace) === 'object') {
        for (let i = 0; i < query.replace.length; i++) {
            const option = query.replace[i]

            source = source.split(option.from).join(option.to)
        }
    } else source = source.split(query.search).join(query.replace)

    return source
}