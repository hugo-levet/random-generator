
let time = 0;
let keyCurrentElmt = 0;
let currentElmt = 0;
let wheelIntervale;
let wheelStartTime = null;

let randomElmts = [];

(function () {
    'use strict';

    $(() => {
        function getrandomElmt(array, start) {
            let min = 0;
            let max = array.length - 1;
            let randNumber = Math.round(Math.random() * (max - min) + min);

            if (start == null) {
                return array[randNumber];
            }
            else {
                if (start + randNumber > array.length - 1) {
                    let newKey = start + randNumber - array.length;
                    return {
                        data: array[newKey],
                        start: newKey
                    };
                }
                else {
                    return {
                        data: array[start + randNumber],
                        start: start + randNumber
                    };
                }
            }
        }

        function changeElmt() {
            time += 1;
            let newElmt = getrandomElmt(randomElmts, keyCurrentElmt);
            keyCurrentElmt = newElmt.start;
            currentElmt = newElmt.data;

            // display
            $('#wheel').html(currentElmt);

            let now = Date.now();
            if (!wheelStartTime) {
                wheelStartTime = Date.now();
            } else if (now - wheelStartTime < 700) {
                clearInterval(wheelIntervale);
                wheelIntervale = setInterval(changeElmt, 300 / time);
            } else if (now - wheelStartTime < 2000) {
                clearInterval(wheelIntervale);
                wheelIntervale = setInterval(changeElmt, 50);
            } else if (now - wheelStartTime < 5000) {
                clearInterval(wheelIntervale);
                wheelIntervale = setInterval(changeElmt, 0.15 * (now - wheelStartTime) - 250);
            } else {
                clearInterval(wheelIntervale);
                $('#wheel')
                    .html(currentElmt)
                    .css('animation', 'finish 2s');
                setTimeout(function () {
                    $('#restart').css('top', '0');
                }, 2000)
            }
        }

        function updateRandomElmts() {
            $('#randomElmts').html('').attr('style', '');

            let i = 0;
            randomElmts.forEach(elmt => {
                $('#randomElmts').append(
                    $('<div />').append(
                        $('<p />')
                            .html(elmt)
                            .data('i', i),
                        $('<a />')
                            .bind('click', function () {
                                let li = $(this).parent().children('p');
                                randomElmts.splice(li.data('i'), 1);
                                updateRandomElmts();
                            })
                    ).addClass('randomElmt')
                );
                i += 1;
            });
        }

        $('#start').bind('click', function () {
            if (randomElmts.length > 1) {
                // CSS
                $('#wheel').css({
                    'width': $('#wheel').innerWidth() + 'px'
                });

                time = 0;
                keyCurrentElmt = 0;
                currentElmt = 0;
                wheelStartTime = null;
                wheelIntervale = setInterval(changeElmt, 300);
                $(this).remove();
            } else {
                $('#randomElmts')
                    .html('Ajoute plusieurs valeurs')
                    .fadeIn(200)
                    .css({
                        'padding-bottom': '6px',
                        'color': '#ff2039'
                    });
            }
        });

        $('#restart').bind('click', function () {
            if (randomElmts.length > 1) {
                // CSS
                $('#wheel').css({
                    'width': $('#wheel').innerWidth() + 'px'
                });
                
                $('#restart').css('top', '-50px');

                time = 0;
                keyCurrentElmt = 0;
                currentElmt = 0;
                wheelStartTime = null;
                wheelIntervale = setInterval(changeElmt, 300);
            } else {
                $('#randomElmts')
                    .html('Ajoute plusieurs valeurs')
                    .fadeIn(200)
                    .css({
                        'padding-bottom': '6px',
                        'color': '#ff2039'
                    });
            }
        });

        // add new element
        $('#addElmt').submit(function (e) {
            e.preventDefault();

            const regex = /^ *$/gm;
            if (!$('#newElmt').val().match(regex)) {
                randomElmts.push($('#newElmt').val());
                $('#newElmt').val('');
                updateRandomElmts();
            }
        });
    });
})();