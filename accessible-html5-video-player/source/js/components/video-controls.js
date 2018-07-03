(function ($, document, undefined) {
    "use strict";

    var c = {
        id: 'x-video-controls',
        version: 0.1,
        classes: {
            active: '_active',
            fullscreen: 'fullscreen',
            overlayPlayer: 'x-player-overlay'
        },
        selectors: {
            contentBanner: '.x-content-banner',
            videoComponent: '[data-video]',
            vidInner: '.x-video-inner',
            closeBtn: '.x-player-close-btn',
            shortcutsCloseBtn: '.x-shortcuts-close-btn',
            player: 'video.x-player-video',
            playBtn: '.x-controls-button--play',
            pauseBtn: '.x-controls-button--pause',
            muteBtn: '.x-controls-button--mute',
            unmuteBtn: '.x-controls-button--unmute',
            captionOnBtn: '.x-controls-button--captionon',
            captionOffBtn: '.x-controls-button--captionoff',
            shortcutsBtn: '.x-controls-button--shortcuts',
            fullscreenOnBtn: '.x-controls-button--fullscreenon',
            fullscreenOffBtn: '.x-controls-button--fullscreenoff',
            volumeControls: '.x-controls-volume-group',
            inputTime: '.x-controls-inputtime',
            volumeBar: '.x-controls-hidden-range--volume',
            seekBar: '.x-controls-hidden-range--seek',
            notification: '.x-player-notification',
            rangeHandle: '.x-range-control-handle',
            rangeThermometer: '.x-range-control-thermometer',
            rangeFill: '.x-range-control-fill',
            controlsGroup: '.x-controls-group',
            ariaLive: '.x-accessibility-info',
            shortcutsInfo: '.x-player-shortcuts-container',
            focusable: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
        },
        templateOptions: {
            interpolate: /{{([\s\S]+?)}}/g
        },
        md: new MobileDetect(window.navigator.userAgent),
        $dragTarg: null,
        $fullscreenTarg: null,
        notificationTimeout: null,
        controlsTimeout: null,
        hideDelay: 2000,

        initialize: function () {
            this.selectors.component = '[data-component="' + this.id + '"]';
            _.forEach(this.classes, _.bind(function (i, n) {
                this.selectors[n] = '.' + i;
            }, this));
            this.bindListeners();
        },

        // Time
        updateTime: function (ev) {
            var $targ = $(ev.target),
                val = $targ[0].value,
                player = $targ.closest(this.selectors.videoComponent).find(this.selectors.player)[0],
                $ariaLive = $targ.closest(this.selectors.vidInner).find(this.selectors.ariaLive);
            player.currentTime = val /100 * player.duration;
            //$ariaLive.text("Time " + this.secondsToMinutes(player.currentTime));
            //$targ.attr('aria-valuetext', this.secondsToMinutes(player.currentTime) + " of " + this.secondsToMinutes(player.duration));
            $targ.attr('aria-valuetext', "Time " + this.toAccessibleTime(player.currentTime) + " of " + this.toAccessibleTime(player.duration));
        },
        onTimeUpdate: function (e) {
            var player = $(e.target)[0],
                $videoComponent = $(e.target).closest(this.selectors.videoComponent); //$videoComponent = $(e.target).closest(this.selectors.videoComponent + "." + this.classes.active);
            if ($videoComponent.length) {
                // update seek bar
                var $seekBar = $videoComponent.find(this.selectors.seekBar),
                    value = (100 / player.duration) * player.currentTime;
                $seekBar.attr('value', Math.round(value));
                //$seekBar.attr('aria-valuenow', Math.round(value));
                //$seekBar.attr('aria-valuetext', this.secondsToMinutes(player.currentTime) + " of " + this.secondsToMinutes(player.duration));
                //$seekBar.attr('aria-label', "Time " + this.secondsToMinutes(player.currentTime) + " of " + this.secondsToMinutes(player.duration));
                //$videoComponent.find('.x-controls-hidden-range--progress').attr('aria-label', "Time " + this.secondsToMinutes(player.currentTime) + " of " + this.secondsToMinutes(player.duration));

                this.updateRangeControl($seekBar, value);
                // update current time label
                var $inputTime = $videoComponent.find(this.selectors.inputTime),
                    time = this.secondsToMinutes(player.currentTime),
                    $currentTime = $videoComponent.find('.x-controls-currenttime');
                //$inputTime.prop('placeholder', time); // when scrupbber is focused in accesibilty mode, screanreader constantly reads changing time
                $currentTime.html(time);

                if (this.md.mobile()) {
                    $currentTime.attr('aria-label', "Time: " + this.toAccessibleTime(player.currentTime));
                }
            }
        },
        onDurationChange: function (e) {
            var player = $(e.target)[0],
                $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                $timeEl = $videoComponent.find('.x-controls-duration');
            $timeEl.html(this.secondsToMinutes(player.duration)).attr('aria-label', "Duration: " + this.toAccessibleTime(player.duration));
        },

        // Play/Pause
        onPlayClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player);
            $player[0].play();
        },
        onPlay: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player),
                $playBtn = $videoComponent.find(this.selectors.playBtn),
                $pauseBtn = $videoComponent.find(this.selectors.pauseBtn),
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            $pauseBtn.show();
            if ($playBtn.is(':focus')) {
                this.focus($pauseBtn);
            }
            $playBtn.hide();

            var $notification = $videoComponent.find(this.selectors.notification);
            $notification.addClass('x-player-notification--play show').removeClass('x-player-notification--pause');
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = setTimeout(function () {
                $notification.removeClass('show');
            }, 1500);
            $ariaLive.text("Video playing");
            //this.announce($ariaLive, "Video playing");
        },
        onPauseClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player);
            $player[0].pause();
        },
        onPause: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player),
                $playBtn = $videoComponent.find(this.selectors.playBtn),
                $pauseBtn = $videoComponent.find(this.selectors.pauseBtn),
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            $playBtn.show();
            if ($pauseBtn.is(':focus')) {
                this.focus($playBtn);
            }
            $pauseBtn.hide();

            var $notification = $videoComponent.find(this.selectors.notification);
            $notification.removeClass('x-player-notification--play').addClass('x-player-notification--pause show').show();
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = setTimeout(function () {
                $notification.removeClass('show');
            }, 1500);
            $ariaLive.text("Video paused");
        },
        togglePlayPause: function (e) {
            var $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                player = $videoComponent.find(this.selectors.player)[0];
            if ($videoComponent.hasClass('x--background-mode')) {
              return;
            }
            if (player.paused) {
                $videoComponent.find(this.selectors.playBtn).focus();
                player.play();
            } else {
                $videoComponent.find(this.selectors.pauseBtn).focus();
                player.pause();
            }
        },

        // Volume
        onMuteClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                player = $videoComponent.find(this.selectors.player)[0],
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            player.volume = 0;

            // For accessibility have to duplicate it here. Originally in onVolumeChange()
            var $mute = $videoComponent.find(this.selectors.muteBtn),
                $unmute = $videoComponent.find(this.selectors.unmuteBtn);
            $mute.hide();
            $unmute.show().focus();
            $ariaLive.text("Muted");
        },
        onUnmuteClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                player = $videoComponent.find(this.selectors.player)[0],
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            player.volume = 1;

            // For accessibility have to duplicate it here. Originally in onVolumeChange()
            var $mute = $videoComponent.find(this.selectors.muteBtn),
                $unmute = $videoComponent.find(this.selectors.unmuteBtn);
            $unmute.hide();
            $mute.show().focus();
            $ariaLive.text("Unmuted");
        },
        updateVolume: function (e) {
            var $targ = $(e.target),
                val = $targ[0].value,
                player = $targ.closest(this.selectors.videoComponent).find(this.selectors.player)[0];
            player.volume = val;
            // accessibility
            $targ.attr('aria-valuetext', "Volume " + Math.round(val * 100) + "%");
        },
        onVolumeChange: function (e) {
            var player = e.target,
                $videoComponent = $(player).closest(this.selectors.videoComponent),
                $muteBtn = $videoComponent.find(this.selectors.muteBtn),
                $unmuteBtn = $videoComponent.find(this.selectors.unmuteBtn);
            // update mute/unmute
            if (player.volume == 0) {
                $unmuteBtn.show();
                if ($muteBtn.is(':focus')) {
                    $unmuteBtn.focus();
                }
                $muteBtn.hide();
            } else {
                $muteBtn.show();
                if ($unmuteBtn.is(':focus')) {
                    $muteBtn.focus();
                }
                $unmuteBtn.hide();
            }
            // update volume bar
            var $volumeBar = $videoComponent.find(this.selectors.volumeBar);
            $volumeBar.attr('value', player.volume);
            $volumeBar.attr('aria-valuetext', "Volume " + Math.round(player.volume * 100) + "%");
            this.updateRangeControl($volumeBar, player.volume, true);
        },
        openVolumeControls: function (e) {
            var $controls = $(e.target).closest(this.selectors.volumeControls);
            $controls.addClass('open');
        },
        closeVolumeControls: function (e) {
            var $controls = $(e.target).closest(this.selectors.volumeControls);
            $controls.removeClass('open');
        },

        // Closed caption
        onCaptionShowClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                player = $videoComponent.find(this.selectors.player)[0],
                $captionOnBtn = $videoComponent.find(this.selectors.captionOnBtn),
                $captionOffBtn = $videoComponent.find(this.selectors.captionOffBtn),
                $ariaLive = $targ.closest(this.selectors.vidInner).find(this.selectors.ariaLive);
            player.textTracks[0].mode = "showing";
            $captionOffBtn.show()
            if ($captionOnBtn.is(':focus')) {
                //$captionOffBtn.focus();
                this.focus($captionOffBtn);
            }
            $captionOnBtn.hide();
            $ariaLive.text("Closed captions on");
        },
        onCaptionHideClick: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                player = $videoComponent.find(this.selectors.player)[0],
                $captionOnBtn = $videoComponent.find(this.selectors.captionOnBtn),
                $captionOffBtn = $videoComponent.find(this.selectors.captionOffBtn),
                $ariaLive = $targ.closest(this.selectors.vidInner).find(this.selectors.ariaLive);
            player.textTracks[0].mode = "hidden";
            $captionOnBtn.show();
            if ($captionOffBtn.is(':focus')) {
                //$captionOnBtn.show().focus();
                this.focus($captionOnBtn);
            }
            $captionOffBtn.hide();
            $ariaLive.text("Closed captions off");
        },

        // Fulscreen
        toggleFullscreen: function (e) {
            var $targ = $(e.target),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player),
                isInFullScreen = !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement),
                $controls = $videoComponent.find(this.selectors.component),
                $notification = $videoComponent.find('.x-player-notification-container');
            if (isInFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if ($videoComponent[0].requestFullscreen) {
                    $videoComponent[0].requestFullscreen();
                } else if ($videoComponent[0].mozRequestFullScreen) {
                    $videoComponent[0].mozRequestFullScreen();
                } else if ($videoComponent[0].webkitRequestFullScreen) {
                    $videoComponent[0].webkitRequestFullScreen();
                } else if ($videoComponent[0].msRequestFullscreen) {
                    $videoComponent[0].msRequestFullscreen();
                } else if (this.md.tablet() == 'iPad' && $player[0].webkitEnterFullscreen) {
                    $player[0].webkitEnterFullscreen();
                }
            }
        },
        onFullscreen: function (e) {
            var isFullscreenOn = !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement),
                fullscreenElement = (document.fullscreenElement ||	document.webkitFullscreenElement ||	document.mozFullScreenElement ||	document.msFullscreenElement);
            if ($(fullscreenElement).is(this.selectors.videoComponent) || this.$fullscreenTarg) {
                var $videoComponent = (this.$fullscreenTarg) ? this.$fullscreenTarg : $(fullscreenElement),
                    $controls = $videoComponent.find(this.selectors.component),
                    $outsideControls = $(this.selectors.component).not($controls),
                    $closeButton = $videoComponent.find(this.selectors.closeBtn),
                    $innerContainer = $videoComponent.find(this.selectors.vidInner),
                    $fullscreenOnBtn = $videoComponent.find(this.selectors.fullscreenOnBtn),
                    $fullscreenOffBtn = $videoComponent.find(this.selectors.fullscreenOffBtn),
                    $ariaLive = $videoComponent.find(this.selectors.ariaLive),
                    $bookends = $controls.find('[data-fullscreen-bookends]');
                if (isFullscreenOn) {
                    this.$fullscreenTarg = $(fullscreenElement);
                    $outsideControls.hide(); // hide all custom controls on the page, except current one. (their z-index is 2147483647)
                    $closeButton.hide();
                    $innerContainer.css('height', '100%');
                    $videoComponent.addClass(this.classes.fullscreen);

                    if ($bookends.length < 1) {
                        var bookendMarkup = '<div tabindex="0" data-fullscreen-bookends></div>',
                            $bookendFirst = $(bookendMarkup),
                            $bookendLast = $(bookendMarkup);
                        $controls.prepend(bookendMarkup);
                        $controls.append(bookendMarkup);
                        var $focusableElements = $controls.find(this.selectors.focusable);
                        // Capture focus events on bookends to contain tabbing within a container
                        $controls.find('[data-fullscreen-bookends]')
                            .eq(0) // Focusing first bookend sends focus to last real focusable element
                            .on('focus', function () {
                                $focusableElements.eq(-2).focus();
                            })
                            .end()
                            .eq(1) // Focusing last bookend sends focus to the first real focusable element
                            .on('focus', function () {
                                if ($focusableElements.eq(1).is(':visible')) {
                                    $focusableElements.eq(1).focus();
                                } else {
                                    $focusableElements.eq(2).focus();
                                }
                            });
                    }

                    $fullscreenOffBtn.show();
                    if ($fullscreenOnBtn.is(':focus')) {
                        //$fullscreenOffBtn.focus();
                        this.focus($fullscreenOffBtn);
                    }
                    $fullscreenOnBtn.hide();
                    setTimeout(function () {
                        $ariaLive.text("Fullscreen enabled");
                    }, 0);
                } else {
                    this.$fullscreenTarg = null;
                    $outsideControls.show();
                    if ($videoComponent.hasClass(this.classes.overlayPlayer)) {
                        $closeButton.show();
                    }
                    $innerContainer.removeAttr('style');
                    $videoComponent.removeClass(this.classes.fullscreen);

                    $bookends.remove();

                    $fullscreenOnBtn.show();
                    if ($fullscreenOffBtn.is(':focus')) {
                        //$fullscreenOnBtn.focus();
                        this.focus($fullscreenOnBtn);
                    }
                    $fullscreenOffBtn.hide();
                    setTimeout(function () {
                        $ariaLive.text("Fullscreen disabled");
                    }, 0);
                }
            }
        },


        secondsToMinutes: function (sec) {
            var timeString,
                minutes,
                seconds,
                sanitized;
            sanitized = Math.floor(sec);
            minutes = Math.floor(sec / 60);
            seconds = sanitized % 60;
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            timeString = minutes + ':' + seconds;
            return timeString
        },
        minutesToSeconds: function (time) {
            if (time.indexOf(':') > -1) {
                var parts = time.split(':'),
                    minutes = +parts[0],
                    seconds = +parts[1];
                return (minutes * 60 + seconds).toFixed(3);
            } else {
                return +time;
            }
        },
        toAccessibleTime: function (sec) {
            var timeString;
            var hours = parseInt( sec / 3600 ) % 24;
            var minutes = parseInt( sec / 60 ) % 60;
            var seconds = Math.floor(sec) % 60;
            var timeString = (hours < 1 ? "" : hours + " hour") + (hours > 1 ? "s" : "") + (hours > 0 ? ", " : " ") +
                (minutes < 1 ? "" : minutes + " minute") + (minutes > 1 ? "s " : "") + (minutes > 0 ? ", " : " ") +
                (seconds < 1 ? "" : seconds + " second") + (seconds > 1 ? "s " : "");
            return timeString;
        },

        setRangeDragHandle: function (e) {
            this.$dragTarg = $(e.target);
        },
        unsetRangeDragHandle: function (e) {
            $(this.selectors.inputTime).prop('placeholder', '--:--');
            this.$dragTarg = null;
        },
        onRangeClick: function (e) {
            var $rangeHandle = $(e.target).find(this.selectors.rangeHandle);
            if (!$rangeHandle.length) {
                $rangeHandle = $(e.target).closest(this.selectors.rangeThermometer).find(this.selectors.rangeHandle);
            }
            if ($rangeHandle.length) {
                this.$dragTarg = $rangeHandle;
                this.onRangeDrag(e);
                this.unsetRangeDragHandle(null);
            }
        },
        updateAriaLabel: function (e) {
            var $videoComponent = $(e.target).closest(this.selectors.videoComponent);
            if ($videoComponent.length) {
                // update seek bar
                var $seekBar = $videoComponent.find(this.selectors.seekBar),
                    player = $videoComponent.find(this.selectors.player)[0];
                //$seekBar.attr('aria-valuetext', this.secondsToMinutes(player.currentTime) + " of " + this.secondsToMinutes(player.duration));
                $seekBar.attr('aria-valuetext', "Time " + this.toAccessibleTime(player.currentTime) + " of " + this.toAccessibleTime(player.duration));
            }
        },

        onRangeDrag: function (e) {
            if (this.$dragTarg) {
                // calculate range value
                var $pageX = null,
                    $therm = this.$dragTarg.closest(this.selectors.rangeThermometer),
                    pageX = e.pageX,
                    thermWidth = $therm.outerWidth(),
                    therm_startPos = $therm.offset().left,
                    therm_endPos = (therm_startPos + thermWidth),
                    trueLeft = (pageX - therm_startPos);
                if (trueLeft <= 0) {
                    trueLeft = 0;
                }
                if (trueLeft >= thermWidth) {
                    trueLeft = thermWidth;
                }
                var handle_startPos = $therm.find(this.selectors.rangeHandle).offset().left,
                    overallWidth = (therm_endPos - therm_startPos),
                    handlePos = (handle_startPos - therm_startPos),
                    handlePosPercent = (handlePos / overallWidth) * 100,
                    trueHandlePos = ((trueLeft / thermWidth) * 100).toFixed(2),
                    trueHandlePosPercent = trueHandlePos + '%';
                this.$dragTarg.css({
                    'left': trueHandlePosPercent
                });
                // update related video property
                var $videoComponent = this.$dragTarg.closest(this.selectors.videoComponent),
                    $player = $videoComponent.find(this.selectors.player),
                    $hiddenRangeBar = this.$dragTarg.closest(this.selectors.controlsGroup).find('.x-controls-hidden-range'),
                    value = trueHandlePosPercent.slice(0, -1);
                if ($hiddenRangeBar.is($videoComponent.find(this.selectors.volumeBar))) {
                    value = value / 100;
                    value = value.toFixed(2);
                    value.toString();
                    if (value >= 1) {
                        value = 1;
                    }
                    if (value <= 0) {
                        value = 0;
                    }
                    $player[0].volume = value;
                } else if ($hiddenRangeBar.is($videoComponent.find(this.selectors.seekBar))) {
                    var time = value / 100 * $player[0].duration;
                    $player[0].currentTime = time;
                    // update current time label
                    var $inputTime = $videoComponent.find(this.selectors.inputTime);
                    $inputTime.prop('placeholder', this.secondsToMinutes(time));
                } else {
                    console.log("unexpected scrubber target");
                }
            }
        },

        updateTimeFromInput: function (e) {
            var $targ = $(e.target),
                $handle = $targ.closest(this.selectors.rangeHandle),
                keycode = (e.keyCode ? e.keyCode : e.which),
                targVal = $targ.val(),
                $videoComponent = $targ.closest(this.selectors.videoComponent),
                $player = $videoComponent.find(this.selectors.player),
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            if (keycode == 32 || keycode == 80 || keycode == 77 || keycode == 70 || keycode == 80 || keycode == 67 || keycode == 27 || keycode == 88) { // on shortcut
                e.preventDefault();
                return;
            } else if (keycode == 13) { // on enter
                var targVal = this.minutesToSeconds(targVal),
                    inputTime = Number(targVal),
                    duration = $player[0].duration;
                if (inputTime > duration) {
                    inputTime = duration;
                }
                $player[0].currentTime = inputTime;
                $targ.val('');
                $handle.removeClass('error');
                $ariaLive.text("Time " + this.toAccessibleTime(inputTime) + " of " + this.toAccessibleTime(duration));
                //$targ.prop('aria-valuetext', "Time " + this.secondsToMinutes(inputTime));
                /*
                 $handle.addClass('_error');
                 setTimeout(function () {
                 $handle.removeClass('_error');
                 $handle.find(this.selectors.inputTime).val('');
                 }.bind(this), this.hideDelay);
                 */
            } else {
                // Allow: backspace, delete, tab, escape, enter and :
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 186, 59]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return; // do nothing
                }
                // Ensure that it is a number and stop the keydown
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            }
            e.stopPropagation();
        },

        updateRangeControl: function ($targ, val, forVolume) {
            var $controlCol = $targ.closest(this.selectors.controlsGroup),
                $thermFill = $controlCol.find(this.selectors.rangeFill),
                $handle = $controlCol.find(this.selectors.rangeHandle);
            if (forVolume) {
                val = val * 100;
                $thermFill.css({
                    'width': val + '%'
                });
                $handle.css({
                    'left': val + '%'
                });
            } else {
                $thermFill.css({
                    'width': val + '%'
                });
                $handle.css({
                    'left': val + '%'
                });
            }
        },

        showControls: function (e) {
            var $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                $controls = $videoComponent.find(this.selectors.component),
                $closeBtn = $videoComponent.find(this.selectors.closeBtn);
            if ($controls.length) {
                $controls.addClass('show');
                $closeBtn.addClass('show');
                clearTimeout(this.controlsTimeout);
                this.controlsTimeout = setTimeout(function () {
                    this.hideControls();
                }.bind(this), this.hideDelay);
            }
        },
        hideControls: function () {
            var $controls = $(this.selectors.component),
                $closeBtn = $controls.closest(this.selectors.videoComponent).find(this.selectors.closeBtn);
            if ($controls.length) {
                // keep active
                if (this.$dragTarg || $controls.find(this.selectors.inputTime + ':focus').length) {
                    clearTimeout(this.controlsTimeout);
                    this.controlsTimeout = setTimeout(function () {
                        this.hideControls();
                    }.bind(this), this.hideDelay);
                    // hide
                } else {
                    $controls.removeClass('show');
                    $closeBtn.removeClass('show');
                }
            }
        },

        openShortcutsInfo: function (e) {
            var $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                $shortcuts = $videoComponent.find(this.selectors.shortcutsInfo),
                $closeBtn = $shortcuts.find(this.selectors.shortcutsCloseBtn);
            if ($shortcuts.length) {
                var $bookends = $shortcuts.find('[data-shortcut-bookends]');
                if ($bookends.length < 1) {
                    var bookendMarkup = '<div tabindex="0" data-shortcut-bookends></div>',
                        $bookendFirst = $(bookendMarkup),
                        $bookendLast = $(bookendMarkup);
                    $shortcuts.prepend(bookendMarkup);
                    $shortcuts.append(bookendMarkup);
                    var $focusableElements = $shortcuts.find(this.selectors.focusable);
                    // Capture focus events on bookends to contain tabbing within a container
                    $shortcuts.find('[data-shortcut-bookends]')
                        .eq(0) // Focusing first bookend sends focus to last real focusable element
                        .on('focus', function () {
                            $focusableElements.eq(-2).focus();
                        })
                        .end()
                        .eq(1) // Focusing last bookend sends focus to the first real focusable element
                        .on('focus', function () {
                            if ($focusableElements.eq(1).is(':visible')) {
                                $focusableElements.eq(1).focus();
                            } else {
                                $focusableElements.eq(2).focus();
                            }
                        });
                }
                $shortcuts.addClass('show').attr('aria-hidden', 'false');
                $shortcuts.siblings().attr('tabindex', "-1").attr('aria-hidden', "true");
                setTimeout(function () {
                    $shortcuts.find('[role="document"]').focus();
                    var $ariaLive = $videoComponent.find(this.selectors.ariaLive);
                    $ariaLive.text("Shortcuts info opened. Press Escape to close it");
                }.bind(this), 100);
            }
        },
        closeShortcutsInfo: function (e) {
            var $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                $shortcuts = $videoComponent.find(this.selectors.shortcutsInfo),
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            if ($shortcuts.length) {
                $shortcuts.find('[data-shortcut-bookends]').remove();
                $shortcuts.removeClass('show').attr('aria-hidden', 'true');
                $shortcuts.siblings().removeAttr('tabindex').attr('aria-hidden', "false");
                $ariaLive.text("Shortcuts info closed");
                $videoComponent.find(this.selectors.shortcutsBtn).focus();
            }
        },

        // Shortcuts
        onKeyDown: function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which),
                $component = $(e.currentTarget),
                player = $component.find(this.selectors.player)[0],
                $ariaLive = $component.find(this.selectors.ariaLive);
            switch(keycode) {
                case 80: // P - play/pause
                case 32: // Spacebar - play/pause
                    if (player.paused) {
                        player.play();
                    } else {
                        player.pause();
                    }
                    break;
                case 38: // Arrow Up - volume up
                    var volume = player.volume + 0.1;
                    if (volume > 1) {
                        volume = 1;
                    }
                    player.volume = volume;
                    $ariaLive.text("Volume " + Math.round(volume * 100) + "%");
                    e.preventDefault();
                    break;
                case 40: // Arrow Down - volume down
                    var volume = player.volume - 0.1;
                    if (volume < 0) {
                        volume = 0;
                    }
                    player.volume = volume;
                    $ariaLive.text("Volume " + Math.round(volume * 100) + "%");
                    e.preventDefault();
                    break;
                case 39: // Arrow Right - skip ahead 15 seconds; +shift - 60 seconds
                    var chunk = (e.shiftKey) ? 60 : 15,
                        time = player.currentTime + chunk;
                    if (time > player.duration) {
                        time = player.duration;
                    }
                    player.currentTime = time;
                    $ariaLive.text("Time " + this.toAccessibleTime(time) + " of " + this.toAccessibleTime(player.duration));

                    $(this.selectors.inputTime).prop('placeholder', this.secondsToMinutes(time));
                    this.notificationTimeout = setTimeout(function () {
                        $(this.selectors.inputTime).prop('placeholder', '--:--');
                    }.bind(this), 500);

                    e.preventDefault();
                    break;
                case 37: // Arrow Left - skip back 15 seconds; +shift - 60 seconds
                    var chunk = (e.shiftKey) ? 60 : 15,
                        time = player.currentTime - chunk;
                    if (time < 0) {
                        time = 0;
                    }
                    player.currentTime = time;
                    $ariaLive.text("Time " + this.toAccessibleTime(time) + " of " + this.toAccessibleTime(player.duration));

                    $(this.selectors.inputTime).prop('placeholder', this.secondsToMinutes(time));
                    this.notificationTimeout = setTimeout(function () {
                        $(this.selectors.inputTime).prop('placeholder', '--:--');
                    }.bind(this), 500);

                    e.preventDefault();
                    break;
                case 77: // M - toggle mute audio
                    var $muteBtn = $component.find(this.selectors.muteBtn),
                        $unmuteBtn = $component.find(this.selectors.unmuteBtn);
                    if ($muteBtn.is(':visible')) {
                        $muteBtn.trigger('click');
                    } else if ($unmuteBtn.is(':visible')) {
                        $unmuteBtn.trigger('click');
                    }
                    break;
                case 70: // F - toggle full screen
                    var $fullscreenOnBtn = $component.find(this.selectors.fullscreenOnBtn),
                        $fullscreenOffBtn = $component.find(this.selectors.fullscreenOffBtn);
                    if ($fullscreenOnBtn.is(':visible')) {
                        $fullscreenOnBtn.trigger('click');
                    } else if ($fullscreenOffBtn.is(':visible')) {
                        $fullscreenOffBtn.trigger('click');
                    }
                    break;
                case 67: // C - toggle closed captions
                    var $captionOnBtn = $component.find(this.selectors.captionOnBtn),
                        $captionOffBtn = $component.find(this.selectors.captionOffBtn);
                    if ($captionOnBtn.is(':visible')) {
                        $captionOnBtn.trigger('click');
                    } else if ($captionOffBtn.is(':visible')) {
                        $captionOffBtn.trigger('click');
                    }
                    break;
                case 88: // X - close video
                    $component.find(this.selectors.closeBtn).trigger('click');
                    break;
                case 27: // Esc - close shortcuts pane; close video
                    var $shortcuts = $component.find(this.selectors.shortcutsInfo),
                        $shortcutsBookends = $shortcuts.find('[data-shortcut-bookends]');
                    if ($shortcutsBookends.length) {
                        $shortcuts.find(this.selectors.shortcutsCloseBtn).trigger('click');
                    } else {
                        $component.find(this.selectors.closeBtn).trigger('click');
                    }
                    break;
                case 74: // J - jump to time input field
                    e.preventDefault();
                    $component.find(this.selectors.inputTime).focus();
                    break;
                case 191: // ? - keyboard controls; 73 - I - keyboard controls
                    if (e.shiftKey && !this.md.mobile()) {
                        $component.find(this.selectors.shortcutsBtn).trigger('click');
                    }
                    break;
            }
        },
        preventDefaultKeySpacebar: function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == 32) { // Spacebar
                e.preventDefault();
            }
        },
        preventArrowShortcuts: function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode > 36 && keycode < 41) { // Arrows
                e.stopPropagation();
            }
        },
        focus: function ($button) {
            // mobile accessibility
            if (this.md.mobile()) {
                setTimeout(function () {
                    $button.focus();
                }, 100);
            } else {
                $button.focus();
            }
        },
        announce: function ($ariaLive, msg) {
            $ariaLive.text(msg);
            setTimeout(function () {
                $ariaLive.text("");
            }, 50);
        },



        // 'timeupdate' isn't captured in IE, when assigned to document. Assigning it to video element instead
        onLoadStart: function (e) {
            var player = $(e.target)[0],
                $videoComponent = $(e.target).closest(this.selectors.videoComponent),
                $ariaLive = $videoComponent.find(this.selectors.ariaLive);
            if ($videoComponent.length) {
                player.addEventListener('timeupdate', this.onTimeUpdate.bind(this), true);
            }
            $ariaLive.text("Video buffering");

            // Mobile accessibility
            /*var $seekBar = $videoComponent.find(this.selectors.seekBar),
             $currentTime = $videoComponent.find('.x-controls-currenttime');
             if (this.md.mobile()) {
             $currentTime.attr('tabindex', "-1");
             $seekBar.hide();
             }*/
        },

        toActiveMode: function (e) {
            //var $videoComponent = $(this.selectors.videoComponent);
            //if ($videoComponent.length) {
            var $videoComponent = $(e.target);
            if ($videoComponent.is(this.selectors.videoComponent)) {
                var player = $videoComponent.find(this.selectors.player)[0],
                  $controls = $videoComponent.find(this.selectors.component),
                  $ariaLive = $videoComponent.find(this.selectors.ariaLive);
                $videoComponent.removeClass('x--background-mode').addClass('x--active-mode');
                $controls.show().trigger('mousemove');
                $ariaLive.text("Video activated");

                player.currentTime = 0;
                player.volume = 1;
                $(player).prop('muted', false).prop('loop', false);
            }
        },
        toBackgroundMode: function (e) {
            //var $videoComponent = $(this.selectors.videoComponent);
            //if ($videoComponent.length) {
            var $videoComponent = $(e.target);
            if ($videoComponent.is(this.selectors.videoComponent)) {
                var player = $videoComponent.find(this.selectors.player)[0],
                  $controls = $videoComponent.find(this.selectors.component),
                  $ariaLive = $videoComponent.find(this.selectors.ariaLive);
                $videoComponent.addClass('x--background-mode').removeClass('x--active-mode');
                $controls.hide();

                player.volume = 0;
                player.play();
                $(player).prop('autoplay', true).prop('loop', true);
            }
        },

        bindListeners: function () {
            var $win = $(window),
              $doc = $(document),
              $comp = $(this.selectors.component);
            // Video element events
            document.addEventListener('play', this.onPlay.bind(this), true);
            document.addEventListener('pause', this.onPause.bind(this), true);
            document.addEventListener('volumechange', this.onVolumeChange.bind(this), true);
            document.addEventListener('durationchange', this.onDurationChange.bind(this), true);
            //document.addEventListener('timeupdate', this.onTimeUpdate.bind(this), true);
            document.addEventListener('loadstart', this.onLoadStart.bind(this), true);

            // Volume
            $doc.on('input.x-video change.x-video', this.selectors.volumeBar, this.updateVolume.bind(this));
            $doc.on('click.x-video', this.selectors.muteBtn, this.onMuteClick.bind(this));
            $doc.on('click.x-video', this.selectors.unmuteBtn, this.onUnmuteClick.bind(this));
            $doc.on('focus.x-video', this.selectors.volumeBar + ', '+ this.selectors.muteBtn + ', '+ this.selectors.unmuteBtn, this.openVolumeControls.bind(this));
            $doc.on('focusout.x-video', this.selectors.volumeBar + ', '+ this.selectors.muteBtn + ', '+ this.selectors.unmuteBtn, this.closeVolumeControls.bind(this));
            // Fullscreen
            $doc.on('click.x-video', this.selectors.fullscreenOnBtn + ", " + this.selectors.fullscreenOffBtn, this.toggleFullscreen.bind(this));
            $doc.on('webkitfullscreenchange mozfullscreenchange fullscreenchange fullscreenChange MSFullscreenChange', this.onFullscreen.bind(this));
            // Play/Pause
            $doc.on('click.x-video', '.x-player-notification-container', this.togglePlayPause.bind(this));
            $doc.on('click.x-video press.x-video', this.selectors.playBtn, this.onPlayClick.bind(this));
            $doc.on('click.x-video press.x-video', this.selectors.pauseBtn, this.onPauseClick.bind(this));
            // CC
            $doc.on('click.x-video', this.selectors.captionOnBtn, this.onCaptionShowClick.bind(this));
            $doc.on('click.x-video', this.selectors.captionOffBtn, this.onCaptionHideClick.bind(this));
            // Range
            $doc.on('input.x-video change.x-video', this.selectors.seekBar, this.updateTime.bind(this));
            $doc.on('click.x-video', '.x-range-control', this.onRangeClick.bind(this));
            // Range Handle
            $doc.on('mousedown.x-video touchstart.x-video', this.selectors.rangeHandle, this.setRangeDragHandle.bind(this));
            $doc.on('mousemove.x-video touchmove.x-video', this.onRangeDrag.bind(this));
            $doc.on('mouseup.x-video touchend.x-video', this.unsetRangeDragHandle.bind(this));
            $doc.on('focus.x-video', this.selectors.seekBar, this.updateAriaLabel.bind(this));
            // Time input
            $doc.on('keydown', this.selectors.inputTime, this.updateTimeFromInput.bind(this));
            $doc.on('mousedown mouseup mousemove click', this.selectors.inputTime, this.unsetRangeDragHandle.bind(this));
            // Hide/Show controls
            //$doc.on('mousemove.x-video click.x-video touchstart.x-video', '.x-player-notification-container', this.showControls.bind(this));
            $doc.on('mousemove.x-video click.x-video touchstart.x-video', this.selectors.vidInner, this.showControls.bind(this));
            $doc.on('focus.x-video', this.selectors.videoComponent + ' button, ' + this.selectors.videoComponent + ' input', this.showControls.bind(this));
            $doc.on('input.x-video change.x-video', this.selectors.volumeBar + ', ' + this.selectors.seekBar, this.showControls.bind(this));
            // Shortcuts
            $doc.on('keydown.x-video', this.selectors.videoComponent, this.onKeyDown.bind(this));
            $doc.on('keydown.x-video', this.selectors.videoComponent + " input", this.preventArrowShortcuts.bind(this));
            $doc.on('keydown.x-video keypress.x-video keyup.x-video', this.selectors.videoComponent + " button", this.preventDefaultKeySpacebar.bind(this));
            // On android both touchstart and onclick are fired. Use touchstart on iPad only
            if (this.md.tablet() == 'iPad') {
                $doc.on('touchstart.x-video', '.x-player-notification-container', this.togglePlayPause.bind(this)); // Play/Pause
            }
            // Shortcuts info pane
            $doc.on('click.x-video', this.selectors.shortcutsBtn, this.openShortcutsInfo.bind(this));
            $doc.on('click.x-video', this.selectors.shortcutsCloseBtn, this.closeShortcutsInfo.bind(this));
            // Background mode
            $doc.on('activateVideo', this.selectors.videoComponent, this.toActiveMode.bind(this));
            $doc.on('backgroundVideo', this.selectors.videoComponent, this.toBackgroundMode.bind(this));

            this.updateRangeControl($(this.selectors.volumeBar), 1, true);
        }
    };

    c.initialize();

})(jQuery, document);
