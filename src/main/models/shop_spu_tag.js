const { DataTypes } = require('sequelize')
const { sequelize } = require('../component/db/connection')

// 完成基础定义. 后面来看一下.
const ShopSpuTag = sequelize.define('ShopSpuTag', {
  id: {
    type: DataTypes.INTEGER,       // SQLite 自增列需使用 INTEGER 类型
    primaryKey: true,              // 设为主键
    autoIncrement: true,           // 启用自增
    comment: '自增id'
  },
  platform: {
    type: DataTypes.STRING,
    comment: '所属平台',
    allowNull: false
  },
  third_id: {
    type: DataTypes.STRING,
    comment: '店铺三方id',
    allowNull: false,
    defaultValue: ''
  },
  brand_id: {
    type: DataTypes.STRING,
    comment: '品牌id',
    allowNull: false,
    defaultValue: ''
  },
  spu_id: {
    type: DataTypes.STRING,
    comment: 'SpuId',
    allowNull: false,
    defaultValue: ''
  },
  tag: {
    type: DataTypes.STRING,
    comment: 'Tag',
    allowNull: false,
    defaultValue: '',
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tag',
    defaultValue: '',
  },
}, {
  // 表名.
  tableName: 'shop_spu_tag',
  // 开启自定义时间.
  timestamps: true
})

// 引入自动同步表. 且不删除表.
sequelize.sync({force:false}).then(() => {
  console.log('shop_spu_tag')
})

export default ShopSpuTag