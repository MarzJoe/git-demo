var getclass_url = "https://www.myyd.xyz/baas/takeoutAdmin/api/queryTakeout_foodclass"
var getp_url ='https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food'
var insertproduct_url ='https://www.myyd.xyz/baas/takeoutAdmin/api/INSERT_Takeout_food'
var updateproduct_url ='https://www.myyd.xyz/baas/takeoutAdmin/api/update_noimage_Takeout_food'
var deleteproduct_url ='https://www.myyd.xyz/baas/takeoutAdmin/api/delete_Takeout_food'
var updatep_url ="https://www.myyd.xyz/baas/takeoutAdmin/api/update_Takeout_food"
var update_myorder_fOrderKuaiDi ="https://www.myyd.xyz/baas/takeoutAdmin/api/update_myorder_fOrderKuaiDi"
var oss_url ='https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/'
var getorder_url ='https://www.myyd.xyz/baas/takeoutAdmin/api/queryMyorder'




export default {
  update_myorder_fOrderKuaiDi:function(){
    return update_myorder_fOrderKuaiDi
  },
  getclass_url: function () {
    return getclass_url
  },
  getp_url: function () {
    return getp_url
  },
  getorder_url: function () {
    return getorder_url
  },
  insertproduct_url:function(){
    return insertproduct_url
  },
  updatep_url:function(){
    return updatep_url
  },
  updateproduct_url:function(){
    return updateproduct_url
  },
  deleteproduct_url:function(){
    return deleteproduct_url
  },
  oss_url:function(){
    return oss_url
  }
}
