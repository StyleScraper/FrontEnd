# FrontEnd
little FrontEnd Helper in Javascript (jQuery)

Helper to generate overlays, 
get text information (font-size, line-height, font-family), 
setting dev-class to body-tag, 
showing the bootstrap-grid

easy to modify for own helper integrations
****

**Dependency:**

jQuery 

**Usage:**

One can use it in development via direct integration of the script.

call it in jQuery's ready-function:

    var mydev = new FrontEnd();
    mydev.init();
    
There is an interval class changer implemented,
for setting the switching classes use:

    var mydev = new FrontEnd();
    mydev.setIntervalClasses(['default', 'white', 'grey', 'inverted', 'lightblue']);
    mydev.init();
    
before the **init()** call.

**Testing/Usage via Favelet**

One of the useful tools, that have fallen into oblivion is the favelet.
Just copy the javascript content from the js/favelet.js file and paste it into the address-input of a new favorite link.
Once it is set up one can just open a website and click the favelet button.

**Opening the dev-menu**

Doubleclick in the website's body and it will appear in the upper right corner.

**Known issue**

If the website has set up the CORS explicitly, the implementation is going to fail due to this.