$('document').ready(function () {
    /* The dragging code for '.draggable' from the demo above
     * applies to this demo as well so it doesn't have to be repeated. */
    
    function UpdateNode(status, navarr) {
        storyCall = true;
        $('#mainCanvas').removeClass('dragactive');
        if (status == "defaultNode") {
            statusNewStory == false;
        }
        if (status == "relatedNode") {
            statusNewStory == true;
        }
        let nodeIDPreviousVisitedStory = d3.select('#nodeLabel1').attr('nodeID');
        // get node title out of tspans
        let titlePreviousVisitedStory = '';
        let child = $('#nodeLabel1')[0].childNodes;
        for (let i = 0; i < child.length; i++) {
            titlePreviousVisitedStory += child[i].innerHTML + ' ';
        }
        let previousVisitedStory = {nodeID: nodeIDPreviousVisitedStory, title: titlePreviousVisitedStory};
        // if current story element is clicked, then no previous visited story appear

        clickBehaviour(1, nodeIDtarget, previousVisitedStory);
    }

    function UpdateNode(status, navarr) {
        storyCall = true;
        $('#mainCanvas').removeClass('dragactive');
        if (status == "defaultNode") {
            statusNewStory == false;
        }
        if (status == "relatedNode") {
            statusNewStory == true;
        }
        let nodeIDPreviousVisitedStory = d3.select('#nodeLabel1').attr('nodeID');
        // get node title out of tspans
        let titlePreviousVisitedStory = '';
        let child = $('#nodeLabel1')[0].childNodes;
        for (let i = 0; i < child.length; i++) {
            titlePreviousVisitedStory += child[i].innerHTML + ' ';
        }
        let previousVisitedStory = {nodeID: nodeIDPreviousVisitedStory, title: titlePreviousVisitedStory};
        // if current story element is clicked, then no previous visited story appear
        if (navarr == true) {
            if (arrowDestination == 'right') {

                if ($('#nodeLabel3').length) {
                    nodeIDtarget = $('.nodeLabelGroup3').attr('class').split(' ').pop();
                } else {
                    nodeIDtarget = $('.nodeLabelGroup4').attr('class').split(' ').pop();
                }
            } else if (arrowDestination == 'left') {

                if ($('#nodeLabel2').length) {
                    nodeIDtarget = $('.nodeLabelGroup2').attr('class').split(' ').pop();
                } else {
                    nodeIDtarget = $('.nodeLabelGroup1').attr('class').split(' ').pop();
                }
            }
        }
        clickBehaviour(1, nodeIDtarget, previousVisitedStory);
    }

    $('.titleTools').on("click", function () {
        $('#contentWrapperMetadata').css('display', 'none');
        $('.titleTools').find('.fa').removeClass('active');
        $('.titleTools').removeClass('active');
        $(this).addClass('active');
        $(this).find('.fa').addClass('active');
        if ($(this).find('.fa').hasClass("fa-image")) {
            $('#contentWrapperText').css('display', 'none');
            $('#contentWrapperViz').css('display', 'block');
        } else if ($(this).find('.fa').hasClass("fa-file-text")) {
            $('#contentWrapperText').css('display', 'block');
            $('#contentWrapperViz').css('display', 'none');
        } else {
            $('.titleTools').find('.fa').removeClass('active');
            $('#contentWrapperMetadata').css('display', 'block');
            $('#contentWrapperText').css('display', 'none');
            $('#contentWrapperViz').css('display', 'none');
        }
    });
    $('.fa-angle-right-slide').on("click", function () {
        $('.storynode5Wrapper').animate({left: '-200px'})
        $('.fa-angle-left-slide').removeClass('hidden');
        $(this).addClass('hidden');
    })
    $('.fa-angle-left-slide').on("click", function () {
        $('.storynode5Wrapper').animate({left: '0px'});
        $('.fa-angle-right-slide').removeClass('hidden');
        $(this).addClass('hidden');
    })

    $(window).on("orientationchange", function (event) {
        var x = event.beta,  // -180 to 180
            y = event.gamma, // -90 to 90
            z = event.alpha; // 0 to 360
        UpdateNode(status, navarr);
    });
//scroll to tutorials
    $('.mainButtonsmallHelp').on("click", function (e) {
        $('.mainInfoWrapper').removeClass('hidden');
        $('.mainImpressum').addClass('hidden');
        $('.mainTutorials').removeClass('hidden');
        $('.mainVizWrapper').addClass('hidden');
        $('.mainButtonsWrapperView').addClass('hidden');
        $('#canvasSVG').css('display', 'none');

        $('html, body').animate({
            scrollTop: $('.mainInfoWrapper').offset().top
        })
    })
    $('.mainButtonsmallImpressum').on("click", function (e) {
        $('.mainInfoWrapper').removeClass('hidden');
        $('.mainImpressum').removeClass('hidden');
        $('.mainTutorials').addClass('hidden');
        $('.mainVizWrapper').addClass('hidden');
        $('.mainButtonsWrapperView').addClass('hidden');
        $('#canvasSVG').css('display', 'none');
    })
    $('.mainButtonsmallDatenschutz').on("click", function (e) {
        $('.mainInfoWrapper').removeClass('hidden');
        $('.mainDatenschutz').removeClass('hidden');
        $('.mainTutorials').addClass('hidden');
        $('.mainVizWrapper').addClass('hidden');
        $('.mainButtonsWrapperView').addClass('hidden');
        $('#canvasSVG').css('display', 'none');
    })

    $('.closeMain').on("click", function (e) {
        $('.mainButtonsWrapperView').removeClass('hidden');
        $('.mainVizWrapper').removeClass('hidden');
        $('.mainInfoWrapper').addClass('hidden');
        $('#canvasSVG').css('display', 'block');
        $('.mainImpressum').addClass('hidden');
        $('.mainDatenschutz').addClass('hidden');
    })

    $('.mainButton').on("click", function () {
        let page = $(this).attr('page');
        localStorage.setItem('page', page);
    })
    $('.storyLogo').on("click", function () {
        let page = localStorage.getItem('page');
        if (localStorage.getItem("page") !== null) {
            switch (page) {
                case 'network':
                    window.location.replace("/");
                    break;
                case 'random':
                    window.location.replace("/");
                    break;
                case 'topics':
                    window.location.replace("/Themen");
                    break;
                default:
                    window.location.replace("/");
                    break;
            }
        } else {
            window.location.replace("/");
        }
    })
    // if ($(window).width() < 1200) {
    //
    //     $('.hasproposed').css('display', 'none');
    //
    // }

    $('.wrapper-plus').click(function (event) {
        event.stopPropagation();
        var currFontSize = $('#storyText').css('font-size');
        var newFontSize = parseFloat(currFontSize) + 3;
        if (newFontSize < 30) {
            $('#storyText').animate({fontSize: newFontSize}, 250);
        }
    });

    $('.wrapper-minus').click(function (event) {
        event.stopPropagation();
        var currFontSize = $('#storyText').css('font-size');
        var newFontSize = parseFloat(currFontSize) - 3;
        if (newFontSize > 14) {
            $('#storyText').animate({fontSize: newFontSize}, 250);
        }
    });

    $('.link-feedback').on('click', function (event) {
        event.preventDefault();
        var email = 'altersatlas@fhnw.ch';
        var titleText = $('#storyTitle').text();
        var subject = 'Feedback ' + storyNode + ': ' + titleText;
        window.location = 'mailto:' + email + '?subject=' + subject;
    });
    $('#fa-info-circle-js').on('click', function (event) {
        flip();
    });

    function flip() {

        let obj = $("#WrapperVizDesktop");

        if (obj.attr("flipped") === "true") {

            $('#contentWrapperText').css('transform', 'perspective(2000px) rotateX(0deg)');
            $('#contentWrapperMetadata').css('transform', 'perspective(2000px) rotateX(180deg)');
            $("#WrapperVizDesktop").attr("flipped", "false");
            $('#fa-info-circle-js').removeClass('fa fa-file-text');
            $('#fa-info-circle-js').addClass('fa fa-info-circle');
            $('#contentWrapperMetadata').css('opacity', '0');
            $('#contentWrapperText').css('opacity', '1.0');
            $('#contentWrapperText').css('z-index', '200');
            $('#contentWrapperMetadata').css('z-index', '100');
            $('.contentElementTextTools').removeClass('meta');
        } else {
            $('.contentElementTextTools').addClass('meta');
            $('#fa-info-circle-js').removeClass('fa fa-info-circle');
            $('#fa-info-circle-js').addClass('fa fa-file-text');
            $('#contentWrapperMetadata').css('transform', 'perspective(2000px) rotateX(0deg)');
            $('#contentWrapperText').css('transform', 'perspective(2000px) rotateX(-180deg)');
            $('#contentWrapperMetadata').css('opacity', '1.0');
            $('#contentWrapperText').css('opacity', '0');
            $('#contentWrapperText').css('z-index', '100');
            $('#contentWrapperMetadata').css('z-index', '200');
            $("#WrapperVizDesktop").attr("flipped", "true");
            $('.wrapper-plus').css('opacity', '1.0');
            $('.wrapper-minus').css('opacity', '1.0');
        }
    }
    function flipChangeNode() {

        let obj = $("#WrapperVizDesktop");

        if (obj.attr("flipped") === "true") {
            $('.wrapper-plus').css("opacity", "0.6") ;
            $('.wrapper-minus').css("opacity", "0.6") ;
            $('#contentWrapperText').css('transform', 'perspective(2000px) rotateX(0deg)');
            $('#contentWrapperMetadata').css('transform', 'perspective(2000px) rotateX(180deg)');
            $("#WrapperVizDesktop").attr("flipped", "false");
            $('#fa-info-circle-js').removeClass('fa fa-file-text');
            $('#fa-info-circle-js').addClass('fa fa-info-circle');
            $('#contentWrapperMetadata').css('opacity', '0');
            $('#contentWrapperText').css('opacity', '1.0');
            $('#contentWrapperText').css('z-index', '200');

        }
    }
    $('.wrapper-expand-pop').on('click', function () {
        $('.viz').trigger('click');
    });
    let navarr = false;
    let arrowDestination;

    function navigateLeft() {
        arrowDestination = 'left';
        navarr = true;
        UpdateNode(status, navarr);
    };

    function navigateRight() {
        navarr = true;
        arrowDestination = 'right';
        UpdateNode(status, navarr);
    };
    $('.fa-caret-right').click(function () {
        navigateRight();
        flipChangeNode();
    });
    $('.fa-caret-left').click(function () {
        navigateLeft();
        flipChangeNode();
    });

    $('#mainCanvas').on("swipeleft", swipeleftHandler);
    $('#mainCanvas').on("swiperight", swiperightHandler);
    function swipeleftHandler(event) {
        if ($(window).width() < 1500) {
            navigateLeft();
            flipChangeNode();
        }
    }
    function swiperightHandler(event) {
        if ($(window).width() < 1500) {
            navigateRight();
            flipChangeNode();
        }
    }
    document.onkeydown = function (e) {
        switch (e.which) {
            case 37:
                navigateLeft();
                break;

            case 38: // up
                break;

            case 39:
                navigateRight();
                break;

            case 40: // down
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    };

    $(window).bind('resize', function() {
        windowReload();
    });

    function windowReload() {
        var $window = $(window),
            previousDimensions = {
                width: $window.width(),
                height: $window.height()
            };

        $window.resize(function(e) {
            var newDimensions = {
                width: $window.width(),
                height: $window.height()
            };
            if (newDimensions.width > previousDimensions.width) {
                if ((previousDimensions.width <= 1498) && (newDimensions.width > 1498)){
                    $('#wrapper-screen').css('display', 'block');
                    setTimeout(function() {
                        window.location.reload();
                    }, 500)
                }
            }

            /*if ((previousDimensions.width >= 1500) && (newDimensions.width < 1500)){
                $('#wrapper-screen').css('display', 'block');
                setTimeout(function() {
                window.location.reload();
                }, 500)
            }
        */

            // Store the new dimensions
            previousDimensions = newDimensions;
        });
    }

    $('.fa-print').click(function () {

        localStorage.clear();

        let nodeIDprint = $(this).attr('id');

        var url = './document.pdf';

        localStorage.setItem('nodeIDprint', nodeIDprint);
        $('#pdfIframe').attr('src', './document.pdf');
        //$("#pdfIframe").contentWindow.print();
        // setTimeout(function(){ window.print(); }, 2000);
    });


    // function toDataURL(url, callback) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.onload = function() {
    //         var reader = new FileReader();
    //         reader.onloadend = function() {
    //             callback(reader.result);
    //         }
    //         reader.readAsDataURL(xhr.response);
    //     };
    //     xhr.open('GET', url);
    //     xhr.responseType = 'blob';
    //     xhr.send();
    // }
    //
    // toDataURL('https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0', function(dataUrl) {
    //     console.log('RESULT:', dataUrl)
    // })
    //   });

});
