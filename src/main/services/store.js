const Shop = require('../models/shop')
const { Op } = require('sequelize')
const { PAGE_SIZE } = require('./constants')
const { renderSuc,  renderFail} = require('../component/web/response')

export async function getStoreList(kw, platform = '', page = 1) {
  let cond = {}

  if(platform) {
    cond['platform'] = platform
  }

  if(kw) {
    cond[Op.or] = [
      {
        name: {
          [Op.like]: '%' + kw + '%'
        }
      },
      {
        address: {
          [Op.like]: '%' + kw + '%'
        }
      }
    ]
  }

  const total = await Shop.count({where: cond})

  // 开始查询.
  const store_list = await Shop.findAll({
    where: cond,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE, 
  })

  return renderSuc({
    total, 
    store_list
  })
}

export async function getStoreInfo(id) {
  if(!id) {
    return renderFail('缺少关键信息')
  }

  const store_info = await Shop.findOne({
    where: {
      id: id
    }
  })

  if(!store_info) {
    return renderFail('未找到店铺信息')
  }

  return renderSuc(store_info)
}