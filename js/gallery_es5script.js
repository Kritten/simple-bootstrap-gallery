'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Listener_Touch = function () {
    function Listener_Touch(target) {
        _classCallCheck(this, Listener_Touch);

        this.m_target = target;
        this.m_callback_touch = undefined;
        this.m_callback_swipe = undefined;
        this.m_threshold_swipe = 100;

        this.client_x_start = undefined;
        this.client_y_start = undefined;

        var that = this;

        this.m_target.on('touchstart', function (e) {
            this.client_x_start = e.originalEvent.touches[0].clientX;
            this.client_y_start = e.originalEvent.touches[0].clientY;
        });

        this.m_target.on('touchend', function (e) {
            var delta_x = e.originalEvent.changedTouches[0].clientX - this.client_x_start;
            var delta_y = e.originalEvent.changedTouches[0].clientY - this.client_y_start;
            var delta_x_abs = Math.abs(delta_x);
            var delta_y_abs = Math.abs(delta_y);

            if (delta_x_abs < that.m_threshold_swipe && delta_y_abs < that.m_threshold_swipe) {
                that.m_callback_touch();
            } else {
                that.m_callback_swipe(delta_x, delta_y, delta_x_abs, delta_y_abs);
            }
        });
    }

    _createClass(Listener_Touch, [{
        key: 'on_touch',
        set: function set(callback) {
            this.m_callback_touch = callback;
        }
    }, {
        key: 'on_swipe',
        set: function set(callback) {
            this.m_callback_swipe = callback;
        }
    }]);

    return Listener_Touch;
}();

var Gallery = function () {
    function Gallery(html_modal, css_gallery) {
        _classCallCheck(this, Gallery);

        this.m_name_class_image = '.sbg-image';

        // this.m_duration_transition_images = 0; 
        this.m_duration_transition_images = 200;
        this.m_duration_transition_controls = 100;
        this.m_is_transitioning = false;

        this.m_a_active = false;
        this.m_gallery_active = undefined;

        this.m_html_modal = html_modal;
        this.m_css_gallery = css_gallery;
        this.m_image = new Image();

        this.m_map_galleries = new Map();
        this.m_map_galleries.set('default', this.create_new_gallery());

        this.init();
    }

    _createClass(Gallery, [{
        key: 'init',
        value: function init() {
            $('body').append(this.m_html_modal);
            $('head').append(this.m_css_gallery);

            var that = this;

            $(this.m_name_class_image).each(function (index, image) {
                var jquery_image = $(image);
                var src = jquery_image.data('src');
                if (src == undefined) {
                    src = jquery_image.prop('src');
                }

                var gallery = that.select_gallery(jquery_image);
                gallery.map_images.set(src, gallery.list_images.length);
                gallery.list_images.push(src);
            });

            this.m_image_a = $('#wrapper_gallery img.a');
            this.m_image_b = $('#wrapper_gallery img.b');

            this.m_image_a.hide();
            this.m_image_b.hide();

            $(this.m_name_class_image).on('click', function () {
                that.click_on_thumbnail(this);
            });

            this.m_image.onload = function () {
                that.onload_image(this);
            };

            if (!('ontouchstart' in document.documentElement)) {
                $('.carousel-control').hover(function () {
                    $(this).fadeTo(that.m_duration_transition_controls, 1.0);
                }, function () {
                    $(this).fadeTo(that.m_duration_transition_controls, 0.5);
                });

                $('.carousel-control').on('click', function () {
                    var direction = $(this).data('direction');
                    that.click_on_control(direction);
                });

                $(window).on('keyup', function (e) {
                    if (e.which == 37 || e.which == 33) {
                        that.click_on_control('left');
                    } else if (e.which == 39 || e.which == 34) {
                        that.click_on_control('right');
                    }
                });
            } else {
                $('.carousel-control[data-direction="left"]').hide();
                $('.carousel-control[data-direction="center"]').hide();
                $('.carousel-control[data-direction="right"]').hide();

                this.m_touch_listener = new Listener_Touch($('#wrapper_gallery'));

                this.m_touch_listener.on_touch = function () {
                    that.click_on_control('center');
                };
                this.m_touch_listener.on_swipe = function (delta_x, delta_y, delta_x_abs, delta_y_abs) {
                    if (delta_x_abs > delta_y_abs) {
                        if (delta_x < 0) {
                            that.click_on_control('right');
                        } else {
                            that.click_on_control('left');
                        }
                    }
                };
            }
        }
    }, {
        key: 'click_on_thumbnail',
        value: function click_on_thumbnail(image) {
            var jquery_image = $(image);
            var src = jquery_image.data('src');
            if (src == undefined) {
                src = jquery_image.prop('src');
            }

            var gallery = this.select_gallery(jquery_image);

            this.m_gallery_active = gallery;
            gallery.index_current = gallery.map_images.get(src);

            this.m_image_a.prop('src', '');
            this.m_image_b.prop('src', '');

            $('#gallery_modal_image').modal('show');
            $('#gallery_modal_image .loader').show();

            this.m_image.src = src;
        }
    }, {
        key: 'click_on_control',
        value: function click_on_control(direction) {
            if (direction == 'center') {
                $('#gallery_modal_image').modal('hide');
            } else if (!this.m_is_transitioning) {
                this.m_is_transitioning = true;

                if (direction == 'left') {
                    this.m_gallery_active.index_current -= 1;
                    if (this.m_gallery_active.index_current <= -1) this.m_gallery_active.index_current = this.m_gallery_active.list_images.length - 1;
                } else {
                    this.m_gallery_active.index_current += 1;
                    if (this.m_gallery_active.index_current >= this.m_gallery_active.list_images.length) this.m_gallery_active.index_current = 0;
                }

                $('#gallery_modal_image .loader').show();
                this.m_image.src = this.m_gallery_active.list_images[this.m_gallery_active.index_current];
            }
        }
    }, {
        key: 'onload_image',
        value: function onload_image(image) {
            var image_active = this.m_image_a;
            var image_inactive = this.m_image_b;

            if (this.m_a_active) {
                image_active = this.m_image_b;
                image_inactive = this.m_image_a;
            }

            image_active.prop('src', image.src);

            image_inactive.css('opacity', 1).fadeTo(this.m_duration_transition_images, 0, function () {});

            var that = this;

            image_active.css('opacity', 0).fadeTo(this.m_duration_transition_images, 1, function () {
                that.m_is_transitioning = false;
                that.m_a_active = !that.m_a_active;
            });

            $('#gallery_modal_image .loader').hide();
        }
    }, {
        key: 'create_new_gallery',
        value: function create_new_gallery() {
            return {
                index_current: 0,
                map_images: new Map(),
                list_images: []
            };
        }
    }, {
        key: 'select_gallery',
        value: function select_gallery(jquery_image) {
            var name_gallery = jquery_image.data('gallery');
            var gallery = this.m_map_galleries.get(name_gallery);
            if (gallery == undefined) {
                if (name_gallery == undefined) {
                    gallery = this.m_map_galleries.get('default');
                } else {
                    gallery = this.create_new_gallery();
                    this.m_map_galleries.set(name_gallery, gallery);
                }
            }
            return gallery;
        }
    }]);

    return Gallery;
}();

var css_gallery = '\n<style type="text/css">\n    .modal-backdrop.show {\n        opacity: 0.9 !important;\n    }\n    #wrapper_gallery {\n        height: calc(100vh - 20px);\n    }\n    @media (min-width: 576px) {\n        #wrapper_gallery {\n            margin-left: 50px;\n            width: calc(100% - 100px);\n            height: calc(100vh - 60px);\n        }\n    }\n    #wrapper_gallery img {\n        max-height: calc(100vh - 20px);\n        max-width: calc(100vw - 20px);\n        width: auto;\n        position: absolute;\n    }\n    @media (min-width: 576px) {\n        #wrapper_gallery img {\n            max-height: calc(100vh - 60px);\n            max-width: calc(500px - 100px);\n        }\n    }\n    @media (min-width: 992px) {\n        #wrapper_gallery img {\n            max-width: calc(800px - 100px);\n        }\n    }\n    @media (min-width: 1200px) {\n        #wrapper_gallery img {\n            max-width: calc(1200px - 100px);\n        }\n    }\n    @media (min-width: 1200px) {\n        #gallery_modal_image .modal-dialog {\n            max-width: 1200px;\n        }\n    }\n    #gallery_modal_image .modal-content {\n        border: none;\n        background-color: transparent;\n    }\n    .carousel-control {\n        cursor: pointer;\n        position: absolute;\n        width: 50px; \n        height: calc(100vh - 60px);\n        z-index: 50;\n        opacity: 0.5;\n    }\n    .carousel-control[data-direction="center"] {\n        z-index: 100;\n        height: 50px; \n        right: 0;\n        text-align: center;\n        color: #fff;\n        line-height: 3rem;\n        font-size: 6rem;\n    }\n    .carousel-control[data-direction="right"] {\n        text-align: right;\n        right: 0;\n    }\n    #wrapper_gallery {\n        -moz-user-select: none;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n    .arrow {\n        border: solid #fff;\n        border-width: 0 0.5rem 0.5rem 0;\n        display: inline-block;\n        padding: 1rem;\n        margin-top: calc(50vh - 30px - 0.75rem);\n    }\n    .left {\n        transform: rotate(135deg);\n        -webkit-transform: rotate(135deg);\n    }\n    .right {\n        transform: rotate(-45deg);\n        -webkit-transform: rotate(-45deg);\n    }\n\n    .loader {\n        /* position: absolute;\n        color: #fff; */\n        z-index: 5;\n        border: 0.75rem solid rgba(255, 255, 255, 0.5);\n        border-top: 0.75rem solid #fff;\n        border-radius: 50%;\n        width: 6rem;\n        height: 6rem;\n        animation: spin 2s linear infinite;\n        -webkit-animation: spin 2s linear infinite;\n\n    }\n    .wrapper_loader {\n\n        z-index: 5;\n        position: absolute;\n    }\n    @keyframes spin {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n    }\n    @media screen and (-ms-high-contrast: active),\n        (-ms-high-contrast: none) {\n        #wrapper_gallery img {\n            transform: translate(-50%, -50%);\n        }\n        #gallery_modal_image {\n            min-height: 5000px;\n        }\n        .wrapper_loader {\n            display: none;\n        }\n    }\n</style>\n';

var html_modal = '\n<div class="modal fade" id="gallery_modal_image" tabindex="-1" role="dialog">\n    <div class="modal-dialog modal-lg" role="document">\n        <div class="modal-content">\n            <div data-direction="left" class="carousel-control">\n                <i class="arrow left"></i>\n            </div>\n            <div data-direction="right" class="carousel-control">\n                <i class="arrow right"></i>\n            </div>\n            <div data-direction="center" class="carousel-control tmp_align-self-stretch">\n                &times;\n            </div>\n            <div id="wrapper_gallery" class="d-flex flex-row align-items-center justify-content-center">\n                <div class="wrapper_loader"><div class="loader"></div></div>\n                <img class="a rounded" src="">\n                <img class="b rounded" src="">\n            </div>\n        </div>\n    </div>\n</div>\n';

var gallery = new Gallery(html_modal, css_gallery);