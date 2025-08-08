const ShopSpu = require('../models/shop_spu')
const Shop = require('../models/shop')
const ShopSku = require('../models/shop_sku')
const { renderFail, renderSuc } = require('../component/web/response')
const { PAGE_SIZE } = require('./constants')
const { Op } = require('sequelize')

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
      platform: store.platform,
    },
    raw: true
  })

  return renderSuc(sku_list)
}

// 这里的方式肯定是需要进行一些操作的.
export async function getSkuList(shop_id, spu_id = '', kw = '', page = 1, is_export = 0) {
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

  let spu_id_list = []

  if(kw) {
    spu_id_list = await ShopSpu.findAll({
      where: {
        name: {
          [Op.like]: '%' + kw + '%'
        },
        third_id: store.third_id,
        platform: store.platform
      },
      attributes: ['spu_id'],
      raw: true
    })

    if(spu_id_list.length > 0) {
      spu_id_list = spu_id_list.map((item) => {
        return item.spu_id
      })
    }else{
      spu_id_list = ['-1']
    }
  }

  if(spu_id) {
    spu_id_list.push(spu_id)
  }
  
  // 处理一个组合查询情况.
  if(spu_id_list.length > 0) {
    cond['spu_id'] = {
      [Op.in]: spu_id_list
    }
  }

  const total = await ShopSku.count({
    where: cond
  })

  let sku_list = []

  if(is_export) {
    sku_list = await ShopSku.findAll({
      where: cond,
      raw: true,
    })
  }else{
    sku_list = await ShopSku.findAll({
      where: cond,
      raw: true,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    })
  }

  let render_data = []

  // 这里要去查找spu的信息 然后组合数据出来给前台用.
  if(sku_list) {
    // 这里要重新查一次. 按照店铺名称. 
    const spu_list = await ShopSpu.findAll({
      where: {
        spu_id: {
          [Op.in]: sku_list.map((item) => {
            return item.spu_id
          })
        },
        third_id: store.third_id,
        platform: store.platform
      },
      raw: true,
    })

    let spu_map = {}
    // 换算一下. 开始拼凑数据了.
    for(let i = 0; i < spu_list.length; i++) {
      spu_map[spu_list[i].spu_id] = spu_list[i]
    }

    sku_list.map((item) => {
      let spu = spu_map[item.spu_id] ? spu_map[item.spu_id] : {}
      
      // 开始拼凑.
      render_data.push({
        // 店铺名称
        shop_name: store.name,
        // 店铺地址
        shop_address: store.address,
        // 店铺的logo图片
        shop_picture: store.logo,
        // 药品名称
        product_name: spu ? spu.name : '',
        // 药品图片
        spu_picture: spu ? spu.picture : '',
        // 规格标签
        sku_label: spu ? spu.sku_name : '',
        // 规格名称
        sku_name: item.name,
        // 价格
        price: item.price,
        // 原价
        origin_price: item.origin_price,
        // 库存
        stock: item.stock,
        // sku图片
        sku_picture: item.picture,
        // 最小购买数
        min_order_count: item.min_order_count,
      })
    })
  }

  return renderSuc({
    sku_list: render_data,
    total
  })
}
