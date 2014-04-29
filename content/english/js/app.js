define(['lib/news_special/bootstrap', 'module/simpleimageswap'], function (news, SimpleImageSwap) {

    return {
        init: function (storyPageUrl) {

            new SimpleImageSwap();
            news.pubsub.emit('istats', ['App initiated', true]);

        }
    };

});