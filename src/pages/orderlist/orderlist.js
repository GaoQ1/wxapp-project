let app = getApp();
let loginCount = 0;

Page({
    data: {
      page:1,
      size: 20,
      hasMore: true,
      login: true,
      orderList: []
    },

    onLoad: function() {
      this.loadMore();
    },


    loadMore(){
      if(!this.data.hasMore) return

      app.globalData.afterLogin.then(() => {
        app.post('api/Order/GetOrderAppListView',{
          PageIndex: this.data.page++,
          PageSize: this.data.size
        }).then((data) =>{
          if(data.Code == 4){
            if(loginCount < 3){
              app.login().then(this.loadMore)
              loginCount++;
            }else{
              this.setData({
                login: false
              });
              return;
            }
          }else if(data.Code === 200 && data.Data.OrderList.length){
            data.Data.OrderList.forEach((item) => {
              item.OrderStatus = app.orderStatus(item.OrderStatus)
            })

            this.setData({
              orderList: this.data.orderList.concat(data.Data.OrderList)
            });

            if(data.Data.OrderList.length < this.data.size){
              this.setData({ hasMore: false })
            }
          }else{
            this.setData({ hasMore: false })
          }
        });
      })
    },

    //跳到订单详情页
    tapdetail(e) {
      let order = e.currentTarget.dataset.order;

      /*let that = this;
      app.globalData.refreshOrderList = function(){
        that.onLoad();
      }*/

      wx.navigateTo({
        url: `../orderdetail/orderdetail?order=${order}`
      })
    }
})
