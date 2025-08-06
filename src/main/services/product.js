const ShopSpu = require('../models/shop_spu')
const Shop = require('../models/shop')
const ShopSku = require('../models/shop_sku')
const { renderFail, renderSuc } = require('../component/web/response')
const { PAGE_SIZE } = require('./constants')

export async function getSpuList(shop_id, kw = '', page = 1) {
  page = !page ? 1 : parseInt(page)

  const store = await Shop.findOne({
    where: {
      id: shop_id
    },
    raw: true
  })

  if(!store) {
    return renderFail('暂无店铺信息')
  }

  // 开始进行查找数据
  let cond = {
    third_id: store.third_id
  }

  if(kw) {
    cond['name'] = {
      [Op.like]: '%' + kw + '%'
    }
  }

  const total = await ShopSpu.count({
    where: cond
  })

  const spu_list = await ShopSpu.findAll({
    where:cond,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    raw: true,
  })

  return renderSuc({
    spu_list: spu_list,
    total: total,
    store
  })
}

// 根据单个spu获取sku的信息
export async function getSkuListBySpuId(shop_id, spu_id) {
  const store = await Shop.findOne({
    where: {
      id: shop_id
    },
    raw: true
  })

  if(!store) {
    return renderFail('暂无店铺信息')
  }

  const sku_list = await ShopSku.findAll({
    where: {
      third_id: store.third_id,
      spu_id: spu_id,
      Platform: store.platform,
    },
    raw: true
  })

  return renderSuc(sku_list)
}

// 这里的方式肯定是需要进行一些操作的.
export async function getSkuList(shop_id, spu_id = '', page = 1, is_export = 0) {
  page = !page ? 1 : parseInt(page)

  const store = await Shop.findOne({
    where: {
      id: shop_id
    },
    raw: true
  })

  if(!store) {
    return renderFail('暂无店铺信息')
  }

  let cond = {
    third_id: store.third_id,
    platform: store.platform,
  }

  if(spu_id) {
    cond['spu_id'] = spu_id
  }

  const total = await ShopSku.count({
    where: cond
  })

  if(is_export) {
    let sku_list = await ShopSku.findAll({
      where: cond,
      raw: true,
    })
  }else{
    let sku_list = await ShopSku.findAll({
      where: cond,
      raw: true,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    })
  }

  // 这里要去查找spu的信息 然后组合数据出来给前台用.
  if(sku_list) {

  }

  return renderSuc({
    sku_list,
    total
  })
}

