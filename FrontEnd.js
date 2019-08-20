;function FrontEnd() {
    var self            = this;
    self.intervalClasses= [];
    self.ddoms          = [
        'mvdns',
        'wwwqa',
        '.local',
        '.home.9uh'
    ];
    self.devMenu        = [
        {
            id      : 'ColorSet',
            prompt  : 'Set element selector for interval',
            action  : 'classInterval',
            param   : '.mod_fact_slider .cta',
            kill    : 'killClassInterval'
        },
        {
            id      : 'Grid',
            param   : 'grid',
            action  : 'testOverlay',
            kill    : 'hideOverlay'
        },
        {
            id      : 'ImageOverlay',
            prompt  : 'Set image path',
            param   : '//images.131.mvdns.de/nl/screenshot.242.jpg',
            action  : 'testOverlay',
            kill    : 'hideOverlay'
        },
        {
            id      : 'DevClass',
            action  : 'setDevClass',
            kill    : 'removeDevClass'
        },
        {
            id      : 'Font Identifier',
            action  : 'identifyFonts',
            kill    : 'removeFontident'
        },
    ];

    self.vars           = {
        console : false,
        init    : false
    };
    self.dependencies   = {};
    self.debugger       = null;


    self.init = function(){
        try{
            if(typeof window.console === 'object'){
                self.vars.console = true;
            }
            if(!self.checkDev()){
                throw new Error("...production mode...");
            }else{
                console.log('dev mode active');
                self.vars.init = true;
                self.buildDevMenu();
            }
        }catch(e){
            if(self.vars.console){
                console.log(e.message);
            }
        }
        if(!self.getDebug()){
            if(self.debug === true) {
                if (typeof (console) === 'object') {
                    console.error("Dependency \"debugger\" is missing.\ndebug automatically set to false.");
                }
                self.debug = false;
            }
        }

        if(self.debug) {
            self.debugger.debug(this);
        }
    };

    self.run = function(name, param){
        if(typeof self[name] === 'function') {
            self[name](param);
        }
    };

    self.buildDevMenu = function(){
        $('body').append('<div id="feDevMenu">');
        var dMenu = $('#feDevMenu');
        dMenu.on('click', 'a.devSwitch', function(e){
            var clicked = $(this);
            var response = null;
            if(clicked.hasClass('off')){
                //switch on
                clicked.removeClass('off').addClass('on');
                if(clicked.data('prompt') !== 'undefined'){
                    var myDefault = '';
                    if(clicked.data('param') !== 'undefined'){
                        myDefault = clicked.data('param');
                    }
                    response = window.prompt(clicked.data('prompt'),myDefault);
                    if(response != null && response.length>0){
                        self.run(clicked.data('action'), response);
                    }else{
                        clicked.removeClass('on').addClass('off');
                    }
                }else{
                    if(clicked.data('param') !== 'undefined'){
                        self.run(clicked.data('action'), clicked.data('param'));
                    }else{
                        self.run(clicked.data('action'));
                    }
                }
            }else{
                //switch off
                clicked.removeClass('on').addClass('off');
                self.run(clicked.data('kill'));
            }
        }).on('dblClick', function(){
            dMenu.fadeOut(200);
        }).hide(0);

        $(document).dblclick(function(){
            if(dMenu.is(':hidden')){
                dMenu.fadeIn(200);
            }else{
                dMenu.fadeOut(200);
            }
        });

        for(var i=0; i<self.devMenu.length; i++){
            dMenu.append(   '<p><a href="javascript:void(0);" data-param="'+self.devMenu[i].param+'" data-prompt="'+self.devMenu[i].prompt+'" ' +
                            'data-action="'+self.devMenu[i].action+'" data-kill="'+self.devMenu[i].kill+'" '+
                            'id="'+self.devMenu[i].id+'" class="devSwitch off">' +
                            '<span>'+self.devMenu[i].id+'</span><i class="fal fa-toggle-on"></i><i class="fal fa-toggle-off"></i></a></p>');
        }
    };
    /*
    dependency handling
    checking for dependencies, adding a dependency, getting a dependency
    */
    self.getDebug = function(){
        if(self.hasDependency('debugjs')){
            self.debugger = self.getDependency('debugjs');
            return true;
        }
        return false;
    };

    self.hasDependency = function(name){
        return !!self.dependencies[name];
    };

    self.addDependency = function(dependencyName, dependencyObject){
        if(!self.hasDependency(dependencyName)){
            /*
            if dependency is just another script/lib without particular object
            the dependencyObject becomes a String representing the dependencyName
            */
            if(typeof dependencyObject === 'undefined' || typeof dependencyObject === null ){
                dependencyObject = dependencyName;
            }
            self.dependencies[dependencyName] = dependencyObject;
        }else{
            if(typeof (console) === 'object'){
                console.error("Dependency already defined.\nPlease check the dependencies.");
            }
        }
    };
    self.getDependency = function(dependencyName){
        if(self.hasDependency(dependencyName)){
            return self.dependencies[dependencyName];
        }else{
            if(typeof (console) === 'object'){
                console.error("Dependency not available.\nPlease check the dependency for " + dependencyName + ".");
            }
            return null;
        }
    };

    self.classInterval = function(theModules){
        if(!self.vars.init){
            return null;
        }
        var switchCounter = 0;
        theModules = $(theModules);
        self.vars.CINTERVAL = setInterval(function(){
            theModules.removeClass(self.intervalClasses.join(' '));
            theModules.addClass(self.intervalClasses[switchCounter]);
            switchCounter++;
            if(switchCounter >= self.intervalClasses.length){
                switchCounter = 0;
            }
        }, 3000);
    };
    self.killClassInterval = function(){
        clearInterval(self.vars.CINTERVAL);
    };

    self.setIntervalClass = function(name){
        if(self.intervalClasses.indexOf(name) === -1){
            self.intervalClasses.push(name);
        }
    };

    self.setIntervalClasses = function(names){
        //check if names is Array or String
        if(Array.isArray(names)){
            for(var i=0; i<names.length; i++){
                self.setIntervalClass(names[i]);
            }
        }else{
            if(names instanceof String || typeof names === 'string'){
                names = names.split(',');
                for(var i=0; i<names.length; i++){
                    self.setIntervalClass(names[i].replace(/\s/g, ""));
                }
            }
        }
    };

    self.checkDev = function(){
        var allodbg = false;
        for(var i=0;i<self.ddoms.length;i++){
            if(top.location.href.indexOf(self.ddoms[i]) !== -1){
                allodbg = true;
                break;
            }
        }
        return allodbg;
    };

    self.testOverlay = function(imgUrl){
        if(!self.vars.init){
            return null;
        }
        self.vars['overlay'] = $('#testoverlay');
        self.vars['overlayImage'] = imgUrl;
        if(self.vars['overlay'].length === 0){
            $('body').append('<div id="testoverlay">');
            self.vars['overlay'] = $('#testoverlay');
            self.vars['overlay'].dblclick(function(e){
                e.stopPropagation();
                e.preventDefault();
                self.vars['overlay'].fadeOut(200, function () {
                    self.vars['overlay'].html('');
                });
                $('a#ImageOverlay').addClass('off').removeClass('on');
            });
        }

        if(self.vars.overlayImage !== 'grid'){
            var img = new Image();
            img.onload = function(){
                self.vars['overlay'].css({
                    'background-image' : 'url(\''+self.vars.overlayImage+'\')',
                    height: img.height,
                    width : img.width,
                    zIndex: 9999,
                    position: 'fixed',
                    opacity:0.7,
                    top:0,
                    right:0,
                    bottom:0,
                    left:0,
                    margin : 'auto',
                    display: 'none'
                }).draggable();
                self.vars['overlay'].fadeIn(200);
            };
            img.src = self.vars.overlayImage;
        }else{
            if(self.vars['overlay'].hasClass('ui-draggable')){
                self.vars['overlay'].draggable('destroy');
            }
            self.vars['overlay'].css({
                'background-image' : 'none',
                height: '100%',
                width : '100%',
                zIndex: 9999,
                position: 'fixed',
                top:0,
                right:0,
                bottom:0,
                left:0,
                margin : 'auto',
                display: 'none'
            }).html(
                '<div class="container"><div class="row">' +
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '<div class="col-1"><div class="gridbrd"></div></div>'+
                '</div></div>'
            ).fadeIn(200);
        }

    };

    self.hideOverlay = function(){
        self.vars['overlay'].fadeOut(200);
    };

    self.setDevClass = function(){
        if(!self.vars.init){
            return null;
        }
        $('body').addClass('dev');
    };
    self.removeDevClass = function(){
        if(!self.vars.init){
            return null;
        }
        $('body').removeClass('dev');
    };
    self.setHeadlineBorders = function(){
        if(!self.vars.init){
            return null;
        }
        $('h1,h2,h3,h4,h5').addClass('brd');
    };
    self.removeHeadlineBorders = function(){
        if(!self.vars.init){
            return null;
        }
        $('h1,h2,h3,h4,h5').removeClass('brd');
    };
    self.identifyFonts = function(){
        var itms = $('h1,h2,h3,h4,h5,p,a,span,div[class*="text"]');
        for(var i=0; i<itms.length;i++){
            var that = itms[i];
            var $that = $(that);
            if($that.parents('#feDevMenu').length === 0){
                var fontSize = parseInt($that.css('font-size'));
                var lineHeight = parseInt($that.css('line-height'));
                var marbot = parseInt($that.css('margin-bottom'));
                var padbot = parseInt($that.css('padding-bottom'));
                var ffam    = ' '+$that.css('font-family');
                var gap = marbot + padbot;
                var hlClass = '';
                var matchHlClass = ['h1','h2','h3','h4','h5'];
                var matches = [];
                var cssClass = itms[i].className.toString();

                if(cssClass != undefined){
                    for (var j = 0; j < matchHlClass.length; j++) {
                        if (cssClass.indexOf(matchHlClass[j]) > -1) {
                            matches.push('.'+matchHlClass[j]);
                        }
                    }
                }

                matches = matches.join('');
                $that.prepend('<span class="findi">')
                    .find('.findi')
                        .css({
                            'position' : 'absolute',
                            'background' : '#aaa',
                            'z-index'   : 9999,
                            'padding'   : '1px 3px',
                            'font-size' : '12px'
                        }).html(that.tagName + '' +matches+ ' ' +fontSize + '/' + lineHeight + '/' + gap +
                                /*'['+marbot +'m+'+ padbot+'p]' +*/ ffam
                                );
            }

        }
    };
    self.removeFontident = function(){
        $('span.findi').fadeOut(200, function(){
            $(this).remove();
        });
    }

};