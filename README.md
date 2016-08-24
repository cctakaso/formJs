# formJs
simple input form manager for javascript

## How to use
```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>form.js TEST</title>
<script src="/js/jquery-1.11.3.min.js"></script>
<script src="/js/form.js"></script>
</head>
<body>

<h2 id="title">form.js TEST</h2>

<table id='form1'>
  <tr>
    <td>status_1</td>
    <td><select name='status_1'><option value='null'></option><option value='00'>aaaaaa</option><option value='10'>bbbb</option><option value='20'>ccccc</option><option value='60'>dddddd</option></select></td>
  </tr>
  <tr>
    <td>date_1(yyyy/MM/dd)</td>
    <td><input type='text' name='date_1' size='12' maxlength='10'></td>
  </tr>
  <tr>
    <td>text_1</td>
    <td><input type='text' name='text_1' size='12'></td>
  </tr>
  <tr>
    <td>text_2</td>
    <td><input type='text' name='text_2' size='12'></td>
  </tr>
  <tr>
    <td>num_1</td>
    <td><input type='text' name='num_1' size='12'></td>
  </tr>
  <tr>
    <td>check_1</td>
    <td><lavel><input type='checkbox' name='check_1'>check_1</lavel></td>
  </tr>
</table>

  <div>
    <a href='javascript:void(0);' onclick='getter(); return false;'>Getter</a> 
    <a href='javascript:void(0);' onclick='setter(); return false;'>Setter</a> 
  </div>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<script>
  var FORM = {
    ERROR_RULE:{alert:1, color:"#FFAAAA"},
    status_1:{type:"text", req:1},
    date_1:{type:"date", fmt:"YYYY/MM/DD", req:1, min:"2016/01/03", max:"2016/01/05"},
    text_1:{type:"text", req:1},
    text_2:{type:"text", prefix:"%", tail:"%"},
    num_1:{type:"int", req:1, min:10, max:100},
    check_1:{type:"int", req:1},
  };
  
  $(function() {
  });
  
  
  function getter() {
    var data = get_form("#form1", FORM);
    if (data){
      var json = JSON.stringify(data);
      window.alert(json);
    }
  }
  function setter() {
    var data={status_1:"60", date_1:"2016/01/04", text_1:"text 1", text_2:"text 2", num_1:"31", check_1:"1"};
    set_form("#form1", FORM, data);
  }
</script>

</body>
</html>
```
