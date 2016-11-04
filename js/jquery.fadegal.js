(function($) {
    // default configuration array
    var fadegal_config =
    {
        initialDelay:      600, // milliseconds
        initialEffect:     true, // play a first time show effect
        initialEffectType: "fade", // effects: fade, slide, popup
        alwaysVisible:     true, // if always visible or it should popup like a gallery

        animation:         true,
        animationDuration: 1000,
        animationType:     "fade", // transitional animations: fade, slide, popup
        maxItems:          1, // maximum visible items
        autoWidth:         false,
        autoHeight:        true,
        selectedClass:     "selected",
        navigation:        true,
        navPrevStyle:      "#prev",
        navNextStyle:      "#next",
        itemChangeEvent:   "click", // click, hover or dblclick
        itemTagName:       "img", // ex. tags: img, li, a
        navigatorFor:      []
    };

    // instance constructor extending the jquery namespace
    $.fn.fadegal = function(config)
    {
        // merge all objects and allow the instance config to supercede the default one
        $.extend(this, fadegal_config, config, { version: '1.5' });

        var self        = this;
        var m_nCurIndex = 0;
        var m_gTagArray = self.find(self.itemTagName); // find all matching local tags

        // ==========================================
        // Public Functions
        // ==========================================

        self.getElementNum       = function()      { return m_gTagArray.length;    };
        self.getElementFromIndex = function(index) { return m_gTagArray.eq(index); };

        self.switchTo = function(index)
        {
            self.getElementFromIndex(index % self.getElementNum()).trigger(self.itemChangeEvent);
        };

        self.connect = function(object)
        {
            if (typeof(object) != typeof(self) || object.getElementNum() != self.getElementNum())
                return false;
            self.navigatorFor.push(object);
            return true;
        };

        self.activate = function()
        {
            if (self.is(':hidden'))
            {
                if (self.initialEffect) animate(self.initialEffectType, self.initialDelay);
                else setTimeout(function(){ self.show(); }, self.initialDelay);
            }
        };

        // ==========================================
        // Initialization & Error Checks
        // ==========================================

        if (!self.getElementNum())
        {
            console.error("NO element data!");
            return undefined;
        }

        // if enabled perform initial auto sizing
        if (self.autoWidth ) self.width (calcWidth (m_nCurIndex));
        if (self.autoHeight) self.height(calcHeight(m_nCurIndex));

        // hide everything on load to prepare for initialization
        if (self.is(':visible')) self.hide();

        // if NOT used as popup gallery then show the container in a delayed manner
        if (self.alwaysVisible) self.activate();

        // correct positioning for the container
        if (self.maxItems == 1 && self.alwaysVisible)
            self.css({ "position": "relative", "overflow": "hidden" });

        // ensure proper initial visibility state
        m_gTagArray.each(function(index)
        {
            switch(self.maxItems)
            {
            case 0:
                $(this).show();
                break;
            case 1:
                $(this).css("position", "absolute");
                if (index == m_nCurIndex) $(this).show();
                else $(this).hide();
                break;
            default:
                if (index < self.maxItems) $(this).show();
                else $(this).hide();
            }
        });

        // add event callbacks
        switch(self.itemChangeEvent)
        {
        case 'click': case 'dblclick': case 'hover':
            // register item change event callback
            self.on(self.itemChangeEvent, self.itemTagName, onIndexChange);

            if (self.navigation)
            {
                // register navigation event callback for previous
                $(self.navPrevStyle).on(self.itemChangeEvent, function(e)
                { self.switchTo(m_nCurIndex - 1); e.preventDefault(); });

                // register navigation event callback for next
                $(self.navNextStyle).on(self.itemChangeEvent, function(e)
                { self.switchTo(m_nCurIndex + 1); e.preventDefault(); });
            }
            break;
        default:
            console.error("Wrong change event trigger!");
            return undefined;
        }

        // register auto sizing callback for window resize
        if (self.autoWidth || self.autoHeight)
            $(window).on('resize', function()
            {
                if (self.autoWidth ) self.width (calcWidth (m_nCurIndex));
                if (self.autoHeight) self.height(calcHeight(m_nCurIndex));
            });

        // discard instances with element count mismatch
        for (var i = 0; i < self.navigatorFor.length; ++i)
        {
            if (self.navigatorFor[i].getElementNum() != self.getElementNum())
                self.navigatorFor.splice(i, 1);
        }

        // ==========================================
        // Private Functions
        // ==========================================

        function calcWidth(index)
        {
            return self.getElementFromIndex(index).outerWidth(true) +
                  (self.outerWidth() - self.innerWidth());
        }

        function calcHeight(index)
        {
            return self.getElementFromIndex(index).outerHeight(true) +
                  (self.outerHeight() - self.innerHeight());
        }

        function animate(type, duration, index = -1)
        {
            switch (type)
            {
            case 'fade':
                if (index > -1)
                {
                    self.getElementFromIndex(index).stop(true, true).fadeIn(duration);
                    self.getElementFromIndex(m_nCurIndex).stop(true, true).fadeOut(duration);
                }
                else self.stop(true, true).fadeIn(duration);
                break;
            case 'popup':
                if (index > -1)
                {
                    self.getElementFromIndex(index).stop(true, true).show(duration);
                    self.getElementFromIndex(m_nCurIndex).stop(true, true).hide(duration);
                }
                else self.stop(true, true).show(duration);
                break;
            case 'slide':
                break;
            default:
                console.warn("Unknown animation type!");
            }
        }

        function setCurIndex(index)
        {
            var gCurElement  = self.getElementFromIndex(m_nCurIndex);
            var gNextElement = self.getElementFromIndex(index);

            gCurElement .removeClass(self.selectedClass);
            gNextElement.addClass   (self.selectedClass);

            if (self.maxItems == 1)
            {
                if (self.animation)
                {
                    animate(self.animationType, self.animationDuration, index);

                    if (self.autoWidth ) self.animate({ width : calcWidth (index) }, 300);
                    if (self.autoHeight) self.animate({ height: calcHeight(index) }, 300);
                }
                else
                {
                    gCurElement .hide();
                    gNextElement.show();

                    if (self.autoWidth ) self.width (calcWidth (m_nCurIndex));
                    if (self.autoHeight) self.height(calcHeight(m_nCurIndex));
                }

            }

            m_nCurIndex = index;
        }

        function onIndexChange(event)
        {
            var nNextIndex = m_gTagArray.index(this);

            if (self.navigatorFor.length)
            {
                if (nNextIndex == m_nCurIndex)
                {
                    for (i = 0; i < self.navigatorFor.length; ++i)
                        self.navigatorFor[i].activate();
                }
                else
                {
                    // avoid infinite loop
                    var source = event.data;
                    event.data = self;

                    setCurIndex(nNextIndex);

                    // call each navigated object instance
                    for (i = 0; i < self.navigatorFor.length; ++i)
                    {
                        if (source != self.navigatorFor[i])
                            $(self.navigatorFor[i].getElementFromIndex(nNextIndex)).
                                trigger(self.navigatorFor[i].itemChangeEvent, event);
                    }
                }
            }
            else if (nNextIndex != m_nCurIndex) setCurIndex(nNextIndex);

            event.preventDefault();
        }

        return self;
    };

}(jQuery)); // namespace jQuery
