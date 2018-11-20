Page({
  data: {
    value: '',
    type_array: ['jd', 'zhongtong', 'yuantong', 'shentong', 'yunda'],  // 快递公司英文type值列表
    company_array: ['京东', '中通', '圆通', '申通', '韵达']  // 快递公司中文列表
  },
  // 京东测试快递单号：
  // 6666666666
  // let申明一个块级作用域的变量
  handleChange: function(event) {
    let value = event.detail.value;
    this.setData({ value })
    // console.log(value)
    // console.log(this.data.value)
  },
  handleSubmit: function(){
    // 快递单号
    let value = this.data.value;
    // 快递公司type值
    let company = this.data.type_array[this.data.index]
    console.log(company)
    if (!value){
      wx.showToast({
        icon: 'none',
        title: '请输入快递单号'
      })
    }else if(!company){
      wx.showToast({
        icon: 'none',
        title: '请选择快递公司'
      })
    }else{
      let url = `/pages/detail/detail?order_id=${value}&company=${company}`;
      console.log(url);  // hh太久没有写前端了，这里get的参数的写法都写错了 &
      wx.navigateTo({ url });
    }
  },
  // 扫码
  handleScancode: function(){
    wx.scanCode({
      success(res) {
        let order_id = res.result;
        order_id = Number(order_id);
        let url = `/pages/detail/detail?order_id=${order_id}`;
        wx.navigateTo({ url });
      }
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
