$( document ).ready(function() {
    
    $(".accordion-collapse").collapse();
    $('#collapseFilterbtn').click(function() {
        $('#collapseFilter').collapse('toggle');
    });
    $('.collapseFilter').collapse();
    $('#buttonsubmitformdraft').click(function () {
        $('#form-status-input').attr('value', '10');
    });
    $('#buttonsubmitform').click(function () {
        $('#form-status-input').attr('value', '1');
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
    /*$('.btn-delete-js').click(function(){
        prompt('Um diese Arbeit löschen zu lassen, tippen Sie DELETE ein')
    });
    $('.btn-delete-light-js').click(function(){
        alert( 'Alle Eingaben verwerfen')
    })*/

    // Example starter JavaScript for disabling form submissions if there are invalid fields
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


//only edit and form functions
    /*
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
    */

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

    $(".custom-control-label").click(function () {
        if ($(this).attr('answer') == "open") {
            $(this).closest(".custom-control").nextAll(".inputHide").delay(300).slideDown("slow");
        } else {
            $(this).closest(".custom-control").nextAll(".inputHide").delay(300).slideUp("slow");
        }
    });
    $(".custom-control-select").on('change', function (e) {
        var valueSelected = $('option:selected', this).attr('answer');
        if (valueSelected == "open") {
            $(this).closest(".custom-select-js").nextAll(".inputHide").delay(300).slideDown("slow");
        } else {
            $(this).closest(".custom-select-js").nextAll(".inputHide").delay(300).slideUp("slow");
        }
    });

    // var doc = new jsPDF();
    // var specialElementHandlers = {
    //     '#print-btn': function (element, renderer) {
    //         return true;
    //     }
    // };
    //
    // $('#pdfexport').click(function () {
    //     // doc.fromHTML($('.form-group-view-wrapper').html(), 15, 15, {
    //     //     'width': 170,
    //     //     'elementHandlers': specialElementHandlers
    //     // });
    //     // doc.save('SW-Antrag.pdf');
    // });


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

});

