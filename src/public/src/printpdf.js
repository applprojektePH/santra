function pdfTemplate(){
   let nodeID = localStorage.getItem('nodeIDprint');
    getNode(nodeID, data => {
        document.title = `AltersAtlas | ${data.title}`;
        $('.pdfTitle').text(`${data.title}`);
        if (data.dynamic) {
            {
                function viewBoxSVG() {
                    d3.queue()
                        .defer(d3.json, `static/data/viz/defaultVar.json`)
                        .await(function (error, defaultVizContent) {
                            $.extend(defaultVizContent, vizContent);
                            drawVisualisation(defaultVizContent);
                        });
                    let vizContent = JSON.parse(data.vizContent);
                    let width = parseInt($("#pdfSVG").width());
                    let height = parseInt($("#pdfSVG").height());
                    let x = parseInt($("#wrapper-screen-pdf").position().left);
                    let y = parseInt($("#wrapper-screen-pdf").position().top);
                    let Vizwidth = vizContent.customWidth;
                    let Vizheight = vizContent.customHeight;

                    if (data.format == 'hoch') {
                        $('#pdfSVG').append('<svg id="vizSVG" height="100%" width="100%" viewbox=" 0 0 ' + Vizwidth + ' ' + Vizheight * 1.2 + '"  preserveAspectRatio="xMidYMid meet" ></svg>')
                    } else {
                        let xmin = x + (width / 2) - (Vizwidth / 2)
                        let ymin = y + (height / 2) - (Vizheight / 2);
                        $('#pdfSVG').append('<svg id="vizSVG" height="100%" width="100%" viewbox=" 0 0 ' + Vizwidth + ' ' + Vizheight + '"  preserveAspectRatio="xMidYMid meet" ></svg>')
                    }
                    $('#vizSVG').attr('class', 'viz');

                }
                viewBoxSVG();
            }
        $('#pdfSVG').removeAttr('class');
        $('#pdfSVG').addClass(data.format);

            }  else {

                if (data.format == 'hoch') {
                    $('#pdfImg').append('<img id="vizImage" class="viz hoch">');
                } else {
                    $('#pdfImg').append('<img id="vizImage" class="viz default">');
                }
                $('#vizImage').attr('src', `static/files/${data.vizContent}`);
                $('#vizImage').attr('class', 'viz');
            }


            $('#pdfText').html(data.text);


        let storyTitleYear = '';

        $('#nodeText').css('height', 'auto');
        $('#metaData').css('height', 'auto');

        let metaDataElement = ``;
        let dataSourceLength = data.dataSource.length;
        let dataInstitute = data.institute.length;
        metaDataElement += ' ';
        if (dataSourceLength !== 0) {
            if (dataSourceLength > 1) {
                metaDataElement += `<p class="metaContact"><span class="metatitle">Datenquelle</span> 
                <span>${data.dataSource.join(';' + '</br>')}</span></p>`;
                if (data.projectTitle !== undefined) {
                    metaDataElement += `<p class="metaContact"><span class="metaProjectTitle">${data.projectTitle}</span></p>`;
                }
                if (data.projectInfo !== undefined) {
                    metaDataElement += `<p class="metaContact"><span class="metatitle">Projektbeschreibung</span> ${data.projectInfo}</p>`;
                }
            } else {
                metaDataElement += `<p class="metaContact"><span class="metatitle">Datenquelle</span> <span>${data.dataSource}</span></p>`;
                if (data.projectTitle !== undefined) {
                    metaDataElement += `<p class="metaContact"><span class="metaProjectTitle">${data.projectTitle}</span></p>`;
                }
                if (data.projectInfo !== undefined) {
                    metaDataElement += `<p class="metaContact"><span class="metatitle">Projektbeschreibung</span> ${data.projectInfo}</p>`;
                }
            }
        } else {
            if (data.projectTitle !== undefined) {
                metaDataElement += `<p class="metaContact"><span class="metatitle">Datenquelle</span> ${data.projectTitle}</p>`;
            }
            if (data.projectInfo !== undefined) {
                metaDataElement += `<p class="metaContact"><span class="metatitle">Projektbeschreibung</span> ${data.projectInfo}</p>`;
            }
        }
        if (data.comment !== '' && data.comment !== undefined) {
            metaDataElement += `<p class="metaContact"><span class="metatitle">Kommentar</span> ${data.comment}</p>`;
        }
        if (dataInstitute !== undefined) {

            if (dataInstitute == 1) {
                metaDataElement += `<p class="metaContact"> <span class="metatitle">Beteiligte Institution</span> <span>${data.institute.join(", " + '</n>')}</p></span>`;
            } else if (dataInstitute > 1) {
                metaDataElement += `<p class="metaContact"> <span class="metatitle">Beteiligte Institutionen</span> <span>${data.institute.join(", " + '</n>')}</p></span>`;
            }
        }

        if (data.referenceYears !== '' && data.referenceYears !== undefined) {
            metaDataElement += `<br><p class="metaContact"><span class="metatitle"></span><span><b>Information bezieht sich auf</b> ${data.referenceYears}.</span></p><br>`;
            storyTitleYear = ` (${data.referenceYears})`;
        }
        if (data.contact !== undefined) {
            metaDataElement += `<p class="metaContact"><span class="metatitle">Kontakt</span><span>${data.contact}</span></p>`;
        }
        $('#pdfMeta').html(metaDataElement);
    })

}

