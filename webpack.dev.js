const common = require('./webpack.common.js')

jsConfig = common[0], cssConfig = common[1]

jsConfig.mode  = 'development'
cssConfig.mode = 'development'

module.exports = [jsConfig, cssConfig]
