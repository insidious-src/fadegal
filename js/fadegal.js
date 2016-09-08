// the short version of jquery $(document).ready
$(function()
{
    // default configuration array
    var default_config =
    {
        initialDelay:             400, // milliseconds
        initialEffect:            true, // play a first time show effect
        initialEffectType:        1, // effects: 1.FadeIn, 2.Popup, 3.SlideIn
        alwaysVisible:            true, // if always visible or it should popup like a gallery

        animation:                true,
        animationDuration:        1000,
        animationType:            "fade", // transitional animations: fade, slide
        maxItems:                 1, // maximum visible items
        selectedClass:            "selected",
        navigation:               true,
        navPrevStyle:             "#prev",
        prevText:                 'Previous',
        navNextStyle:             "#next",
        nextText:                 'Next',
        itemChangeEvent:          "click", // click, hover, dblclick or empty string
        navigatorFor:             undefined
    };

    // objance constructor extending the jquery namespace
    $.fn.fadegal = function(config)
    {
        // merge all objects and allow the objance config to supercede the default one
        $.extend(this, default_config, config, { version: '1.0' });

        var obj         = this;
        var imgElements = $(obj).find('img');
        var curIndex    = 0;

        function setCurIndex(index)
        {
            $(imgElements).eq(curIndex).removeClass(obj.selectedClass);
            $(imgElements).eq(index).addClass(obj.selectedClass);

            if(obj.maxItems == 1)
            {
                $(imgElements).eq(curIndex).fadeOut(obj.animationDuration / 2);
                $(imgElements).eq(index).fadeIn(obj.animationDuration / 2)
            }

            curIndex = index;
        }

        function getElementIndex(element)
        {
            for (var i = 0; i < imgElements.length; ++i)
                if ($(imgElements).eq(i).is(element)) return i;

            return 0;
        }

        function onChange(e)
        {
            var nextIndex  = getElementIndex(this);
            if (nextIndex == obj.curIndex) return;

            setCurIndex (nextIndex);

            if (obj.navigatorFor)
                obj.navigatorFor.onChange(e);

            e.preventDefault();
        }

        if (!imgElements.length)
        {
            console.error("NO image data!");
            return;
        }

        if (!obj.alwaysVisible)
            $(obj).hide();

        // ensure proper initial visibility state
        $("div#content").append('<p>------------</p>');

        imgElements.each(function(index)
        {
            $("div#content").append('<p>index: '    + index +
                ', src: '   + $(this).attr('src')   +
                ', title: ' + $(this).attr('title') + '</p>');

            if (obj.maxItems <= 0 || obj.maxItems > index)
                $(this).show();
            else
                $(this).hide();
        });

        if (obj.navigatorFor && obj.navigatorFor.imgElements.length != imgElements.length)
        {
            console.error("CANNOT assign self as navigator");
            return;
        }

        // add change event callback
        if (obj.itemChangeEvent.length)
            $(obj).on(obj.itemChangeEvent, 'img', onChange);
    };

});
