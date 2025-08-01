const { DataTypes } = require('sequelize')
const { sequelize } = require('../component/db/connection')

// 完成基础定义. 后面来看一下.
const QueueList = sequelize.define('QueueList', {
  id: {
    type: DataTypes.INTEGER,       // SQLite 自增列需使用 INTEGER 类型
    primaryKey: true,              // 设为主键
    autoIncrement: true,           // 启用自增
    comment: '任务队列id'
  },
  queue_name: {
    type: DataTypes.STRING,
    comment: '队列名',
    allowNull: false
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '抓取数据'
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -2,
    comment: '状态, -2待执行'
  },
  
}, {
  // 表名.
  tableName: 'queue_list',
  // 开启自定义时间.
  timestamps: true
})

// 引入自动同步表. 且不删除表.
sequelize.sync({force:false}).then(() => {
  console.log('queue_list')
})

export default QueueList