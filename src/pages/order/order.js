let app = getApp();
let utils = require('../../utils/utils');
let dateFormat = require('../../utils/dateutil');
Page({
     data:{
        hasInvoice:false,
        hasCoupon:false,
        hasAgree:false,
        addhidden:true,
       // aaa:false,
        modalhidden:true,
        tip:"../../images/check.png",
        ttp:"../../images/checked.png",
        mallhide:false,
        //退改签
        //rulehide:true,
         hide:true,
         activityhide:true,
         detail:true,
         //明细显示隐藏
         showtravel:true,
         hidetravel:false,
         totalPrice: '--',
         nextStep: {
           btnWord: '去支付'
         },
         costDetail: {
           show: false
         }
   },
   //添加乘机人
   addp:function(e){
      this.refreshPassengerHandle();
      wx.navigateTo({
          url: '../selectpassengers/selectpassengers',

    }),
     this.setData({
       addhidden:false
     })

   },
   onLoad:function(params){
      this.productKey=params.productKey;
      this.childrenNum=params.childrenNum;
      this.adultNum=params.adultNum;
      let that=this;
      var p='?p=U%2FkdIFBV9sBVvHfT7efjqvwcgO%2Bu6HMYw0h%2BWKVVJmFpDIwe1Ep2FErYdt6uEyjM0e5U45s9Ql5sXplj%2BQdK8pJEy7GohHZ06%2BWDW50kW1r1XKR2rTdbwdLSboZEaO0QwN5YPj2lGLhpaDgLVLu3Yw%3D%3D';
      app.post('api/Product/Booking'+p,{
        ProductKey: this.productKey
      }).then(function(data){
        that.setBookingData(data.Data.BookingInfo);
        return app.get('api/Coupon/GetCouponList'+p,{
          ProductKey: that.productKey,
          OrderAmount:0
        })
      }).then(function(data){
        that.setData({
          loading:false
        })
      }).catch(function(e){
        console.log(e);
      })

      this.setData({
        loading:true,
        childrenNum:this.childrenNum,
        adultNum:this.adultNum
      })

   },

   setBookingData:function(bookingInfo){
    let that=this;
    let departureDate= dateFormat.formatDay(new Date(bookingInfo.PkgProductInfo.PkgProduct_Schedule[0].DepartureDate));
    let departureCityName = bookingInfo.PkgProductInfo.DepartureTravelCityName;
    let destinationCityName = bookingInfo.PkgProductInfo.DestinationCityName;
    let contactInfo=bookingInfo.ContactInfo||{};
    let invoiceInfo=contactInfo.InvoiceInfo||{};
    this.isInternational = bookingInfo.PkgProductInfo.IsInternational;
    let segLeg=bookingInfo.PkgProductInfo.PkgProduct_Segment.length-1;
    this.lastDepartureTime=bookingInfo.PkgProductInfo.PkgProduct_Segment[segLeg].DepartureTime;
    //获取价格信息
    (bookingInfo.PackageProductPriceInfoList||[]).forEach(function(item){
      switch(item.PriceType){
        case 0:
          that.flightAndHotelPrice=item.TotalAmount;
          break;
        case 1:
          that.taxPrice=item.TotalAmount;
          break;
      }
    })
    let totalPrice=this.getTotalPrice();
    let passengerList=bookingInfo.PassengerInfoList;
    this.passengerInfo={
      productKey:this.productKey,
      passengerList:passengerList,
      selectedPassengerList:[],
      childrenNum:this.childrenNum,
      adultNum:this.adultNum,
      lastDepartureTime:this.lastDepartureTime,
      isInternational:this.isInternational
    };
    wx.setStorageSync('passengerInfo',this.passengerInfo);
    this.setData({
      productName:bookingInfo.PkgProductInfo.ProductName,
      departureDate:departureDate,
      contactInfo:bookingInfo.ContactInfo,
      departureCityName:departureCityName,
      destinationCityName:destinationCityName,
      totalPrice:totalPrice,
      flightAndHotelPrice:this.flightAndHotelPrice,
      taxPrice:this.taxPrice,
      contactName:contactInfo.ReceivingName||'',
      contactPhone:contactInfo.MobilePhone||'',
      contactEmail:contactInfo.Email||'',
      invoiceTitle:invoiceInfo.Title||'',
      invoiceAddress:invoiceInfo.DetailAddress||'',
      isInternational:this.isInternational,
      passengerList:[]
    })
   },
   getSelectedPassengerList:function(list,selectedIds){
    let that=this;

    return (list||[]).filter(function(item){
      return selectedIds.indexOf(item.ID)>-1;
    }).map(function(item){
      let passengerType=utils.isChild(new Date(item.Birthday),that.lastDepartureTime)?'儿童':(utils.isAdult(new Date(item.Birthday),that.lastDepartureTime)?'成人':'婴儿');
      let name =utils.getName(item);
      return {
        id:item.ID,
        name:name,
        cardType:item.CardType,
        CardNo:item.CardNo,
        passengerType:passengerType
      }
    })
   }
   ,
   refreshPassengerHandle:function(){
    var that=this;
    app.globalData.refreshPassenger=function(){
      let passengerInfo= wx.getStorageSync('passengerInfo');
      if(that.productKey==passengerInfo.productKey){
        let passengerList=passengerInfo.passengerList;
        let selectedPassengerList=passengerInfo.selectedPassengerList;
        that.setData({
          passengerList:that.getSelectedPassengerList(passengerList,selectedPassengerList)
        })
        app.globalData.refreshPassenger=null;
      }
    }
   }
   ,
   getTotalPrice:function(){
     let totalPrice= Math.floor(((this.flightAndHotelPrice||0)+(this.taxPrice||0)-(this.couponPrice||0))*100)/100;
     return totalPrice>0?totalPrice:0;
   },

   inputChangeHandle:function(e){
      var key=e.currentTarget.id;
      var data={};
      data[key]=e.detail.value;
      this.setData(data);
   },

   bindKeyInput: function(e) {
      this.inputChangeHandle(e);
   }
   ,
    //开关函数
   switch1Change: function (e){
     this.inputChangeHandle(e);
  },

   // 遮罩层
 showMask:function(e){
    //  console.log(e)
     this.setData({
     modalhidden:false
     })
   },
   hiddenMask:function(e){
     this.setData({
     modalhidden:true
     })
   },

  //  活动弹窗
  showactivity:function(e){
    console.log(e)
      this.setData({
      activityhide:false
     })
  },
  // backshowactivity:function(e){
  //    this.setData({
  //     activityhide:false
  //    })
  // },
  hideactivity:function(e){
      this.setData({
      activityhide:true
     })
  },
  deleteHandle:function(e){
    let id=e.currentTarget.dataset.id;
    let that=this;
    utils.confirm('是否删除旅客？',function(){
      that.passengerInfo.selectedPassengerList=that.passengerInfo.selectedPassengerList.filter(function(item){
        return item!=id;
      })
      wx.setStorageSync('passengerInfo',that.passengerInfo);
      let passengerList=that.data.passengerList.filter(function(item){
        return item.id!=id;
      })
      that.setData({
        passengerList:passengerList
      })
    })
  },
  editHandle:function(e){
    this.refreshPassengerHandle();
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'../createTraveller/createTraveller?type=2&id='+id
    })
  },
// //价格明细底部弹窗
// showdetail:function(e){
//    this.setData({
//      detail:false,
//      showtravel:false,
//      hidetravel:true
//    })
// },
//   pricedetail:function(e){
//      this.setData({
//      detail:true,
//      showtravel:true,
//      hidetravel:false
//    })
//   },

  //选择
  catchTapHandle:function(){

  },
  agreeChange:function(e){
    var key=e.currentTarget.id;
    var data={};
    data[key]=!this.data[key];
    this.setData(data);
  },
   app:function(e){
     this.setData({
          mallhide:true,
          hide:false,
          tip:"../../images/checked.png"
         })
    },
    appjs:function(e){
       this.setData({
           mallhide:false,
           hide:true,
           tip:"../../images/check.png"
         })
    },

    //表单验证
    formBindsubmit:function(e){
      // console.log(e.detail.value.userName.length)
      if(e.detail.value.userName.length==0){

          wx.showModal({
            title: '温馨提示',
            content: '姓名不能为空',
            showCancel:false,
            confirmColor:"#59A5F0"
        })
    }else if(e.detail.value.phone.length==0){

          wx.showModal({
            title: '温馨提示',
            content: '手机号不能为空',
            showCancel:false,
            confirmColor:"#59A5F0"

        })
    }else if(e.detail.value.phone.length!=11){
        wx.showModal({
            title: '温馨提示',
            content: "电话号码长度是11位",
            showCancel:false,
            confirmColor:"#59A5F0"

        })
    }else if(!(/^1[34578]\d{9}$/.test(e.detail.value.phone))){
          console.log("手机号码有误，请重填")
          wx.showModal({
            title: '温馨提示',
            content: '手机号码输入不正确',
            showCancel:false,
            confirmColor:"#59A5F0"
        })

      }else{
        wx.navigateTo({
          url: '../payment/payment'
       })
      }

    },

    showCostDetail(){
      this.setData({
        costDetail: {
          show: true
        }
      })
    },

    hideCostDetail(){
      this.setData({
        costDetail: {
          show: false
        }
      })
    }
})
