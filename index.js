var classifyPoint = require("robust-point-in-polygon");
var onn = [
    {
        x:0,
        y:0
    },
    {
        x:0,
        y:200
    },
    {
        x:300,
        y:200
    },
    {
        x:300,
        y:0
    },
    {
        x:200,
        y:0
    },
    {
        x:200,
        y:100
    },
    {
        x:100,
        y:100
    },
    {
        x:100,
        y:0
    },
]
var getPoint = function(line1,line2){
    if(((line2.p1.y>=line1.p1.y || line2.p1.y>=line1.p2.y) && (line2.p2.y<=line1.p1.y || line2.p2.y<=line1.p2.y)) || ((line2.p1.y<=line1.p1.y || line2.p1.y<=line1.p2.y) && (line2.p2.y>=line1.p1.y || line2.p2.y>=line1.p2.y))){
        return {x:line2.p1.x,y:line1.p1.y};
    }
};
var getScaleRectangle = function(arr,distance){
    let testArr = [];
    let p1 = {
        x:arr[0].x + distance,
        y:arr[0].y + distance
    };
    let p2 = {
        x:arr[1].x + distance,
        y:arr[1].y - distance
    };
    let p3 = {
        x:arr[2].x - distance,
        y:arr[2].y + distance
    };
    let p4 = {
        x:arr[3].x - distance,
        y:arr[3].y - distance
    };
    testArr.push(p1,p2,p3,p4);
    return testArr;
}
var getRestoreRectangle = function(arr,distance){
    let testArr = [];
    let p1 = {
        x:arr[0].x - distance,
        y:arr[0].y - distance
    };
    let p2 = {
        x:arr[1].x - distance,
        y:arr[1].y + distance
    };
    let p3 = {
        x:arr[2].x + distance,
        y:arr[2].y - distance
    };
    let p4 = {
        x:arr[3].x + distance,
        y:arr[3].y + distance
    };
    testArr.push(p1,p2,p4,p3);
    return testArr;
}
var getRoate = function (p1, p2) {
    let offsetX = (p2.x - p1.x);
    let offsetY = (p2.y - p1.y);
    let k = offsetY / offsetX;  //斜率
    // console.log(offsetX, offsetY, k);
    let t = Math.atan(k) * 180 / Math.PI;//斜率对应的角度
  
    //修正象限
    (offsetX >= 0 && offsetY >= 0) && (t = t); //0-90°
    (offsetX < 0 && offsetY >= 0) && (t = 180 + t); //90-180°
    (offsetX < 0 && offsetY < 0) && (t = 180 + t); //180-270°
    (offsetX >= 0 && offsetY < 0) && (t = 360 + t); //270-0°
    t = Math.trunc(t * 10) / 10;
    return t;
}
var rotateThisRec = function(floor){
    let horizontalArr = [],verticalArr = [];
    floor.map((item,index,arr)=>{
        if(index<arr.length - 1){
            if(getRoate(item,arr[index+1])%180 == 0){
                horizontalArr.push({
                    p:item,
                    wall:{
                        p1:{
                            x:item.x,
                            y:item.y
                        },
                        p2:{
                            x:arr[index+1].x,
                            y:arr[index+1].y,
                        }
                    }
                });
            }else if(getRoate(item,arr[index+1])%180 == 90){
                verticalArr.push({
                    p:item,
                    wall:{
                        p1:{
                            x:item.x,
                            y:item.y
                        },
                        p2:{
                            x:arr[index+1].x,
                            y:arr[index+1].y,
                        }
                    }
                });
            }else{
                horizontalArr = [];
                verticalArr = [];
                return;
            }
        }else{
            if(getRoate(item,arr[0])%180 == 0){
                horizontalArr.push({
                    p:item,
                    wall:{
                        p1:{
                            x:item.x,
                            y:item.y
                        },
                        p2:{
                            x:arr[0].x,
                            y:arr[0].y,
                        }
                    }
                });
            }else if(getRoate(item,arr[0])%180 == 90){
                verticalArr.push({
                    p:item,
                    wall:{
                        p1:{
                            x:item.x,
                            y:item.y
                        },
                        p2:{
                            x:arr[0].x,
                            y:arr[0].y,
                        }
                    }
                });
            }else{
                horizontalArr = [];
                verticalArr = [];
                return;
            }
        }
    });
    //水平方向点排序
    horizontalArr.sort(function(a,b){
        return a.p.y - b.p.y;
    });
    let zongArr = [];
    horizontalArr.map(function(item1){
        let obj = [];
        verticalArr.map(function(item2){
            let point = getPoint(item1.wall,item2.wall);
            if(point){
                obj.push(point);
            }
        });
        
        obj.sort(function(a,b){
            return a.x - b.x;
        });
        zongArr.push(obj);
    });
    let c = 0;
    let sibianxing = [];
    let obj = [];
    zongArr.map((item,index,arr)=>{
        item.map(( item1,index1,arr1)=>{
            if(c == 0){
                obj = [];
                if(index1 == arr1.length - 1){
                    return;
                }
            }
            if(index<arr.length -1){
                
                arr[index + 1].filter((item2,index2,arr2)=>{
                    if(Math.abs(item2.x - item1.x)<2 && item2.y - item1.y>10){
                        if(c == 1){
                            obj.push(item1,item2);
                            sibianxing.push(obj);
                            c = 0;
                        }else{
                            c = 1;
                            obj.push(item1,item2);
                            if(index1<arr1.length -1){
                                arr2.filter((item3,index3,arr3)=>{
                                    if(Math.abs(item3.x - arr1[index1 + 1].x)<2 && item3.y - arr1[index1 + 1].y>50){
                                        obj.push(arr1[index1 + 1],item3);
                                        sibianxing.push(obj);
                                        c = 0;
                                    }
                                })
                            }
                        }
                    }
                })
            }
        });
    });
    let testRec = [];
    let scaleArr = [];
    sibianxing.map((item)=>{
        testRec.push(getScaleRectangle(item,5))
    });
    // console.log(sibianxing);
    let areaArr = [];
    let arrTest = floor.map((item,index)=>{
        areaArr.push([item.x,item.y]);
    });
    testRec.map((item,index)=>{
        // return (classifyPoint(arr,[item.x,item.y]) !=1);
        let boolean = true;
        item.map((item1,index1)=>{
           if(classifyPoint(areaArr,[item1.x,item1.y]) == 1){
                boolean = false;
           }
        });
        if(boolean){
            scaleArr.push(item);
        }
    });
    let zongRec = [];
    scaleArr.map((item)=>{
        zongRec.push(getRestoreRectangle(item,5));
    })
    return zongRec;
}
module.exports = rotateThisRec;

