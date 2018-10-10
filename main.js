
/* 当DOM加载完成的时候运行的方法 */
$(document).ready(function(){
	var totWidth=0;
	var positions = new Array();
	var $slides = $('#slides .slide');
	/* 遍历每个slide */
	$slides.each(function(i){
		
		/* 将每个位置的图片偏移量根据对应的位置固定 */
		positions[i] = totWidth;
		totWidth += $(this).width();
		/* 获取当前的图片控件的宽度 */
		if(!$(this).width())
		{
			alert("Please, fill in width & height for all your images!");
			return false;
		}
	});

	let $firstSlide = $('#slides .slide').eq(0).clone(true);
	positions[$slides.length] = totWidth;
	$('#slides').append($firstSlide);
	totWidth+=920;
	
	/* 设置图片控件的最大宽度 */
	$('#slides').width(totWidth);

	/* 为状态栏的每个A标签添加点击事件 */ 
	$('#menu ul li').click(function(e,isLast){
		/* 先将每个li的act类全部删除,在添加inact */
		$('li.menuItem').removeClass('act').addClass('inact');
		/* 在给被点击的a标签的父类添加act */
		$(this).addClass('act');
		/* 获得当前li之前一共有多少个li */
		var pos = $(this).prevAll('.menuItem').length;
		/* 停止动画后,设置slides的marginLeft,动画为450ms */			
		$('#slides').stop().animate({marginLeft:-positions[pos]+'px'},450);			
		if(isLast){
			window.clearInterval(timer);
			setTimeout(()=>{
				$('#slides').stop().animate({marginLeft:-positions[pos+1]+'px'},450,()=>{
				$('#slides').hide().offset();
				$('#slides').stop().animate({'margin-left':'0px'},0).show();
				$('li.menuItem').removeClass('act').addClass('inact');
				$('li.menuItem').eq(0).addClass('act');
				})
				timer = setInterval(function(){autoAdvance()},changeEvery);
				current = 1;
			},changeEvery);
		}else{
			current = pos;
		}
		/* 阻止A标签的默认事件 */
		e.preventDefault();
	});
	
	/* 页面加载后,将第一个bar设置为act,在将其他设置为inact */
	$('#menu ul li.menuItem:first').addClass('act').siblings().addClass('inact');
	 
	 /* 自动滑动 */
	var current=1;
	var $liBarLength = $('#menu ul li a').length;
	console.log($liBarLength)
	function autoAdvance(){
		/* 如果是-1返回 */	
		if(current==-1) return false;
		console.log('current = '+current);
		if(current%$liBarLength === 3){
			$('#menu ul li a').eq(current%$('#menu ul li a').length).trigger('click',true);
		}else{
			/* 根据当前current%menu ul li a的总长度选择下个元素,执行click,传入keepScroll表示这是自动滑动 */
			$('#menu ul li a').eq(current%$('#menu ul li a').length).trigger('click');
		}
		current++;
	}

	$('#slides').on('mouseenter',()=>{
		window.clearInterval(timer);
	}).on('mouseleave',()=>{
		timer = setInterval(()=>{
			autoAdvance();
		},changeEvery)
	});

	document.addEventListener('visibilitychange',()=>{
		console.log(document.hidden);
		if(document.hidden){
			window.clearInterval(timer);
		}else{
			timer = setInterval(function(){autoAdvance()},changeEvery);
		}
	});
	
	var changeEvery = 3 * 1000;
	//设置自动滑动时间
	var timer = setInterval(()=>{
		autoAdvance();
	},changeEvery);
});