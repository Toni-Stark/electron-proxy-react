const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('sqlite:./drug.db') // 数据库文件路径

// 暴露一下. 这里会有几个地方要注意的点. 因为这里要去导入对应的模型. 所以会有一个动态导入的方式.
module.exports = {
  sequelize
}