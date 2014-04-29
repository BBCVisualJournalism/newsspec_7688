define(['lib/news_special/bootstrap'], function (news) {

    var requestSwap = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var link = news.$(this).find('a');
        if (!link.hasClass('active')) {
            news.pubsub.emit('ns:sis:swap', [link]);
        }
    };

    var SimpleImageSwap = function () {
        this.navigation = news.$('#ns__navstrip');
        news.pubsub.on('ns:sis:swap', news.$.proxy(this.swapSelection, this));
        this.navigation.on('click', 'li', requestSwap);
    };

    SimpleImageSwap.prototype = {
        swapSelection: function (item) {
            var link = item.attr('data-section');
            news.$('#ns__navstrip>li>a.active').removeClass('active');
            news.$('#ns__viewport>img.active').removeClass('active');
            item.addClass('active');
            news.$('.js-ns-item-' + link).addClass('active');
        }
    };

    return SimpleImageSwap;

});