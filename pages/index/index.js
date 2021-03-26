// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    show: true,
    canvas: null,
    ctx: null,
    showTip: true,
    dpr: 0
  },
  onReady() {
    const _this = this
    let query = wx.createSelectorQuery().in(this);
    query.select('#sign_box').boundingClientRect(function (res) {
      const context = wx.createCanvasContext('sign_box')
      const canvas = res
      const w = wx.getSystemInfoSync().windowWidth
      _this.setData({
        ctx: context,
        dpr: 750 / w,
        canvas
      })
      _this.handleSetInitCanvas(context)

    }).exec();

  },
  onPopShow() {
    this.setData({
      show: true,
      showTip: true
    }, () => {
      this.handleClearRect()
    })
  },
  handleSaveSign() {
    const _this = this
    if (!this.data.showTip) {
      wx.canvasToTempFilePath({
        canvasId: 'sign_box',
        success(res) {
          const img = res.tempFilePath
          _this.setData({
            show: false,
            showTip: true,
            signImg: img
          })

        }
      })
    }


  },
  handleUploadSign(tempFilePath) {
    wx.uploadFile({
      url: 'https://www.test.com', //仅为示例，非真实的接口地址
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
      },
      method: "post",
      success(res) {
        let list = JSON.parse(res.data)
        let imgurlArr = that.data.imgurlArr //data中定义的imgurlArr数组，用来存图片路径
        imgurlArr.push(...list)
        if (success) {
          that.setData({
            imgurlArr: imgurlArr,
          })
        } else {
        }
      },
      fail() {
      }
    })
  },
  handleSetInitCanvas(ctx) {
    const { dpr } = this.data
    ctx.setStrokeStyle('#bdbdbd')
    ctx.setLineDash([10, 10, 10])
    ctx.setLineWidth(2)
    ctx.strokeRect(20 / dpr, 20 / dpr, 710 / dpr, 460 / dpr)
    ctx.setFillStyle("#bdbdbd")
    ctx.setFontSize(48 / dpr)
    ctx.setTextAlign("center")
    ctx.setTextBaseline("center")
    ctx.fillText('请清晰书写您的签名', 380 / dpr, 240 / dpr)
    ctx.draw(true);
  },
  handleClearRect() {
    this.data.ctx.draw(false)
    this.setData({
      showTip: true
    })
    this.handleSetInitCanvas(this.data.ctx)
  },
  handelCanvasBegin(e) {
    const posX = e.changedTouches[0].x
    const posY = e.changedTouches[0].y
    const { showTip } = this.data
    if (showTip) {
      this.data.ctx.draw(false)
    }
    this.data.ctx.setLineDash([0, 0, 0])
    this.data.ctx.setLineWidth(3)
    this.data.ctx.setLineCap("round")
    this.data.ctx.setLineJoin("round")
    this.data.ctx.setStrokeStyle("#333333")
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(posX, posY)
    this.setData({
      showTip: false
    })

  },
  handleOnTouchMove(e) {
    const posX = e.changedTouches[0].x
    const posY = e.changedTouches[0].y
    this.data.ctx.lineTo(posX, posY)
    this.data.ctx.stroke()
    this.data.ctx.draw(true);
    this.data.ctx.moveTo(posX, posY)

  },
  handleOnTouchEnd(e) {
    this.data.ctx.closePath()
  },
  onClose() {
    this.setData({
      show: false
    })

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow() {

    this.setData({
      loading: false
    })
  }
})
