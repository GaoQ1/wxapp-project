function buildUrl(url, objParams){
	if (Object.keys(objParams).length > 0) {
		var serializedParams = [];
		Object.keys(objParams).forEach(function(val){
			serializedParams.push(`${val}=${objParams[val]}`);
		})
		url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams.join('&');
	}
	return url;
};

function isChild(birthday,relativeDate){
	var year=birthday.getFullYear(),
		month=birthday.getMonth(),
		day=birthday.getDate(),
		nowDate=relativeDate?new Date(relativeDate):new Date(),
		nowYear=nowDate.getFullYear(),
		nowMonth=nowDate.getMonth(),
		nowDay=nowDate.getDate(),
		initDate=new Date(nowYear,nowMonth,nowDay);
	return (new Date(year+12,month,day)-initDate>0)&&(new Date(year+2,month,day)-initDate<=0);
}

function isAdult(birthday,relativeDate){
	var year=birthday.getFullYear(),
		month=birthday.getMonth(),
		day=birthday.getDate(),
		nowDate=relativeDate?new Date(relativeDate):new Date(),
		nowYear=nowDate.getFullYear(),
		nowMonth=nowDate.getMonth(),
		nowDay=nowDate.getDate(),
		initDate=new Date(nowYear,nowMonth,nowDay);
	return new Date(year+12,month,day)-initDate<=0;
}

var cardTypes={
	0:'身份证',
	1:'护照',
	2:'军官证',
	3:'港澳通行证',
	4:'回乡证',
	99:'其他'
}

var customerTypes={
	1:'在职',
	2:'自由职业',
	3:'学生'
}

var countryOption=[{"value":"CN","text":"中国(包括港澳台)"},{"value":"US","text":"美国"},{"value":"GB","text":"英国"},{"value":"JP","text":"日本"},{"value":"CA","text":"加拿大"},{"value":"FR","text":"法国"},{"value":"DE","text":"德国"},{"value":"KR","text":"韩国"},{"value":"AF","text":"阿富汗"},{"value":"AL","text":"阿尔巴尼亚"},{"value":"DZ","text":"阿尔及利亚"},{"value":"AD","text":"安道尔"},{"value":"AR","text":"阿根廷"},{"value":"AW","text":"阿鲁巴"},{"value":"AU","text":"澳大利亚"},{"value":"AT","text":"奥地利"},{"value":"AZ","text":"阿塞拜疆"},{"value":"AM","text":"亚美尼亚共和国"},{"value":"BS","text":"巴哈马"},{"value":"BH","text":"巴林"},{"value":"BD","text":"孟加拉国"},{"value":"BE","text":"比利时"},{"value":"BZ","text":"伯利兹"},{"value":"BJ","text":"贝宁"},{"value":"BM","text":"百慕达群岛"},{"value":"BO","text":"波黑"},{"value":"BW","text":"博茨瓦纳"},{"value":"BR","text":"巴西"},{"value":"BN","text":"文莱"},{"value":"BG","text":"保加利亚"},{"value":"BF","text":"布基纳法索"},{"value":"BI","text":"布隆迪"},{"value":"BY","text":"白俄罗斯"},{"value":"KH","text":"柬埔寨"},{"value":"CM","text":"喀麦隆"},{"value":"CR","text":"哥斯达黎加"},{"value":"CF","text":"中非共和国"},{"value":"CL","text":"智利"},{"value":"CO","text":"哥伦比亚"},{"value":"CG","text":"刚果"},{"value":"CI","text":"科特迪瓦"},{"value":"CT","text":"克罗地亚"},{"value":"CU","text":"古巴"},{"value":"CY","text":"塞浦路斯"},{"value":"CZ","text":"捷克"},{"value":"DK","text":"丹麦"},{"value":"DJ","text":"吉布提"},{"value":"DO","text":"多米尼加共和国"},{"value":"EC","text":"厄瓜多尔"},{"value":"EG","text":"埃及"},{"value":"SV","text":"萨尔瓦多"},{"value":"ER","text":"厄立特里尔"},{"value":"EE","text":"爱沙尼亚"},{"value":"ET","text":"埃塞俄比亚"},{"value":"FJ","text":"斐济"},{"value":"FI","text":"芬兰"},{"value":"GF","text":"法属圭亚那"},{"value":"GA","text":"加蓬"},{"value":"GE","text":"格鲁吉亚"},{"value":"GH","text":"加纳"},{"value":"GM","text":"冈比亚"},{"value":"GQ","text":"赤道几内亚"},{"value":"GR","text":"希腊"},{"value":"GT","text":"危地马拉"},{"value":"GU","text":"关岛"},{"value":"GN","text":"几内亚"},{"value":"GW","text":"几内亚比绍"},{"value":"HN","text":"洪都拉斯"},{"value":"HU","text":"匈牙利"},{"value":"IS","text":"冰岛"},{"value":"IN","text":"印度"},{"value":"ID","text":"印度尼西亚"},{"value":"IR","text":"伊朗"},{"value":"IQ","text":"伊拉克"},{"value":"IE","text":"爱尔兰"},{"value":"IL","text":"以色列"},{"value":"IT","text":"意大利"},{"value":"JM","text":"牙买加"},{"value":"JO","text":"约旦"},{"value":"KZ","text":"哈萨克"},{"value":"KE","text":"肯尼亚"},{"value":"KI","text":"基里巴斯"},{"value":"KP","text":"朝鲜"},{"value":"KW","text":"科威特"},{"value":"KG","text":"吉尔吉斯坦"},{"value":"LA","text":"老挝"},{"value":"LV","text":"拉脱维亚"},{"value":"LB","text":"黎巴嫩"},{"value":"LS","text":"莱索托"},{"value":"LR","text":"利比里亚"},{"value":"LY","text":"利比亚"},{"value":"LT","text":"立陶宛"},{"value":"LU","text":"卢森堡"},{"value":"MK","text":"马其顿"},{"value":"MG","text":"马达加斯加"},{"value":"MY","text":"马来西亚"},{"value":"MV","text":"马尔代夫"},{"value":"ML","text":"马里"},{"value":"MT","text":"马耳他"},{"value":"MQ","text":"马提尼克岛"},{"value":"MR","text":"毛里塔尼亚"},{"value":"MU","text":"毛里求斯"},{"value":"MX","text":"墨西哥"},{"value":"MW","text":"马拉维"},{"value":"MD","text":"摩尔多瓦"},{"value":"MC","text":"摩纳哥"},{"value":"MN","text":"蒙古"},{"value":"MA","text":"摩洛哥"},{"value":"MM","text":"缅甸"},{"value":"NA","text":"纳米比亚"},{"value":"NP","text":"尼泊尔"},{"value":"NL","text":"荷兰"},{"value":"AN","text":"荷属安的列斯群岛"},{"value":"NZ","text":"新西兰"},{"value":"NI","text":"尼加拉瓜"},{"value":"NE","text":"尼日尔"},{"value":"NG","text":"尼日利亚"},{"value":"NO","text":"挪威"},{"value":"PK","text":"巴基斯坦"},{"value":"PA","text":"巴拿马"},{"value":"PG","text":"巴布亚新几内亚"},{"value":"PY","text":"巴拉圭"},{"value":"AO","text":"安哥拉"},{"value":"MZ","text":"莫桑比克"},{"value":"PE","text":"秘鲁"},{"value":"PH","text":"菲律宾"},{"value":"PL","text":"波兰"},{"value":"PT","text":"葡萄牙"},{"value":"PR","text":"波多黎各"},{"value":"QA","text":"卡塔尔"},{"value":"RO","text":"罗马尼亚"},{"value":"RU","text":"俄罗斯联邦"},{"value":"RW","text":"卢旺达"},{"value":"SA","text":"沙特阿拉伯"},{"value":"SN","text":"塞内加尔"},{"value":"SC","text":"塞舌尔"},{"value":"SL","text":"塞拉利昂"},{"value":"SG","text":"新加坡"},{"value":"CS","text":"斯洛伐克"},{"value":"SI","text":"斯洛文尼亚"},{"value":"SB","text":"所罗门群岛"},{"value":"SO","text":"索马里"},{"value":"ZA","text":"南非"},{"value":"ES","text":"西班牙"},{"value":"LK","text":"斯里兰卡"},{"value":"SD","text":"苏丹"},{"value":"SE","text":"瑞典"},{"value":"CH","text":"瑞士"},{"value":"SY","text":"叙利亚"},{"value":"TZ","text":"坦桑尼亚"},{"value":"TH","text":"泰国"},{"value":"TG","text":"多哥"},{"value":"TO","text":"汤加王国"},{"value":"TN","text":"突尼斯"},{"value":"TR","text":"土耳其"},{"value":"TV","text":"图瓦卢"},{"value":"UG","text":"乌干达"},{"value":"UA","text":"乌克兰"},{"value":"AE","text":"阿联酋"},{"value":"UY","text":"乌拉圭"},{"value":"UZ","text":"乌兹别克"},{"value":"VE","text":"委内瑞拉"},{"value":"VN","text":"越南"},{"value":"YE","text":"也门"},{"value":"YU","text":"南斯拉夫"},{"value":"ZR","text":"扎伊尔"},{"value":"ZM","text":"赞比亚"},{"value":"ZW","text":"津巴布韦"}];

function getCustomerType(type){
	return customerTypes[type];
}

function getCardType(type){
	return cardTypes[type];
}

function isPassport(type) {
	return type==1;
}

function getName(item){
      var nameEn=item.PassengerNameEN,
          name=item.PassengerName,
          pName='';
      if(name)
          pName=name+' ';
      if(nameEn&&nameEn!='/'){
          pName+=nameEn;
      }
      return pName;
}

function message(msg){
	wx.showModal({
	    title: '温馨提示',
	    content: msg,
	    showCancel:false,
	    confirmColor:"#59A5F0"      
	})
}

function confirm(msg,success,fail){
	wx.showModal({
	    title: '温馨提示',
	    content: msg,
	    showCancel:false,
	    confirmColor:"#59A5F0",
	    cancelColor:"#59A5F0",
	    success:success,
	    fail:fail      
	})
}

function verifyName(name){
	let reg=/^[a-zA-Z\.\u4E00-\u9FA5]{2,28}$/;
	return name==undefined||name==''||reg.test(name);
}

function verifyPhone(phone){
	let reg=/^[\d]{11}$/;
	return phone==undefined||phone==''||reg.test(phone);
}

function verifyFirstName(name){
	let reg=/^[a-zA-Z]{2,20}$/;
	return name==undefined||name==''||reg.test(name);
}

function verifyLastName(name){
	let reg=/^[a-zA-Z]{2,20}$/;
	return name==undefined||name==''||reg.test(name);
}

module.exports = {
  buildUrl: buildUrl,
  isChild:isChild,
  isAdult:isAdult,
  getCardType:getCardType,
  getName:getName,
  message:message,
  cardTypes:cardTypes,
  customerTypes:customerTypes,
  getCustomerType:getCustomerType,
  countryOption:countryOption,
  isPassport:isPassport,
  verifyName:verifyName,
  verifyPhone:verifyPhone,
  verifyFirstName:verifyFirstName,
  verifyLastName:verifyLastName,
  confirm:confirm
}
