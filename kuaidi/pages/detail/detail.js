Page({
  data: {
    order_id: '',
    company: '',
    detailList: [],
    toastText: '加载中...',
    // 下面这行其实可以写在 app.js里共用
    company_array: ['京东', '中通', '圆通', '申通', '韵达'],  // 快递公司中文列表
    type_array: ['jd', 'zhongtong', 'yuantong', 'shentong', 'yunda'],  // 快递公司英文type值列表
  },

  onLoad: function (options) {
    console.log(options);
    let order_id = options.order_id;
    let company = options.company;
    // console.log(order_id)
    // console.log(company)
    this.getData(order_id, company);  // 获取快递信息
  },

  getData: function(order_id, company){
    let url = 'https://www.kuaidi100.com/query';
    wx.request({
      url: url,
      data: {
        type: company,
        postid: order_id
      },
      success: (res) => {
        console.log(this['data']['type_array']);
        console.log(this.getIndex(this['data']['type_array'], company));
        let index = this.getIndex(this['data']['type_array'], company);
        // console.log(res)
        // 没有下面的方法 hhh 233
        // console.log(indexof(type_array, company)); 
        // print(type_array.indexof(company));
        if (res.data.data.length) {
          this.setData({
            detailList: res.data.data,
            order_id: order_id,
            company: this['data']['company_array'][index]
          })
        } else {
          this.setData({
            toastText: res.data.message
          })
        }
      },
      fail: (err) => {
        console.log(err)
        this.setData({
          toastText: '网络发生错误'
        })
      }
    })
  },

  // 根据数组的值获取对应的数组索引
  getIndex: function (arr, value) {
    console.log(arr)
    for (let i = 0; i <= arr.length; i++) {
      if (value == arr[i]) {
        // console.log(i)
        return i;
      }
    }
    return -1;
  },
})