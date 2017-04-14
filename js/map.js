$(function(){
	/*trends*/

	var hei=$(".trends").find(".trendsBd").find("li").length*27;
	var list=$(".trends").find(".trendsBd").children("ul").html();
	if(hei>162){
		$(".trends").find(".trendsBd").children("ul").append(list);
		var tp=0;
		var si=setInterval(scroll,50);
		function scroll(){
			tp--;
			$(".trends").find(".trendsBd").children("ul").css("top",tp + "px");
			if(tp<=-hei){
				tp=0;
			}
		}
		$(".trends").find(".trendsBd").hover(function(){
			clearInterval(si);
		},function(){
			si=setInterval(scroll,50);
		})
	}

	/*trends end*/


	/*linkage*/

	$(".linkageBd").find("li").each(function(){
		var max=0;
		for (var i = 0; i < $(this).parents(".linkageBd").find("li").length; i++) {
			if (max < parseInt($(this).parents(".linkageBd").find("li").eq(i).children(".lcCont").find("em").text())) {
				max=parseInt($(this).parents(".linkageBd").find("li").eq(i).children(".lcCont").find("em").text());
			}
		}
		$(this).children(".lcCont").find("span").width(parseInt($(this).children(".lcCont").find("em").text())/(1.1*max)*290)
	})
	var nowDate=new Date();
	$(".linkage").find(".linkageHd").children(".lcCont").text(nowDate.getMonth() + "月办理数");
	$(".linkage").on("click",".switch",function(){
		$(".linkageCont").find(".selected").removeClass("selected").siblings(".linkageBd").addClass("selected");
	})
	/*linkage end*/


	/*tendency*/

	var myChart = echarts.init(document.getElementById('tendencyChart'));
    var option = {
		title : {
	        text: '',
	        subtext: ''
	    },
	    color:['#109176','#552f8e'],
	    grid:{
	    	width:'85%',
	    	height:'65%',
	    	borderWidth:'0px'
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {
	            type : 'shadow'
	        }
	    },
	    legend: {
	        data:['2016年','2017年'],
	        orient:'vertical',
	        left:'right',
	        top:'top',
	        textStyle:{
        		color:'#519df8'
        	}
	    },
	    toolbox: {
	        show : false,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    xAxis : [
	        {
	            type : 'category',
	            axisLine:{
	            	lineStyle:{
	            		color:'#4788d9',
	            		type:'solid'
	            	}
	            },
	            axisTick:{
	            	show:false
	            },
	            splitLine:{
	            	show:false
	            },
	            axisLabel:{
	            	textStyle:{
	            		color:'#519df8'
	            	}
	            },
	            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            position:'left',
	            name:'单位：件',
	            nameLocation:'end',
	            axisLine:{
	            	lineStyle:{
	            		color:'#4788d9',
	            		type:'solid'
	            	}
	            },
	            splitLine:{
	            	lineStyle:{
	            		color:'#1a3055',
	            		type:'dashed'
	            	}
	            },
	            axisLabel:{
	            	textStyle:{
	            		color:'#519df8'
	            	}
	            }
	        }
	    ],
		calculable : false,
	    series : [
	        {
	            name:'2016年',
	            type:'bar',
	            data:[167, 120, 520, 180, 120, 132, 1835, 5367, 3355, 3328, 4168, 3710]
	        },
	        {
	            name:'2017年',
	            type:'bar',
	            data:[3203, 5674, 55315, 32232, 0, 0, 0, 0, 0, 0, 0, 0]
	        }
	    ]
    };  
    myChart.setOption(option);

	/*tendency end*/


	/*originate*/

	var myChart = echarts.init(document.getElementById('originateChart'));
    var option = {
	    title : {
	        text: nowDate.getMonth() + '月 10345件',
	        textStyle:{
	        	color:'#01c6df'
	        },
	        subtext: '',
	        x:'right'
	    },
	    color:['#af3648','#109176','#1076a6','#712eaf','#dcb233','#b08667','#4fa105','#3d60d5'],
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	    	show:false,
	        x : 'center',
	        y : 'bottom',
	        data:['手机录入','人工录入','线索录入']
	    },
	    toolbox: {
	        show : false
	    },
	    calculable : true,
	    series : [
	        {
	            name:'事件来源',
	            type:'pie',
	            radius : [20, 90],
	            center : ['50%', '60%'],
	            roseType : 'radius',
	            x: '50%',               // for funnel
	            max: 40,                // for funnel
	            sort : 'ascending',     // for funnel
	            label:{
	            	normal:{
	            		textStyle:{
							color:'#4788d9',
							fontSize:16
	            		}
	            	}
	            },
	            itemStyle : {
	                normal : {
	                    label : {
	                        show : true
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                },
	                emphasis : {
	                    label : {
	                        show : true
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                }
	            },
	            data:[ 
	                {value:55069, name:'手机录入'},
	                {value:10927, name:'人工录入'},
	                {value:11909, name:'线索录入'}
	            ]
	        }
	    ]
	};          
    myChart.setOption(option);

	/*originate end*/


	/*action*/

	$(".population").find(".action").active([
			[
				[[0,0],[0,20],[108,20],[108,42]]
			],
			[
				[[216,0],[216,20],[108,20],[108,42]]
			]
		]);
	$(".house").find(".action").active([
			[
				[[0,2],[56,2]]
			]
		]);
	$(".dataLink").find(".action").active([
			[
				[[2,0],[2,21],[182,21],[182,78]],
				[[2,0],[2,21],[222,21],[222,78]]
			],
			[
				[[506,0],[506,21],[347,21],[347,78]],
				[[506,0],[506,21],[300,21],[300,78]]
			],
		]);
	/*action end*/

	/*linkMove*/
	var i=1;
	$(".linkMove").find(".box").hide().eq(0).show();
	setInterval(function(){
		$(".linkMove").find(".box").eq(i).fadeIn(450);
		i++;
		if(i==5){
			i=1;
			$(".linkMove").find(".box").hide().eq(0).show();
		}
	},450)

	/*linkMove end*/

	/*map*/
	$(".map").find(".mapTabHd").on("click","li",function(){
		var index=$(this).index();
		$(this).addClass("selected").siblings().removeClass("selected");
		$(".mapTabBd").find(".mapTabBox").eq(index).addClass("selected").siblings().removeClass("selected");		
	})
	/*map end*/

	//兼容不同分辨率
	layOut();
	//兼容不同分辨率结束
})
var layOut=function (){
	var x=$("body").width()/1920;
	var y=$("body").height()/1080;
	$(".wraper").css("transform","scale(" + x + "," + y + ")");
}
$(window).resize(function(){
	layOut();
});
$.fn.active=function(option){
	var ts=$(this);
	var si=setInterval(function(){
		var index=parseInt(option[0].length*Math.random());
		var len=new Array();
		for (var i = 0; i < option.length; i++) {
			ts.append("<div class='circle circle" + i + "'></div>");
			len[i]=ts.find(".circle" + i).length;
			if(len[i]>50){
				ts.find(".circle" + i).eq(0).remove();
				len[i]--;
			}
			ts.find(".circle" + i).eq(len[i]-1).css({"left":option[i][index][0][0] + "px","top":option[i][index][0][1] + "px"});
			for (var j = 1; j < option[i][index].length; j++) {
				ts.find(".circle" + i).eq(len[i]-1).animate({"left":option[i][index][j][0] + "px","top":option[i][index][j][1] + "px"},3000);
			}
		}
	},1000)
}










