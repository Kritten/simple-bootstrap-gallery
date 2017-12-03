/**
 * simple-bootstra-gallery (https://github.com/Kritten/simple-bootstrap-gallery)
 * Copyright Kristof Komlossy (Kritten)
 * All rights reserved.
 */
class Listener_Touch
{
    constructor(target)
    {
        this.m_target = target;
        this.m_callback_touch = undefined;
        this.m_callback_swipe = undefined;
        this.m_threshold_swipe = 100;

        this.client_x_start = undefined;
        this.client_y_start = undefined;

        const that = this;

        this.m_target.on('touchstart', function(e) {
           this.client_x_start = e.originalEvent.touches[0].clientX;
           this.client_y_start = e.originalEvent.touches[0].clientY;
        });

        this.m_target.on('touchend', function(e) {
            const delta_x = e.originalEvent.changedTouches[0].clientX - this.client_x_start;
            const delta_y = e.originalEvent.changedTouches[0].clientY - this.client_y_start;
            const delta_x_abs = Math.abs(delta_x);
            const delta_y_abs = Math.abs(delta_y);

            if(delta_x_abs < that.m_threshold_swipe && delta_y_abs < that.m_threshold_swipe)
            {
                that.m_callback_touch();
            } else {
                that.m_callback_swipe(delta_x, delta_y, delta_x_abs, delta_y_abs);
            }
        });
    }

    set on_touch(callback) 
    {
        this.m_callback_touch = callback;
    }

    set on_swipe(callback) 
    {
        this.m_callback_swipe = callback;
    }
}

class Gallery 
{
    constructor(html_modal, css_gallery) {
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
        this.m_map_galleries.set('sbg-default', this.create_new_gallery());

        this.init();
    }

    init()
    {
        $('body').append(this.m_html_modal);
        $('head').append(this.m_css_gallery);

        const that = this;

        $(this.m_name_class_image).each(function(index, image) {
            const jquery_image = $(image);
            let src = jquery_image.data('sbg-src');
            if(src == undefined)
            {
                src = jquery_image.prop('src');
            }

            const gallery = that.select_gallery(jquery_image);
            gallery.map_images.set(src, gallery.list_images.length);
            gallery.list_images.push(src);
        });

        this.m_image_a = $('#wrapper_gallery img.a');
        this.m_image_b = $('#wrapper_gallery img.b');

        this.m_image_a.hide();
        this.m_image_b.hide();

        $(this.m_name_class_image).on('click', function() {
            that.click_on_thumbnail(this);
        });

        this.m_image.onload = function(){
            that.onload_image(this);
        };

        if(!('ontouchstart' in document.documentElement))
        {
            $('.carousel-control').hover(function() {
                $(this).fadeTo(that.m_duration_transition_controls, 1.0);
            }, function() {
                $(this).fadeTo(that.m_duration_transition_controls, 0.5);
            })

            $('.carousel-control').on('click', function() {
                const direction = $(this).data('direction');
                that.click_on_control(direction);
            });

            $(window).on('keyup', function(e) {
                if(e.which == 37 ||e.which == 33)
                {
                    that.click_on_control('left');
                } else if(e.which == 39 ||e.which == 34) {
                    that.click_on_control('right');
                }
            });
        } else {
            $('.carousel-control[data-direction="left"]').hide();
            $('.carousel-control[data-direction="center"]').hide();
            $('.carousel-control[data-direction="right"]').hide();

            this.m_touch_listener = new Listener_Touch($('#wrapper_gallery'));
            
            this.m_touch_listener.on_touch = function() {
                that.click_on_control('center');
            };
            this.m_touch_listener.on_swipe = function(delta_x, delta_y, delta_x_abs, delta_y_abs) {
                if(delta_x_abs > delta_y_abs) 
                {
                    if(delta_x < 0) 
                    {
                        that.click_on_control('right');
                    } else {
                        that.click_on_control('left');
                    }
                }
            };
        }
    }

    click_on_thumbnail(image)
    {   
        const jquery_image = $(image);
        let src = jquery_image.data('sbg-src');
        if(src == undefined)
        {
            src = jquery_image.prop('src');
        }

        const gallery = this.select_gallery(jquery_image);

        this.m_gallery_active = gallery;
        gallery.index_current = gallery.map_images.get(src);

        this.m_image_a.prop('src', '');
        this.m_image_b.prop('src', '');

        $('#gallery_modal_image').modal('show');
        $('#gallery_modal_image .loader').show();

        this.m_image.src = src;
    }

    click_on_control(direction) 
    {
        if(direction == 'center')
        {
            $('#gallery_modal_image').modal('hide');
        } else if(!this.m_is_transitioning) {
            this.m_is_transitioning = true;

            if(direction == 'left')
            {
                this.m_gallery_active.index_current -= 1;
                if(this.m_gallery_active.index_current <= -1) this.m_gallery_active.index_current = this.m_gallery_active.list_images.length - 1;
            } else {
                this.m_gallery_active.index_current += 1;
                if(this.m_gallery_active.index_current >= this.m_gallery_active.list_images.length) this.m_gallery_active.index_current = 0;
            }

            $('#gallery_modal_image .loader').show();
            this.m_image.src = this.m_gallery_active.list_images[this.m_gallery_active.index_current];
        }
    }

    onload_image(image)
    {
        let image_active = this.m_image_a;
        let image_inactive = this.m_image_b;

        if(this.m_a_active)
        {
            image_active = this.m_image_b;
            image_inactive = this.m_image_a;
        }

        image_active.prop('src', image.src);

        image_inactive.css('opacity', 1).fadeTo(this.m_duration_transition_images, 0, function() {});
        
        const that = this;

        image_active.css('opacity', 0).fadeTo(this.m_duration_transition_images, 1, function() {
            that.m_is_transitioning = false;
            that.m_a_active = !that.m_a_active;
        });
        
        $('#gallery_modal_image .loader').hide();
    }

    create_new_gallery()
    {
        return {
            index_current: 0,
            map_images: new Map(),
            list_images: []
        };
    }

    select_gallery(jquery_image)
    {
        const name_gallery = jquery_image.data('sbg-gallery');
        let gallery = this.m_map_galleries.get(name_gallery);
        if(gallery == undefined)
        {
            if(name_gallery == undefined)
            {
                gallery = this.m_map_galleries.get('sbg-default');
            } else {
                gallery = this.create_new_gallery();
                this.m_map_galleries.set(name_gallery, gallery);
            }
        }
        return gallery;
    }
}

const css_gallery = `
<style type="text/css">
    .modal-backdrop.show {
        opacity: 0.9 !important;
    }
    #wrapper_gallery {
        height: calc(100vh - 20px);
    }
    @media (min-width: 576px) {
        #wrapper_gallery {
            margin-left: 50px;
            width: calc(100% - 100px);
            height: calc(100vh - 60px);
        }
    }
    #wrapper_gallery img {
        max-height: calc(100vh - 20px);
        max-width: calc(100vw - 20px);
        width: auto;
        position: absolute;
    }
    @media (min-width: 576px) {
        #wrapper_gallery img {
            max-height: calc(100vh - 60px);
            max-width: calc(500px - 100px);
        }
    }
    @media (min-width: 992px) {
        #wrapper_gallery img {
            max-width: calc(800px - 100px);
        }
    }
    @media (min-width: 1200px) {
        #wrapper_gallery img {
            max-width: calc(1200px - 100px);
        }
    }
    @media (min-width: 1200px) {
        #gallery_modal_image .modal-dialog {
            max-width: 1200px;
        }
    }
    #gallery_modal_image .modal-content {
        border: none;
        background-color: transparent;
    }
    .carousel-control {
        cursor: pointer;
        position: absolute;
        width: 50px; 
        height: calc(100vh - 60px);
        z-index: 50;
        opacity: 0.5;
    }
    .carousel-control[data-direction="center"] {
        z-index: 100;
        height: 50px; 
        right: 0;
        text-align: center;
        color: #fff;
        line-height: 3rem;
        font-size: 6rem;
    }
    .carousel-control[data-direction="right"] {
        text-align: right;
        right: 0;
    }
    #wrapper_gallery {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .arrow {
        border: solid #fff;
        border-width: 0 0.5rem 0.5rem 0;
        display: inline-block;
        padding: 1rem;
        margin-top: calc(50vh - 30px - 0.75rem);
    }
    .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }
    .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }

    .loader {
        /* position: absolute;
        color: #fff; */
        z-index: 5;
        border: 0.75rem solid rgba(255, 255, 255, 0.5);
        border-top: 0.75rem solid #fff;
        border-radius: 50%;
        width: 6rem;
        height: 6rem;
        animation: spin 2s linear infinite;
        -webkit-animation: spin 2s linear infinite;

    }
    .wrapper_loader {

        z-index: 5;
        position: absolute;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @media screen and (-ms-high-contrast: active),
        (-ms-high-contrast: none) {
        #wrapper_gallery img {
            transform: translate(-50%, -50%);
        }
        #gallery_modal_image {
            min-height: 5000px;
        }
        .wrapper_loader {
            display: none;
        }
    }
</style>
`;

const html_modal = `
<div class="modal fade" id="gallery_modal_image" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div data-direction="left" class="carousel-control">
                <i class="arrow left"></i>
            </div>
            <div data-direction="right" class="carousel-control">
                <i class="arrow right"></i>
            </div>
            <div data-direction="center" class="carousel-control tmp_align-self-stretch">
                &times;
            </div>
            <div id="wrapper_gallery" class="d-flex flex-row align-items-center justify-content-center">
                <div class="wrapper_loader"><div class="loader"></div></div>
                <img class="a rounded" src="">
                <img class="b rounded" src="">
            </div>
        </div>
    </div>
</div>
`;

const gallery = new Gallery(html_modal, css_gallery);