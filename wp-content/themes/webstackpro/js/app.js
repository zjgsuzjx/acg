(function($){ 
    $(document).ready(function(){
        // 侧栏菜单初始状态设置
        if(theme.minNav != '1')trigger_resizable(true);
        // 主题状态
        switch_mode(); 
        // 搜索模块
        intoSearch();
        //粘性页脚
        stickFooter();
        // 网址块提示 
        if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }else{ $('.qr-img[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
        // 初始化tab滑块
        intoSlider();
        // 初始化theiaStickySidebar
        $('.sidebar').theiaStickySidebar({
            additionalMarginTop: 90,
            additionalMarginBottom: 20
        });
        // 初始化游客自定义数据
        if(theme.isCustomize == '1'){
            intoSites();
            intoSites(true);
        }
    });
    // Enable/Disable Resizable Event
    var wid = 0;
    $(window).resize(function() {
		clearTimeout(wid);
        wid = setTimeout(go_resize, 200); 
    });
    function go_resize() {
        stickFooter(); 
        //if(theme.minNav != '1'){
            trigger_resizable();
        //}
    }
    // count-a数字动画
    $('.count-a').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $(document).on('click', "a[target!='_blank']", function() {
        if( theme.loading=='1' && $(this).attr('href') && $(this).attr('href').indexOf("#") != 0 && $(this).attr('href').indexOf("java") != 0 && !$(this).data('fancybox') ){
            var load = $('<div id="load-loading"></div>');
            $("body").prepend(load);
            load.animate({opacity:'1'},200,'swing').delay(3000).hide(300,function(){ load.remove() });
        }
    });
	// 点赞
	$(".btn-like").click(function() {
		if ($(this).hasClass('liked')) {
			showAlert(JSON.parse('{"status":3,"msg":"您已经赞过了!"}'));
		} else {
            var icop = $(this).children('.flex-column');
			$('.btn-like').addClass('liked'); 
			$.ajax({
				type : 'POST',
				url : theme.ajaxurl,  
				data : {
					action: "post_like",
                    post_id: $(this).data("id"),
                    ticket: $(this).data("ticket")
                },
                success : function( data ){
                    $am = $('<i class="iconfont icon-heart" style="color: #f12345;transform: scale(1) translateY(0);position: absolute;transition: .6s;opacity: 1;"></i>');
                    icop.prepend($am);
					showAlert(JSON.parse('{"status":1,"msg":"谢谢点赞!"}'));
                    $('.like-count').html(data);
                    $am.addClass('home-like-hide');
				},
                error:function(){ 
                    showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
                }
            });
		}
		return false;
    });
    // 卡片点赞
    $(document).on('click', '.home-like', function() {
		if ($(this).hasClass('liked')) {
			showAlert(JSON.parse('{"status":3,"msg":"您已经赞过了!"}'));
		} else {
            var icop = $(this);
            var id = $(this).data("id");
			$(this).addClass('liked'); 
			$.ajax({
				type : 'POST',
				url : theme.ajaxurl,  
				data : {
					action: "post_like",
					post_id: id
				},
				success : function( data ){
                    $am = $('<i class="iconfont icon-heart" style="color: #f12345;transform: scale(1) translateY(0);position: absolute;transition: .6s;opacity: 1;"></i>');
                    icop.prepend($am);
                    showAlert(JSON.parse('{"status":1,"msg":"谢谢点赞!"}'));
                    $(".home-like-"+id).html(data);
                    $am.addClass('home-like-hide');
				},
                error:function(){ 
					showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
                }
			});
		}
		return false;
    });
    //未开启详情页计算访客方法
    $(document).on('click', '.url-card a.is-views[data-id]', function() {
        $.ajax({
            type:"GET",
            url:theme.ajaxurl,
            data:{
                action:'io_postviews',
                postviews_id:$(this).data('id'),
            },
            cache:!1,
        });
    });
    // app下载统计
    $(document).on('click', 'a.down_count', function() {
        var mm = document.getElementById( $(this).data("mmid") ); 
        if( mm ){
            mm.select();
            document.execCommand("Copy");
            alert("网盘密码已复制，点“确定”进入下载页面。");
        }
        $.ajax({
            type:"POST",
            url:theme.ajaxurl,
            data: $(this).data(),
            success : function( data ){
                $('.down-count-text').html(data);
            }
        }); 
    });
    //夜间模式
	$(document).on('click', '.switch-dark-mode', function(event) {
		event.preventDefault();
        $.ajax({
            url: theme.ajaxurl,
            type: 'POST',
            dataType: 'html',
            data: {
				mode_toggle: $('body').hasClass('io-black-mode') === true ? 1 : 0,
				action: 'switch_dark_mode',
            },
        })
        .done(function(response) {
			$('body').toggleClass('io-black-mode '+theme.defaultclass);
            switch_mode(); 
            $("#"+ $('.switch-dark-mode').attr('aria-describedby')).remove();
            //$('.switch-dark-mode').removeAttr('aria-describedby');
        })
    });
    function switch_mode(){
        if($('body').hasClass('io-black-mode')){
            if($(".switch-dark-mode").attr("data-original-title"))
                $(".switch-dark-mode").attr("data-original-title","日间模式");
            else
                $(".switch-dark-mode").attr("title","日间模式");
            $(".mode-ico").removeClass("icon-night");
            $(".mode-ico").addClass("icon-light");
        }
        else{
            if($(".switch-dark-mode").attr("data-original-title"))
                $(".switch-dark-mode").attr("data-original-title","夜间模式");
            else
                $(".switch-dark-mode").attr("title","夜间模式");
            $(".mode-ico").removeClass("icon-light");
            $(".mode-ico").addClass("icon-night");
        }
    }
    //返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('#go-to-up').fadeIn(200);
        } else {
            $('#go-to-up').fadeOut(200);
        }
    });
    $('.go-up').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    return false;
    }); 

 
    //滑块菜单
    $('.slider_menu').children("ul").children("li").not(".anchor").hover(function() {
        $(this).addClass("hover"),
        //$('li.anchor').css({
        //    transform: "scale(1.05)",
        //}),
        toTarget($(this).parent()) 
    }, function() {
        //$('li.anchor').css({
        //    transform: "scale(1)",
        //}),
        $(this).removeClass("hover") 
    });
    $('.slider_menu').mouseleave(function(e) {
        var menu = $(this).children("ul");
        window.setTimeout(function() { 
            toTarget(menu) 
        }, 50)
    }) ;  
    function intoSlider() {
        $(".slider_menu[sliderTab]").each(function() {
            if(!$(this).hasClass('into')){
                var menu = $(this).children("ul");
                menu.prepend('<li class="anchor" style="position:absolute;width:0;height:28px"></li>');
                var target = menu.find('.active').parent();
                if(0 < target.length){
                    menu.children(".anchor").css({
                        left: target.position().left + target.scrollLeft() + "px",
                        width: target.outerWidth() + "px",
                        height: target.height() + "px",
                        opacity: "1"
                    })
                }
                $(this).addClass('into');
            }
        })
    }
    //粘性页脚
    function stickFooter() {
        $('.main-footer').attr('style', '');
	    if($('.main-footer').hasClass('text-xs'))
	    {
	    	var win_height				 = jQuery(window).height(),
	    		footer_height			 = $('.main-footer').outerHeight(true),
	    		main_content_height	     = $('.main-footer').position().top + footer_height ;
	    	if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'), 10))
	    	{
	    		$('.main-footer').css({
	    			marginTop: win_height - main_content_height  
	    		});
	    	}
        }
    }
 

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');

    }); 
 
    // Trigger Resizable Function
    var isMin = false,
        isMobileMin = false;
    function trigger_resizable( isNoAnim=false ) {
        if( (theme.minNav == '1' && !isMin && 767.98<$(window).width() )||(!isMin && 767.98<$(window).width() && $(window).width()<1024) ){
            //$('#mini-button').removeAttr('checked');
            $('#mini-button').prop('checked', false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
            if(isMobileMin){
                $('#sidebar').addClass('mini-sidebar');
                isMobileMin = false;
            }
        }
        else if( ( theme.minNav != '1')&&((isMin && $(window).width()>=1024) || ( isMobileMin && !isMin && $(window).width()>=1024 ) ) ){
            $('#mini-button').prop('checked', true);
            trigger_lsm_mini(isNoAnim);
            isMin = false;
            if(isMobileMin){
                isMobileMin = false;
            }
        }
        else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
            isMobileMin = true;
            isMin = false;
        }
    }
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click',function(){//.sidebar-menu-inner a //.has-sub a  

        //console.log('--->>>'+$(this).find('span').text());
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化   
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{ //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    //菜单栏最小化
    $('#mini-button').on('click',function(){
        trigger_lsm_mini();

    });
    function trigger_lsm_mini( isNoAnim = false){
        if ($('.header-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.sidebar-nav').removeClass('mini-sidebar');
            $('.sidebar-menu ul ul').css("display", "none");
            if(isNoAnim)
            $('.sidebar-nav').width(220);
            else
            $('.sidebar-nav').stop().animate({width: 220},200);
        }else{
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            if(isNoAnim)
            $('.sidebar-nav').width(60);
            else
            $('.sidebar-nav').stop().animate({width : 60},200);
        }
        //$('.sidebar-nav').css("transition","width .3s");
    }
    //显示2级悬浮菜单
    $(document).on('mouseover','.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',function(){
        var offset = 2;
        if($(this).parents('.flex-bottom').length!=0)
            offset = -3;
        $(".sidebar-popup.second").length == 0 && ($("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>"));
        $(".sidebar-popup.second>div").html($(this).html());
        $(".sidebar-popup.second").show();
        var top = $(this).offset().top - $(window).scrollTop() + offset; 
        var d = $(window).height() - $(".sidebar-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".sidebar-popup.second").stop().animate({"top":top}, 50);
    });
    //隐藏悬浮菜单面板
    $(document).on('mouseleave','.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").hide();
    });
    //常驻2级悬浮菜单面板
    $(document).on('mouseover','.mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").show();
    });
 

    //首页tab模式请求内容
    $(document).on('click', '.ajax-list a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list') , '.'+$(this).data('target'));
    });

    $(document).on('click', '.ajax-list-home a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list-home'), '.ajax-'+$(this).parents('.ajax-list-home').data('id') );
    });

    function loadAjax(t,parent,body = ".ajax-list-body"){
        if( !t.hasClass('active') ){ 
            parent.find('a').removeClass('active');
            t.addClass('active');
            if($(body).children(".ajax-loading").length == 0)
                $(body).append('<div class="ajax-loading text-center rounded" style="position:absolute;display:flex;width:100%;top:-1rem;bottom:.5rem;background:rgba(125,125,125,.5)"><div class="col align-self-center"><i class="iconfont icon-loading icon-spin icon-2x"></i></div></div>');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'html',
                data : t.data(),
                cache: true,
            })
            .done(function(response) { 
                if (response.trim()) { 
                    $(body).html('');
                    $(body).append(response); 
                    //if(theme.lazyload == '1') {
                    //    $(body+" img.lazy").lazyload();
                    //} 
                    var url =  $(body).children('#ajax-cat-url').data('url');
                    if(url)
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').show().attr('href', url);
                    else
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').hide();
                    if(isPC()) $('.ajax-url [data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
                } else { 
                    $('.ajax-loading').remove();
                }
            })
            .fail(function() { 
                $('.ajax-loading').remove();
            }) 
        }
    }
    
    // 自定义模块-----------------
    $(".add-link-form").on("submit", function() {
        var siteName = $(".site-add-name").val()
          , siteUrl = $(".site-add-url").val();
          addSiteList({
            id: +new Date,
            name: siteName,
            url: siteUrl
        });
        this.reset();
        this.querySelector("input").focus();
        $(this).find(".btn-close-fm").click();
    });
    var isEdit = false;
    $('.customize-menu .btn-edit').click(function () {
        if(isEdit){
            $('.url-card .remove-site,#add-site').hide();
            $('.customize-menu .btn-edit').html("编辑网址");
        }else{
            $('.url-card .remove-site,#add-site').show();
            $('.customize-menu .btn-edit').html("确定");
        }
        isEdit = !isEdit;
    }); 
    function addSiteList(site){
        var sites = getItem();
        sites.unshift(site);
        addSite(site);
        setItem(sites);
    }
    function addSite(site,isLive=false,isHeader=false) {
        if(!isLive) $('.customize_nothing').remove();
        else $('.customize_nothing_click').remove(); 
        var url_f,matches = site.url.match(/^(?:https?:\/\/)?((?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,6})/);
        if (!matches || matches.length < 2) url_f=site.url; 
        else {
            url_f=matches[0];
            if(theme.urlformat == '1')
                url_f = matches[1];
        } 
        var newSite = $('<div class="url-card  col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-10a">'+
            '<div class="url-body mini"><a href="'+site.url+'" target="_blank" class="card new-site mb-3 site-'+site.id+'" data-id="'+site.id+'" data-url="'+site.url+'" data-toggle="tooltip" data-placement="bottom" title="'+site.name+'" rel="external nofollow">'+
                '<div class="card-body" style="padding:0.4rem 0.5rem;">'+
                '<div class="url-content d-flex align-items-center">'+
                    '<div class="url-img rounded-circle mr-2 d-flex align-items-center justify-content-center">'+
                        '<img src="' + theme.icourl + url_f + theme.icopng + '">'+
                    '</div>'+
                    '<div class="url-info flex-fill">'+
                        '<div class="text-sm overflowClip_1">'+
                            '<strong>'+site.name+'</strong>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '</div>'+
            '</a></div>' +
            '<a href="javascript:;" class="text-center remove-site" data-id="'+site.id+'" style="display: none"><i class="iconfont icon-close-circle"></i></a>'+
        '</div>');
        if(isLive){
            if(isHeader)
                $(".my-click-list").prepend(newSite);
            else
                $(".my-click-list").append(newSite);
            newSite.children('.remove-site').on("click",removeLiveSite);
        } else {
            $("#add-site").before(newSite);
            newSite.children('.remove-site').on("click",removeSite);
        }
        if(isEdit)
            newSite.children('.remove-site').show();
        if(isPC()) $('.new-site[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    }
    function getItem(key = "myLinks") {
        var a = window.localStorage.getItem(key);
        return a ? a = JSON.parse(a) : [];
    }
    function setItem(sites,key = "myLinks") {
        window.localStorage.setItem(key, JSON.stringify(sites));
    }
    function intoSites(isLive = false) {
        var sites = getItem( isLive ? "livelists" : "myLinks" );
        if (sites.length) {
            for (var i = 0; i < sites.length; i++) {
                addSite(sites[i],isLive);
            }
        }
    }
    function removeSite() {
        var id = $(this).data("id"), 
            sites = getItem();
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites);
        $(this).parent().remove();
    }
    function removeLiveSite() {
        var id = $(this).data("id"), 
            sites = getItem("livelists");
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites,"livelists");
        $(this).parent().remove();
    }
    $(document).on('click', '.url-card a.card', function(event) {
        var site = {
            id: $(this).data("id"),
            name: $(this).find("strong").html(),
            url: $(this).data("url")
        };
        if(site.url==="")
            return;
        var liveList = getItem("livelists");
        var isNew = true;
        for (var i = 0; i < liveList.length; i++){
            if (liveList[i].name === site.name) {
                isNew = false;
            }
        }
        if(isNew){
            var maxSite = theme.customizemax;
            if(liveList.length > maxSite-1){
                $(".my-click-list .site-"+liveList[maxSite-1].id).parent().remove();
                liveList.splice(maxSite-1, 1);
            }
            addSite(site,true,true);
            liveList.unshift(site);
            setItem(liveList,"livelists");
        }
    });
    $.fn.textSlider = function(settings) {
		settings = jQuery.extend({
			speed: "normal",
			line: 2,
			timer: 1000
		},
		settings);
		return this.each(function() {
			scllor($(this), settings)
		})
	};
	function scllor($this, settings) {
		var ul = $("ul:eq(0)", $this);
		var timerID;
		var li = ul.children();
		var _btnUp = $(".up:eq(0)", $this);
		var _btnDown = $(".down:eq(0)", $this);
		var liHight = $(li[0]).height();
		var upHeight = 0 - settings.line * liHight;
		var scrollUp = function() {
			_btnUp.unbind("click", scrollUp);
			ul.animate({
				marginTop: upHeight
			},
			settings.speed,
			function() {
				for (i = 0; i < settings.line; i++) {
					ul.find("li:first").appendTo(ul)
				}
				ul.css({
					marginTop: 0
				});
				_btnUp.bind("click", scrollUp)
			})
		};
		var scrollDown = function() {
			_btnDown.unbind("click", scrollDown);
			ul.css({
				marginTop: upHeight
			});
			for (i = 0; i < settings.line; i++) {
				ul.find("li:last").prependTo(ul)
			}
			ul.animate({
				marginTop: 0
			},
			settings.speed,
			function() {
				_btnDown.bind("click", scrollDown)
			})
		};
		var autoPlay = function() {
			timerID = window.setInterval(scrollUp, settings.timer)
		};
		var autoStop = function() {
			window.clearInterval(timerID)
		};
		ul.hover(autoStop, autoPlay).mouseout();
		_btnUp.css("cursor", "pointer").click(scrollUp);
		_btnUp.hover(autoStop, autoPlay);
		_btnDown.css("cursor", "pointer").click(scrollDown);
        _btnDown.hover(autoStop, autoPlay);
         
        document.addEventListener('visibilitychange',function(){
            if(document.visibilityState=='hidden') {
                autoStop;
            }else {
                autoPlay;
            }
        });
    }
    
    // 搜索模块 -----------------------
    function intoSearch() {
        if(window.localStorage.getItem("searchlist")){
            $(".hide-type-list input#"+window.localStorage.getItem("searchlist")).prop('checked', true);
            $(".hide-type-list input#m_"+window.localStorage.getItem("searchlist")).prop('checked', true);
        }
        if(window.localStorage.getItem("searchlistmenu")){
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id="+window.localStorage.getItem("searchlistmenu")+"]").addClass('active');
        }
        toTarget($(".s-type-list.big"),false,false);
        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current"); 
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");

        $(".super-search-fm").attr("action",$('.hide-type-list input:radio:checked').val());
        $(".search-key").attr("placeholder",$('.hide-type-list input:radio:checked').data("placeholder")); 
        if(window.localStorage.getItem("searchlist")=='type-zhannei'){
            $(".search-key").attr("zhannei","true"); 
        }
    }
    $(document).on('click', '.s-type-list label', function(event) {
        //event.preventDefault();
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu", $(this).data("id"));
        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current"); 
        toTarget($(this).parents(".s-type-list"),false,false);
    });
    $('.hide-type-list .search-group input').on('click', function() {
        var parent = $(this).parents(".s-search");
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_",""));
        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));

        if($(this).attr('id')=="type-zhannei" || $(this).attr('id')=="m_type-zhannei")
            parent.find(".search-key").attr("zhannei","true");
        else
            parent.find(".search-key").attr("zhannei","");

        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });
    $(document).on("submit", ".super-search-fm", function() {
        var key = $(this).find(".search-key").val()
        if(key == "")
            return false;
        else{
            window.open( $(this).attr("action") + key);
            return false;
        }
    });
    function getSmartTips(value,parents) {
        $.ajax({
            type: "GET",
            url: "//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
            async: true,
            data: { wd: value },
            dataType: "jsonp",
            jsonp: "cb",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res.s.length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res.s[i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
                console.log(res);
            }
        })
    }
    var listIndex = -1;
    var parent;
    var tipsList = 0;
    var isZhannei = false;
    $(document).on("blur", ".smart-tips.search-key", function() {
        parent = '';
        $(".search-smart-tips").slideUp(200)
    });
    $(document).on("focus", ".smart-tips.search-key", function() {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val() && !isZhannei) {
            getSmartTips($(this).val(),parent)
        }
    });
    $(document).on("keyup", ".smart-tips.search-key", function(e) {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || isZhannei) {
                return
            }
            getSmartTips($(this).val(),parent);
            listIndex = -1;
        } else {
            $(".search-smart-tips").slideUp(200)
        }
    });
    $(document).on("keydown", ".smart-tips.search-key", function(e) {
        parent = $(this).parents('#search');
        if (e.keyCode === 40) {
            listIndex === (tipsList - 1) ? listIndex = 0 : listIndex++;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (tipsList - 1) : listIndex--;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
    });
})(jQuery);
function isPC() {
    let u = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
      if (u.indexOf(Agents[i]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
}
function showAlert(data) {
    var title,alert,ico;
    switch(data.status) {
        case 1: 
            title = '成功';
            alert='success';
            ico='icon-adopt';
           break;
        case 2: 
            title = '信息';
            alert='info';
            ico='icon-tishi';
           break;
        case 3: 
            title = '警告';
            alert='warning';
            ico='icon-warning';
           break;
        case 4: 
            title = '错误';
            alert='danger';
            ico='icon-close-circle';
           break;
        default: 
    } 
    var msg = data.msg;
    if(!$('#alert_placeholder').hasClass('text-sm')){
        $('body').append('<div id="alert_placeholder" class="text-sm" style="position: fixed;bottom: 10px;right: 10px;z-index: 1000;text-align: right;text-align: -webkit-right"></div>')
    }
    $html = $('<div class="alert-body" style="display:none;"><div class="alert alert-'+alert+' text-lg pr-4 pr-md-5" style="text-align:initial"><i class="iconfont '+ico+' icon-lg" style="vertical-align: middle;margin-right: 10px"></i><span style="vertical-align:middle">'+title+'</span><br><span class="text-md" style="margin-left:30px;vertical-align:middle">'+msg+'</span></div></div>');
    $('#alert_placeholder').append( $html );//prepend
    $html.show(200).delay(3500).hide(300, function(){ $(this).remove() }); 
} 
function toTarget(menu, padding = true, isMult = true) {
    var slider =  menu.children(".anchor");
    var target = menu.children(".hover").first() ;
    if (target && 0 < target.length){
    }
    else{
        if(isMult)
            target = menu.find('.active').parent();
        else
            target = menu.find('.active');
    }
    if(0 < target.length){
        if(padding)
        slider.css({
            left: target.position().left + target.scrollLeft() + "px",
            width: target.outerWidth() + "px",
            opacity: "1"
        });
        else
        slider.css({
            left: target.position().left + target.scrollLeft() + (target.outerWidth()/4) + "px",
            width: target.outerWidth()/2 + "px",
            opacity: "1"
        });
    }
    else{
        slider.css({
            opacity: "0"
        })
    }
}
//滚动进度条函数
function scrollBar() {
    if (document.body.clientWidth > 860) {
        $(window).scroll(function () {
            var s = $(window).scrollTop();
            var a = $(document).height();
            var b = $(window).height();
            var result = parseInt(s / (a - b) * 100);
            $("#bar").css("width", result + "%");
            if (true) {
                if (result >= 0 && result <= 19)
                    $("#bar").css("background", "skyblue");
                if (result >= 20 && result <= 39)
                    $("#bar").css("background", "#50bcb6");
                if (result >= 40 && result <= 59)
                    $("#bar").css("background", "#85c440");
                if (result >= 60 && result <= 79)
                    $("#bar").css("background", "#f2b63c");
                if (result >= 80 && result <= 99)
                    $("#bar").css("background", "pink");
                if (result == 100)
                    $("#bar").css("background", "purple");
            } else {
                $("#bar").css("background", "orange");
            }
        });
    }
}
scrollBar();