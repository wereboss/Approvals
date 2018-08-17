function ApprovalStatus(asID, Approver, Status, pptOn) {
    //console.log("inside AS list constructor");
    this.asID = asID;
  this.Approver = Approver;
  this.Status = Status;
  this.pptOn = pptOn;
}
function PptList(pptID, pptTitle, pptDesc, pptBy, pptOn, liveBy, MOM) {
  //console.log("inside PPT list constructor pptID:"  + pptID);
    this.pptID = pptID;
  this.pptTitle = pptTitle;
  this.pptDesc = pptDesc;
  this.pptBy = pptBy;
  this.pptOn = pptOn;
  this.liveBy = liveBy;
  this.MOM = MOM;
  this.Approvals = [];
  (this.addApprover = function(approver) {
    this.Approvals.push(approver);
  }),
    (this.clearApprovers = function() {
      this.Approvals.empty();
    });
    //console.log("inside PPTlist constructor this object:" + JSON.stringify(this));
}

//JSON loading functions
function loadApprJSON(url) {
  var asArr = [],
    alArr = [];
  var tObj = {},
    alObj = {};

  console.log("Inside loadJSON with url " + url.join("~"));
  $.ajaxSetup({
    async: false
  });
  $.getJSON(url[0], function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    $.each(data.d.results, function(ini, it) {
      //console.log("Inside PPT List Data:" + JSON.stringify(data));
      tObj = new PptList(
        it.Id,
        it.pptTitle,
        it.pptDesc,
        it.pptBy,
        it.pptOn,
        it.liveBy,
        it.MOM
      );
      //console.log("PPT List Data:" + JSON.stringify(tObj));
      alArr.push(tObj);
    });
    //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
    //console.log("tmpObj len " + tmpObj.length);
  });

  $.getJSON(url[1], function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    $.each(data.d.results, function(ini, it) {
      //console.log("AL list item:" + JSON.stringify(it));
        tObj = new ApprovalStatus(
        it.Id,
        it.Approver,
        it.Status,
        it.PptOn
      );
      //console.log("tObj:" + JSON.stringify(tObj));
      //console.log("About to add approvers:" + it.pptId);
      //console.log("PPT list length" + alArr.length);
      for (let index = 0; index < alArr.length; index++) {
          //console.log("alArr pptID:" + alArr[index].pptID);
        if (alArr[index].pptID == it.pptId) {
          alArr[index].addApprover(tObj);
          break;
        }
      }
      asArr.push(tObj);
    });
    //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
    //console.log("tmpObj len " + tmpObj.length);
  });

  $.ajaxSetup({
    async: true
  });
  return [alArr, asArr];
}
