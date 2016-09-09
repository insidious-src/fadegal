(function($) {
    // default configuration array
    var default_config =
    {
        initialDelay:      400, // milliseconds
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
        prevText:          'Previous',
        navNextStyle:      "#next",
        nextText:          'Next',
        itemChangeEvent:   "click", // click, hover, dblclick or empty string
        navigatorFor:      null
    };

    // instance constructor extending the jquery namespace
    $.fn.fadegal = function(config)
    {
        // merge all objects and allow the instance config to supercede the default one
        $.extend(this, default_config, config, { version: '1.0' });

        var self           = this;
        var m_gImgElements = $(self).find('img');
        var m_nCurIndex    = 0;

        // ==========================================
        // Public Functions
        // ==========================================

        self.getElementNum       = function()      { return m_gImgElements.length; }
        self.getElementFromIndex = function(index) { return $(m_gImgElements).eq(index); }

        // ==========================================
        // Initialization & Error Checks
        // ==========================================

        if (!m_gImgElements.length)
        {
            console.error("NO image data! Please, come back later after you watch some porn!");
            return undefined;
        }

        if (self.maxItems == 1)
        {
            // correct positioning for the container
            $(self).css("position", "relative");
        }

        // ensure proper initial visibility state
        m_gImgElements.each(function(index)
        {
            switch(self.maxItems)
            {
            case 0:
                $(this).show();
                break;
            case 1:
                $(this).css({ "position": "absolute", "top": "0px", "left": "0px" });
                if (index == 0) $(this).show();
                else $(this).hide();
                break;
            default:
                if (index < self.maxItems) $(this).show();
                else $(this).hide();
            }
        });

        if (!self.alwaysVisible)
            $(self).hide();

        if (self.navigatorFor != null &&
            self.navigatorFor.getElementNum() != m_gImgElements.length)
        {
            console.error("CANNOT assign self as navigator");
            return undefined;
        }

        // add change event callback
        switch(self.itemChangeEvent)
        {
        case 'click': case 'dblclick': case 'hover':
            $(self).on(self.itemChangeEvent, 'img', onChange);
            break;
        case '':
            break;
        default:
            console.error("Wrong change event trigger!");
        }

        // ==========================================
        // Private Functions
        // ==========================================

        function animate(index)
        {
            switch(self.animationType)
            {
            case "slide":
                break;
            case "popup":
                $(m_gImgElements).eq(m_nCurIndex).stop(true, true).delay(30).
                    hide(self.animationDuration);
                $(m_gImgElements).eq(index).stop(true, true).show(self.animationDuration);
                break;
            case "fade":
                $(m_gImgElements).eq(m_nCurIndex).stop(true, true).delay(30).
                    fadeOut(self.animationDuration);
                $(m_gImgElements).eq(index).stop(true, true).fadeIn(self.animationDuration);
                break;
            default:
                console.error("Unknown animation type!");
            }
        }

        function setCurIndex(index)
        {
            $(m_gImgElements).eq(m_nCurIndex).removeClass(self.selectedClass);
            $(m_gImgElements).eq(index).addClass(self.selectedClass);

            if (self.maxItems == 1 && self.animation) animate(index);
            m_nCurIndex = index;
        }

        function getElementIndex(element)
        {
            for (var i = 0; i < m_gImgElements.length; ++i)
                if ($(m_gImgElements).eq(i).is(element)) return i;

            return 0;
        }

        function onChange(event)
        {
            var nNextIndex = getElementIndex(this);

            if (nNextIndex != self.m_nCurIndex)
                setCurIndex (nNextIndex);

            // try to call the navigated object instance???
            if (self.navigatorFor != null)
            {
                $(self.navigatorFor.getElementFromIndex(nNextIndex)).
                    trigger(self.navigatorFor.itemChangeEvent, event);
            }

            event.preventDefault();
        }

        return self;
    };

}(jQuery)); // namespace JQuery
