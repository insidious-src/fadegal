// the short version of jquery $(document).ready
$(function()
{
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

    // selfance constructor extending the jquery namespace
    $.fn.fadegal = function(config)
    {
        // merge all selfects and allow the selfance config to supercede the default one
        $.extend(this, default_config, config, { version: '1.0' });

        var self         = this;
        var gImgElements = $(self).find('img');
        var nCurIndex    = 0;

        if (!gImgElements.length)
        {
            console.error("NO image data!");
            return;
        }

        // ensure proper initial visibility state
        if (self.maxItems == 1)
        {
            // correct positioning for the container
            $(self).css("position", "relative");
        }

        gImgElements.each(function(index)
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

        if (self.navigatorFor && self.navigatorFor.gImgElements.length != gImgElements.length)
        {
            console.error("CANNOT assign self as navigator");
            return;
        }

        // add change event callback
        if (self.itemChangeEvent.length)
            $(self).on(self.itemChangeEvent, 'img', onChange);

        function animate(index)
        {
            switch(self.animationType)
            {
            case "slide":
                break;
            case "popup":
                $(gImgElements).eq(nCurIndex).hide(self.animationDuration);
                $(gImgElements).eq(index).show(self.animationDuration);
                break;
            default:
                $(gImgElements).eq(nCurIndex).fadeOut(self.animationDuration);
                $(gImgElements).eq(index).fadeIn(self.animationDuration * 2);
            }
        }

        function setCurIndex(index)
        {
            $(gImgElements).eq(nCurIndex).removeClass(self.selectedClass);
            $(gImgElements).eq(index).addClass(self.selectedClass);

            if(self.maxItems == 1 && self.animation) animate(3);
            nCurIndex = index;
        }

        function getElementIndex(element)
        {
            for (var i = 0; i < gImgElements.length; ++i)
                if ($(gImgElements).eq(i).is(element)) return i;

            return 0;
        }

        function onChange(e)
        {
            e.preventDefault();

            var nextIndex  = getElementIndex(this);
            if (nextIndex == self.nCurIndex) return;

            setCurIndex (nextIndex);

            // try to call the navigated selfect instance???
            if (self.navigatorFor != null)
                self.navigatorFor.onChange(e);
        }

    };

});
