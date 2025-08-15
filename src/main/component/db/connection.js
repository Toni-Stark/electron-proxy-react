const { Sequelize } = require('sequelize')
const os = require('os')
const path = require('path')
const db_path = path.join(os.homedir(), '.drug.db')
// 这里处理一下项目初始路径就可以了. 换一个地方存储drug.db就可以了.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: db_path // 直接使用处理好的路径
})

// 暴露一下. 这里会有几个地方要注意的点. 因为这里要去导入对应的模型. 所以会有一个动态导入的方式.
module.exports = {
  sequelize
}