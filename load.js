$(document).ready(function()
{
    var s = document.createElement('script');
    if (check()) {
        s.src = 'gallery_es6script.js';
    } else {
        s.src = 'gallery_es5script.js';
    }
    document.head.appendChild(s);
});

function check() 
{
    if (typeof Symbol == 'undefined') return false;

    try 
    {
        eval('class Foo {}');
        eval('var bar = (x) => x+1');
    } catch (e) { 
        return false; 
    }

    return true;
}