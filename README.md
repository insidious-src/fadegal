# Fadegal - Universal lightweight JavaScript Slider/Carousel/Gallery/Navigator #


**Example Usage**
```
#!html

<script type="text/javascript">
$(function()
{
    var popup = $(".lightbox").fadegal(
    {
        alwaysVisible:            false, // init as a popup gallery
        animation:                true,
        animationDuration:        1000,
        animationType:            "fade", // transitional animations: fade, slide, popup
        navigation:               true,
        navPrevStyle:             "#prev",
        navNextStyle:             "#next",
        itemChangeEvent:          "click", // click, hover or dblclick
    });

    var slideshow = $(".slideshow").fadegal(
    {
        animation:                true,
        animationType:            "fade",
        navigation:               false,
        navigatorFor:             [popup]
    });

    $(".thumbs").fadegal(
    {
        animation:                false,
        maxItems:                 0, // maximum visible items
        navigation:               false,
        navigatorFor:             [slideshow]
    });
});
</script>
```
