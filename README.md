# simple-bootstrap-gallery

[DEMO](https://sbg.kritten.org/)

The main idea behind this library is to create an easy to integrate and easy to use gallery.<br> 
Most of the configuration of the library can be done without any javascript via html data attributes 

## Features
* dynamic device specific navigation:
    
    Device | open lightbox | previous image | next image | close lightbox
    ---|---|---|---|---
    desktop | click on image | left arrow key, <br> page up, <br> click on left arrow | right arrow key, <br> page down, <br> click on right arrow | escape key, <br> click outside of lightbox, <br> click on closing symbol
    mobile | touch on image| swipe to right | swipe to right | touch anywhere
* multiple different, seperated galleries on the same page
* support for optional thumbnails
* every necessary html, css and javascript code is contained within the script

## Prerequisites
* [Bootstrap 4](https://getbootstrap.com/)
* [jQuery](https://jquery.com/) (any more or less recent version is sufficient, but **do not use the slim version**)

## Browser support
Tested with the following browser versions (other browsers or versions will most probably also work):
* Chrome 62+
* Firefox 57+
* Opera 49+
* Microsoft Edge 41+
* Internet Explorer 9, 11

## Quickstart
1. Include the script into your webpage:
```html
<script src="sbg.min.js"></script>
```
2. Add the class 'sbg-image' to your images:
```html
<img src="image.jpg" class="sbg-image">
```
3. Thats it! 

## Usage
### Available files
* `js/`
    * `sbg_dev.js` - development version
    * `sbg.min.js` - production version (minified, [transpiled](https://babeljs.io) to es2015)

### Thumbnails
Use the `src` attribute of the image tag to display your thumbnails. The high resolution image can be specified with the `data-sbg-src` attribute:
```html
<img src="thumbnail.jpg" data-sbg-src="image.jpg" class="sbg-image">
```

### Multiple galleries
You can use the `data-sbg-gallery` attribute to separate the images into different galleries.<br>
Every image with the same `data-sbg-gallery` value is assigned to the same virtual gallery.<br>
If the `data-sbg-gallery` attribute is not specified the image is assigned to the `sbg-default` gallery.

The following example creates three different galleries ('a', 'b' and 'sbg-default'):
```html
<img src="thumbnail1.jpg" data-sbg-src="image1.jpg" data-sbg-gallery="a" class="sbg-image">
<img src="thumbnail2.jpg" data-sbg-src="image2.jpg" data-sbg-gallery="a" class="sbg-image">
<img src="thumbnail3.jpg" data-sbg-src="image3.jpg" data-sbg-gallery="b" class="sbg-image">
<img src="thumbnail4.jpg" data-sbg-src="image4.jpg" data-sbg-gallery="b" class="sbg-image">
<img src="thumbnail5.jpg" data-sbg-src="image5.jpg" class="sbg-image">
```

### Custom settings
The library allows the user to adjust the settings for all the galleries or for specific galleries only.<br>
It is also possible to first adjust the settings for all galleries and then to override some of these settings for specific galleries.

To change all or some settings for all galleries on your page simply create the variable `sbg_settings` <b>before</b> you include the library.<br>
The variable is a javascript object with the names of the galleries as properties and  
```html
<script>
	var sbg_settings = {
		'sbg-default': {
			'transition_speed': 1000 
		}
	}
</script
<script src="sbg.min.js"></script>

```
You are able to adjust the following settings:
	setting | default | description
    ---|---
    transition_speed | 200 | The transition speed between two images.
