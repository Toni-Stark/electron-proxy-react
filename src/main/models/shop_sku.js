const { DataTypes } = require('sequelize')
const { sequelize } = require('../component/db/connection')

// 完成基础定义. 后面来看一下.
const ShopSku = sequelize.define('ShopSku', {
  id: {
    type: DataTypes.INTEGER,       // SQLite 自增列需使用 INTEGER 类型
    primaryKey: true,              // 设为主键
    autoIncrement: true,           // 启用自增
    comment: '药品自增id'
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
  spu_id: {
    type: DataTypes.STRING,
    comment: 'SpuId',
    allowNull: false,
    defaultValue: ''
  },
  sku_id: {
    type: DataTypes.STRING,
    comment: 'SkuId',
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: DataTypes.STRING,
    comment: '规格名称',
    allowNull: false,
    defaultValue: '',
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '售价',
    defaultValue: 0
  },
  origin_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '原价',
    defaultValue: 0
  },
  discount_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '折扣价',
    defaultValue: 0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '库存',
    defaultValue: 0,
  },
  real_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '实际库存',
    defaultValue: 0,
  },
  activity_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '活动库存',
    defaultValue: 0,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'sku图片',
    defaultValue: '',
  },
  box_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '打包盒数量',
    defaultValue: 0,
  },
  box_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '打包盒价格',
    defaultValue: 0,
  },
  min_order_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '最小购买数',
    defaultValue: 0,
  },
  upccode: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '69码',
    defaultValue: '',
  },
}, {
  // 表名.
  tableName: 'shop_sku',
  // 开启自定义时间.
  timestamps: true
})

// 引入自动同步表. 且不删除表.
sequelize.sync({force:false}).then(() => {
  console.log('shop_sku')
})

export default ShopSku