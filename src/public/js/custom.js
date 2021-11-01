$( document ).ready(function() {
    //$('.collapseFilter').collapse();


    $(".accordion-collapse").collapse();
    $('#collapseFilterbtn').click(function() {
        $('#collapseFilter').collapse('toggle');
    });
    $('.collapseFilter').collapse();
    if (window.location.href.indexOf("form") > -1) {

//only edit and form functions
        var maxChar = parseInt($('.textarea-js').attr('maxlength'));
        $('.textarea-js[maxlength]').parent().find('.charleft').html(maxChar - $(this).val().length);
        var char = $('.textarea-js').val().length;
        $('.textarea-js').parent().find('.charleft').html(maxChar - char);
        $('.textarea-js[maxlength]').keyup(function(){
            if($(this).val().length > maxChar){
                $(this).val($(this).val().substr(0, maxChar));
            }
            $(this).parent().find('.charleft').html(maxChar - $(this).val().length);
        });

        $('.submitformbtn').click(function () {
            $("#accordionForm").find(".accordion-item").each(function () {
                $(this).find("input, select, textarea").filter('[required]').each(function () {
                    if (($(this).val() == "") || ($(this).val() == null)) {
                        let current = $(this).closest(".accordion-collapse").prev();
                        current.addClass('required-header');
                        //alert($(this).val());
                    } else {
                        let current = $(this).closest(".accordion-collapse").prev();
                        current.removeClass('required-header');
                    }
                    return false;
                });
            });
        });
    }
    $('#buttonsubmitformdraft').click(function () {
        $('#form-status-input').attr('value', '10');

        let d = new Date();
        let month = d.getMonth()+1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();

        let datetime = d.getFullYear() + '-' +
            ((''+month).length<2 ? '0' : '') + month + '-' +
            ((''+day).length<2 ? '0' : '') + day + ' ' +
            ((''+hour).length<2 ? '0' :'') + hour + ':' +
            ((''+minute).length<2 ? '0' :'') + minute + ':' +
            ((''+second).length<2 ? '0' :'') + second;
        $('.btn-datumantrag').attr('value', datetime);
    });
    $('#buttonsubmitform').click(function () {
        $('#form-status-input').attr('value', '1');
        let d = new Date();
        let month = d.getMonth()+1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        let datetime = d.getFullYear() + '-' +
            ((''+month).length<2 ? '0' : '') + month + '-' +
            ((''+day).length<2 ? '0' : '') + day + ' ' +
            ((''+hour).length<2 ? '0' :'') + hour + ':' +
            ((''+minute).length<2 ? '0' :'') + minute + ':' +
            ((''+second).length<2 ? '0' :'') + second;
        $('.btn-datumantrag').attr('value', datetime);
    });
        $(".excel-export-btn").click(function(e){
            var table = $(".table-works");
            if(table && table.length){
                $(table).table2excel({
                    exclude: ".noExl",
                    name: "Excel Document Name",
                    filename: "SW-Anträge" + ".xls",
                    fileext: ".xls",
                    exclude_img: true,
                    exclude_links: false,
                    exclude_inputs: true
                });
            }
        });
    $('.li-status').click(function (event) {
        let status =  $(this).attr('id').slice(-1);
           // $(this).unbind("click");
            //$(this).prevAll().unbind("click");
        $(this).addClass('preactive');
        $(this).prevAll().addClass('preactive');
        // const urlParams = new URLSearchParams(window.location.search);
        // const currenturlParam = urlParams.get('tsid');
        //     $.ajax({
        //         type: 'GET',
        //         data:{status:status},
        //         url: '/details?tsid='+currenturlParam+'&st='+status,
        //         error: function (xhr, ajaxOptions, thrownError) {
        //             alert(xhr.status);
        //             alert(thrownError);
        //         }
        //     });
        });

    $('.button-email-send').click(function (event) {
        let mailtype =  $(this).attr('class').split(' ')[0].slice(-1);
        let status =  $(this).attr('class').split(' ')[1].slice(-1);
        const urlParams = new URLSearchParams(window.location.search);
        const currenturlParam = urlParams.get('tsid');
        let mailtext = $(this).prev().val();
        let d = new Date();
        let month = d.getMonth()+1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();

        let datetime = d.getFullYear() + '-' +
            ((''+month).length<2 ? '0' : '') + month + '-' +
            ((''+day).length<2 ? '0' : '') + day + ' ' +
            ((''+hour).length<2 ? '0' :'') + hour + ':' +
            ((''+minute).length<2 ? '0' :'') + minute + ':' +
            ((''+second).length<2 ? '0' :'') + second;
        $.ajax({
            type: 'GET',
            data:{status:status},
            url: '/details?tsid='+currenturlParam+'&st='+status+'&mailtext='+mailtext+'&datetime='+datetime+'&mailtype='+mailtype,
            // success: function(data) {
            //     alert();
            //     $(this).parent(".inputHide").delay(300).slideDown("slow");
            // },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    });

    // $('#submitformchanges').click(function (event) {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const currenturlParam = urlParams.get('tsid');
    //
    //     $.ajax({
    //         type: 'GET',
    //         data:{currenturlParam:currenturlParam},
    //         url: '/edit?tsid='+currenturlParam+'changed="true"',
    //         success: function(data) {
    //             alert();
    //         },
    //         error: function (xhr, ajaxOptions, thrownError) {
    //             alert(xhr.status);
    //             alert(thrownError);
    //         }
    //     });
    // });




    //     var maxChar = parseInt($(".textarea-js").attr("maxlength"));
    //     $(".textarea-js[maxlength]").parent().find(".charleft").html(maxChar - $(this).val().length);
    //     var char = $(".textarea-js").val().length;
    //     $(".textarea-js").parent().find(".charleft").html(maxChar - char);
    //
    //     $(".textarea-js[maxlength]").keyup(function(){
    //     if($(this).val().length > maxChar){
    //     $(this).val($(this).val().substr(0, maxChar));
    // }
    //     $(this).parent().find(".charleft").html(maxChar - $(this).val().length);
    // });


    $('.date-picker').datepicker(
        {
            format: 'dd.mm.yyyy',
            endDate: '+0d',
            autoclose: true,
            language: 'de'
        }
    );

    /*add field*/
    //Clone the hidden element and shows it
    let count = 0;
    $('.add-one').click(function () {
        if (count <= 0) {
            $('.dynamic-element').first().clone().appendTo('.dynamic-stuff').show();
            attach_delete();
            $('.add-one').addClass('hidden');
            $(".dynamic-element").find(".form-select").each(function () {
                let attrselectedform = $(this).attr('filled');
                $(this).find("option[value='" + attrselectedform + "']").prop('selected', true);
            });
        }
        /* else {
            // $('#countModal').modal('show');
             $('.add-one').addClass('hidden');
           count=count-1;
         }*/
        count++;
    });

//Attach functionality to delete buttons
    function attach_delete() {
        $('.delete').off();
        $('.delete').click(function () {
            $(this).closest('.form-group').remove();
            $('.add-one').removeClass('hidden');
            count--;
        });
    };
    (() => {
        'use strict';
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation');

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms).forEach((form) => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                 //   event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    })();

    //
    // $('form').bootstrapValidator({
    //     feedbackIcons: {
    //         valid: 'glyphicon glyphicon-ok',
    //         invalid: 'glyphicon glyphicon-remove',
    //         validating: 'glyphicon glyphicon-refresh'
    //     },
    //     fields: {
    //         firstName: {
    //             validators: {
    //                 notEmpty: {
    //                     message: 'The first name is required and cannot be empty'
    //                 }
    //             }
    //         },
    //         lastName: {
    //             validators: {
    //                 notEmpty: {
    //                     message: 'The last name is required and cannot be empty'
    //                 }
    //             }
    //         },
    //         email: {
    //             validators: {
    //                 notEmpty: {
    //                     message: 'The email address is required'
    //                 },
    //                 emailAddress: {
    //                     message: 'The input is not a valid email address'
    //                 }
    //             }
    //         },
    //         gender: {
    //             validators: {
    //                 notEmpty: {
    //                     message: 'The gender is required'
    //                 }
    //             }
    //         }
    //     },
    //     submitHandler: function(validator, form, submitButton) {
    //         var fullName = [validator.getFieldElements('firstName').val(),
    //             validator.getFieldElements('lastName').val()].join(' ');
    //         alert('Hello ' + fullName);
    //     }
    // });

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


// Upload
    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var htmlPreview =
                    '<i style="font-size: 18px;" class="fas fa-file-alt"></i>' +
                    '<p>' + input.files[0].name + '</p>';
                var wrapperZone = $(input).parent();
                var previewZone = $(input).parent().parent().find('.preview-zone');
                var boxZone = $(input).parent().parent().find('.preview-zone').find('.box').find('.box-body');
                wrapperZone.removeClass('dragover');
                previewZone.removeClass('hidden');
                boxZone.empty();
                boxZone.append(htmlPreview);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    function reset(e) {
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
        $('.remove-preview').removeClass('hidden');
    }

    $(".dropzone").change(function () {
        readFile(this);
    });

    $('.dropzone-wrapper').on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });

    $('.dropzone-wrapper').on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });

    $('.remove-preview').on('click', function () {
        var boxZone = $(this).parents('.preview-zone').find('.box-body');
        var previewZone = $(this).parents('.preview-zone');
        var dropzone = $(this).parents('.form-group').find('.dropzone');
        boxZone.empty();
        previewZone.addClass('hidden');
        reset(dropzone);
    });
    $(".search-btn-js").click(function () {

        $("body,html").animate(
            {
                scrollTop: $(".scroll-till-there").offset().top
            },
            800
        );
        return false;

    });

    /*add class mobile*/
    let showChar = 300;
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

    /*cut text*/

    // let ellipsestext = "...";
    // let moretext = "mehr lesen";
    // let lesstext = "zuklappen";
    // $('#content').find('.more').each(function() {
    //     let content = $(this).html();
    //     if(content.length > showChar) {
    //         let c = content.substr(0, showChar-1);
    //         let h = content.substr(showChar-1, content.length - showChar);
    //         let html = c + '<span class="moreellipses ">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink " >' + moretext + '</a></span>';
    //         $(this).html(html);
    //     }
    // });


    //
    // $(".morelink").click(function(){
    //     if($(this).hasClass("less")) {
    //         $(this).html(moretext);
    //         $(this).removeClass("less");
    //     } else {
    //         $(this).addClass("less");
    //         $(this).html(lesstext);
    //     }
    //     $(this).parent().prev().toggle();
    //     $(this).prev().slideToggle(
    //         'slow', function () {
    //             $("body,html").animate(
    //                 {
    //                     scrollTop: $('.more').offset().top -100
    //                 },
    //                 800
    //             )
    //         });
    //     return false;
    // });




    // var doc = new jsPDF();
    // var specialElementHandlers = {
    //     '#print-btn': function (element, renderer) {
    //         return true;
    //     }
    // };
    //
    $('#pdfexport').click(function () {
        doc.fromHTML($('.form-group-view-wrapper').html(), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('SW-Antrag.pdf');
    });


    $("#accordionForm .accordion-item").find("input, select, textarea").focus(function() {
        let current = $(this).closest(".accordion-collapse").prev();
        current.removeClass('required-header');
    });
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
    // $(".btn-orderedit").click(function () {
    //
    // })
});

