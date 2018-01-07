(function($, undefined) {
    $.fn.po = function(custom) {
        var defaults = {
            container:'body',
            alignment:'center',
            modal:false,
            belowSelector:false
        }

        var opts = $.extend({}, defaults, custom);

        if ( opts.modal ) {
            if ( typeof $.pjax === 'function' ) {
                $(document).on('pjax:end', function() {
                    var $modalNodes = $('[id*=modal-container_]');
                    if ( $modalNodes.length ) $modalNodes.remove();
                })
            }

            $(opts.container).on('click', this.selector, function() {
                var selector = $(this);
                var layerId = selector.data('layer-id');

                // background element create
                if ( !$('#modal-container_' + layerId ).length ) $('<div id="modal-container_' + layerId + '" class="po__modal"></div>').appendTo('body');

                var layer = $('#' + layerId);
                var modal = $('#modal-container_' + layerId);

                function positioningInner() {
                    var info = {
                        layerWidth: layer.outerWidth(true),
                        layerHeight: layer.outerHeight(true)
                    }
                    layer.css({
                        'margin-top': -info.layerHeight/2,
                        'margin-left': -info.layerWidth/2
                    })
                }


                if ( modal.html() !== '' ) {
                    modal.addClass('is-active');

                } else {
                    positioningInner();
                    layer.appendTo(modal);
                    modal.addClass('is-active');
                }

                $('html,body').css('overflow', 'hidden');

                setTimeout(function() {
                    modal.on('click', function() {
                        $(this).removeClass('is-active');
                        $('html,body').css('overflow', '');
                    })

                    layer.on('click', function(ev) {
                        ev.stopPropagation();
                    })
                }, 0)
            });
            return;
        }

        $(opts.container).on('click', this.selector, function() {
            // not modal
            var selector = $(this);
            var layer = $('#' + selector.data('layer-id'));

            if ( layer.hasClass('is-active') ) {
                layer.removeClass('is-active');
                return;
            }

            var info = {
                selectorHeight: selector.outerHeight(true),
                selectorWidth: selector.outerWidth(true),
                layerWidth: layer.outerWidth(true),
                layerHeight: layer.outerHeight(true),
                offsetTop: selector.offset().top,
                positionTop: selector.position().top,
                positionLeft: selector.position().left,
                scrollAmount: $(window).scrollTop(),
                viewportHeight: $(window).height()
            };

            var layerPosition = {
                _top: function() {
                    if ( info.scrollAmount + info.viewportHeight - (info.offsetTop + info.selectorHeight) > info.layerHeight ) return info.positionTop + info.selectorHeight + 10
                    else return info.positionTop - info.layerHeight - 10;
                },
                _left:function() {
                    switch ( opts.alignment ) {
                        case 'left' :
                            return info.positionLeft;
                        case 'right' :
                            return info.positionLeft + info.selectorWidth - info.layerWidth;
                        case 'center' :
                            return info.positionLeft + info.selectorWidth - (info.selectorWidth/2 + info.layerWidth/2);
                        default :
                            return info.positionLeft;
                    }
                }
            }

            setTimeout(function() {
                layer.addClass('is-active');
                layer.css({
                    'top':layerPosition._top(),
                    'left':layerPosition._left()
                })

                $(window).on('click', function() {
                    layer.removeClass('is-active');
                })

                layer.on('click', function(ev) {
                    if ( $(ev.target).is('a') ) return;
                    else ev.stopPropagation();
                });
            },0)
        });
    }
})(jQuery)
