
class VQQGrid {
    constructor(ObjectName, ColumnOrder, Url, DefaultPageCount, DefaultPageSize, DefaultPageSizeOptions, DefaultMaxPage, DestinationTable, DestinationPagging, DestinationPageSize) {
        this.objectName = ObjectName;
        this.columnOrder = ColumnOrder;
        this.url = Url;
        this.defaultPageCount = DefaultPageCount;
        this.defaultPageSize = DefaultPageSize;
        this.defaultPageSizeOptions = DefaultPageSizeOptions;
        this.defaultMaxPage = DefaultMaxPage;
        this.destinationTable = DestinationTable;
        this.destinationPagging = DestinationPagging;
        this.destinationPageSize = DestinationPageSize;
    }

    Generate(data) {
        this.destinationTable.html(this.GenerateHeader());
        this.destinationTable.append(this.GenerateBody(data));
        this.destinationPageSize.html(this.PageSizeGenerate(this.defaultPageSize));
        //this.DestinationPagging.Html();
    }

    RefreshContent(data) {
        //this.destinationTable.
        this.destinationTable.children('tr:nth-of-type(n+2)').append(this.GenerateBody(data));
    }

    GenerateHeader() {
        let str = "<thead><tr>";
        this.columnOrder.forEach(function (value) {
            str += "<th column-pivot=" + value.ColumnName + ">" + value.DisplayName + "</th>";
        });
        str += "</tr></thead>";
        return str;
    }

    GenerateBody(data) {
        let str = "<tbody>";
        let map = this.MappingColumn(data);
        data.forEach(function (val) {
            str += "<tr>";
            map.forEach(element => str += "<td>" + val[element] + "</td>");
            str += "</tr>";
        });
        return str + '</tbody>';
    }

    MappingColumn(data) {
        let arr = [];
        let col = Object.keys(data[0]);
        this.columnOrder.forEach(function (columnValue) {
            col.findIndex(function (item) {
                if (columnValue.ColumnName === item) {
                    arr.push(item);
                }
            });
        });
        return arr;
    }

    PaggingGenerate(pageNo, pageSize, maxPage, totalRecord) {
        //let url = "";
        let first = "<button data-page='0'><<</button>";
        let last = "<button data-page='0'>>></button>";
        let pre = "<button data-page='0'><</button>";
        let next = "<button data-page='0'>></button>";
        let str = "";
        let totalPage = Math.ceil(totalRecord / pageSize);
        if (pageNo > 0 && pageSize > 0 && maxPage > 0 && totalRecord > 0 && totalPage >= pageNo) {
            if (pageNo > 2) {
                str += first;
            }
            if (pageNo > 1) {
                str += pre;
            }
            let halfMaxPage = Math.round(maxPage / 2);
            let lowwerPage;
            let upperPage;
            if (maxPage <= totalPage) {
                if (pageNo <= halfMaxPage) {
                    lowwerPage = 1;
                    upperPage = maxPage;
                }
                else if (pageNo > totalPage - halfMaxPage) {
                    lowwerPage = totalPage - maxPage + 1;
                    upperPage = totalPage;
                }
                else {
                    lowwerPage = pageNo - halfMaxPage + 1;
                    upperPage = pageNo + halfMaxPage - 1;
                }
            }
            else {
                lowwerPage = 1;
                upperPage = totalPage;
            }
            for (var i = lowwerPage; i <= upperPage; i++) {
                str += (i == pageNo) ? "<button class='current'>" + i + "</button>" : "<button onclick='" + this.objectName + ".GetPaging(" + i + "," + this.defaultPageSize + ");'>" + i + "</button>";
            }
            if (pageNo < totalPage) {
                str += next;
            }
            if (pageNo < totalPage - 1) {
                str += last;
            }
        }
        str += "<p>" + pageNo * (pageSize - 1) + " - " + pageNo * pageSize + " / " + totalRecord + "<p>";
        return str;
    }

    PageSizeGenerate(pageSize) {
        let str = '';
        this.defaultPageSizeOptions.forEach(element => {
            if (pageSize == element) {
                str += '<option value="' + element + '" selected>' + element + '</option>';
            }
            else {
                str += '<option value="' + element + '">' + element + '</option>';
            }
        });
        return str;
    }

    GetPaging(pageCount, pageSize) {
        //pageSize = $('');
        let a = this;
        $.ajax({
            url: this.url,
            type: 'POST',
            data: { pageCount: pageCount, pageSize: pageSize },
        })
            .done(function (res) {
                a.Generate(JSON.parse(res.data));
                a.destinationPagging.html(a.PaggingGenerate(pageCount, pageSize, a.defaultMaxPage, res.totalRecord));
                //a.RefreshContent();
            })
            .fail(function () {
                console.log("error");
            })
            .always(function () {
                console.log("complete");
            });
    }
}

//function Convert() {
//    var index = data1.findIndex(function (item, i) {
//        return item.name === val
//    });
//}

//var data1 = [{ "name": "placeHolder", "section": "right" }, { "name": "Overview", "section": "left" }, { "name": "ByFunction", "section": "left" }, { "name": "Time", "section": "left" }, { "name": "allFit", "section": "left" }, { "name": "allbMatches", "section": "left" }, { "name": "allOffers", "section": "left" }, { "name": "allInterests", "section": "left" }, { "name": "allResponses", "section": "left" }, { "name": "divChanged", "section": "right" }];

//var val = "allInterests"
//var index = data1.findIndex(function (item, i) {
//    return item.name === val
//});

//console.log(index);


//let data = [{ "Id": 3, "Code": "E03", "FirstName": "Vũ Tuấn", "LastName": "Anh", "Gender": false, "DOB": "1991-10-02T00:00:00", "Email": "anhvt@gmail", "Phone": "0935860528", "Address": "Hòa Bình", "LiteracyId": 2, "Description": "<p><b>Thích chơi game</b></p>", "Status": 0 }, { "Id": 4, "Code": "E04", "FirstName": "Hoàng Khánh", "LastName": "Linh", "Gender": false, "DOB": "1989-10-12T00:00:00", "Email": "linhhk@gmail", "Phone": "0905123390", "Address": "Nam Định", "LiteracyId": 1, "Description": "<p><b>Thích chạy bộ, nghe nhạc</b></p>", "Status": 1 }];
