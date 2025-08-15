import ShopSpuTag from '../models/shop_spu_tag'
import ShopTag from '../models/shop_tag'

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
export async function getSkuList(shop_id, tag_id = '', kw = '', page = 1, is_export = 0) {
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
    cond['name'] = {
      [Op.like]: '%' + kw + '%'
    }
  }

  if(tag_id) {
    let tags = await ShopTag.findAll({
      where: {
        third_id: store.third_id,
        platform: store.platform,
        [Op.or]: {
          parent_tag: tag_id,
          tag: tag_id
        }
      }
    })

    let tag_id_list = tags ? tags.map((item) => {
      return item.tag
    }) : ['-1']

    const shop_spu_tag_list = await ShopSpuTag.findAll({
      where: {
        third_id: store.third_id,
        platform: store.platform,
        tag: {
          [Op.in]: tag_id_list
        }
      },
      raw: true
    })
    
    if(shop_spu_tag_list.length) {
      spu_id_list = spu_id_list.concat(shop_spu_tag_list.map(item => item.spu_id))
      // 再搜索一次
    }else{
      spu_id_list = ['-1']
    }
  }
  
  // 处理一个组合查询情况.
  if(spu_id_list.length > 0) {
    cond['spu_id'] = {
      [Op.in]: spu_id_list
    }
  }

  const total = await ShopSpu.count({
    where: cond
  })

  let spu_list

  if(is_export) {
    spu_list = await ShopSpu.findAll({
      where: cond,
      raw: true,
    })
  }else{
    spu_list = await ShopSpu.findAll({
      where: cond,
      raw: true,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    })
  }

  let render_data = []

  // 这里要去查找spu的信息 然后组合数据出来给前台用.
  if(spu_list) {
    // 这里要重新查一次. 按照店铺名称. 
    const sku_list = await ShopSku.findAll({
      where: {
        spu_id: {
          [Op.in]: spu_list.map((item) => {
            return item.spu_id
          })
        },
        third_id: store.third_id,
        platform: store.platform
      },
      raw: true,
    })

    let tag_id_list = []

    spu_list.map((item) => {
      let sup_tag = item.tag.split(',')

      tag_id_list = tag_id_list.concat(sup_tag)
    })

    const tag_list = await ShopTag.findAll({
      where: {
        tag: {
          [Op.in]: tag_id_list
        },
        third_id: store.third_id,
        platform: store.platform
      },
      raw: true
    })

    let tag_map = {}

    if(tag_list) {
      for(let i = 0; i < tag_list.length;i++) {
        tag_map[tag_list[i].tag] = tag_list[i].tag_text
      }
    }

    spu_list.map((item) => {
      let current_skus = sku_list.filter((sku) => sku.spu_id == item.spu_id) || []
      let spu_tag_id_list = item.tag.split(',')
      let tag_names = []

      for(let i = 0; i < spu_tag_id_list.length; i++) {
        let tmp_tag_id = spu_tag_id_list[i]
        let tag = tag_map[tmp_tag_id] ? tag_map[tmp_tag_id] : ''
        if(!tag) {
          continue
        }

        tag_names.push(tag)
      }

      // 开始拼凑.
      render_data.push({
        // 店铺名称
        shop_name: store.name,
        // 店铺地址
        shop_address: store.address,
        // 店铺的logo图片
        shop_picture: store.logo,
        // 药品名称
        product_name: item ? item.name : '',
        // 药品图片
        spu_picture: item ? item.picture : '',
        // 规格标签
        sku_label: item ? item.sku_name : '',
        // 销量
        month_saled: item.month_saled_num ? item.month_saled_num.replace('月售', '') : item.month_saled_num,
        // 更新时间
        updated_time: item.updatedAt,
        // 分类.
        sku_items: current_skus.map((sku) => {
          return {
            sku_name: sku.name,
            price: sku.price,
            origin_price: sku.origin_price,
            stock: sku.stock,
            picture: sku.picture,
            min_order_count: sku.min_order_count,
            upccode: sku.upccode
          }
        }),
        tag_name: tag_names.join(',')
      })
    })
  }

  return renderSuc({
    render_data: render_data,
    total
  })
}
