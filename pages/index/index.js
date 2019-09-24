//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '../../images/tu1.png',
      '../../images/tu2.png',
      '../../images/tu3.png',
      '../../images/tu4.png',
      '../../images/tu5.png',
    ],
    imgTagUrls: '',
    current: 0,
    motto: '迎国庆换新颜',
    cardImgSrc: '../../images/bg.png',  // 背景图
    logo: '../../images/1.png',  
    title: '../../images/2.png',
    save: '../../images/3.png',  
    left: '../../images/left.png',
    right: '../../images/right.png',
    userInfo: {},
    avatarUrl: '',
    maskHidden: false,
    shengcheng: ''
  },
  onLoad: function () {
    //用户信息
    app.getUserInfo(userInfo => {
      this.setData({
        userInfo: userInfo,
      })
      wx.downloadFile({
        url: userInfo.avatarUrl,
        success: res => {
          if (res.statusCode === 200) {
            this.setData({
              avatarUrl: res.tempFilePath
            });
          }
        }, fail: res => {
          console.log(res);
        }
      });
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      imgTagUrls: this.data.imgUrls[0],
    })
    
  },
  prev: function () {
    var current = this.data.current;
    current = current === 0 ? (this.data.imgUrls.length - 1) : current - 1;
    this.setData({
      current: current,
      imgTagUrls: this.data.imgUrls[current],
    })
  },
  next: function () {
    var current = this.data.current;
    current = current < (this.data.imgUrls.length - 1) ? current + 1 : 0;
    this.setData({
      current: current,
      imgTagUrls: this.data.imgUrls[current],
    })
  },
  catchTouchMove: function (res) {
    return false
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    var path = that.data.avatarUrl;
    var path1 = that.data.imgTagUrls;

    context.drawImage(path, 0, 0, 200, 200);
    context.drawImage(path1, 0, 0, 200, 200);

    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout( () => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          console.log(res);
          var tempFilePath = res.tempFilePath;
          that.setData({
            shengcheng: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      wx.vibrateLong();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  save: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shengcheng,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
