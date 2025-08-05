const { DataTypes } = require('sequelize')
const { sequelize } = require('../component/db/connection')

// 完成基础定义. 后面来看一下.
const Shop = sequelize.define('Shop', {
  id: {
    type: DataTypes.INTEGER,       // SQLite 自增列需使用 INTEGER 类型
    primaryKey: true,              // 设为主键
    autoIncrement: true,           // 启用自增
    comment: '店铺自增id'
  },
  platform: {
    type: DataTypes.STRING,
    comment: '所属平台',
    allowNull: false
  },
  brand_id: {
    type: DataTypes.STRING,
    comment: '品牌id',
    allowNull: false,
    defaultValue: ''
  },
  third_id: {
    type: DataTypes.STRING,
    comment: '店铺三方id',
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: DataTypes.STRING,
    comment: '店铺名称',
    allowNull: false,
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '店铺地址'
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '距离',
    defaultValue: '',
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '口号',
    defaultValue: '',
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '状态, 0异常. 1正常',
    defaultValue: 1
  },
}, {
  // 表名.
  tableName: 'shop',
  // 开启自定义时间.
  timestamps: true
})

// 引入自动同步表. 且不删除表.
sequelize.sync({force:false}).then(() => {
  console.log('shop')
})

export default Shop