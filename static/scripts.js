$(document).ready(function () {
    let canvas;
    $('#uploadForm').submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.success) {
                    let imgSrc = '/static/uploads/' + data.filename;
                    let img = new Image();
                    img.src = imgSrc;
                    img.onload = function () {
                        $('#imageContainer').html('<canvas id="c"></canvas>');
                        canvas = new fabric.Canvas('c');
                        let fabricImg = new fabric.Image(img);
                        canvas.setWidth(img.width);
                        canvas.setHeight(img.height);
                        canvas.add(fabricImg);
                        canvas.renderAll();
                    };
                    $('#processButton').show();
                } else {
                    alert('Error: ' + data.error);
                }
            }
        });
    });

    $('#processButton').click(function () {
        let points = getSelectedPoints(); // 获取用户选择的点
        let imagePath = $('#c').find('img').attr('src').replace('/static/uploads/', '');

        $.ajax({
            url: '/process',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                image_path: imagePath,
                points: points
            }),
            success: function (data) {
                if (data.success) {
                    alert('Processing complete! Output Mesh: ' + data.output_mesh);
                } else {
                    alert('Processing failed');
                }
            }
        });
    });

    function getSelectedPoints() {
        let points = [];
        canvas.getObjects('circle').forEach(function (circle) {
            points.push({ x: circle.left, y: circle.top });
        });
        return points;
    }

    $('#imageContainer').on('click', 'canvas', function (e) {
        let pointer = canvas.getPointer(e);
        let circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 5,
            fill: 'red',
            selectable: false
        });
        canvas.add(circle);
        canvas.renderAll();
    });
});
