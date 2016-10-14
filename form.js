var FORM_MSG = {
  ERR_REQ:"This field is required.",
  ERR_TYPE:"Please enter a valid value.",
  ERR_RANGE:"Please enter a valid value range.",
};
function set_form(def_name, def_form, data, isReadOnly) {
  for (var key in def_form) {
    if (key=="ERROR_RULE")
      continue;
    var ctr = get_ctr(def_name, key);
    if (!isEmpty(ctr)) {
      //if (!isEmpty(def_form[key]["ctr"]) && def_form[key]["ctr"]=="check") {
      if (!isEmpty(ctr[0]["nodeName"]) && (ctr[0].nodeName == "DIV" || ctr[0].nodeName == "SPAN")) {
        if (ctr.hasClass('autoval')) {
          ctr.html(data[key]);
        }else if (isReadOnly) {
          ctr.prop('disabled',true);
        }
      }else{
        if (!isEmpty(ctr[0].type) && ctr[0].type=="checkbox") {
          ctr.prop('checked',data[key]>0 ? true:false);
        }else{
          ctr.val(data[key]);
        }
        if (isReadOnly) {
          ctr.prop('disabled',true);
        }
      }
    }
  }
  return data;
}

function get_form(def_name, def_form) {
  var data = new Object();
  var ctr_error_fst = null;
  var msg = null;
  for (var key in def_form) {
    var ishd = def_form[key]["hd"];
    if (isEmpty(ishd) || ishd!=true ) {
      var ctr = get_ctr(def_name, key);
      if (isValidCtr(ctr)) {
        var val = get_ctr_value(def_name, def_form, key);
        if (def_form["ERROR_RULE"].color) {
          ctr.css("background-color","");
        }
        if (def_form[key].req && isNullUndefined(val)) {
          if (def_form["ERROR_RULE"].color) {
            ctr.css("background-color",def_form["ERROR_RULE"].color);
          }
          if (!ctr_error_fst) {
            ctr_error_fst = ctr;
            msg = FORM_MSG.ERR_REQ;
          }
        }else{
          if (def_form[key].type=="int" || def_form[key].type=="hex"
              || def_form[key].type=="date") {
            if (isNaN(val)) {
              if (def_form["ERROR_RULE"].color) {
                ctr.css("background-color",def_form["ERROR_RULE"].color);
              }
              if (!ctr_error_fst) {
                ctr_error_fst = ctr;
                msg = FORM_MSG.ERR_TYPE;
              }
            }else{
              if (def_form[key].type=="date") {
                if (val && !isBetweenDate(val, new Date(def_form[key].min), new Date(def_form[key].max))) {
                  if (def_form["ERROR_RULE"].color) {
                    ctr.css("background-color",def_form["ERROR_RULE"].color);
                  }
                  if (!ctr_error_fst) {
                    ctr_error_fst = ctr;
                    msg = FORM_MSG.ERR_RANGE;
                  }
                }
              }else{
                if ((def_form[key].min && val<def_form[key].min) 
                    || (def_form[key].max && val>def_form[key].max)) {
                  if (def_form["ERROR_RULE"].color) {
                    ctr.css("background-color",def_form["ERROR_RULE"].color);
                  }
                  if (!ctr_error_fst) {
                    ctr_error_fst = ctr;
                    msg = FORM_MSG.ERR_RANGE;
                  }
                }
              }
            }
          }
        }
        data[key] = val;
        if (isValid(data[key])) {
          if (def_form[key].prefix) {
            data[key] = def_form[key].prefix + data[key];
          }
          if (def_form[key].tail) {
            data[key] += def_form[key].tail;
          }
        }
      }
    }
  }
  if (isValidCtr(ctr_error_fst)) {
    ctr_error_fst.focus();
    if (def_form["ERROR_RULE"].alert) {
      var timer = setTimeout(function() {
        window.alert(msg);
      }, 200);
      return null;
    }
  }
  return data;
}

function get_ctr_value(def_name, def_form, key) {
  var val = null;
  var req = def_form[key].req;
  var ctr = get_ctr(def_name, key);
  if (isValidCtr(ctr)) {
    if (ctr.is('select')) {
      var tmp = def_name+" [name=\""+key+"\"] option:selected";
      ctr = $(tmp);
      val = parseValue(def_form, ctr.val(), key);
    }else if (!isEmpty(ctr[0].type) && ctr[0].type=="checkbox") {
      val = parseValue(def_form, ctr.is(':checked') ? '1':'0', key);
    }else{
      var val;
      if (!isEmpty(ctr[0].nodeName) && (ctr[0].nodeName == "DIV" || ctr[0].nodeName == "SPAN")) {
        if (ctr.hasClass('autoval')) {
          val = ctr.html();
        }
      }else{
        val = parseValue(def_form, ctr.val(), key);
      }
    }
  }
  
  return val;
}

function parseValue(def_form, obj, key) {
  if (isEmpty(obj)) {
    if (obj == void 0 || obj==="") { //undefined check!
      return null; //undifined > null
    }
    //return obj;
  }
  
  var type = def_form[key].type;
  var fmt = def_form[key].fmt;

  
  var radix=null;
  var pref="";
  switch (type) {
    case "int":
      radix = 10;
      break;
    case "hex":
      radix = 16;
      pref="0x";
      break;
    case "date":
      obj = formatDate(obj, fmt); 
      break;
    //"text"
    default:
      if (obj=="null")
        obj = null;
      break;
  }
  if (radix!=null) {
    if (isNaN(pref+obj)) {
      return obj;
    }else{
      return parseInt(obj, radix);
    }
  }
  return obj;
}

function get_ctr(def_name, key) {
  var tmp;
  tmp = def_name+" [name=\""+key+"\"]";
  return $(tmp);
}

/*
 * valiable function
 */

function isEmpty(val) {
  if (!val) {
    if (!((val === 0) || (val === false) || isNaN(val))) {
      return true;
    }
  }
  if (isUndefined(val)) {
    return true;
  }
  return false;
}

function isValidCtr(ctr) {
  return (isValid(ctr) && !isUndefined(ctr.html()));
}

function isValid(val, key, value) {
  if (key == undefined) {
    return !isEmpty(val);
  }
  if (!isEmpty(val)) {
    if (value == undefined) {
      return !isEmpty(val[key]);
    }else if (!isEmpty(val[key])) {
      return (val[key] == value);
    }
  }
  return false;
}

function isUndefined(val) {
  return (typeof val === "undefined") || (val == "undefined") || (val.toString() === "Invalid Date");
}

function isNullUndefined(val) {
  return val==null || isUndefined(val);
}

function today(toformat) {
  return getFormatDate(new Date(), toformat);
}

function formatDate(datestr, frformat, toformat) {
  if (isEmpty(datestr)){
    return '';
  }
  var date;
  var st = frformat.indexOf("YYYY");
  var year, month, day;
  if (st>=0) {
    year = datestr.substr(st, 4);
  }else{
    st = frformat.indexOf("YY");
    var today;
    if (st>=0) {
      year = datestr.substr(st, 2);
      today = new Date(year, 1, 1)
    }else{
      today = new Date();
    }
    year = today.getFullYear();
  }
  
  st = frformat.indexOf("MM");
  if (st>=0) {
    month = datestr.substr(st, 2);
  }else{
    st = frformat.indexOf("M");
    if (st>=0) {
      month = datestr.substr(st, 1);
    }else{
      month = "01";
    }
  }
  
  st = frformat.indexOf("DD");
  if (st>=0) {
    day = datestr.substr(st, 2);
  }else{
    st = frformat.indexOf("D");
    if (st>=0) {
      day = datestr.substr(st, 1);
    }else{
      day = "01";
    }
  }
  
  try{
   date = new Date(year+"/"+month+"/"+day);
  }catch(e){}
  if (!isNaN(date)) {
    if (toformat)
      return getFormatDate(date, toformat);
    //return date;
  }
  //return null;
  return date;
}

function getFormatDate(date, toformat) {
  if (!toformat) toformat = 'YYYY-MM-DD hh:mm:ss.SSS';
  toformat = toformat.replace(/YYYY/g, date.getFullYear());
  toformat = toformat.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  toformat = toformat.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  toformat = toformat.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  toformat = toformat.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  toformat = toformat.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (toformat.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = toformat.match(/S/g).length;
    for (var i = 0; i < length; i++) toformat = toformat.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return toformat;
}

function isBetweenDate(targetDate, startDate, endDate) {
  return (isEmpty(startDate) || startDate.getTime()<=targetDate.getTime())
        && (isEmpty(endDate) || targetDate.getTime()<=endDate.getTime());
}


