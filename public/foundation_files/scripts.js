/*$(document).ready(function() {
    $('#a').fadeIn(300, function() {
        $('#b').fadeIn(300, function() {
            $('#c').fadeIn(300, function() {
                $('#d').fadeIn(300, function() {});
            });
        });
    });
    $('div.video img').click(function() {
        getVideo($(this).attr("id"));
    });
    $("a.next").css({"right": 0});
    $('#scrollbar').tinyscrollbar({
        axis: 'x',
        scroll: false,
        sizethumb: '410'
    });
});

function getVideo(videoId) {
    $.ajax({
        type: "GET",
        url: "/videos/" + videoId,
        success: function(code) {
            showVideo(videoId, code);
        }
    });
}
function showVideo(videoId, code) {
    $('#' + videoId).parent('div.video').html(code);
}*/