function isApproved(itObj) {
  var isApp = true;
  for (let index = 0; index < itObj.Approvals.length; index++) {
    if (itObj.Approvals[index].Status != "Approved") {
      isApp = false;
      break;
    }
  }
  return isApp;
}

function genCountText(Approvals) {
  var iC = 0,
    iT = 0,
    sC = "";
  iT = Approvals.length;
  for (let ini = 0; ini < Approvals.length; ini++) {
    if (Approvals[ini].Status == "Approved") {
      iC += 1;
    }
  }
  if (iC / iT < 0.3) {
    sC = "bgcritical";
  } else if (iC / iT < 0.6) {
    sC = "bgpending";
  } else {
    sC = "";
  }
  return [sC, iC + "/" + iT];
}

function Approvers(ApprName) {
  this.ApprName = ApprName; // e.g. "Reg Fraud"
  this.ApprPendList = []; // array of strings containing HTML item cards
  this.addItem = function(aItem) {
    this.ApprPendList.push(aItem);
  };
}

function ApproversArray() {
  this.ApprArray = [];
  this.addApprover = function(apprname) {
    var aInd = -1,
      bFound = false;
    if (this.ApprArray.length > 0) {
      for (let oarr = 0; oarr < this.ApprArray.length; oarr++) {
        if (this.ApprArray[oarr].ApprName == apprname) {
          aInd = oarr;
          bFound = true;
          break;
        }
      }
    }
    if (bFound) {
      return aInd;
    } else {
      this.ApprArray.push(new Approvers(apprname));
      return this.ApprArray.length - 1;
    }
  };
  this.checkAdd = function(pptitem, htmlStr) {
    console.log("Inside checkAdd for pptitem:" + JSON.stringify(pptitem));
    var bNew = false,
      pptstr = "",
      iArrInd;
    if (pptitem.Approvals.length > 0) {
      for (let arri = 0; arri < pptitem.Approvals.length; arri++) {
        if (pptitem.Approvals[arri].Status == "Pending") {
          iArrInd = this.addApprover(pptitem.Approvals[arri].Approver);
          this.ApprArray[iArrInd].ApprPendList.push(htmlStr);
        }
      }
    }
  };
}

$(function() {
  var arrAS = [],
    arrAL = [],
    tArr = [],
    arrApprovers = [];
  var strSch = [],
    strPen = [],
    strApp = [];
  var strSchH = "",
    strPenH = "",
    strAppH = "";
  var htmlStr = "",
    strtemp = "",
    strtemp2 = "",
    mStr = "",
    mHtml = "",
    tStr = "",
    tHtml = "",
    sModStr = "";
  var strACObj = "",
    strACsinP = "",
    strACsinT = "";
  tArr = loadApprJSON(["Apprppt.json", "ApprStatus.json"]);
  if (tArr.length > 0) {
    arrAL = tArr[0];
    //console.log("Ppt List" + JSON.stringify(arrAL));
    arrAS = tArr[1];
    //console.log("Approval List" + JSON.stringify(arrAS));
  }
  $.each(arrAL, function(ini, it) {
    if (it.pptOn == "") {
      strSch.push(ini);
    } else {
      if (isApproved(it)) {
        strApp.push(ini);
      } else {
        strPen.push(ini);
      }
    }
  });
  //console.log("Scheduled list" + JSON.stringify(strSch));
  //console.log("Pending list" + JSON.stringify(strPen));
  //console.log("Approved list" + JSON.stringify(strApp));

  htmlStr = "";
  mStr = "";
  tHtml = "";
  sModStr = $("#ModalContainer").html(); //save for later clean up
  tStr = $("#ApproverCard").html(); //save for later cleanup
  //console.log("Original Modal" + sModStr);
  //console.log("Original ApprovedCard" + tStr);

  strSchH = $("#Scheduled").html();
  for (let index = 0; index < strSch.length; index++) {
    //generate Approval list
    tHtml = "";
    $("#ApproverCard").html(tHtml);
    mHtml = sModStr;
    //console.log("Changed Sch Card" + tHtml);
    //console.log("Changed Sch Modal" + mHtml);

    strtemp = strSchH
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strSch[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strSch[index]].pptDesc)
      .replace(new RegExp("#MOM#", "g"), arrAL[strSch[index]].MOM)
      .replace(new RegExp("#num#", "g"), "Sch" + index);
    htmlStr += strtemp;
    strtemp2 = mHtml
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strSch[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strSch[index]].pptDesc)
      .replace("#pptBy#", arrAL[strSch[index]].pptBy)
      .replace("#liveBy#", arrAL[strSch[index]].liveBy)
      .replace(new RegExp("#MOM#", "g"), arrAL[strSch[index]].MOM)
      .replace(new RegExp("#num#", "g"), "Sch" + index)
      .replace("#CardContent#", tHtml);
    mStr += strtemp2;
  }
  $("#Scheduled").html(htmlStr + mStr);
  htmlStr = "";
  mStr = "";
  tHtml = "";
  mHtml = "";

  strPenH = $("#Pending").html();
  strACObj = $("#ApprCard");
  arrApprovers = new ApproversArray();

  for (let index = 0; index < strPen.length; index++) {
    //generate Approval list
    tHtml = "";
    for (
      let jindex = 0;
      jindex < arrAL[strPen[index]].Approvals.length;
      jindex++
    ) {
      var status = arrAL[strPen[index]].Approvals[jindex].Status.toLowerCase();
      var iconstr = "";
      if (status == "pending") {
        iconstr = "exclamation";
      } else {
        iconstr = "check";
      }
      tHtml += tStr
        .replace(new RegExp("#bgapprstatus#", "g"), "bg" + status)
        .replace(new RegExp("#appriconcolor#", "g"), "f" + status)
        .replace(new RegExp("#appricon#", "g"), iconstr)
        .replace("#ApprName#", arrAL[strPen[index]].Approvals[jindex].Approver);
    }

    mHtml = sModStr;

    strtemp = strPenH
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strPen[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strPen[index]].pptDesc)
      .replace(new RegExp("#num#", "g"), "Pen" + index)
      .replace("#MOM#", arrAL[strPen[index]].MOM)
      .replace("#bg#", genCountText(arrAL[strPen[index]].Approvals)[0])
      .replace("#count#", genCountText(arrAL[strPen[index]].Approvals)[1]);
    htmlStr += strtemp;
    strtemp2 = mHtml
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strPen[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strPen[index]].pptDesc)
      .replace("#pptBy#", arrAL[strPen[index]].pptBy)
      .replace("#liveBy#", arrAL[strPen[index]].liveBy)
      .replace(new RegExp("#num#", "g"), "Pen" + index)
      .replace("#MOM#", arrAL[strPen[index]].MOM)
      .replace("#bg#", genCountText(arrAL[strPen[index]].Approvals)[0])
      .replace("#count#", genCountText(arrAL[strPen[index]].Approvals)[1])
      .replace("#CardContent#", tHtml);
    mStr += strtemp2;
    arrApprovers.checkAdd(arrAL[strPen[index]], strtemp + strtemp2);
  }
  //console.log("Changed Pen Card" + tHtml);
  //console.log("Changed Pen Modal" + mStr);

  $("#Pending").html(htmlStr + mStr);

  strACsinP = $("#ApproverCont").html();
  if (arrApprovers.ApprArray.length > 0) {
    for (let APLind = 0; APLind < arrApprovers.ApprArray.length; APLind++) {
      strACsinT = strACsinP
        .replace("#Appteam#", arrApprovers.ApprArray[APLind].ApprName)
        .replace(
          "#PptItems#",
          arrApprovers.ApprArray[APLind].ApprPendList.join(" ")
        );
      strACObj.append(strACsinT);
    }
  }

  htmlStr = "";
  mStr = "";
  tHtml = "";
  mHtml = "";

  strAppH = $("#Approved").html();
  for (let index = 0; index < strApp.length; index++) {
    //generate Approval list
    tHtml = "";
    for (
      let jindex = 0;
      jindex < arrAL[strApp[index]].Approvals.length;
      jindex++
    ) {
      var status = arrAL[strApp[index]].Approvals[jindex].Status.toLowerCase();
      var iconstr = "";
      if (status == "pending") {
        iconstr = "exclamation";
      } else {
        iconstr = "check";
      }
      tHtml += tStr
        .replace(new RegExp("#bgapprstatus#", "g"), "bg" + status)
        .replace(new RegExp("#appriconcolor#", "g"), "f" + status)
        .replace(new RegExp("#appricon#", "g"), iconstr)
        .replace("#ApprName#", arrAL[strApp[index]].Approvals[jindex].Approver);
    }

    mHtml = sModStr;

    htmlStr += strAppH
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strApp[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strApp[index]].pptDesc)
      .replace("#bg#", "bggreen")
      .replace("#MOM#", arrAL[strApp[index]].MOM)
      .replace(new RegExp("#num#", "g"), "App" + index)
      .replace("#count#", genCountText(arrAL[strApp[index]].Approvals)[1]);
    mStr += mHtml
      .replace(new RegExp("#pptTitle#", "g"), arrAL[strApp[index]].pptTitle)
      .replace("#pptDesc#", arrAL[strApp[index]].pptDesc)
      .replace("#pptBy#", arrAL[strApp[index]].pptBy)
      .replace("#liveBy#", arrAL[strApp[index]].liveBy)
      .replace("#bg#", "bggreen")
      .replace("#MOM#", arrAL[strApp[index]].MOM)
      .replace(new RegExp("#num#", "g"), "App" + index)
      .replace("#count#", genCountText(arrAL[strApp[index]].Approvals)[1])
      .replace("#CardContent#", tHtml);
  }
  //console.log("Changed App Card" + tHtml);
  //console.log("Changed App Modal" + mHtml);

  $("#Approved").html(htmlStr + mStr);
  htmlStr = "";
  //clean up
  $("#ModalContainer").html(sModStr);
});
