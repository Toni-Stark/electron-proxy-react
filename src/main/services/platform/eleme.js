const { PLATFORM_ELEME } = require('../constants')

function getDataFromUrl(url) {
  // 解析URL中的查询参数部分
  const queryString = new URL(url).search;
  
  // 创建URLSearchParams对象来处理查询参数
  const params = new URLSearchParams(queryString);
  
  // 获取data参数的值
  const dataParam = params.get('data');
  
  if (!dataParam) {
      console.log('未找到data参数');
      return null;
  }
  
  try {
      // 解码data参数（处理URL编码）
      const decodedData = decodeURIComponent(dataParam);
      // 解析为JSON对象
      return JSON.parse(decodedData);
  } catch (error) {
      console.error('解析data参数失败:', error);
      return null;
  }
}

function parseSpu(third_id, cate_foods_list) {
  let spu_list = []
  let sku_list = []
  let shop_spu_tag_list = []

  cate_foods_list.map((cate_foods) => {
    const foods = cate_foods.foods
    const cateId = cate_foods.cat1Id
    if(!foods) {
      return
    }
    // 饿了么目前来看 只有spu. 没看到规格这种. 所以sku的名字为空. spu只有单独的spu_id.
    foods.map((spu) => {
      const currentPrice = spu.item.currentPrice

      const originalPrice = spu.item.originalPrice ? spu.item.originalPrice : currentPrice

      spu_list.push({
        platform: PLATFORM_ELEME,
        third_id: third_id,
        spu_id: spu.item.itemId,
        name: spu.item.title,
        show_name: '',
        // 这里是已售
        month_saled_num: spu.item.monthSell,
        categroys: spu.item.categoryId,
        sku_name: '',
        picture: spu.item.mainPictUrl,
        // 折扣价格. 也就是实际到手价格. 这里的展示尤为重要. 看看怎么操作了. 如果是美团或者饿了么的话.
        // 不看折扣价格.
        single_standard_price: parseFloat(currentPrice.priceText),
        underline_price: parseFloat(originalPrice.priceText),
        tag: spu.item.shopCategoriesIdList
      })

      const cate_id_list = cateId != spu.item.shopCategoriesIdList ? [cateId, spu.item.shopCategoriesIdList] : [spu.item.shopCategoriesIdList]
      
      cate_id_list.map((tag) => {
        shop_spu_tag_list.push({
          platform: PLATFORM_ELEME,
          third_id: third_id,
          spu_id: spu.item.itemId,
          tag: tag,
        })
      })

      sku_list.push({
        platform: PLATFORM_ELEME,
        third_id: third_id,
        spu_id: spu.item.itemId + '',
        sku_id: spu.item.itemId + '',
        // 饿了么没有规格
        name: '',
        price: parseFloat(currentPrice.priceText),
        origin_price: parseFloat(originalPrice.priceText),
        // 折扣价格.
        discount_price: parseFloat(currentPrice.discountFeeText) || 0.0,
        stock: spu.item.stockModel.quantity,
        real_stock: spu.item.stockModel.quantity,
        activity_stock: spu.item.stockModel.quantity,
        picture: spu.item.mainPictUrl,
        box_num: 0,
        box_price: 0,
        min_order_count: 1,
        upccode: spu.item.barcode,
      })
    })
  })

  return {
    spu_list,
    sku_list,
    shop_spu_tag_list
  }
}

const parseShop = function(data) {
  if(data.body == 'success') {
    return false
  }
  // 开始解析店铺数据. 和一些基本数据. 这里先直接写到表里面  后面考虑队列吧.
  // 先看效果.
  const info = JSON.parse(data.body)
  
  if(!info.data || parseInt(info.data.errorCode) != 0) {
    return false
  }

  const ele_shop_info = info.data.data.shopInfo

  // 开始店铺基本信息. 后面可以根据这个来看看.
  let shop_info = {
    platform: PLATFORM_ELEME,
    brand_id: ele_shop_info.brandId + '',
    name: ele_shop_info.name,
    third_id: ele_shop_info.storeId,
    address: ele_shop_info.address,
    distance: '', // 这里的距离可能要从列表里面拿取.
    phone_list: ele_shop_info.phoneList.join(','),
    slogan: ele_shop_info.promotionInfo,
    logo: ele_shop_info.imagePath,
  }

  return {
    shop_info
  }
}

const parseTags = function(data) {
  if(data.body == 'success') {
    return false
  }

  const info = JSON.parse(data.body)
  // 需要解析storeId. 这里从url里面获取就可以了.
  const req_data = getDataFromUrl(data.url)

  if(!info.adta || parseInt(info.data.errorCode) != 0 || !req_data.storeId) {
    console.log('parse store id fail, url: ' + data.url)
    return false
  }

  let tag_list = []

  // 开始解析tag.
  info.data.data.catInfoList.map((item, idx) => {
    tag_list.push({
      platform: PLATFORM_ELEME,
      third_id: req_data.storeId,
      tag: item.catId,
      sequence: idx,
      tag_text: item.name,
      parent_tag: '',
    })

    // 意味着有二级分类.
    if(item.detail && item.detail.length > 0) {
      item.detail.map((sub_cat) => {
        tag_list.push({
          platform: PLATFORM_ELEME,
          third_id: req_data.storeId,
          tag: sub_cat.catId,
          sequence: idx,
          tag_text: sub_cat.name,
          parent_tag: item.catId,
        })
      })
    }
    return {
      
    }
  });

  return {
    tag_list
  }
}

const parseSpuPage = function(data) {
  // 开始解析店铺数据
  if(data.body == 'success') {
    return false
  }

  const info = JSON.parse(data.body)

  const req_data = getDataFromUrl(data.url)

  if(!info.data || parseInt(info.data.errorCode) != 0 || !req_data.storeId) {
    return false
  }

  return parseSpu(req_data.storeId, info.data.data)
}

export default {
  parseShop,
  parseSpuPage,
  parseTags
}