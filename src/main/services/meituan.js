const {PLATFORM_MEITUAN} = require('./constants')

function parseSpu(third_id, source_list) {
  let spu_list = []
  let sku_list = []
  source_list.map((spu) => {
    spu_list.push({
      platform: PLATFORM_MEITUAN,
      third_id: third_id,
      spu_id: spu.id + '',
      name: spu.name,
      show_name: spu.show_name,
      month_saled_num: spu.month_saled_content,
      categroys: spu.standardCategorys ? spu.standardCategorys.map((cate) => {
        return cate.name
      }).join(',') : '',
      sku_label: spu.sku_label,
      picture: spu.picture,
      single_standard_price: spu.single_standard_price,
      underline_price: spu.underline_price,
      tag: spu.tag
    })

    spu.skus.map((sku) => {
      sku_list.push({
        platform: PLATFORM_MEITUAN,
        third_id: third_id,
        spu_id: spu.id + '',
        sku_id: sku.id + '',
        name: sku.spec,
        price: sku.price,
        origin_price: sku.origin_price,
        stock: sku.stock,
        real_stock: sku.real_stock,
        activity_stock: sku.activity_stock,
        picture: sku.picture,
        box_num: sku.box_num,
        box_price: sku.box_price,
        min_order_count: sku.min_order_count,
        upccode: sku.upccode,
      })
    })
  })

  return {
    spu_list,
    sku_list
  }
}

const parseFood = function(data) {
  // 开始解析店铺数据. 和一些基本数据. 这里先直接写到表里面  后面考虑队列吧.
  // 先看效果.
  const info = JSON.parse(data.body)
  const poi_info = info.data.poi_info

  if(info.code != 0) {
    console.log('no parse shop basic info')
    return false
  }

  // 开始店铺基本信息. 后面可以根据这个来看看.
  let shop_info = {
    platform: PLATFORM_MEITUAN,
    brand_id: poi_info.brand_id + '',
    name: poi_info.name,
    third_id: poi_info.poi_id_str,
    address: poi_info.address,
    distance: poi_info.distance,
    phone_list: poi_info.phone_list.join(','),
    solgan: poi_info.bulletin,
    logo: poi_info.pic_url,
  }

  // 店铺实际的左侧标签栏. 
  let tag_list = info.data.food_spu_tags.map((item) => {
    return {
      platform: PLATFORM_MEITUAN,
      third_id: shop_info.third_id,
      tag: item.tag,
      sequence: item.sequence,
      tag_text: item.name
    }
  })

  // 前两个tag有关联. 也就只有前两个tag有spu. 其他都没有. 所以第一屏幕的spu. 可以通过food_spu_tags去获取.
  // 默认部分的spu和sku信息. 能抓则抓. 所以不太确定信息哦.
  let shop_spu_tag_list = []
  let all_spu_list = []
  let all_sku_list = []
  info.data.food_spu_tags.map((item) => {
    if(item.spus.length <= 0) {
      return
    }
    
    let spu_info = parseSpu(shop_info.third_id, item.spus)

    all_spu_list = all_spu_list.concat(spu_info.spu_list)
    all_sku_list = all_sku_list.concat(spu_info.sku_list)
    
    item.spus.map((spu) => {
      // 这里的tag 可能会跟关联的tag不一致. 所以如果想要复原界面. 就得用关联表保存item.tag
      shop_spu_tag_list.push({
        platform: PLATFORM_MEITUAN,
        third_id: shop_info.third_id,
        spu_id: spu.id + '',
        tag: item.tag,
      })
    })
  })
  // 这一趴先弄起来. 后面在返回就可以了. 直接进行插入操作.
  return {
    shop_info,
    tag_list,
    spu_list: all_spu_list,
    shop_spu_tag_list,
    sku_list: all_sku_list
  }
}

const parseSpuPage = function(data) {
  // 开始解析店铺数据
  const info = JSON.parse(data.body)

  if(info.code != 0) {
    console.log('no parse shop basic info')
    return false
  }

  // 获取third_id. 也就是店铺id.
  const request_params = data.req_params

  // 开始解析里面数据. 并拿到poi_id_str
  let map = {}
  request_params.split('&').map((item) => {
    let param = item.split('=')

    map[param[0]] = param.length > 1 ? param[1] : ''
  })

  if(Object.keys(map).length == 0 || !map.poi_id_str) {
    console.log('meituan not found poi_id_str')
    return false
  }

  return parseSpu(map['poi_id_str'], info.data.product_spu_list)
}

export default {
  parseFood,
  parseSpuPage,
}