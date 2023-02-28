const common = require('./webpack.common.js')

jsConfig = common[0], cssConfig = common[1]

jsConfig.mode  = 'production'
cssConfig.mode = 'production'

module.exports = [jsConfig, cssConfig]
