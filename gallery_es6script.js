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
        this.m_duration_transition_images = 300; 
        this.m_duration_transition_controls = 100; 
        this.m_is_transitioning = false; 
        this.m_index_current = 0;

        this.m_a_active = false;

        this.m_html_modal = html_modal;
        this.m_css_gallery = css_gallery;
        this.m_image = new Image();

        this.m_map_images = new Map();
        this.m_list_images = [];

        this.init();
    }

    init()
    {
        $('body').append(this.m_html_modal);
        $('head').append(this.m_css_gallery);

        const that = this;

        $('.gallery').each(function(index, image) {
            const src = $(image).data('src');
            that.m_list_images.push(src);
            that.m_map_images.set(src, index);
        });

        this.m_image_a = $('#wrapper_gallery img.a');
        this.m_image_b = $('#wrapper_gallery img.b');

        this.m_image_a.hide();
        this.m_image_b.hide();

        $('.gallery').on('click', function() {
            that.click_on_thumbnail(this);
        });

        this.m_image.onload = function(){
            that.onload_image(this);
        };

        if(!('ontouchstart' in document.documentElement))
        {
            $('.carousel-control').hover(function() {
                $(this).find('i').fadeTo(that.m_duration_transition_controls, 1.0);
            }, function() {
                $(this).find('i').fadeTo(that.m_duration_transition_controls, 0.5);
            })

            $('.carousel-control').on('click', function() {
                const direction = $(this).data('direction');
                that.click_on_control(direction);
            });

            $(window).on('keyup', function(e) {
                if(e.which == 37)
                {
                    that.click_on_control('left');
                } else if(e.which == 39) {
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

    click_on_thumbnail(img)
    {
        const src = $(img).data('src');

        this.m_index_current = this.m_map_images.get(src);

        this.m_image_a.prop('src', '');
        this.m_image_b.prop('src', '');

        $('#gallery_modal_image').modal('show');
        $('#gallery_modal_image .fa-spinner').show();

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
                this.m_index_current -= 1;
                if(this.m_index_current <= -1) this.m_index_current = this.m_list_images.length - 1;
            } else {
                this.m_index_current += 1;
                if(this.m_index_current >= this.m_list_images.length) this.m_index_current = 0;
            }

            $('#gallery_modal_image .fa-spinner').show();
            this.m_image.src = this.m_list_images[this.m_index_current];
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

        image_inactive.fadeOut(this.m_duration_transition_images, function() {});
        
        const that = this;

        image_active.fadeIn(this.m_duration_transition_images, function() {
            that.m_is_transitioning = false;
            that.m_a_active = !that.m_a_active;
        });
        
        $('#gallery_modal_image .fa-spinner').hide();
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
    #wrapper_gallery .fa-spinner {
        z-index: 5;
        position: absolute;
        color: #fff;
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
        display: table;
        font-size: 3rem;
        z-index: 50;
    }
    .carousel-control i {
        color: #fff;
        opacity: 0.5;
        vertical-align: middle;
        display: table-cell;
    }
    .carousel-control[data-direction="center"] {
        z-index: 100;
        height: 50px; 
        right: 0;
        text-align: center;
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
</style>
`;

const html_modal = `
<i class="fa fa-spinner fa-pulse fa-3x fa-fw position-fixed" style="opacity: 0"></i>
<div class="modal fade" id="gallery_modal_image" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div data-direction="left" class="carousel-control">
                <i class="fa fa-chevron-left"></i>
            </div>
            <div data-direction="right" class="carousel-control">
                <i class="fa fa-chevron-right"></i>
            </div>
            <div data-direction="center" class="carousel-control align-self-stretch">
                <i class="fa fa-times"></i>
            </div>
            <div id="wrapper_gallery" class="d-flex flex-row align-items-center justify-content-center">
                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                <img class="a rounded" src="">
                <img class="b rounded" src="">
            </div>
        </div>
    </div>
</div>
`;

const gallery = new Gallery(html_modal, css_gallery);