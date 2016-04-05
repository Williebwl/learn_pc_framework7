define(['jquery', 'bootstrap', 'core.state', 'scrollbar', 'jquery-ui', 'Assets/Js/Plugins/select2.min.js', 'css!Assets/Css/select2.css'],
    function ($, bootstrap, coreState) {
        'use strict'

        // 左侧滚动条
        function setNavHeight() {
            $(".lef-mainnnav").css("height", $(window).height() - $(".index-logo").outerHeight(true) - $(".user-portrait").outerHeight(true) - $(".lef-footer").outerHeight(true))
        }

        // 主体区域
        function setMainHeight() {
            $(".contentpanel").outerHeight($(window).height() - $(".header-bar").outerHeight() - $(".fixed-footer").height())
        }
        // 字母表
        function setLetterHeight() {
            var perH = Math.floor(($(window).height() - $(".header-bar").outerHeight()) / $(".letter-list li").length)
            $(".letter-list ul li").css({ "height": perH, 'lineHeight': perH + 'px' })
        }

        // 适应窗口
        $(window).resize(function () {
            setNavHeight();
            setMainHeight();
            setLetterHeight();
        })



        $(document).on("click", '[data-toggle="tooltip modal"]', function () {
            if ($(window).width() <= 800 && $(window).width() > 481) {
                setLayout(false, -130, 70, -200, 0, 0, -200);
                $(this).parents(".left-nav").removeClass('zIndex');
            } else if ($(window).width() <= 480) {
                setLayout(false, -200, 0, -200, 0, -70, -200);
                $(".left-nav").removeClass('zIndex');
            }
        })

        // 菜单适应宽度
        function setLayout(arrow, fixnav, fixcontent, fullnav, fullcontent, fixaside, fullaside) {
            if (arrow === true) {
                $(".toggle-menu .fa-caret-right").hide();
                $(".toggle-menu .fa-caret-left").css("display", "block");
            } else {
                $(".toggle-menu .fa-caret-left").hide();
                $(".toggle-menu .fa-caret-right").css("display", "block");
            };
            $(".fixed-nav .left-nav").stop().animate({ 'left': fixnav }, 200);
            $(".fixed-nav #content").stop().animate({ 'left': fixcontent }, 200);
            $(".fullwidth-nav .left-nav").stop().animate({ 'left': fullnav }, 200);
            $(".fullwidth-nav #content").stop().animate({ 'left': fullcontent }, 200);
            $(".fixed-nav .fold-menu").stop().animate({ 'left': fixaside }, 200);
            $(".fullwidth-nav .fold-menu").stop().animate({ 'left': fullaside }, 200);
        }
        $(window).resize(function () {
            if ($(window).width() > 1024) {
                setLayout(true, 70, 270, 200, 400, 0, 0);
            } else if ($(window).width() <= 1024 && $(window).width() > 800) {
                setLayout(false, -130, 70, 0, 200, 0, 0);
            } else if ($(window).width() <= 800 && $(window).width() > 481) {
                setLayout(false, -130, 70, -200, 0, 0, -200);
            } else if ($(window).width() <= 480) {
                setLayout(false, -200, 0, -200, 0, -70, -200);
            }
        });
        $(document).on("click", ".toggle-menu .fa-caret-left", function () {
            if ($(window).width() > 800) {
                setLayout(false, -130, 70, 0, 200);
            } else if ($(window).width() <= 800 && $(window).width() > 480) {
                setLayout(false, -130, 70, -200, 0, 0, -200);
            } else if ($(window).width() <= 480) {
                setLayout(false, -200, 0, -200, 0, -70, -200);
            }
        }).on("click", ".toggle-menu .fa-caret-right", function () {
            if ($(window).width() > 800) {
                setLayout(true, 70, 270, 200, 400);
            } else if ($(window).width() <= 800 && $(window).width() > 480) {
                setLayout(true, 70, 70, 200, 0, 0, 0);
                $(".left-nav").addClass('zIndex');
            } else if ($(window).width() <= 480) {
                $(".left-nav").addClass('zIndex');
                setLayout(true, 70, 0, 200, 0, 0, 0);
            }
        }).on("click", function (e) {
            if ($(window).width() <= 800 && $(window).width() > 481 && $(e.target).closest(".left-nav").length == 0 && $(e.target).closest(".fold-menu").length == 0) {
                setLayout(false, -130, 70, -200, 0, 0, -200);
                $(".left-nav").removeClass('zIndex');
            } else if ($(window).width() <= 480 && $(e.target).closest(".left-nav").length == 0 && $(e.target).closest(".fold-menu").length == 0) {
                setLayout(false, -200, 0, -200, 0, -70, -200);
                $(".left-nav").removeClass('zIndex');
            }
        })

        // 搜索
        $.fn.extend({
            showSearch: function() {
                var w = this.data("outerWidth") || this.data("outerWidth", this.outerWidth()).data("outerWidth");
                $(".contentpanel").stop().animate({'margin-left':w},200);
                this.attr("data-animate", "flipInY");
                if ($(window).width() > 1024) {
                    setLayout(false, -130, 70, 200, 400, 0, 0);
                }
                return this;
            },
            hideSearch: function() {
                this.attr("data-animate", "flipOutY");
                $(".contentpanel").stop().animate({'margin-left':0},200)
                if ($(window).width() > 1024) {
                    setLayout(true, 70, 270, 200, 400, 0, 0);
                } else if ($(window).width() <= 1024 && $(window).width() > 800) {
                    setLayout(false, -130, 70, 0, 200, 0, 0);
                } else if ($(window).width() <= 800 && $(window).width() > 481) {
                    setLayout(false, -130, 70, -200, 0, 0, -200);
                } else if ($(window).width() <= 480) {
                    setLayout(false, -200, 0, -200, 0, -70, -200);
                }
                return this;
            },
            toggleSearch: function () {
                var $ele = $(this.attr("data-search"))
                if ($ele.is(":visible")) {
                    $ele.hideSearch();
                    this.find("i").removeClass("fa-search-minus").addClass("fa-search-plus");
                } else {
                    $ele.showSearch();
                    this.find("i").addClass("fa-search-minus").removeClass("fa-search-plus");
                }
            }
        });

        $(document).on("click", "[data-search-close]", function () {
            $("[data-search='#" + $('.search-panel').attr("id") + "']").toggleSearch();
        })

        // 树菜单经过事件
        $(document).on("mouseenter", ".editTree .bbit-tree-node-el:visible", function () {
            $('.tree-icons', this).length || $('.bbit-tree-node-anchor', this).append('<div class="tree-icons"><i class="fa fa-edit"></i><i class="fa fa-trash"></i></div>');
        }).on("mouseleave", ".editTree .bbit-tree-node-el:visible", function () { $('.tree-icons', this).remove(); })

        // 弹出滑动层
        $.fn.extend({
            showProp: function () {
                var dir = this.attr("data-prop-direction");
                switch (dir) {
                    case "left":
                        this.stop().animate({ "left": 0 }, 200);
                        break;
                    case "right":
                        this.stop().animate({ "right": 0 }, 200);
                        break;
                    case "top":
                        this.stop().animate({ "top": 0 }, 200);
                        break;
                    case "bottom":
                        this.stop().animate({ "bottom": 0 }, 200);
                        break;
                };
                return this;
            },
            hideProp: function () {
                var dir = this.attr("data-prop-direction");
                if (this.css(dir) == '0px') {
                    var effect = {};
                    effect[dir] = '-100%';
                    this.stop().animate(effect, 200);
                }
                return this;
            }
        });

        $(document).on('click', '[data-prop-class]', function () {
            $($(this).attr('data-prop-class')).showProp()
        })

        // 点击空白关闭滑动层
        var props = $("[data-prop-direction]");
        $(document).on("click", "[data-prop-direction],.modal-backdrop,.modal,[data-prop-class],[data-toggle*='tooltip modal']", function (e) {
            e.stopPropagation();
        })
        $(document).on("click", function (e) {
            $("[data-prop-direction]").each(function () {
                $(this).hideProp();
            });
        })

        // 关闭滑动层
        $(document).on("click", "[data-close-slider = self ]", function () {  //关闭当前滑动层
            $(this).parents(".prop-slider").hideProp();
        }).on("click", "[data-close-slider = all]", function () {   //关闭所有滑动层
            $("[data-prop-direction]").each(function () {
                $(this).hideProp();
            })
        })

        // 拖拽排序
        $(".sortable-table").sortable({
            cursor: "move",
            axis: "y"
        }).on("sortstart", function (event, ui) {
            var _this = $(this);
            ui.item.attr('sorted', 'sorted')
            ui.item.find('td').each(function (i) {
                $(this).outerWidth(_this.find('tr:first td').eq(i).outerWidth())
            });
        }).disableSelection();

        // 下拉选择
        $(".select-autocomplete").select2({
            placeholder: $(this).attr("data-placeholder")
        });


        /** 表单向导 start**/
        $(document).on("click", ".wizard .wizard-header li", function () {
            var $self = $(this);
            showWizard($self.closest(".wizard"), $self.index())
        }).on("click", ".wizard-footer .next", function (e) {
            if (!coreState.FormState) return;
            var $self = $(this).closest(".wizard");
            showWizard($self, $self.find(".wizard-pane.active").index() + 1)
        }).on("click", ".wizard-footer .previous:not(.disabled)", function (e) {
            var $self = $(this).closest(".wizard");
            showWizard($self, $self.find(".wizard-pane.active").index() - 1)
        })

        function showWizard(obj, i) {
            i > 0 ? obj.find(".previous").removeClass("disabled") :
                obj.find(".previous").addClass("disabled")
            if (i == obj.find(".wizard-header li").length - 1) {
                obj.find(".next").hide().siblings().removeClass("hide");
            } else {
                obj.find(".next").show().siblings().addClass("hide");
            }
            obj.find(".wizard-header li:eq(" + i + ")").addClass("active").siblings("li").removeClass("active");
            obj.find(".wizard-pane:eq(" + i + ")").addClass("active").siblings(".wizard-pane").removeClass('active');
        }
        /** 表单向导 end**/

        /** 选项卡 start**/
        $(document).on("click", ".tabs > .nav > li", function () {
            var $nav = $(this).addClass("active"),
                $tabs = $nav.closest('.tabs'),
                $pane = $tabs.children('.tab-content').children('.tab-pane:eq(' + $nav.index() + ')').addClass("active"),
                last = $tabs.data('last');

            last && (last.$nav.removeClass("active"),
            last.$pane.removeClass("active")) || ($nav.siblings("li.active:first").removeClass("active"),
            $pane.siblings(".tab-pane.active:first").removeClass("active")),

            $tabs.data('last', { $nav: $nav, $pane: $pane })
        })
        /** 选项卡 end**/
        /** 隐藏浮动层 start**/
        .on('click', function (e) {
            if (!$(e.target).closest(".dropdown-box").is('.dropdown-box') && e.target.parentNode) $('.dropdown-box').hide()
        })
        /** 隐藏浮动层 end**/
        // 自定义模态
        $(document).on("click", "[data-modal]", function (e) {
            e.stopPropagation();
            var ele = $($(this).attr("data-modal"));
            ele.show();
        })
        .on("click", "[data-close-self]", function () {
            $(this).parents(".custom-modal,.dropdown-box").hide();
        })
        .on("click", "[data-blank-off]", function (e) {
            if ($(e.target).closest('.custom-modal-panel').length == 0) {
                $(this).hide();
            }
        })

        /** 导航 start**/
        $(document).on('click', '.header-bar > .toggle-menu', function () {
            var w = $(window).width();
            if (w <= 800 && w > 480) medium()
            else if (w <= 480) small()
            else large.bind(this)()
        });

        function large() {
            var $nav = $('body > #nav'), $c = $nav.next(), w = $c.outerWidth(true);
            $('i', this).toggleClass('fa-caret-right', 'fa-caret-left')
            if (parseInt($nav.css('marginLeft')) < 0) {
                $nav.stop().animate({ 'marginLeft': 0 }, 200),
                $c.animate({ 'width': (w - 200) + 'px' }, 200, function () { $c.css('width', 'calc(100% - 270px)') })
            } else {
                $nav.stop().animate({ 'marginLeft': -200 }, 200)
                $c.animate({ 'width': w + 200 + 'px' }, 200, function () { $c.css('width', 'calc(100% - 70px)') })
            }
        }

        function medium() { }

        function small() { }
        /** 导航 end**/


        /** 左边栏滚动条 **/
        $(function () { CustomScrollbar.call($('.lef-mainnnav')) })
        /** 左边栏滚动条 **/

        /** tooltip **/
        $(document).on('mouseover', '[data-toggle*="tooltip"]', function () { $(this).removeAttr('data-toggle').tooltip().triggerHandler('mouseover') })
        /** tooltip **/

        return {
            ToolBarLoaded: function (s, e) {

            },
            NavLoaded: function (s, e) {
                /** 导航区滚动条 **/
                CustomScrollbar.call($('.subcontent', e.$element))
                /** 导航区滚动条 **/
                CustomScrollbar.call($('.open-navigation,.search_panel'))
            },
            ContainerLoaded: function (s, e) {

            },
            ContentLoaded: function (s, e) {
                //$('[data-toggle="popover"]', e.$element).popover()
                setNavHeight();
                setMainHeight();
                setLetterHeight();
            }
        };

        //滚动条设置
        function CustomScrollbar() {
            this.mCustomScrollbar({ theme: "minimal" });
        }

    });