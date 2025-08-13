// 解析数据并入库.
const { PLATFORM_ELEME, PLATFORM_MEITUAN } = require('./constants')
const Shop = require('../models/shop')
const ShopTag = require('../models/shop_tag')
const ShopSpu = require('../models/shop_spu')
const ShopSku = require('../models/shop_sku')
const ShopSpuTag = require('../models/shop_spu_tag')
const meituan = require('./platform/meituan')
const eleme = require('./platform/eleme')

const handleMeituan = (url, data) => {
  // 解析基础数据. 这里可以解析门店数据.
  if(url.indexOf('/wxapp/v1/poi/food') > -1 || url.indexOf('/mtweapp/v1/poi/food') > -1) {
    return meituan.parseFood(data)
  }

  // 解析首屏数据和分类数据
  if(url.indexOf('/v1/poi/product/smooth/render') > -1 || url.indexOf('/v1/poi/sputag/products') > -1) {
    return meituan.parseSpuPage(data)
  }

  return false
}

const handleEleme = (url, data) => {
  // 解析店铺基本数据.
  if(url.indexOf('/h5/mtop.venus.shopresourceservice.getshopresource') > - 1) {
    return eleme.parseShop(data)
  }

  // 解析展示的标签.
  if(url.indexOf('/h5/mtop.venus.shopcategoryservice.getcategoryv2') > -1) {
    return eleme.parseTags(data)
  }

  // 解析商品信息了.
  if(url.indexOf('/h5/mtop.venus.shopcategoryservice.getcategorydetail') > -1) {
    return eleme.parseSpuPage(data)
  }

  return false
}

export async function handle(platform, url, data) {
  let parse_data = {}
  if(platform == PLATFORM_MEITUAN) {
     parse_data = handleMeituan(url, data)
  }

  if(platform == PLATFORM_ELEME) {
    parse_data = handleEleme(url, data)
  }

  if(!parse_data) {
    return false
  }

  // 保存店铺基本信息.
  if(parse_data.shop_info) {
    let shop = await Shop.findOne({
      where: {
        third_id: parse_data.shop_info.third_id
      }
    })

    if(!shop) {
      shop =  Shop.build({})
    }

    shop.set(parse_data.shop_info)
    await shop.save()
  }

  // 保存标签分类
  if(parse_data.tag_list) {
    for(let i = 0; i < parse_data.tag_list.length; i++) {
      let tag = parse_data.tag_list[i]
      let shop_tag = await ShopTag.findOne({
        where: {
          platform: tag.platform,
          third_id: tag.third_id,
          tag: tag.tag,
        }
      })
  
      if(!shop_tag) {
        shop_tag =  ShopTag.build({})
      }
  
      shop_tag.set(tag)
      await shop_tag.save()
    }
  }

  // 保存spu.
  if(parse_data.spu_list) {
    for(let i = 0; i < parse_data.spu_list.length; i++) {
      let spu = parse_data.spu_list[i]
      let shop_spu = await ShopSpu.findOne({
        where: {
          platform: spu.platform,
          third_id: spu.third_id,
          spu_id: spu.spu_id,
        }
      })
  
      if(!shop_spu) {
        shop_spu =  ShopSpu.build({})
      }
  
      shop_spu.set(spu)
      await shop_spu.save()
    }
  }

  // 保存sku.
  if(parse_data.sku_list) {
    for(let i = 0; i < parse_data.sku_list.length; i++) {
      let sku = parse_data.sku_list[i]
      let shop_sku = await ShopSku.findOne({
        where: {
          platform: sku.platform,
          third_id: sku.third_id,
          spu_id: sku.spu_id,
          sku_id: sku.sku_id
        }
      })
  
      if(!shop_sku) {
        shop_sku =  ShopSku.build({})
      }
  
      shop_sku.set(sku)
      await shop_sku.save()
    }
  }


  if(parse_data.shop_spu_tag_list) {
    for(let i = 0; i < parse_data.shop_spu_tag_list.length; i++) {
      let spu_tag = parse_data.shop_spu_tag_list[i]
      let shop_spu_tag = await ShopSpuTag.findOne({
        where: {
          platform: spu_tag.platform,
          third_id: spu_tag.third_id,
          spu_id: spu_tag.spu_id,
          tag: spu_tag.tag
        }
      })
      // 不做更新. 后面来考虑这个东西.
      if(shop_spu_tag) {
        continue
      }

      shop_spu_tag =  ShopSpuTag.build({})
      shop_spu_tag.set(spu_tag)
      await shop_spu_tag.save()
    }
  }

  
  return 1
}
