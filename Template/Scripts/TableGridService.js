
/**
 * Mẫu filter bằng str
 * @param {any} obj
 * @param {any} dT DataType
 * @param {any} cN ColumnName
 */
const FilterStr = (obj, dT, cN) => {
    if (dT == 'number') {
        return '<div class="filter-toggle pull-right"><i class="fa fa-filter"></i><div class="filter-wrapper"><div class="filter-button" onclick=' + obj + '.FilterDataColumn(this);><i class="fa fa-filter"></i></div><div class="filter-option"><select name="option-' + cN + '"><option value="0">==</option><option value="1">></option><option value="2"><</option><option value="3">>=</option><option value="4"><=</option><option value="7">!=</option><option value="5">Between</option></select></div><div class="filter-input"><input type="text" name="' + cN + '" /></div></div></div>';
    }
    else if (dT == 'text') {
        return '<div class="filter-toggle pull-right"><i class="fa fa-filter"></i><div class="filter-wrapper"><div class="filter-button" onclick=' + obj + '.FilterDataColumn(this);><i class="fa fa-filter"></i></div><div class="filter-option"><select name="option-' + cN + '"><option value="0">==</option><option value="6">Like</option></select></div><div class="filter-input"><input type="text" name="' + cN + '" /></div></div></div>';
    }
    else {
        return '';
    }
}

/**
 * Trước định tạo 1 class riêng để define từng cột của dữ liệu đầu vào nhưng hiện tại dùng luôn json data.
 * */
class ColumnDefine {
    constructor(ColumnName, DisplayName, Visible, Order, QuickSort, Filter, DataType, Width) {
        this.ColumnName = ColumnName;
        this.DisplayName = DisplayName;
        this.Visible = Visible;
        this.Order = Order;
        this.QuickSort = QuickSort;
        this.Filter = Filter;
        this.DataType = DataType;
        this.Width = Width;
    }
}

/**Convert số 
 * Dự định mở rộng hàm này cho nhập 1 vài tham số đầu vào như
 * số lượng chữ số được làm tròn sau dấu thập phân...*/
const VQQGridNumberFormatter = new Intl.NumberFormat('en-US', {
    //style: 'currency',
    //currency: 'VND',
    minimumFractionDigits: 2
})

/**
 * Kiểm tra IsNullOrEmpty và defined của 1 object
 * @param {any} data
 */
const IsNotNull = (data) => {
    return data != null && data != '' && data != undefined;
}

$(document).mouseup(function (e) {
    if ($(e.target).closest(".filter-wrapper").length === 0) {
        $(".filter-wrapper").hide();
    }
});

$(document).on('click', '.filter-toggle', function (e) {
    $(e.currentTarget).find(".filter-wrapper").show();
    //if ($(e.target).closest(".filter-wrapper").length === 0) {
    //    $(".filter-wrapper").hide();
    //}
});

/**Class tổng VietQQGrid định nghĩa, generate table form và các hành động của table dựa vào các input */
class VQQGrid {
    /**
     * 
     * @param {any} ObjectName Tên bảng muốn đặt (nên là unique)
     * @param {any} ColumnOrder Dữ liệu cấu hình cho từng cột trong table
     * @param {any} Url Url để load dữ liệu pagging
     * @param {any} DefaultPageCount Trang được active lần load đầu
     * @param {any} DefaultPageSize PageSize mặc định
     * @param {any} DefaultPageSizeOptions Array pagesize sẽ được assign cho table
     * @param {any} DefaultMaxPage Tối đa bao nhiêu số trang liên tiếp được hiển thị
     * Ví dụ: DefaultMaxPage=5, CurrentPage=5, TotalPage=100 => Display: << < 3 4 [5] 6 7 > >>
     * @param {any} DestinationTable Vị trí đặt table trên Html
     * @param {any} DestinationPagging Vị trí đặt Footer table trên Html
     * @param {any} DestinationPageSize Vị trí đặt dropdown pageSize
     * @param {any} HeaderSwitch Vị trí đặt option thay đổi ẩn hiện cột
     */
    constructor(ObjectName, ColumnOrder, Url, DefaultPageCount, DefaultPageSize, DefaultPageSizeOptions, DefaultMaxPage, DestinationTable, DestinationPagging, DestinationPageSize, HeaderSwitch) {
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
        this.headerSwitch = HeaderSwitch;
        this.GetPaging(this.defaultPageCount, this.defaultPageSize, 1);
    }

    Generate(data, isOriginal, isHeader = true) {
        if (this.destinationTable && isHeader) {
            this.destinationTable.html(this.GenerateHeader());
            this.destinationTable.append(this.GenerateBody(data));
        }
        if (this.destinationTable && !isHeader) {
            this.destinationTable.children('tbody').remove();
            this.destinationTable.append(this.GenerateBody(data));
        }
        if (this.destinationPageSize && isOriginal == 1) {
            this.destinationPageSize.html(this.PageSizeGenerate(this.defaultPageSize));
        }
        if (this.headerSwitch && isOriginal == 1) {
            this.headerSwitch.html(this.GenerateHeaderSwitch());
        }
    }

    RefreshContent(data) {
        this.destinationTable.children('tr:nth-of-type(n+2)').append(this.GenerateBody(data));
    }

    GenerateHeader() {
        let current = this;
        //let str = "<thead><form id='" + current.objectName + "'><tr>";
        let str = "<thead><tr>";
        this.columnOrder.filter(e => e.Visible == true).sort((a, b) => (a.Order > b.Order) ? 1 : -1).forEach(function (value) {
            str += "<th column-pivot=" + value.ColumnName + " style='width:" + value.Width + ";'>"
            str += "<div class=\"header-title pull-left\"><span " + (value.QuickSort ? "data-direction='0' onclick='" + current.objectName + ".QuickSort(this)'" : "") + ">" + value.DisplayName + "</span><i icon-direction=''></i></div>";
            if (value.Filter) {
                str += FilterStr(current.objectName, IsNotNull(value.DataType) ? value.DataType.Name : "", value.ColumnName);
            }
            str += "</th>";
        });
        str += "</tr></thead>";
        return str;
    }

    GenerateHeaderSwitch() {
        let str = "<ul class='" + this.objectName + "-sortable'>";
        this.columnOrder.forEach(e => {
            str += "<li data-column=" + e.ColumnName + "><input type='checkbox' onChange='" + this.objectName + ".ToggleVisibleColumn(this)' " + (e.Visible ? "checked" : "") + ">" + e.DisplayName + "</th>";
        });
        str += "</ul>";
        return str;
    }

    GenerateBody(data) {
        let str = "<tbody>";
        let map = this.MappingColumn(data);
        let current = this;
        data.forEach(function (val) {
            str += "<tr>";
            map.forEach(element => {
                let content = element.DataType ? current.ConvertDataType(val[element.ColumnName], element.DataType) : val[element.ColumnName];
                str += "<td style='width:" + element.Width + ";'>" + content + "</td>";
            });
            str += "</tr>";
        });
        return str + '</tbody>';
    }

    /**
     * Mapping column với dữ liệu đầu vào bằng columnOrder
     * @param {any} data
     */
    MappingColumn(data) {
        let arr = [];
        let col = Object.keys(data[0]);
        this.columnOrder.filter(e => e.Visible == true).sort((a, b) => (a.Order > b.Order) ? 1 : -1).forEach(function (columnValue) {
            col.findIndex(function (item) {
                if (columnValue.ColumnName === item) {
                    arr.push(columnValue);
                }
            });
        });
        return arr;
    }

    /**
     * Chuyển đổi dữ liệu
     * @param {any} input
     * @param {any} dataType
     */
    ConvertDataType(input, dataType) {
        if (IsNotNull(input) && IsNotNull(dataType)) {
            if (dataType.Name.toLowerCase() == 'currency') {
                formatter.format(input, dataType.Digit);
            }
            else if (dataType.Name.toLowerCase() == 'bool') {
                if (input == 0 || input == false) {
                    return dataType.False;
                }
                if (input == 1 || input == true) {
                    return dataType.True;
                }
            }
            else if (dataType.Name.toLowerCase() == 'singleselect') {
                return dataType.List.filter(e => e.Id == input)[0].Content;
            }
            else if (dataType.Name.toLowerCase() == 'datetime') {
                return moment(input).format(dataType.DataFormat);
            }
            else {
                return input;
            }
        }
    }

    //compareType
    // 0 == => default
    // 1 >
    // 2 >=
    // 3 <
    // 4 <=
    // 5 beetween
    // 6 contain
    FilterDataColumn(e) {
        let curOpt = $(e).siblings('.filter-option').find('select').val();
        let curVal = $(e).siblings('.filter-input').find('input').val();
        if (curOpt && curVal) {
            let data = this.GetAllData();
            this.GetPaging(data.pC, data.pS, 0, data.sort, data.filters);
        }
        else {
            alert('Filter trống');
        }
    }
    /**
     * 
     * @param {any} pS PageSize
     * @param {any} pC PageCount
     * @param {any} sort
     * @param {any} filters
     */
    GetAllData(pS = null, pC = null, sort = null, filters = null) {
        let current = this;
        // Page size
        if (!pS) {
            pS = current.destinationPageSize.find('select').val();
        }
        // Page count
        if (!pC) {
            let pCTemp = current.destinationPagging.find('.current').attr('value');
            let tR = current.destinationPagging.find('.page-limit').attr('data-total-record');
            let tP = Math.ceil(tR / pS);
            pC = pCTemp > tP ? tP : pCTemp;
        }
        // Sắp xếp
        if (!sort) {
            let d = current.destinationTable.find('[data-direction][data-direction!="0"]:first-child').attr('data-direction');
            let cN = current.destinationTable.find('[data-direction][data-direction!="0"]:first-child').parent('th').attr('column-pivot');
            if (d && cN) {
                let sS = current.SortSequence(d);
                sort = { "ColumnName": cN, "Direction": sS };
            }
        }
        // Lọc dũ liệu
        if (!filters) {
            let inputRepos = $('#' + current.objectName).serializeArray();
            let opts = inputRepos.filter((str) => str.name.includes("option-"));
            filters = inputRepos.filter((str) => !str.name.includes("option-") && str.value != '');
            filters.forEach((el) => {
                let opt = opts.filter(o => 'option-' + el.name == o.name);
                let dT = current.columnOrder.filter(o => o.ColumnName == el.name);
                Object.assign(el, { 'SortType': opt[0].value, 'DataType': dT[0].DataType.Name });
            })
        }
        return { pC: pC, pS: pS, sort: sort, filters: filters };
    }

    /**
     * Gen số trang ...
     * @param {any} pageNo
     * @param {any} pageSize
     * @param {any} maxPage
     * @param {any} totalRecord
     */
    PaggingGenerate(pageNo, pageSize, maxPage, totalRecord) {
        let first = "<button data-page='0' onclick='" + this.objectName + ".PageCountChange(1);'><<</button>";
        //let last = "<button data-page='0'>>></button>";
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
                str += (i == pageNo) ? "<button class='current' value='" + i + "'>" + i + "</button>" : "<button onclick='" + this.objectName + ".PageCountChange(" + i + ");'>" + i + "</button>";
            }
            if (pageNo < totalPage) {
                str += next;
            }
            if (pageNo < totalPage - 1) {
                str += "<button data-page='0' onclick='" + this.objectName + ".PageCountChange("+totalPage+");'>>></button>";
            }
        }
        str += "<p class='page-limit' data-total-record='" + totalRecord + "'>" + ((pageNo - 1) * pageSize + 1) + " - " + (pageNo * pageSize > totalRecord ? totalRecord : pageNo * pageSize) + " / " + totalRecord + "<p>";
        return str;
    }

    
    /**
     * Gen dropdown pageSize
     * @param {any} pageSize
     */
    PageSizeGenerate(pageSize) {
        let str = '<select onchange="' + this.objectName + '.PageSizeChange($(this).val());">';
        this.defaultPageSizeOptions.forEach(element => {
            if (pageSize == element) {
                str += '<option value="' + element + '" selected>' + element + '</option>';
            }
            else {
                str += '<option value="' + element + '">' + element + '</option>';
            }
        });
        str += '</select>';
        return str;
    }

    /**
     * Hàm gọi server lấy data
     * @param {any} pageCount
     * @param {any} pageSize
     * @param {any} isOriginal
     * @param {any} sort
     * @param {any} filter
     */
    GetPaging(pageCount, pageSize, isOriginal = 0, sort, filter) {
        let current = this;
        $.ajax({
            url: this.url,
            type: 'POST',
            data: { pageCount: pageCount, pageSize: pageSize, sort: sort, filter: filter },
        })
            .done(function (res) {
                let isHeader = true;
                if (sort || filter) {
                    isHeader = false;
                }
                current.Generate(JSON.parse(res.data), isOriginal, isHeader);
                current.destinationPagging.html(current.PaggingGenerate(pageCount, pageSize, current.defaultMaxPage, res.totalRecord));
                if (isOriginal == 1) {
                    current.InitSortable();
                }
                current.destinationTable.attr('data-content', res.data);
                console.log("\"");
            })
            .fail(function () {
                console.log("error");
            })
            .always(function () {
            });
    }

    SortSequence(i) {
        i++;
        return (i > 1 ? -1 : i);
    }

    SortSequenceIcon(i) {
        let icon = "";
        if (i == -1) {
            icon = "fa fa-long-arrow-up";
        }
        else if (i == 1) {
            icon = "fa fa-long-arrow-down";
        }
        return icon;
    }

    QuickSort(e) {
        let d = $(e).attr('data-direction');
        let cN = $(e).closest('th').attr('column-pivot');
        if (d && cN) {
            let sS = this.SortSequence(d);
            let sort = { "ColumnName": cN, "Direction": sS };
            let data = this.GetAllData(null, null, sort, null);
            this.GetPaging(data.pC, data.pS, 0, data.sort, data.filter);
            $(e).closest('tr').find('span[data-direction]').attr('data-direction', 0);
            $(e).closest('tr').find('i[icon-direction]').attr('class', '');
            $(e).attr('data-direction', sS);
            $(e).siblings('i[icon-direction]').attr('class', this.SortSequenceIcon(sS));
        }
    }

    PageCountChange(pC) {
        let data = this.GetAllData(null, pC, null, null);
        this.GetPaging(data.pC, data.pS, 0, data.sort, data.filter);
    }

    PageSizeChange(pS) {
        let data = this.GetAllData(pS, null, null, null);
        this.GetPaging(data.pC, data.pS, 0, data.sort, data.filter);
    }

    SwapTable() {
        let data = JSON.parse(this.destinationTable.attr('data-content'));
        this.Generate(data, 0);
    }

    ToggleVisibleColumn(e) {
        let cN = $(e).closest('li').attr('data-column');
        let iC = $(e).is(':checked');
        this.columnOrder.filter(x => x.ColumnName == cN)[0].Visible = iC;
        this.SwapTable();
        let vE = $(e).closest('ul').find('input[type="checkbox"]');
        const single = (num) => {
            let ele;
            for (var i = 0; i < vE.length; i++) {
                if (vE[i].checked) {
                    num++;
                    ele = vE[i];
                }
            }
            return { Count: num, Element: ele };
        }
        let sE = single(0);
        if (sE.Count == 1) {
            sE.Element.setAttribute('disabled', 'disabled');
        }
        else if (sE.Count == 2) {
            $('[table-engine-column-switch="main"]').find('input[type="checkbox"][disabled]').removeAttr('disabled');
        }
    }

    /** Khởi tạo kéo thả để thay đổi thứ tự cột */
    InitSortable() {
        let current = this;
        $("." + this.objectName + "-sortable").sortable({
            //grid: [20, 10],
            items: "> li",
            opacity: 0.5,
            appendTo: document.body,
            update: function (event, ui) {
                let arr = [];
                let temp = $(this).find('li');
                for (var i = 0; i < temp.length; i++) {
                    arr.push({ ColumnName: temp[i].attributes['data-column'].value, Order: i + 1 });
                }
                const merge = (arr1, arr2) => {
                    const temp = []
                    arr1.forEach(x => {
                        arr2.forEach(y => {
                            if (x.ColumnName === y.ColumnName) {
                                temp.push({ ...y, ...x })
                            }
                        })
                    })

                    return temp
                }
                current.columnOrder = merge(arr, current.columnOrder);
                if ($(event.originalEvent.target).children('input[type="checkbox"]').is(':checked')) {
                    current.SwapTable();
                }
            }
            //axis: "x"
            //revert: true
        });
    }
}

// switch column không giữ sort

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