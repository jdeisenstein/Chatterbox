const startButtonClickHandler = function () {
    $('#start-button').on('click', function () {

        jQuery(document).ready(function () {
            var audioArray = document.getElementsByClassName('songs');
            var i = 0;
            console.log("audio array:")
            console.log(audioArray);
            audioArray[i].play();
            for (i = 0; i < audioArray.length - 1; ++i) {
                audioArray[i].addEventListener('ended', function (e) {
                    var currentSong = e.target;
                    var next = $(currentSong).nextAll('audio');
                    if (next.length) $(next[0]).trigger('play');
                });
            }
        });
    });
}

startButtonClickHandler();