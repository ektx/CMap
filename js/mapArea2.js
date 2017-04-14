$.fn.mapCharts=function(options){
    var defaults={
        mapChartsBorder:"#408cff",
        mapChartsBorderWidth:5,
        starColor:"#ffff00",
        data:[],
        moduleBorder:"rgba(28,62,109,0.5)",
        moduleBackground:"#0b152e",
        moduleBackgroundHover:"#1076a6",
        pointerColor:"#00ff00",
        nameColor:"#aec5fe",
        nameFont:"12px Microsoft Yahei",
        standard:[5,10]
    };
    var options = $.extend(defaults,options);
    var ctx=$(this).get(0).getContext("2d");
    var tipsImg;
    var mapPainting=function(){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth=options.mapChartsBorderWidth;
        ctx.shadowColor=options.mapChartsBorder;
        ctx.strokeStyle=options.mapChartsBorder;
        var lines=[25,121,29,118,30,107,33,102,29,101,24,99,20,99,13,92,9,87,6,80,6,75,8,69,11,65,16,61,21,56,19,51,16,48,10,45,6,43,6,36,7,30,8,25,13,21,17,21,22,24,26,28,27,31,34,34,44,35,66,22,76,11,107,10,112,6,114,6,118,8,119,10,123,11,124,15,128,21,131,25,134,27,135,33,132,38,126,43,130,44,135,46,141,47,144,53,145,59,147,63,147,67,144,74,146,79,151,82,156,85,157,89,167,89,171,91,175,96,180,96,187,96,191,96,197,95,200,98,201,103,199,107,203,108,209,107,212,110,216,110,219,112,220,125,226,125,230,124,234,124,237,125,237,129,237,133,240,134,242,136,245,136,247,130,249,124,253,121,262,119,272,118,279,116,291,115,297,113,303,112,307,116,306,144,307,146,312,147,317,147,320,151,338,151,346,149,352,146,360,145,367,143,372,140,374,137,377,139,382,140,401,138,414,137,423,135,433,133,442,130,449,128,453,129,454,133,458,142,460,143,464,142,468,141,467,134,465,129,467,125,475,124,486,123,505,123,516,122,563,121,596,123,603,123,623,162,631,164,639,165,645,166,650,165,648,171,641,180,645,195,643,198,642,226,646,227,647,219,651,216,655,218,658,218,663,217,667,217,671,214,676,212,679,213,678,220,677,225,679,227,684,232,690,233,691,238,688,246,685,253,696,254,701,260,706,264,703,267,697,269,691,269,688,269,685,273,680,277,678,281,682,285,685,286,683,291,682,296,677,299,673,302,667,303,667,316,661,316,657,314,642,318,634,319,626,319,615,317,606,314,597,309,591,306,574,306,562,318,548,319,533,309,519,315,508,316,504,303,499,299,491,297,480,301,468,301,464,304,457,303,451,305,445,304,439,304,416,306,404,316,406,322,410,333,406,335,401,334,393,346,389,345,386,335,389,327,391,323,384,322,379,327,372,326,365,329,354,327,345,326,343,323,333,325,328,323,328,318,331,305,316,291,310,288,307,287,291,279,285,283,285,290,280,293,275,293,272,291,267,293,262,293,258,294,250,291,246,300,241,303,232,303,227,304,224,309,219,308,218,300,214,297,208,298,204,296,205,291,201,289,177,280,171,273,169,268,162,265,158,260,154,261,150,264,134,264,133,270,129,275,125,272,122,268,114,269,110,273,106,275,103,272,100,268,99,262,98,256,98,251,90,247,84,249,80,247,77,242,73,239,71,237,73,233,74,228,74,222,58,209,58,203,54,198,49,197,44,198,42,193,42,187,45,180,44,175,38,168,34,163,34,157,36,151,35,147,30,145,23,141,21,134,16,132,17,126,17,122,23,121,27,120];
        for (var i = 0; i < lines.length; i+=2) {
            if (i==0) {
                ctx.moveTo(lines[i],lines[i+1]);
            }else{
                ctx.lineTo(lines[i],lines[i+1]);
            }
        }
        ctx.closePath();ctx.stroke();ctx.restore();
    }
    var starPainting=function(){
        ctx.save();
        ctx.strokeStyle=options.starColor;
        ctx.fillStyle=options.starColor;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(165,140);ctx.lineTo(169,149);ctx.lineTo(177,151);ctx.lineTo(171,157);ctx.lineTo(172,166);ctx.lineTo(165,161);ctx.lineTo(157,166);ctx.lineTo(159,158);ctx.lineTo(153,151);ctx.lineTo(160,149);ctx.lineTo(165,140);
        ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
    }
    var addArray=new Array();
    var lines=[
        [25,121,29,118,30,107,33,102,29,101,24,99,20,99,13,92,9,87,6,80,6,75,8,69,11,65,16,61,21,56,19,51,16,48,10,45,6,43,6,36,7,30,8,25,13,21,17,21,22,24,26,28,27,31,34,34,44,35,66,22,76,11,107,10,112,6,114,6,118,8,119,10,123,11,124,15,128,21,131,25,134,27,135,33,132,38,126,43,130,44,135,46,141,47,144,53,145,59,147,63,147,67,133,74,122,79,119,84,119,89,113,90,113,100,114,105,108,105,106,110,102,114,107,117,116,118,121,122,123,127,123,133,123,137,114,147,110,148,105,148,102,148,101,153,98,155,94,155,86,150,82,144,79,139,70,139,64,135,60,138,56,139,54,136,50,135,46,131,42,127,36,126,35,123,30,124,25,124,24,122],
        [147,67,144,74,146,79,151,82,156,85,157,89,167,89,171,91,175,96,180,96,187,96,191,96,197,95,200,98,201,103,199,107,203,108,209,107,212,110,216,110,219,112,219,125,220,126,210,132,202,133,201,129,201,124,192,121,184,119,178,119,167,119,163,123,161,126,156,126,154,131,154,136,151,141,148,146,148,149,148,154,147,154,141,153,140,148,137,145,131,146,127,147,124,152,123,157,116,157,116,151,114,147,123,137,123,133,123,127,121,122,116,118,107,117,102,114,106,110,108,105,114,105,113,100,113,90,119,89,119,84,122,79,133,74,147,67],
        [90,247,84,249,80,247,77,242,73,239,71,237,73,233,74,228,74,222,58,209,58,203,54,198,49,197,44,198,42,193,42,187,45,180,44,175,38,168,34,163,34,157,36,151,35,144,30,145,23,141,21,134,16,132,17,126,17,122,23,121,27,120,24,122,25,124,30,124,35,123,36,126,42,127,46,131,50,135,54,136,56,139,60,138,64,135,70,139,79,139,82,144,86,150,94,155,98,155,101,153,102,148,105,148,110,148,114,147,116,151,116,157,123,157,124,152,127,147,131,146,137,145,140,148,141,153,147,154,150,163,151,167,154,170,160,172,161,172,156,177,155,182,151,189,134,192,124,193,120,196,117,201,115,206,116,209,113,212,112,215,107,214,104,216,105,219,106,223,107,229,105,235,98,239,93,242,91,247],
        [220,126,210,132,202,133,201,129,201,124,192,121,184,119,178,119,167,119,163,123,161,126,156,126,154,131,154,136,151,141,148,146,148,149,148,154,147,154,150,163,151,167,154,170,160,172,166,172,170,173,175,175,179,174,183,172,187,167,193,169,197,171,202,171,205,170,211,170,215,168,221,163,224,159,224,155,221,151,218,147,224,146,231,146,237,145,239,144,242,142,244,140,243,136,245,136,242,136,240,134,237,133,237,129,237,125,234,124,230,124,226,125,220,125],
        [160,172,166,172,170,173,175,175,179,174,183,172,187,167,193,169,197,171,202,171,205,170,211,170,215,168,221,163,224,159,224,155,221,151,218,147,224,146,231,146,237,145,239,144,242,142,244,140,243,136,245,136,247,130,249,124,253,121,262,119,272,118,279,116,291,115,297,113,303,112,307,116,306,144,307,146,312,147,317,147,319,151,322,151,310,153,308,157,307,162,307,163,304,170,302,172,299,177,296,187,291,193,288,199,285,201,272,195,270,200,268,204,260,201,253,202,252,202,251,200,247,197,242,197,236,195,230,194,226,202,220,201,212,200,206,199,203,197,200,198,196,199,192,197,188,196,182,194,176,196,173,196,171,193,166,195,162,196,158,194,152,189,151,189,155,182,156,177,161,172],
        [214,297,208,298,204,296,205,291,201,289,177,280,171,273,169,268,162,265,158,260,154,261,150,264,134,264,133,270,129,275,125,272,122,268,114,269,110,273,106,275,103,272,100,268,99,262,98,256,98,251,90,248,91,247,93,242,98,239,105,235,107,229,106,223,105,219,104,216,107,214,112,215,113,212,116,209,115,206,117,201,120,196,124,193,134,192,151,189,152,189,158,194,162,196,166,195,171,193,173,196,176,196,182,194,188,196,192,197,196,199,200,198,203,197,206,199,212,200,220,201,226,202,230,194,236,195,242,197,247,197,251,200,252,202,249,208,247,212,247,217,246,218,246,219,240,226,233,233,230,239,231,243,235,246,240,248,238,252,232,257,212,273,211,276,214,282,215,286,215,293,214,297],
        [307,163,304,170,302,172,299,177,296,187,291,193,288,199,285,201,272,195,270,200,268,204,260,201,253,202,252,202,249,208,247,212,247,217,246,218,247,220,255,219,275,211,293,241,296,249,295,253,298,257,299,263,303,266,302,270,302,274,308,274,315,274,318,276,323,281,326,280,329,277,324,276,325,273,332,274,336,273,337,268,338,264,349,258,351,255,355,255,360,256,363,254,363,249,361,243,360,242,357,237,352,231,350,226,349,222,339,221,335,209,333,201,330,199,330,191,332,189,329,186,327,183,325,177,319,176,316,174,315,168,312,169,311,164,307,163],
        [323,281,318,276,315,274,308,274,302,274,302,270,303,266,299,263,298,257,295,253,296,249,293,241,275,211,255,219,247,220,246,219,240,226,233,233,230,239,231,243,235,246,240,248,238,252,232,257,212,273,211,276,214,282,215,286,215,293,214,297,218,300,219,308,224,309,227,304,232,303,241,303,246,300,250,291,258,294,262,293,267,293,272,291,275,293,280,293,285,290,285,283,291,279,307,287,310,288,316,291,317,291,320,285,324,281],
        [320,151,338,151,346,149,352,146,360,145,367,143,372,140,374,137,377,139,382,140,401,138,414,137,423,135,433,133,442,130,449,128,453,129,454,133,458,142,460,143,464,142,468,141,467,134,465,129,467,125,475,124,486,123,505,123,516,122,563,121,596,123,603,123,623,162,631,164,639,165,645,166,650,165,648,171,641,180,645,195,643,198,642,226,590,224,573,233,571,232,562,224,529,228,525,224,517,224,510,214,506,212,491,216,484,203,468,203,463,204,464,210,462,213,440,216,414,223,411,227,406,227,391,232,383,233,376,234,378,236,361,242,360,242,357,237,352,231,350,226,349,222,339,221,335,209,333,201,330,199,330,191,332,189,329,186,327,183,325,177,319,176,316,174,315,168,312,169,311,164,307,163,307,162,308,157,310,153,322,151],
        [646,227,647,219,651,216,655,218,658,218,663,217,667,217,671,214,676,212,679,213,678,220,677,225,679,227,684,232,690,233,691,238,688,246,685,253,696,254,701,260,706,264,703,267,697,269,691,269,688,269,685,273,680,277,678,281,682,285,685,286,683,291,682,296,677,299,673,302,667,303,667,316,661,316,657,314,642,318,634,319,626,319,615,317,606,314,597,309,591,306,574,306,562,318,548,319,533,309,519,315,508,316,504,303,499,299,491,297,480,301,468,301,464,304,457,303,451,305,445,304,439,304,416,306,404,316,406,322,410,333,406,335,401,334,393,346,389,345,386,335,389,327,391,323,384,322,379,327,372,326,365,329,354,327,345,326,343,323,333,325,328,323,328,318,331,305,316,291,317,291,320,285,324,281,323,280,326,279,329,276,324,275,325,272,332,273,336,272,337,267,338,263,349,257,351,254,355,254,360,255,363,253,363,248,361,242,361,243,378,237,376,235,383,234,391,233,406,228,411,228,414,224,440,217,462,214,464,211,463,205,468,204,484,204,491,217,506,213,510,215,517,225,525,225,529,229,562,225,571,233,573,234,590,225,642,227]
    ];//定义地图内部区域线条路径
    var txt=options.data;//定义地图乡镇街道名称
    var modulePainting=function(){
        var inde=new Array();
        var dialogIndex=-1;
        for (var i = 0; i < lines.length; i++) {
            //开始划线
            ctx.save();
            ctx.globalCompositeOperation="destination-over";
            ctx.beginPath();
            ctx.lineWidth=3;
            ctx.shadowBlur=0;
            ctx.strokeStyle=options.moduleBorder;
            for (var j = 0; j <lines[i].length; j+=2) {
                if (j==0) {
                    ctx.moveTo(lines[i][j],lines[i][j+1]);
                }
                else{
                    ctx.lineTo(lines[i][j],lines[i][j+1]);
                }
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle=options.moduleBackground;
            if(ctx.isPointInPath(currentX,currentY)){
                ctx.fillStyle=options.moduleBackgroundHover;
            }
            ctx.fill();
            ctx.restore();
            //结束划线
            //鼠标移上去确定弹框位置
            if(ctx.isPointInPath(currentX,currentY)){
                dialogIndex=i;
            }
            //确定弹框位置结束
            //各区块内部添加亮点
            var getArea=function(x,y,color){
                do{
                    x=parseInt(x-100+200*Math.random());
                    y=parseInt(y-100+200*Math.random());
                }
                while (!ctx.isPointInPath(x,y))
                return [x,y,color];
            }
            var total=0;
            for (var p = 0; p < lines.length; p++) {
                total+=(parseInt(txt[p][2]));
            }           
            if (addArray.length<total) {
                for (var k = 0; k < txt[i][2]; k++) {
                    addArray.push(getArea(txt[i][1][0],txt[i][1][1],options.pointerColor));
                }
            }
            //各区块内部添加亮点结束
            //划线
            if(txt[i][6]||txt[i][7]){
                reportRoad(txt[i][1][0]+25,txt[i][1][1]-5,txt[i][6],txt[i][7]);
            }
            //结束划线
        }
        //添加圆点
        addPointer(addArray);
        //添加圆点结束
        for (var i = 0; i < txt.length; i++) {
            //开始添加名字
            ctx.save();
            ctx.lineWidth=0.5;
            ctx.strokeStyle=options.nameColor;
            ctx.font=options.nameFont;
            ctx.globalCompositeOperation="source-over";
            ctx.strokeText(txt[i][0],txt[i][1][0],txt[i][1][1]);
            ctx.restore();
            //结束添加名字
            //是否督办提示
            if(txt[i][5]!=0){
                if (txt[i][5]<=options.standard[0]) {
                    tipsImg=$("#tips1").get(0);
                }else if (txt[i][5]>options.standard[0]&&txt[i][5]<=options.standard[1]) {
                    tipsImg=$("#tips2").get(0);
                }else{
                    tipsImg=$("#tips3").get(0);
                }
                tips(txt[i][1][0],txt[i][1][1]);
            }
            //结束是否督办提示
        }
        //绘制星图标
        starPainting();
        //绘制星图标结束
        //绘制弹框
        if (dialogIndex!=-1) {
            dialogPaint(txt[dialogIndex][1][0]+20,txt[dialogIndex][1][1]-20,txt[dialogIndex][0],txt[dialogIndex][3],txt[dialogIndex][4],txt[dialogIndex][5]);
        }
        //绘制弹框结束
    }
    //地图鼠标移上去的事件
    var currentX,currentY;
    $(this).on("mousemove",function(event){
        currentX=event.offsetX;
        currentY=event.offsetY;
    })
    var dialogPaint=function(x,y,name,add,over,supervise){
        var dialogPath=[
                [-29,85,85,5,0,-5,-29,-29],
                [-136,-136,-10,-10,0,-10,-10,-136],
                [-19,-19,-19,-19],
                [-112,-83,-54,-25]
            ];
        if (y<136) {
            dialogPath[1]=[166,166,40,40,30,40,40,166];
            dialogPath[3]=[64,93,122,151];
        }
        if(x>500){
            dialogPath[0]=[-89,25,25,5,0,-5,-89,-89];
            dialogPath[2]=[-79,-79,-79,-79];
        }
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation="source-over";
        ctx.strokeStyle="#41b2ce";
        ctx.fillStyle="rgba(10,10,10,0.8)";
        ctx.lineWidth=2;
        ctx.lineJoin="round";
        ctx.moveTo(x+dialogPath[0][0],y+dialogPath[1][0]);
        ctx.lineTo(x+dialogPath[0][1],y+dialogPath[1][1]);
        ctx.lineTo(x+dialogPath[0][2],y+dialogPath[1][2]);
        ctx.lineTo(x+dialogPath[0][3],y+dialogPath[1][3]);
        ctx.lineTo(x+dialogPath[0][4],y+dialogPath[1][4]);
        ctx.lineTo(x+dialogPath[0][5],y+dialogPath[1][5]);
        ctx.lineTo(x+dialogPath[0][6],y+dialogPath[1][6]);
        ctx.lineTo(x+dialogPath[0][7],y+dialogPath[1][7]);
        ctx.stroke();
        ctx.fill();
        ctx.lineWidth=1;
        ctx.strokeStyle="#408cff";
        ctx.font="16px Microsoft Yahei";
        ctx.strokeText(name + " 今日",x+dialogPath[2][0],y+dialogPath[3][0]);
        ctx.font="14px Microsoft Yahei";
        ctx.strokeStyle="#47e957";
        ctx.strokeText("新增：" + add ,x+dialogPath[2][1],y+dialogPath[3][1]);
        ctx.strokeStyle="#23b3d2";
        ctx.strokeText("结案：" + over ,x+dialogPath[2][2],y+dialogPath[3][2]);
        ctx.strokeStyle="#d13738";
        ctx.strokeText("督办：" + supervise ,x+dialogPath[2][3],y+dialogPath[3][3]);
        ctx.restore();
    }
    //添加亮点的事件
    var pointArcR=4;
    var pointArcR2=7.3;
    var pointArcR3=10.6;
    var addPointer=function(pointer){
        ctx.save();
        ctx.globalCompositeOperation="lingter";
        for (var i = 0; i < pointer.length; i++) { 
            ctx.save();
            ctx.beginPath();               
            var grd=ctx.createRadialGradient(pointer[i][0],pointer[i][1],2,pointer[i][0],pointer[i][1],6);
            grd.addColorStop(0,pointer[i][2]);
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            ctx.arc(pointer[i][0],pointer[i][1],4,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle=pointer[i][2];
            ctx.globalAlpha=1.4-pointArcR*0.1;
            ctx.lineWidth=0.5;
            ctx.arc(pointer[i][0],pointer[i][1],pointArcR,0,2*Math.PI,false);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle=pointer[i][2];
            ctx.globalAlpha=1.4-pointArcR2*0.1;
            ctx.lineWidth=0.5;
            ctx.arc(pointer[i][0],pointer[i][1],pointArcR2,0,2*Math.PI,false);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle=pointer[i][2];
            ctx.globalAlpha=1.4-pointArcR3*0.1;
            ctx.lineWidth=0.5;
            ctx.arc(pointer[i][0],pointer[i][1],pointArcR3,0,2*Math.PI,false);
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }
    //设置上报事件关联路径动画
    var interval=1;
    var interval2=500;
    var reportRoad=function(x,y,report,issued){ 
        var roadlef=x,roadtop=y;
        var averageX=(166-x)/500;
        var averageY=(155-y)/500;
        var averX=averageX/(Math.sqrt(averageX*averageX + averageY*averageY));  
        var averY=averageY/(Math.sqrt(averageX*averageX + averageY*averageY)); 
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle="#6bc0c6";
        ctx.lineCap="round";
        ctx.globalAlpha=0.3;
        ctx.moveTo(roadlef,roadtop);
        ctx.lineTo(166,155);
        ctx.stroke();
        ctx.restore();
        // ctx.save(); 
        // ctx.beginPath();
        // ctx.lineWidth=2;
        // ctx.strokeStyle="#fff";
        // ctx.lineCap="round";
        // ctx.globalAlpha=0.5;
        // ctx.moveTo(roadlef,roadtop);
        // for (var i = 0; i < interval; i++) { 
        //     if(interval%3==0){
        //         ctx.lineTo(roadlef + averageX * i,roadtop + averageY * i);
        //     }
        // }
        // ctx.stroke();
        // ctx.restore();
        /*if (report && issued) {
            if(interval < 300){
                interval++;
                ctx.save(); 
                ctx.lineCap="round";
                ctx.shadowBlur=50;
                ctx.lineWidth=8;
                ctx.shadowColor="#ffff00";
                ctx.beginPath();
                var grd=ctx.createLinearGradient(roadlef + averageX * interval - 35*averageX/Math.abs(averageX),roadtop + averageY * interval - 35*averageY/averageX*averageX/Math.abs(averageX),roadlef + averageX * interval,roadtop + averageY * interval);
                grd.addColorStop(0,"transparent");
                grd.addColorStop(1,"#ffff00");
                ctx.strokeStyle=grd;
                ctx.moveTo(roadlef + averageX * interval - 35*averageX/Math.abs(averageX),roadtop + averageY * interval - 35*averageY/averageX*averageX/Math.abs(averageX));
                ctx.lineTo(roadlef + averageX * interval,roadtop + averageY * interval);
                ctx.stroke();
                ctx.restore();
            }else{
                if(interval2 > 1){
                    interval2--;
                    ctx.save(); 
                    ctx.lineCap="round";
                    ctx.shadowBlur=50;
                    ctx.lineWidth=8;
                    ctx.shadowColor="#ffff00";
                    ctx.beginPath();
                    var grd2=ctx.createLinearGradient(roadlef + averageX * interval2 + 35*averageX/Math.abs(averageX),roadtop + averageY * interval2 + 35*averageY/averageX*averageX/Math.abs(averageX),roadlef + averageX * interval2,roadtop + averageY * interval2);
                    grd2.addColorStop(0,"transparent");
                    grd2.addColorStop(1,"#ffff00");
                    ctx.strokeStyle=grd2;
                    ctx.moveTo(roadlef + averageX * interval2 + 35*averageX/Math.abs(averageX),roadtop + averageY * interval2 + 35*averageY/averageX*averageX/Math.abs(averageX));
                    ctx.lineTo(roadlef + averageX * interval2,roadtop + averageY * interval2);
                    ctx.stroke();
                    ctx.restore();
                }else{
                    interval=1;
                    interval2=300;
                }
            }
        }
        else if(report && !issued){
            if(interval < 300){
                interval++;
                ctx.save(); 
                ctx.lineCap="round";
                ctx.shadowBlur=50;
                ctx.lineWidth=8;
                ctx.shadowColor="#ffff00";
                ctx.beginPath();
                var grd=ctx.createLinearGradient(roadlef + averageX * interval - 35*averageX/Math.abs(averageX),roadtop + averageY * interval - 35*averageY/averageX*averageX/Math.abs(averageX),roadlef + averageX * interval,roadtop + averageY * interval);
                grd.addColorStop(0,"transparent");
                grd.addColorStop(1,"#ffff00");
                ctx.strokeStyle=grd;
                ctx.moveTo(roadlef + averageX * interval - 35*averageX/Math.abs(averageX),roadtop + averageY * interval - 35*averageY/averageX*averageX/Math.abs(averageX));
                ctx.lineTo(roadlef + averageX * interval,roadtop + averageY * interval);
                ctx.stroke();
                ctx.restore();
            }
            else{
                interval=1;
            }
        }
        else if(!report && issued){
            if(interval2 > 1){
                interval2--;
                ctx.save(); 
                ctx.lineCap="round";
                ctx.shadowBlur=50;
                ctx.lineWidth=8;
                ctx.shadowColor="#ffff00";
                ctx.beginPath();
                var grd2=ctx.createLinearGradient(roadlef + averageX * interval2 + 35*averageX/Math.abs(averageX),roadtop + averageY * interval2 + 35*averageY/averageX*averageX/Math.abs(averageX),roadlef + averageX * interval2,roadtop + averageY * interval2);
                grd2.addColorStop(0,"transparent");
                grd2.addColorStop(1,"#ffff00");
                ctx.strokeStyle=grd2;
                ctx.moveTo(roadlef + averageX * interval2 + 35*averageX/Math.abs(averageX),roadtop + averageY * interval2 + 35*averageY/averageX*averageX/Math.abs(averageX));
                ctx.lineTo(roadlef + averageX * interval2,roadtop + averageY * interval2);
                ctx.stroke();
                ctx.restore();
            }
            else{
                interval2=300;
            }
        }*/
        if (report) {
            interval++;
            if(interval < 500){
                ctx.save(); 
                ctx.lineCap="round";
                ctx.shadowBlur=50;
                ctx.lineWidth=8;
                ctx.shadowColor="#ffff00";
                ctx.beginPath();
                var grd=ctx.createLinearGradient(roadlef + averageX * interval - 35*averX,roadtop + averageY * interval - 35*averY,roadlef + averageX * interval,roadtop + averageY * interval);
                grd.addColorStop(0,"transparent");
                grd.addColorStop(1,"#ffff00");
                ctx.strokeStyle=grd;
                ctx.moveTo(roadlef + averageX * interval - 35*averX,roadtop + averageY * interval - 35*averY);
                ctx.lineTo(roadlef + averageX * interval,roadtop + averageY * interval);
                ctx.stroke();
                ctx.restore();
            }
            else{
                interval=1;
            }
        }
        if (issued) {
            interval2--;
            if(interval2 > 1){
                ctx.save(); 
                ctx.lineCap="round";
                ctx.shadowBlur=50;
                ctx.lineWidth=8;
                ctx.shadowColor="#ffff00";
                ctx.beginPath();
                var grd2=ctx.createLinearGradient(roadlef + averageX * interval2 + 35*averX,roadtop + averageY * interval2 + 35*averY,roadlef + averageX * interval2,roadtop + averageY * interval2);
                grd2.addColorStop(0,"transparent");
                grd2.addColorStop(1,"#ffff00");
                ctx.strokeStyle=grd2;
                ctx.moveTo(roadlef + averageX * interval2 + 35*averX,roadtop + averageY * interval2 + 35*averY);
                ctx.lineTo(roadlef + averageX * interval2,roadtop + averageY * interval2);
                ctx.stroke();
                ctx.restore();
            }
            else{
                interval2=500;
            }
        }
    }
    //绘制督办提示图标
    var tips=function(x,y){
        ctx.save(); 
        ctx.globalCompositeOperation="source-over";
        ctx.drawImage(tipsImg,x+10,y-31,21,21);
        ctx.restore();
    }
    //重绘
    var repaint=function(){
        var repaintInter=setInterval(function(){
            pointArcR+=0.1;
            pointArcR2+=0.1;
            pointArcR3+=0.1;
            if(pointArcR>=14){pointArcR=4;}
            if(pointArcR2>=14){pointArcR2=4;}
            if(pointArcR3>=14){pointArcR3=4;}
            ctx.clearRect(0,0,712,352);
            mapPainting();
            modulePainting();
        },10);
    }
    //初始化方法
    var init=function(){
        mapPainting();
        modulePainting();
        repaint();
    }
    init();
}
$.fn.hotMap=function(options){
    var defaults={
        data:[],
        standard:[],
        mapChartsBorder:"rgba(28,62,109,0.5)",
        mapChartsBorderWidth:3,
        color:["#F1DC9D","#ECBA85","#E2A784","#CB615E"]
    };
    var options = $.extend(defaults,options);
    var ctx=$(this).get(0).getContext("2d");
    var lines=[
        [25,121,29,118,30,107,33,102,29,101,24,99,20,99,13,92,9,87,6,80,6,75,8,69,11,65,16,61,21,56,19,51,16,48,10,45,6,43,6,36,7,30,8,25,13,21,17,21,22,24,26,28,27,31,34,34,44,35,66,22,76,11,107,10,112,6,114,6,118,8,119,10,123,11,124,15,128,21,131,25,134,27,135,33,132,38,126,43,130,44,135,46,141,47,144,53,145,59,147,63,147,67,133,74,122,79,119,84,119,89,113,90,113,100,114,105,108,105,106,110,102,114,107,117,116,118,121,122,123,127,123,133,123,137,114,147,110,148,105,148,102,148,101,153,98,155,94,155,86,150,82,144,79,139,70,139,64,135,60,138,56,139,54,136,50,135,46,131,42,127,36,126,35,123,30,124,25,124,24,122],
        [147,67,144,74,146,79,151,82,156,85,157,89,167,89,171,91,175,96,180,96,187,96,191,96,197,95,200,98,201,103,199,107,203,108,209,107,212,110,216,110,219,112,219,125,220,126,210,132,202,133,201,129,201,124,192,121,184,119,178,119,167,119,163,123,161,126,156,126,154,131,154,136,151,141,148,146,148,149,148,154,147,154,141,153,140,148,137,145,131,146,127,147,124,152,123,157,116,157,116,151,114,147,123,137,123,133,123,127,121,122,116,118,107,117,102,114,106,110,108,105,114,105,113,100,113,90,119,89,119,84,122,79,133,74,147,67],
        [90,247,84,249,80,247,77,242,73,239,71,237,73,233,74,228,74,222,58,209,58,203,54,198,49,197,44,198,42,193,42,187,45,180,44,175,38,168,34,163,34,157,36,151,35,144,30,145,23,141,21,134,16,132,17,126,17,122,23,121,27,120,24,122,25,124,30,124,35,123,36,126,42,127,46,131,50,135,54,136,56,139,60,138,64,135,70,139,79,139,82,144,86,150,94,155,98,155,101,153,102,148,105,148,110,148,114,147,116,151,116,157,123,157,124,152,127,147,131,146,137,145,140,148,141,153,147,154,150,163,151,167,154,170,160,172,161,172,156,177,155,182,151,189,134,192,124,193,120,196,117,201,115,206,116,209,113,212,112,215,107,214,104,216,105,219,106,223,107,229,105,235,98,239,93,242,91,247],
        [220,126,210,132,202,133,201,129,201,124,192,121,184,119,178,119,167,119,163,123,161,126,156,126,154,131,154,136,151,141,148,146,148,149,148,154,147,154,150,163,151,167,154,170,160,172,166,172,170,173,175,175,179,174,183,172,187,167,193,169,197,171,202,171,205,170,211,170,215,168,221,163,224,159,224,155,221,151,218,147,224,146,231,146,237,145,239,144,242,142,244,140,243,136,245,136,242,136,240,134,237,133,237,129,237,125,234,124,230,124,226,125,220,125],
        [160,172,166,172,170,173,175,175,179,174,183,172,187,167,193,169,197,171,202,171,205,170,211,170,215,168,221,163,224,159,224,155,221,151,218,147,224,146,231,146,237,145,239,144,242,142,244,140,243,136,245,136,247,130,249,124,253,121,262,119,272,118,279,116,291,115,297,113,303,112,307,116,306,144,307,146,312,147,317,147,319,151,322,151,310,153,308,157,307,162,307,163,304,170,302,172,299,177,296,187,291,193,288,199,285,201,272,195,270,200,268,204,260,201,253,202,252,202,251,200,247,197,242,197,236,195,230,194,226,202,220,201,212,200,206,199,203,197,200,198,196,199,192,197,188,196,182,194,176,196,173,196,171,193,166,195,162,196,158,194,152,189,151,189,155,182,156,177,161,172],
        [214,297,208,298,204,296,205,291,201,289,177,280,171,273,169,268,162,265,158,260,154,261,150,264,134,264,133,270,129,275,125,272,122,268,114,269,110,273,106,275,103,272,100,268,99,262,98,256,98,251,90,248,91,247,93,242,98,239,105,235,107,229,106,223,105,219,104,216,107,214,112,215,113,212,116,209,115,206,117,201,120,196,124,193,134,192,151,189,152,189,158,194,162,196,166,195,171,193,173,196,176,196,182,194,188,196,192,197,196,199,200,198,203,197,206,199,212,200,220,201,226,202,230,194,236,195,242,197,247,197,251,200,252,202,249,208,247,212,247,217,246,218,246,219,240,226,233,233,230,239,231,243,235,246,240,248,238,252,232,257,212,273,211,276,214,282,215,286,215,293,214,297],
        [307,163,304,170,302,172,299,177,296,187,291,193,288,199,285,201,272,195,270,200,268,204,260,201,253,202,252,202,249,208,247,212,247,217,246,218,247,220,255,219,275,211,293,241,296,249,295,253,298,257,299,263,303,266,302,270,302,274,308,274,315,274,318,276,323,281,326,280,329,277,324,276,325,273,332,274,336,273,337,268,338,264,349,258,351,255,355,255,360,256,363,254,363,249,361,243,360,242,357,237,352,231,350,226,349,222,339,221,335,209,333,201,330,199,330,191,332,189,329,186,327,183,325,177,319,176,316,174,315,168,312,169,311,164,307,163],
        [323,281,318,276,315,274,308,274,302,274,302,270,303,266,299,263,298,257,295,253,296,249,293,241,275,211,255,219,247,220,246,219,240,226,233,233,230,239,231,243,235,246,240,248,238,252,232,257,212,273,211,276,214,282,215,286,215,293,214,297,218,300,219,308,224,309,227,304,232,303,241,303,246,300,250,291,258,294,262,293,267,293,272,291,275,293,280,293,285,290,285,283,291,279,307,287,310,288,316,291,317,291,320,285,324,281],
        [320,151,338,151,346,149,352,146,360,145,367,143,372,140,374,137,377,139,382,140,401,138,414,137,423,135,433,133,442,130,449,128,453,129,454,133,458,142,460,143,464,142,468,141,467,134,465,129,467,125,475,124,486,123,505,123,516,122,563,121,596,123,603,123,623,162,631,164,639,165,645,166,650,165,648,171,641,180,645,195,643,198,642,226,590,224,573,233,571,232,562,224,529,228,525,224,517,224,510,214,506,212,491,216,484,203,468,203,463,204,464,210,462,213,440,216,414,223,411,227,406,227,391,232,383,233,376,234,378,236,361,242,360,242,357,237,352,231,350,226,349,222,339,221,335,209,333,201,330,199,330,191,332,189,329,186,327,183,325,177,319,176,316,174,315,168,312,169,311,164,307,163,307,162,308,157,310,153,322,151],
        [646,227,647,219,651,216,655,218,658,218,663,217,667,217,671,214,676,212,679,213,678,220,677,225,679,227,684,232,690,233,691,238,688,246,685,253,696,254,701,260,706,264,703,267,697,269,691,269,688,269,685,273,680,277,678,281,682,285,685,286,683,291,682,296,677,299,673,302,667,303,667,316,661,316,657,314,642,318,634,319,626,319,615,317,606,314,597,309,591,306,574,306,562,318,548,319,533,309,519,315,508,316,504,303,499,299,491,297,480,301,468,301,464,304,457,303,451,305,445,304,439,304,416,306,404,316,406,322,410,333,406,335,401,334,393,346,389,345,386,335,389,327,391,323,384,322,379,327,372,326,365,329,354,327,345,326,343,323,333,325,328,323,328,318,331,305,316,291,317,291,320,285,324,281,323,280,326,279,329,276,324,275,325,272,332,273,336,272,337,267,338,263,349,257,351,254,355,254,360,255,363,253,363,248,361,242,361,243,378,237,376,235,383,234,391,233,406,228,411,228,414,224,440,217,462,214,464,211,463,205,468,204,484,204,491,217,506,213,510,215,517,225,525,225,529,229,562,225,571,233,573,234,590,225,642,227]
    ];//定义地图内部区域线条路径
    var txt=[
        ["桐屿街道",[50,86]],
        ["螺洋街道",[126,110]],
        ["路北街道",[62,180]],
        ["路桥街道",[165,155]],
        ["路南街道",[240,170]],
        ["峰江街道",[140,235]],
        ["横街镇",[302,238]],
        ["新桥镇",[250,260]],
        ["蓬街镇",[455,178]],
        ["金清镇",[485,268]]
    ]
    //根据已有数据计算需要的数据
    var total=0;
    var percent=new Array();
    var ranking=new Array();
    for (var i = 0; i < options.data.length; i++) {
        total+=options.data[i];
    }
    for (var j = 0; j < options.data.length; j++) {
        percent[j]=(100*options.data[j]/total).toFixed(0) + "%";
        var index=0;
        for (var k = 0; k < options.data.length; k++) {
            if(options.data[j]<options.data[k]){
                index++;
            }
        }
        ranking[j]=(index+1);
        switch(index){
            case 2:
              options.standard[2]=options.data[j];
              break;
            case 7:
              options.standard[1]=options.data[j];
              break;
            case 12:
              options.standard[0]=options.data[j]
        }
    }
    //鼠标移上去是进行定位
    var hotCurrentX,hotCurrentY;
    $(this).on("mousemove",function(event){
        hotCurrentX=event.offsetX;
        hotCurrentY=event.offsetY;
    })
    var mapPainting=function(){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth=options.mapChartsBorderWidth;
        ctx.shadowColor=options.mapChartsBorder;
        ctx.strokeStyle=options.mapChartsBorder;
        var lines=[25,121,29,118,30,107,33,102,29,101,24,99,20,99,13,92,9,87,6,80,6,75,8,69,11,65,16,61,21,56,19,51,16,48,10,45,6,43,6,36,7,30,8,25,13,21,17,21,22,24,26,28,27,31,34,34,44,35,66,22,76,11,107,10,112,6,114,6,118,8,119,10,123,11,124,15,128,21,131,25,134,27,135,33,132,38,126,43,130,44,135,46,141,47,144,53,145,59,147,63,147,67,144,74,146,79,151,82,156,85,157,89,167,89,171,91,175,96,180,96,187,96,191,96,197,95,200,98,201,103,199,107,203,108,209,107,212,110,216,110,219,112,220,125,226,125,230,124,234,124,237,125,237,129,237,133,240,134,242,136,245,136,247,130,249,124,253,121,262,119,272,118,279,116,291,115,297,113,303,112,307,116,306,144,307,146,312,147,317,147,320,151,338,151,346,149,352,146,360,145,367,143,372,140,374,137,377,139,382,140,401,138,414,137,423,135,433,133,442,130,449,128,453,129,454,133,458,142,460,143,464,142,468,141,467,134,465,129,467,125,475,124,486,123,505,123,516,122,563,121,596,123,603,123,623,162,631,164,639,165,645,166,650,165,648,171,641,180,645,195,643,198,642,226,646,227,647,219,651,216,655,218,658,218,663,217,667,217,671,214,676,212,679,213,678,220,677,225,679,227,684,232,690,233,691,238,688,246,685,253,696,254,701,260,706,264,703,267,697,269,691,269,688,269,685,273,680,277,678,281,682,285,685,286,683,291,682,296,677,299,673,302,667,303,667,316,661,316,657,314,642,318,634,319,626,319,615,317,606,314,597,309,591,306,574,306,562,318,548,319,533,309,519,315,508,316,504,303,499,299,491,297,480,301,468,301,464,304,457,303,451,305,445,304,439,304,416,306,404,316,406,322,410,333,406,335,401,334,393,346,389,345,386,335,389,327,391,323,384,322,379,327,372,326,365,329,354,327,345,326,343,323,333,325,328,323,328,318,331,305,316,291,310,288,307,287,291,279,285,283,285,290,280,293,275,293,272,291,267,293,262,293,258,294,250,291,246,300,241,303,232,303,227,304,224,309,219,308,218,300,214,297,208,298,204,296,205,291,201,289,177,280,171,273,169,268,162,265,158,260,154,261,150,264,134,264,133,270,129,275,125,272,122,268,114,269,110,273,106,275,103,272,100,268,99,262,98,256,98,251,90,247,84,249,80,247,77,242,73,239,71,237,73,233,74,228,74,222,58,209,58,203,54,198,49,197,44,198,42,193,42,187,45,180,44,175,38,168,34,163,34,157,36,151,35,147,30,145,23,141,21,134,16,132,17,126,17,122,23,121,27,120];
        for (var i = 0; i < lines.length; i+=2) {
            if (i==0) {
                ctx.moveTo(lines[i],lines[i+1]);
            }else{
                ctx.lineTo(lines[i],lines[i+1]);
            }
        }
        ctx.closePath();ctx.stroke();ctx.restore();
    }
    //各区域绘图及弹窗实现
    var hotModulePainting=function(){
        var inde=new Array();
        var dialogIndex=-1;
        for (var i = 0; i < lines.length; i++) {
            //开始划线
            ctx.save();
            ctx.beginPath();
            ctx.globalCompositeOperation="destination-over";
            ctx.lineWidth=3;
            ctx.shadowBlur=0;
            ctx.strokeStyle="rgba(28,62,109,0.5)";
            for (var j = 0; j <lines[i].length; j+=2) {
                if (j==0) {
                    ctx.moveTo(lines[i][j],lines[i][j+1]);
                }
                else{
                    ctx.lineTo(lines[i][j],lines[i][j+1]);
                }
            }
            ctx.closePath();
            ctx.stroke();
            if (parseInt(ranking[i])<=3) {
                ctx.fillStyle=options.color[3];
            }else if(ranking[i]>3 && ranking[i]<=8){
                ctx.fillStyle=options.color[2];
            }
            else if(ranking[i]>8 && ranking[i]<=13){
                ctx.fillStyle=options.color[1];
            }else{
                ctx.fillStyle=options.color[0];
            }
            ctx.fill();
            ctx.restore();
            //结束划线
            //开始添加名字
            ctx.save();
            ctx.lineWidth=0.5;
            ctx.strokeStyle="rgba(18,42,89,1)";
            ctx.font="12px Microsoft Yahei";
            //ctx.globalCompositeOperation="lighter";
            ctx.strokeText(txt[i][0],txt[i][1][0],txt[i][1][1]);
            ctx.restore();
            //结束添加名字
            //鼠标移上去确定弹框位置
            if(ctx.isPointInPath(hotCurrentX,hotCurrentY)){
                dialogIndex=i;
            }
            //确定弹框位置结束
        }
        //绘制弹框
        if (dialogIndex!=-1) {
            hotDialogPaint(txt[dialogIndex][1][0]+20,txt[dialogIndex][1][1]-20,txt[dialogIndex][0],options.data[dialogIndex],percent[dialogIndex],ranking[dialogIndex]);
        }
        //绘制弹框结束
    }
    //热力图弹窗实现
    var hotDialogPaint=function(x,y,name,data,percent,ranking){
        var dialogPath=[
                [-29,125,125,5,0,-5,-29,-29],//
                [-136,-136,-10,-10,0,-10,-10,-136],//
                [-19,-19,-19,-19],//
                [-112,-83,-54,-25]//
            ];
        if (y<136) {
            dialogPath[1]=[166,166,40,40,30,40,40,166];//
            dialogPath[3]=[65,94,123,152];//
        }
        if(x>500){
            dialogPath[0]=[-129,25,25,5,0,-5,-129,-129];//
            dialogPath[2]=[-119,-119,-119,-119];//
        }
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation="source-over";
        ctx.strokeStyle="#41b2ce";
        ctx.fillStyle="rgba(10,10,10,0.8)";
        ctx.lineWidth=2;
        ctx.lineJoin="round";
        ctx.moveTo(x+dialogPath[0][0],y+dialogPath[1][0]);
        ctx.lineTo(x+dialogPath[0][1],y+dialogPath[1][1]);
        ctx.lineTo(x+dialogPath[0][2],y+dialogPath[1][2]);
        ctx.lineTo(x+dialogPath[0][3],y+dialogPath[1][3]);
        ctx.lineTo(x+dialogPath[0][4],y+dialogPath[1][4]);
        ctx.lineTo(x+dialogPath[0][5],y+dialogPath[1][5]);
        ctx.lineTo(x+dialogPath[0][6],y+dialogPath[1][6]);
        ctx.lineTo(x+dialogPath[0][7],y+dialogPath[1][7]);
        ctx.stroke();
        ctx.fill();
        ctx.lineWidth=1;
        ctx.strokeStyle="#7fe1ff";
        ctx.font="16px Microsoft Yahei";
        ctx.strokeText(name,x+dialogPath[2][0],y+dialogPath[3][0]);
        ctx.font="14px Microsoft Yahei";
        ctx.strokeStyle="#ffc955";
        ctx.strokeText("事件总量：" + data + "条" ,x+dialogPath[2][1],y+dialogPath[3][1]);
        ctx.strokeStyle="#ffc955";
        ctx.strokeText("在全区事件占比：" + percent ,x+dialogPath[2][2],y+dialogPath[3][2]);
        ctx.strokeStyle="#ffc955";
        ctx.strokeText("在全区街道排名：" + ranking ,x+dialogPath[2][3],y+dialogPath[3][3]);
        ctx.restore();
    }
    /*热力图*/
    //重绘
    var hotRepaint=function(){
        var hotInter=setInterval(function(){
            ctx.clearRect(0,0,682,470);
            mapPainting();
            hotModulePainting();
        },10);
    }
    //初始化方法
    var ths=$(this);
    var hotInit=function(){
        mapPainting();
        hotModulePainting();
        hotRepaint();
        for (var i = 0; i < ths.next(".colorBox").children(".txt").find("p").length; i++) {
            if (i==0) {
                ths.next(".colorBox").children(".txt").find("p").eq(i).text(0 + "-" + options.standard[i]);
            }
            else if(i==(ths.next(".colorBox").children(".txt").find("p").length-1)){
                ths.next(".colorBox").children(".txt").find("p").eq(i).text(">" + (parseInt(options.standard[i-1])+1));
            }
            else{
                ths.next(".colorBox").children(".txt").find("p").eq(i).text(parseInt(options.standard[i-1])+1 + "-" + options.standard[i]);
            }
        }
    }
    hotInit();
    /*热力图end*/
}
$(function(){
    $("#map").mapCharts({
        data:[
            ["桐屿街道",[50,86],6,77,127,0,true,true],
            ["螺洋街道",[126,110],0,99,82,0,true,true],
            ["路北街道",[62,180],45,163,238,6,true,true],
            ["路桥街道",[170,155],0,144,156,0,true,true],
            ["路南街道",[240,170],12,95,80,15,true,true],
            ["峰江街道",[130,235],15,83,103,0,false,false],
            ["横街镇",[302,238],0,57,135,16,false,false],
            ["新桥镇",[250,260],4,42,28,0,true,true],
            ["蓬街镇",[455,178],6,132,156,0,false,false],
            ["金清镇",[485,268],12,207,291,0,true,true]
        ],
        standard:[5,10]
    })
    $("#monthHot").hotMap({
        data:[7523,3693,4079,4036,8068,5690,5482,4819,4750,7175],
        standard:[2000,4000,6000]
    })
    $("#yearHot").hotMap({
        data:[1171,1268,1494,3236,2270,2444,1951,2118,4117,2896],
        standard:[1000,2000,3000]
    })
})












