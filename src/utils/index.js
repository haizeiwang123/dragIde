let nameCode ='鑫正涵琛妍芸露楠薇锦彤采初美冬婧桐莲彩洁'
+'呈菡怡冰雯雪茜优静萱林馨鹤梅娜璐曼彬芳颖韵曦蔚桂月梦琪蕾'
+'依碧枫欣杉丽祥雅欢婷舒心紫芙慧梓香玥菲璟茹昭岚玲云华阳弦'
+'莉明珊雨蓓旭钰柔敏家凡花媛歆沛姿妮珍琬彦倩玉柏橘昕桃栀克'
+'帆俊惠漫芝寒诗春淑凌珠灵可格璇函晨嘉鸿瑶帛琳文洲娅霞颜康'
+'卓星礼远帝裕腾震骏加强运杞良梁逸禧辰佳子栋博年振荣国钊喆'
+'睿泽允邦骞哲皓晖福濡佑然升树祯贤成槐锐芃驰凯韦信宇鹏盛晓'
+'翰海休浩诚辞轩奇潍烁勇铭平瑞仕谛翱伟安延锋寅起谷稷胤涛弘'
+'侠峰材爵楷尧炳乘蔓桀恒桓日坤龙锟天郁吉暄澄中斌杰祜权畅德';
function getName(){
  let length = [3,4,5][parseInt(Math.random()*Math.random()*3)]
    let nameStr ='';
    while(length--){
        nameStr+=(nameCode[parseInt(Math.random()*nameCode.length)])
    }
    return nameStr;
}
let deounce=(func,time)=>{
  let timmer=null;
  return function(...args){
      if(timmer){
          clearTimeout(timmer);
      }
      timmer=setTimeout(()=>{
        func.apply(this,args);
      },time)
  }
}
let getDownObj=(arr,keyArr,key,value)=>{
    if(keyArr.length===1){
      console.log(arr,keyArr,key,value)
      if(key){
        return arr[keyArr[0]]
      }else{
        return arr.splice(keyArr[0],1)[0];
      }
      
    }
    return getDownObj(arr[keyArr[0]].children,keyArr.slice(1),key,value)
}
let inserObj=(arr,keyArr,obj,position)=>{
    if(keyArr.length===1&&position==="select"){
      return  arr[keyArr[0]].children.push(obj);
    }
    if(keyArr.length===2&&position!=="select"){
      if(position==="beforeSelect"){
        let arrDelete=arr[keyArr[0]].children.splice(parseInt(keyArr[1]),1);
        console.log(arrDelete,"arrDelete")
        return arr[keyArr[0]].children.splice(parseInt(keyArr[1]),0,obj,arrDelete[0]);
      }else{
        return arr[keyArr[0]].children.splice(parseInt(keyArr[1])+1,0,obj);
        
      }
    }
    return inserObj(arr[keyArr[0]].children,keyArr.slice(1),obj,position)
  }

  const getOffsetTop=(node)=>{
    if((!node)||node===window.document) {
      return 0
    }
    return node.offsetTop+ getOffsetTop(node.offsetParent)
  }
  const getOffsetLeft=(node)=>{
    if((!node)||node===window.document) {
      return 0
    }
    return node.offsetLeft+ getOffsetTop(node.offsetParent)
  }

  function deepCopy (obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    const hit = cache.filter(c => c.original === obj)[0]
    if (hit) {
      return hit.copy
    }
    const copy = Array.isArray(obj) ?  [] :   {}
    // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
    cache.push({
      original: obj,
      copy
    })
    Object.keys(obj).forEach(key => {
      copy[key] = deepCopy(obj[key], cache)
    })
    return copy
  }
  let replaceObj=(arr,keyArr,obj)=>{
    if(keyArr.length===1){
      return arr[keyArr[0]]=obj;
    }
    return replaceObj(arr[keyArr[0]].children,keyArr.slice(1),obj)
}
const getQueryParam=(variable)=>{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
const iconArr={
  "page":"icon-page",
  "div":"icon-ceng",
  "text":"icon-font",
  "img":"icon-pic",
  "select":"icon-font",
  "input":"icon-font",
  "button":"icon-font"
}
export default {
    getName:getName,//获取每个组件的名称
    deounce:deounce,//防抖函数
    getDownObj:getDownObj,//找到schema里面的key的组件
    inserObj,//往schema组件的固定key位置里面，插入一个组件
    getOffsetTop,//根据当前节点，找到距离顶部的位置
    getOffsetLeft,
    deepCopy,
    replaceObj,iconArr,
    getQueryParam
}