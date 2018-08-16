//JSON loading functions
function loadJSON(url) {
    var tmpObj = [];
    var waitB = true;
    var waitI;
    //console.log("Inside loadJSON with url " + url);
    $.ajaxSetup({
        async: false
    });
    $.getJSON(url, function (data) {
        //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
        $.each(data.d.results, function (ini, it) {
            tmpObj.push(it);
        });
        //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
        //console.log("tmpObj len " + tmpObj.length);
    });
    $.ajaxSetup({
        async: true
    });
    return tmpObj;
}