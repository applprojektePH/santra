$(document).ready(function () {
    $(".accordion-collapse").collapse();
    $('#collapseFilterbtn').click(function () {
        $('#collapseFilter').collapse('toggle');
    });
    $('.collapseFilter').collapse();
    if (window.location.href.indexOf("submit-form") > -1) {
        if (window.history.replaceState) {
            window.history.replaceState(null, null, '/user');
        }
    }
    // var maxChar = parseInt($('.textarea-js').attr('maxlength'));
    // $('.textarea-js[maxlength]').parent().find('.charleft').html(maxChar - $(this).val().length);
    // var char = $('.textarea-js').val().length;
    // $('.textarea-js').parent().find('.charleft').html(maxChar - char);
    // $('.textarea-js[maxlength]').keyup(function(){
    //     if($(this).val().length > maxChar){
    //         $(this).val($(this).val().substr(0, maxChar));
    //     }
    //     $(this).parent().find('.charleft').html(maxChar - $(this).val().length);
    // });

    $('#buttonsubmitform').click(function () {
        $('#form-status-input').attr('value', '1');
    });

    $('.submitformbtn').click(function () {
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let datetime = d.getFullYear() + '-' +
            (('' + month).length < 2 ? '0' : '') + month + '-' +
            (('' + day).length < 2 ? '0' : '') + day + ' ' +
            (('' + hour).length < 2 ? '0' : '') + hour + ':' +
            (('' + minute).length < 2 ? '0' : '') + minute;
        $('.btn-datumantrag').attr('value', datetime);
    });

    // BACK-TO-TOP
    var back_to_top_button = ['<a href="#top" class="back-to-top"></a>'].join('');
    $('body').append(back_to_top_button);

    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $(".back-to-top").css({
                    opacity: 0.4,
                });
            } else {
                $(".back-to-top").css({
                    opacity: 0,
                });
            }
        });

        $(".back-to-top").click(function () {
            $("body,html").animate(
                {
                    scrollTop: 0,
                },
                800
            );
            return false;
        });
    });

    $(window).resize(function () {

        // This will fire each time the window is resized:
        if ($(window).width() >= 1024) {
            // if larger or equal

            $('#content').removeClass('mobile');
        } else {

            // if smaller
            $('#content').addClass('mobile');

        }
    }).resize();

    $('.link-id-delete').click(function (event) {
        event.stopPropagation();
        const urlParams = new URLSearchParams(window.location.search);
        const currenturlParam = urlParams.get('tsid');
        $.ajax({
            type: 'post',
            data: {str: parseInt(currenturlParam)},
            url: '/user'
        });
        setTimeout(
            function () {
                window.location.replace('/user');
            }, 500);
    })
    $('.btn-reload').one("click", function () {
        window.location.reload();
    })

    $("#inlineCheckbox5").click(function () {
        var paramChangeBoxes = $("input:checkbox.form-check-input-js");
        if ($(this).is(":checked")) {
            paramChangeBoxes.attr("disabled", "disabled");
            $(".form-check-input-js").prop("checked", false);
        } else {
            $(".form-check-input-js").removeAttr("disabled");
        }
    });
    if ((location.pathname.split("/")[1]) !== "") {
        $('nav a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active');
    } else {
        $('nav li.home-link a').addClass('active');
    }
    $('.nav-tabs .nav-item a').on('click', function (e) {
        $(this).tab('show')
    })
    $(".link-id").click(function (event) {
        event.stopPropagation()
    });
    $('.pdfexport').click(function () {
        window.frames["pdfframe"].contentWindow.focus();
            let srcpdf =  $('#pdfframe').attr('srcpdf');
            window.frames["pdfframe"].src=""+srcpdf;
            const urlParams = new URLSearchParams(window.location.search);
            const currenturlParam = urlParams.get('tsid');
        setTimeout(function () {
            document.title = "Softwareantrag"+currenturlParam;
            window.frames["pdfframe"].contentWindow.print();
    }, 1300);
        });


});

