'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://58.210.98.62:9002/smartComunityServer/"', // 后台API路径
  mapUrl: '"http://58.210.98.62:8499/XJYV2"',
  mapUrlArcgis: '"http://58.210.98.62:8399/arcgis/rest/services/XJY/MapServer"',
  fileBaseUrl: '"http://58.210.98.62:9002/imgs/"',
})
