const Shop = require('../models/shop')
const ShopSpuTag = require('../models/shop_spu_tag')
const ShopSpu = require('../models/shop_spu')
const ShopSku = require('../models/shop_sku')
const ShopTag = require('../models/shop_tag')

const { Op } = require('sequelize')
const { PAGE_SIZE } = require('./constants')
const { renderSuc,  renderFail } = require('../component/web/response')

export async function getStoreList(kw = '', platform = '', page = 1) {
  let cond = {}

  page = !page ? 1 : parseInt(page)

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
    raw: true,
    order: [['updatedAt', 'DESC']]
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
    },
    raw: true,
  })

  if(!store_info) {
    return renderFail('未找到店铺信息')
  }

  return renderSuc(store_info)
}

export async function delStore(id) {
  if(!id) {
    return renderFail('请输入关键信息')
  }

  // 开始删除表信息. 
  const store_info = await Shop.findOne({
    where: {
      id: id
    },
    raw: true,
  })

  if(!store_info) {
    return renderFail('未找到店铺信息')
  }

  // 开始删除表信息.
  // 1. 店铺信息
  // 2. spu信息.
  // 3. sku信息
  // 4. tag信息
  // 5. tag关联信息
  const cond = {
    where: {
      platform: store_info.platform,
      third_id: store_info.third_id
    }
  }

  await ShopSpuTag.destroy(cond)
  await ShopSku.destroy(cond)
  await ShopSpu.destroy(cond)
  await ShopTag.destroy(cond)
  await Shop.destroy(cond)

  return renderSuc('删除完成')
}

export async function getCates(shop_id) {
  const shop_info = await Shop.findOne({
    where: {
      id: shop_id
    },
    raw: true
  })

  if(!shop_info) {
    return renderFail('缺少关键信息')
  }

  // 开始查询tag.
  const cate_list = await ShopTag.findAll({
    where: {
      third_id: shop_info.third_id,
      platform: shop_info.platform
    },
    raw: true
  })

  if(!cate_list) {
    return []
  }

  let render_data = [
    {
      tag: '',
      tag_text: '全部',
      shop_id: shop_id,
    }
  ]

  render_data = render_data.concat(cate_list.map((item) => {
    return {
      tag: item.tag,
      tag_text: item.parent_tag ? '|---' + item.tag_text : item.tag_text,
      shop_id: shop_id
    }
  }))


  // 返回tag信息.
  return renderSuc(render_data)
}