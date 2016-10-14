(function($, c) {

    $(document).ready(function() {
        var source      = $('#source').get(0);
        var tmp         = $('#tmp').get(0);
        var transformed = $('#transformed').get(0);
        var parent      = $(transformed).parent();

        var stage       = new c.Stage(transformed);
        var tmpCtx      = tmp.getContext('2d');

        var width       = 64;
        var height      = 36;
        var shapeSize   = 10;
        var shapes      = [];

        var userMedia   = navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width : {
                    max: width
                },
                height: {
                    max: height
                }
            }
        });

        c.Ticker.setFPS(30);
        c.Ticker.addEventListener('tick', function() {
            tmpCtx.drawImage(source, 0, 0, width, height);

            var tmpData = tmpCtx.getImageData(0, 0, tmp.width, tmp.height).data;

            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    var index = (y * tmp.width + x) * 4;
                    var scale = 1 - ((tmpData[index] + tmpData[index + 1] + tmpData[index + 2]) / 3) / 255;

                    shapes[x][y].x      = x * shapeSize * (1 - scale) + shapeSize * (1 - scale) / 2;
                    shapes[x][y].y      = y * shapeSize * (1 - scale) + shapeSize * (1 - scale) / 2;
                    shapes[x][y].scaleX = shapes[x][y].scaleY = scale;
                }
            }

            stage.update();
        });

        for (var x = 0; x < width; x++) {
            shapes[x] = [];

            for (var y = 0; y < height; y++) {
                var shape = new c.Shape();
                shape
                    .graphics
                    .beginFill('#000')
                    .drawRect(x * shapeSize, y * shapeSize, shapeSize, shapeSize);

                stage.addChild(shape);

                shapes[x][y] = shape;
            }
        }

        userMedia.then(function(stream) {
            source.src              = window.URL.createObjectURL(stream);
            source.onloadedmetadata = function() {
                source.play();
            };
        });
    });

})(jQuery, createjs);
