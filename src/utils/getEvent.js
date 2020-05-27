export default function (type){
    let obj={
        "form":["onFinish"],
        "pagination":["onChange"]
    }
    return obj[type];
}