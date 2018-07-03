(function ($, document, undefined) {
    "use strict";

    var c = {
        id: 'video',
        version: 0.1,
        classes: {
            show: 'show',
            hide: '_hide',
            active: '_active',
            fullscreen: 'fullscreen',
            vidLoaded: '_videoLoaded',
            vidVisible: 'x-video--visible',
            vidOpen: 'x-video--open',
            overlayPlayer: 'x-player-overlay',
            bgOverlayPlayer: 'x-player-background-overlay'
        },
        selectors: {
            contentBanner: '.x-content-banner',
            vidInner: '.x-video-inner',
            player: 'video.x-player-video',
            launchOverlayBtn: '[data-component="x-video-launch"]',
            closeBtn: '.x-player-close-btn',
            captionBtnGroup: '.x-controls-captions-group',
            playBtn: '.x-controls-button--play',
            pauseBtn: '.x-controls-button--pause',
            shortcutsInfo: '.x-player-shortcuts-container',
            transEndEvents: 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend webkitAnimationEnd oanimationend msAnimationEnd animationend',
            focusable: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
        },
        templateOptions: {
            interpolate: /{{([\s\S]+?)}}/g
        },
        md: new MobileDetect(window.navigator.userAgent),

        initialize: function () {
            this.selectors.component = '[data-' + this.id + ']';
            _.forEach(this.classes, _.bind(function (i, n) {
                this.selectors[n] = '.' + i;
            }, this));
            this.bindListeners();
        },

        contentEditorLoadVid: function ($comp) {
            $comp.not(this.selectors.overlayPlayer).each(function (index, el) {
                var $el = $(el);
                $el.addClass(this.classes.vidLoaded);
                this.createVideo($el);
                $el.addClass(this.classes.vidVisible);
            }.bind(this));
        },

        lazyLoadContentVid: function ($el) {
            var $win = $(window),
                winTop = $win.scrollTop(),
                viewHeight = winTop + $win.height(),
                elTopPos = $el.offset().top,
                preloadPos = elTopPos;
            if ($el.hasClass(this.classes.vidLoaded)) {
                return;
            } else {
                if (viewHeight > preloadPos) {
                    $el.addClass(this.classes.vidLoaded);
                    this.createVideo($el);
                }
            }
        },

        launchOverlayVid: function (ev) {
            var $targ = $(ev.target),
                $banner = $targ.closest(this.selectors.contentBanner);
            // On initial launch move player container from the placeholder to the banner
            if ($targ.prev(this.selectors.component).length) {
                var $el = $targ.prev(this.selectors.component);
                $banner.prepend($el);
                $banner.css('position', 'relative');
            } else {
                var $el = $targ.closest(this.selectors.contentBanner).find(this.selectors.component);
            }
            // Close all other overlay videos
            $(this.selectors.component).not($el).find(this.selectors.closeBtn).trigger('click');

            // Add tabindex to the siblings, to lock focus inside of the opened overlay player
            $banner.siblings().attr('tabindex', "-1").attr('aria-hidden', "true");
            $banner.find(this.selectors.launchOverlayBtn).attr('tabindex', "-1").attr('aria-hidden', "true");

            $el.addClass(this.classes.active);
            if ($el.hasClass(this.classes.vidLoaded)) {
                this.openOverlay($el);
            } else {
                // Mobile accessibility
                if (this.md.phone() == 'iPhone') {
                    var $ariaLive = $('<div class="x--vh" aria-live="polite">Overlay video activated. Swipe back and double tap to start</div>');
                    $el.append($ariaLive);
                }
                if (this.md.os() == 'AndroidOS') {
                    var $ariaLive = $('<div class="x--vh" aria-live="polite">Overlay video activated. Click play button to start</div>');
                    $el.append($ariaLive);
                }
                this.createVideo($el);
            }
            this.addBookends();
            setTimeout(function () {
                $banner.find(this.selectors.closeBtn).addClass(this.classes.show).focus();
                if (this.md.phone()) {
                    $ariaLive.html('');
                    /*if (this.md.os() == 'AndroidOS') {
                     $banner.find(this.selectors.closeBtn).addClass(this.classes.show).focus();
                     }*/
                }
            }.bind(this), 600); // show controls animation duration
        },

        createVideo: function ($el) {
            var vidData = $el.attr('data-video-props') ? JSON.parse($el.attr('data-video-props')) : {}, //
            //$banner = $el.closest(this.selectors.contentBanner),
                $vidInner = $el.find(this.selectors.vidInner),
                controlsTemplate = $('[data-video-controls-template]').html();

            // desktop
            // if (!md.mobile()) {
            $vidInner = $('<div />', {'class': 'x-video-inner'});
            $el.append($vidInner);

            // create video element
            var videoOpt = {
                'class': 'x-player-video',
                'poster': vidData.poster
            };
            // Mobile accessibility. TalkBack reads video tag as "video, video toolbar"
            if (vidData.controls == 'custom' && this.md.os() == 'AndroidOS') {
                videoOpt['aria-hidden'] = "true";
            }

            var $vid = $('<video />', videoOpt);
            // add media
            _.forEach(vidData.urls, function (url) {
                var $videoSource = $('<source />', {
                    'src': url.src,
                    'type': url.type
                });
                $vid.append($videoSource);
            });
            // add subtitles
            if (vidData.captions !== undefined && vidData.captions.length) {
                _.forEach(vidData.captions, function (track) {
                    var $captionTrack = $('<track />', {
                        'src': track.src,
                        'kind': track.kind, // captions, chapters, descriptions, metadata, subtitles
                        'label': track.label,
                        'srclang': track.srclang
                    });
                    track.default == 'true' ? $captionTrack.prop('default', true) : null;
                    $vid.append($captionTrack);
                });
            }
            // set defaults
            if (vidData.muted) {
                $vid.prop('muted', "muted");
            }
            if (vidData.loop) {
                $vid.attr('loop', "")
            }
            if (vidData.autoplay) {
                $vid.attr('autoplay', "");
            }
            if (vidData.controls == 'native' || this.md.phone() == 'iPhone') {
                //if (vidData.controls == 'native' && this.md.phone() != 'iPhone') {
                $vid.attr('controls', "");
            }
            // append created video element
            $vidInner.append($vid);
            // append custom controls
            if (vidData.controls == 'custom' && this.md.phone() != 'iPhone') {
                var controlsHtmlTemplate = _.template(controlsTemplate, { interpolate: /{{([\s\S]+?)}}/g }),
                    controlsMode = this.md.mobile() ? "mobile" : "";
                if (this.md.phone() == 'iPhone') controlsMode = 'iphone';
                $vidInner.append(controlsHtmlTemplate({
                    data: vidData,
                    device: controlsMode
                }));
                if (vidData.backgroundMode) {
                  $el.trigger('backgroundVideo');
                }
                if (vidData.captions === undefined || vidData.captions.length < 1) {
                    $vidInner.find(this.selectors.captionBtnGroup).hide();
                }
                // In IE remove "Toggle Full Screen" option from the Player Shortcuts pane
                // In IE msRequestFullscreen() works only as result of onClick or onEnterDown. Pressing F shortcut doesn't work.
                if (document.msFullscreenEnabled) {
                  $vidInner.find('.full-screen-shortcut-title').hide();
                }
            }

            setTimeout(function () { // race condition. let vid build first
                if ($el.hasClass(this.classes.overlayPlayer)) {
                    $el.addClass(this.classes.vidOpen);
                    $el.addClass(this.classes.vidLoaded);
                    this.centerVid();
                }
                $el.addClass(this.classes.vidVisible);

            }.bind(this), 500);
            // mobile
            /*} else {
             var $mediaContainer = $('<div />', { 'class': 's-media-container' }),
             $img = $('<img />', {
             'src': vidData.poster,
             'class': 's-media'
             });
             $mediaContainer.append($img);
             $vidInner.prepend($mediaContainer);
             $el.addClass(this.classes.vidVisible);
             }*/
        },

        closePlayer: function (ev) {
            var $targ = $(ev.target),
                $vid = $targ.closest(this.selectors.component),
                $vidInner = $vid.find(this.selectors.vidInner),
                player = $vid.find(this.selectors.player)[0],
                $banner = $vid.closest(this.selectors.contentBanner),
                $origLaunchBtn = $banner.find(this.selectors.launchOverlayBtn),
                $shortcuts = $vid.find(this.selectors.shortcutsInfo);
            if (player && !$vid.hasClass('x--background-mode')) {
                // to background mode
                if ($vid.hasClass('x--active-mode')) {
                  $vid.trigger('backgroundVideo');
                  // Fire your event here
                  return;
                }
                // resetOverlay
                player.pause();
                $vid.removeClass(this.classes.vidVisible);
                $vid.removeClass(this.classes.vidOpen);
                $vid.removeClass(this.classes.active);
                this.removeBookends();
                $shortcuts.removeClass('show');
                $shortcuts.find('[data-shortcut-bookends]').remove();
                // Remove tabindex added in launchOverlayVid
                $banner.siblings().removeAttr('tabindex').attr('aria-hidden', "false");
                $banner.find(this.selectors.launchOverlayBtn).removeAttr('tabindex').attr('aria-hidden', "false");
            }
            $origLaunchBtn.focus();
        },

        openOverlay: function ($el) {
            var vidData = $el.attr('data-video-props') ? JSON.parse($el.attr('data-video-props')) : {};
            var player = $el.find(this.selectors.player)[0];
            $el.addClass(this.classes.vidOpen);
            this.centerVid();
            $el.addClass(this.classes.vidVisible);
            if (vidData.startOver) {
                player.currentTime = 0;
            }
            player.play();
        },

        centerVid: function () {
            var $vidWrap = $(this.selectors.overlayPlayer + this.selectors.active),
                $vidInner = $vidWrap.find(this.selectors.vidInner);
            if ($vidWrap.length) {
                if ($vidWrap.hasClass(this.classes.fullscreen)) {
                    $vidWrap.css('height', '100%');
                    $vidInner.removeAttr('style').css('height', '100%');
                } else {
                    var $banner = $vidWrap.closest(this.selectors.contentBanner),
                        vidWrapHeight = $vidWrap.outerHeight(),
                        bannerHeight = $banner.outerHeight();

                    $vidWrap.css('height', bannerHeight);
                    $vidInner.removeAttr('style'); // In order to calculate real player height, we have to remove previously assigned styles
                    var vidInnerHeight = $vidInner.outerHeight();
                    if (vidInnerHeight >= bannerHeight || vidInnerHeight < 50) {
                        // resize player container
                        $vidInner.css({
                            'position':'relative',
                            'height':'100%',
                            'top':'auto',
                            'margin-top': 'auto'
                        });
                        // resize controls
                        var player = $vidWrap.find(this.selectors.player)[0],
                            actualVideoWidth = Math.round(player.videoWidth / player.videoHeight * bannerHeight);
                        $vidInner.css({
                            'width': actualVideoWidth + 'px'
                        });
                    } else {
                        $vidInner.css({
                            'position':'absolute',
                            'height':'auto',
                            'top':'50%',
                            'margin-top': -(vidInnerHeight / 2) + 'px'
                        });
                    }
                }
            }
        },

        addBookends: function () {
            var bookendMarkup = '<div tabindex="0" data-bookends></div>',
                $component = $(this.selectors.component + this.selectors.active);
            if ($component.find('[data-bookends]').length > 0) {
                return true;
            }
            $component.prepend(bookendMarkup);
            $component.append(bookendMarkup);
            this.bookendFocus();
        },
        bookendFocus: function () {
            // Capture focus events on bookends to contain tabbing within a container
            var $component = $(this.selectors.component + this.selectors.active),
                $bookends = $component.find('[data-bookends]'),
                $focusableElements = $component.find(this.selectors.focusable);
            // exclude shortcuts
            if (!_.isEmpty($bookends)) {
                $bookends
                    .eq(0) // Focusing first bookend sends focus to last real focusable element
                    .on('focus', function () {
                        $focusableElements.eq(-5).focus();
                    })
                    .end()
                    .eq(1) // Focusing last bookend sends focus to the first real focusable element
                    .on('focus', function () {
                        $focusableElements.eq(1).focus();
                    });
            }
        },
        removeBookends: function () {
            $(this.selectors.component).find('[data-bookends]').remove();
        },

        bindListeners: function () {
            var $win = $(window),
                $doc = $(document),
                $comp = $(this.selectors.component);
            if ($comp.length) {
                $comp.each(function (index, el) {
                    var $el = $(el);
                    if (!$el.hasClass(this.classes.overlayPlayer)) {
                        $win.on('scroll.x-video', _.throttle(this.lazyLoadContentVid.bind(this, $el), 200));
                        this.lazyLoadContentVid($el);
                    }
                }.bind(this));

                $win.on('resize.x-video, orientationchange.x-video', _.debounce(this.centerVid.bind(this), 300));
                document.addEventListener('loadedmetadata', this.centerVid.bind(this), true);
                $doc.on('click.x-video', this.selectors.launchOverlayBtn, this.launchOverlayVid.bind(this));
                $doc.on('click.x-video', this.selectors.closeBtn, this.closePlayer.bind(this));

            }
        },
    };

    c.initialize();


})(jQuery, document);
