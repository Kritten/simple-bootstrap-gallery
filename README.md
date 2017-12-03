# simple-bootstrap-gallery

[DEMO](https://kritten.org/demo/simple-bootstrap-gallery)

The main idea behind this library is to create an easy to integrate and easy to use gallery. 
Most of the configuration of the library can be done without any javascript via html data attributes 

## Features
* dynamic device specific navigation:
    
    Device | open lightbox | previous image | next image | close lightbox
    ---|---|---|---
    desktop | click on image | left arrow key, <br/> page up, <br/> click on left arrow | right arrow key, <br/> page down, <br/> click on right arrow | escape key, <br/> click outside of lightbox, <br/> click on closing symbol
    mobile | touch on image| swipe to right | swipe to right | touch anywhere
* multiple different, seperated galleries on the same page
* support for optional thumbnails
* every necessary html, css and javascript code is contained within the script

## Prerequisites
* [Bootstrap 4](https://getbootstrap.com/)
* [jQuery](https://jquery.com/) (any more or less recent version is sufficient, but **do not use the slim version**)

## Quickstart
1. Include the script into your webpage:
```html
<script src="gallery_es5script.js"></script>
```
2. Add the class 'sbg-image' to your images:
```html
<img src="image.jpg" class="sbg-image">
```
3. Thats it! All available options are described in the 'Usage' section.

## Browser Support
Tested with the following browser versions (other browsers or versions will most probably also work):
* Chrome 62+
* Firefox 57+
* Opera 49+
* Microsoft Edge 41+
* Internet Explorer 9, 11

## Usage
### Thumbnails
### Multiple Galleries