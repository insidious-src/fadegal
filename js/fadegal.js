(function($) {
    // default configuration array
    var default_config =
    {
        initialDelay:      600, // milliseconds
        initialEffect:     true, // play a first time show effect
        initialEffectType: 1, // effects: 1.FadeIn, 2.Popup, 3.SlideIn
        alwaysVisible:     true, // if always visible or it should popup like a gallery

        animation:         true,
        animationDuration: 1000,
        animationType:     "fade", // transitional animations: fade, slide, popup
        maxItems:          1, // maximum visible items
        selectedClass:     "selected",
        navigation:        true,
        navPrevStyle:      "#prev",
        navNextStyle:      "#next",
        itemChangeEvent:   "click", // click, hover or dblclick
        itemTagName:       "img", // ex. tags: img, li, a
        navigatorFor:      null
    };

    // instance constructor extending the jquery namespace
    $.fn.fadegal = function(config)
    {
        // merge all objects and allow the instance config to supercede the default one
        $.extend(this, default_config, config, { version: '1.4' });

        var self        = this;
        var m_gTagArray = $(self).find(self.itemTagName); // find all matching local tags
        var m_nCurIndex = 0;

        // ==========================================
        // Public Functions
        // ==========================================

        self.getElementNum       = function()      { return m_gTagArray.length;       }
        self.getElementFromIndex = function(index) { return $(m_gTagArray).eq(index); }

        self.activate = function ()
        {
            if ($(self).is(':hidden'))
            {
                if (self.initialEffect) $(self).fadeIn(self.initialDelay);
                else setTimeout(function(){ $(self).show(); }, self.initialDelay);
            }
        }

        // ==========================================
        // Initialization & Error Checks
        // ==========================================

        // hide everything on load to prepare for initialization
        if ($(self).is(':visible')) $(self).hide();

        // if NOT used as popup gallery then show the container in a delayed manner
        if (self.alwaysVisible) self.activate();

        if (!m_gTagArray.length)
        {
            console.error("NO image data!");
            return undefined;
        }

        // correct positioning for the container
        if (self.maxItems == 1 && self.alwaysVisible)
            $(self).css("position", "relative");

        // ensure proper initial visibility state
        m_gTagArray.each(function(index)
        {
            switch(self.maxItems)
            {
            case 0:
                $(this).show();
                break;
            case 1:
                $(this).css({ "position": "absolute", "top": "0px", "left": "0px" });
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
            $(self).on(self.itemChangeEvent, self.itemTagName, onChange);

            if (self.navigation)
            {
                // register navigation event callback for previous
                $(self.navPrevStyle).on(self.itemChangeEvent, function()
                {
                    $(m_gTagArray).eq((m_nCurIndex - 1) % m_gTagArray.length).
                        trigger(self.itemChangeEvent);
                });

                // register navigation event callback for next
                $(self.navNextStyle).on(self.itemChangeEvent, function()
                {
                    $(m_gTagArray).eq((m_nCurIndex + 1) % m_gTagArray.length).
                        trigger(self.itemChangeEvent);
                });
            }

            /*$(self.navPrevStyle).on(self.itemChangeEvent,
                $(m_gTagArray).eq(m_nCurIndex == 0 ? m_gTagArray.length - 1  :
                                                        m_nCurIndex - 1), onChange);
            $(self.navNextStyle).on(self.itemChangeEvent,
                $(m_gTagArray).eq(m_nCurIndex == (m_gTagArray.length - 1) ?
                                        0 : m_nCurIndex + 1), onChange);*/
            break;
        default:
            console.error("Wrong change event trigger!");
            return undefined;
        }

        if (self.navigatorFor != null &&
            self.navigatorFor.getElementNum() != m_gTagArray.length)
        {
            self.navigatorFor = null;
            console.warn("CANNOT assign self as navigator");
        }

        // ==========================================
        // Private Functions
        // ===================================m=======

        // TODO: reimplement the function as an universal animation handler
        function animate(index)
        {
            switch(self.animationType)
            {
            case 'slide':
                break;
            case 'popup':
                $(m_gTagArray).eq(m_nCurIndex).stop(true, true).delay(30).
                    hide(self.animationDuration);
                $(m_gTagArray).eq(index).stop(true, true).show(self.animationDuration);
                break;
            case 'fade':
                $(m_gTagArray).eq(m_nCurIndex).stop(true, true).delay(30).
                    fadeOut(self.animationDuration);
                $(m_gTagArray).eq(index).stop(true, true).fadeIn(self.animationDuration);
                break;
            default:
                console.warn("Unknown animation type!");
            }
        }

        function setCurIndex(index)
        {
            var gCurElement  = $(m_gTagArray).eq(m_nCurIndex);
            var gNextElement = $(m_gTagArray).eq(index);

            $(gCurElement ).removeClass(self.selectedClass);
            $(gNextElement).addClass(self.selectedClass);

            if (self.maxItems == 1)
            {
                if (self.animation) animate(index);
                else
                {
                    $(gCurElement ).hide();
                    $(gNextElement).show();
                }
            }

            m_nCurIndex = index;
        }

        function onChange(event)
        {
            var nNextIndex = $(m_gTagArray).index(this);

            if (self.navigatorFor != null)
            {
                if (nNextIndex == m_nCurIndex) self.navigatorFor.activate();
                else
                {
                    setCurIndex(nNextIndex);

                    // call the navigated object instance
                    $(self.navigatorFor.getElementFromIndex(nNextIndex)).
                        trigger(self.navigatorFor.itemChangeEvent, event);
                }
            }
            else if (nNextIndex != m_nCurIndex) setCurIndex(nNextIndex);

            event.preventDefault();
        }

        return self;
    };

}(jQuery)); // namespace jQuery
