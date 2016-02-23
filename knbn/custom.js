(function(_w){

    var W = _w.Worldnow || null
        , Page = _w.wng_pageInfo || null
        , Site = _w.wn || null

    if(!W || !Page || !Site) return;

    // W.AdMan.getAds('41,46',function(ad) {
    //     var id = ad.get('id')
    //     if ((id == '41' && Page.containerType == 'S') || (id == '46' && Page.containerType == 'C')) { 
    //         var m = ad.manager;
    //         var settings = m.extend({},ad.options)
            
    //         // settings.id = '241'
    //         // settings.wnsz = '241'
    //         // settings.css = 'clear: both;float: none;background: #eee;width: 980px;margin: 10px auto;padding: 10px;'
    //         // m.attachAd({selector:'#WNCol23',attachStyle:'before'},settings);

    //         settings.css = 'clear:both;float:none;width: 980px;margin:10px auto;padding:10px;'
    //         settings.id = '241'
    //         settings.wnsz = '241'
    //         settings.alternativeSizes = [[728,90],[970,250],[970,90]]
    //         m.attachAd('#WNCols23-4',settings)

    //         // This collapses the original ad div.  Using .remove() causes load method not defined.
    //         ad.set('width',null);
    //         ad.set('height',null);
    //     }
    // });
})(window);

$(function() {

    var $headerInner = $('body > section > header')
        , $bodyInner = $('#WNCols234-5')
        , $footersInner = $('body > section > footer')
        , $bottomNavInner = $('body > section > nav')

    $headerInner.addClass('columnshadow')
    $bodyInner.addClass('columnshadow')
    $footersInner.addClass('columnshadow')
    $bottomNavInner.addClass('columnshadow')

    if (wng_pageInfo.containerId == "306496") {
        $('body').addClass('home');
    }
})

/* 
   TSR overflow
*/
Worldnow.EventMan.event('WNcol23done',function() {
    if (wng_pageInfo.containerId == "306496") return;

    var $topstory = $('.displaysize-20.featurednews.rotate-a');
    var $overflow = $topstory.clone();
    $('#WNAd1').after($overflow);
    $topstory.find('.item:gt(3)').remove(); // 5 stories
    $overflow.find('.item:lt(4)').remove(); // overflow starts with 6
    $overflow.find('.item:gt(9)').remove(); 
    $overflow.removeClass('rotate-a').addClass('legacy overflow');
})

Worldnow.EventMan.event('WNCol4done', function () {
    var $section = $('section.tabs-a');
    if ($section.hasClass('most-popular')) $section.attr("data-ribbon","Most Popular");

    var $container = $section.find('> ul.group');
    $tabHeaders = $wn("<div class='tab-headers'></div>");
    $container.before($tabHeaders);
    $container.find("> li.item.category").each(function() {
        tab = $wn(this);
        if (tab.index() == 0) {
            tab.show();
        } else {
            tab.hide();
        }
        tab.find("h3").each(function() {
            $header = $wn(this);
            if (tab.index() == 0) {
                $header.addClass("active");
            }
            $header.click(function() {
                $wn(this).addClass("active").siblings().removeClass("active");
                position = $wn(this).index();
                $container.find("li.item.category").each(function() {
                    tab = $wn(this);
                    if (tab.index() == position) {
                        tab.show();
                    } else {
                        tab.hide();
                    }
                });
            });
            $tabHeaders.append($header);
        });
    });
    $tabHeaders.append($wn('<div class="wnClear"></div>'));
})

function headerRotator() {
    var images = ['9510746_G.jpg','9510742_G.jpg','9510744_G.jpg'];
    $('#Masthead').css({'background-image': 'url(http://knbn.images.worldnow.com/images/' + images[Math.floor(Math.random() * images.length)] + ')'});
    $('#Masthead').css('display','block');
}

$(document).ready(function () {
    $('section.block.weather.simple-a .links a:nth-child(2)').wrapInner('<span class="border"></span>'); 
    $('section.block.displaysize-20.wnclear.featurednews.legacy.overflow ul li:first').prepend('<a href="#"><span class="moreButton">MORE>></div></a>');

    headerRotator();

    $('section.block.connect-a:nth-child(3) i').addClass('youtube');
    $('section.block.connect-a a:nth-child(3)').css('background','red');

});
