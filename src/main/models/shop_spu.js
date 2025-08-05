const { DataTypes } = require('sequelize')
const { sequelize } = require('../component/db/connection')

// 完成基础定义. 后面来看一下.
const ShopSpu = sequelize.define('ShopSpu', {
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
  name: {
    type: DataTypes.STRING,
    comment: '药品名称',
    allowNull: false,
    defaultValue: '',
  },
  show_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '展示名字'
  },
  month_saled_num: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '月销',
    defaultValue: '',
  },
  sku_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Sku名称',
    defaultValue: '',
  },
  underline_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '划线价格',
    defaultValue: 0
  },
  single_standard_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '单价',
    defaultValue: 0
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Spu图片',
    defaultValue: '',
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tag',
    defaultValue: '',
  },
  categroys: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '分类',
    defaultValue: '',
  },
}, {
  // 表名.
  tableName: 'shop_spu',
  // 开启自定义时间.
  timestamps: true
})

// 引入自动同步表. 且不删除表.
sequelize.sync({force:false}).then(() => {
  console.log('shop_spu')
})

export default ShopSpu