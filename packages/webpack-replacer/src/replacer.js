const utils = require('loader-utils')

module.exports = function(source) {
    this.cacheable();

    var query = utils.getOptions(this.query);
    if (typeof(query.replace) === 'object') {
        for (let i = 0; i < query.replace.length; i++) {
            var option = query.replace[i]

            source = source.split(option.from).join(option.to)
        }
    } else source = source.split(query.search).join(query.replace)

    return source
}