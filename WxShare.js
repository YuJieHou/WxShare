/**
 * 微信分享封装
 * var config = {
 *  appId
 *  url 接口地址
 *  data 接口参数
 *  imgUrl 分享图片
 *  friendTitle
 *  friendLink
 *  friendDesc
 *  circleTitle
 *  circleLink
 *  circleDesc
 *  circleFunction
 *  friendFunction
 * }
 * new WxShare(config);
 */
function WxShare(conf) {
  this.getURLParam = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "ig").exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
  };
  this.config = {
    appId: conf && conf.appId || '',
    url: conf && conf.url || '', //接口地址
    data: conf && conf.data || '' ,
    imgUrl: conf && conf.imgUrl || '',
    friendTitle: conf && conf.friendTitle || '',
    friendLink: conf && conf.friendLink || '',
    friendDesc: conf && conf.friendDesc || '',
    circleTitle: conf && conf.circleTitle || '',
    circleLink: conf && conf.circleLink || '',
    circleDesc: conf && conf.circleDesc || '',
    circleFunction: conf && conf.circleFunction || function() {},
    friendFunction: conf && conf.friendFunction || function() {},
    callback: conf && conf.callback || function(d) {}
  };
  this.init();
}
WxShare.prototype.init = function() { //获取用户信息
  var self = this;
  $.ajax({
    url: self.config.url,
    data: self.config.data,
    type:'get',
    success: function(d) { // 成功获取到用户信息，然后配置sdk
      var data;
      if(d.data){
        data = d.data;
      }else{
        data = d.Data;
      }
      self.config.callback(d); //处理用户信息
      wx.config({
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage']
      });
      wx.ready(function() {
        wx.onMenuShareTimeline({ //分享到朋友圈
          title: self.config.circleTitle,
          link: self.config.circleLink,
          desc: self.config.circleDesc,
          imgUrl: self.config.imgUrl,
          success: function() {
            self.config.circleFunction(); // 确认分享
          },
          cancel: function() {
            // 取消分享
          }
        });
        wx.onMenuShareAppMessage({ //分享给朋友
          title: self.config.friendTitle,
          link: self.config.friendLink,
          desc: self.config.friendDesc,
          imgUrl: self.config.imgUrl,
          success: function() {
            self.config.friendFunction(); // 确认分享
          },
          cancel: function() {
            // 取消分享
          }
        });
      });
    },
    error: function(a, b, c) {
      console.log('error');
    }
  });
}