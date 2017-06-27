

function getMySkis(user_name) {
  if (offline) return onOffline();

  console.log('getMySkis function fired with user_name ' + user_name);

  var url='http://finappv2.paulsantangelo.com/ws/ws_get_my_skis_ret_json.php';

  $$.ajax({url:url,data:{ user_name:user_name },type:'POST',dataType: 'json',success:function(mySkisObj) {
    if (mySkisObj.length>0) { // RETURNED RESULTS
      if (mySkisObj[0].RETURN_CODE==1) {
        console.log('success with obj ' + mySkisObj)
        //var str = '<div class="list-block">';
          var str='<ul id="saved_ski_list">';

            // iterate here.
            $$.each(mySkisObj, function( index, value ) {

              if (value.current==1) {
                str+='<li class="lightOrangeBG">';
              } else {
                str+='<li>';
              }

              str+='<label class="label-radio item-content">';
              str+='<input type="radio" name="my-radio" value="'+value.id+'"';
              if (value.current==1) {
                str+=' checked="checked">';
              } else {
                str+='>';
              }
              str+='<div class="item-inner">';
              if (value.current==1) {
                str+='<div class="item-title checkedRadio">'+value.my_ski_name+'</div>';
              } else {
                str+='<div class="item-title">'+value.my_ski_name+'</div>';
              }
              str+='</div>';
              str+='</label>';
              str+='</li>';
      			});

            str+='</ul>';
            //str+='</div>';

            $$(".page #ul_mySkis_list").append(str).trigger('create');
      } else {
        console.log('json success, but no stock ski data found.');
      }
      console.log('json success, RETURN CODE NOT 1.');
    }
/*
    var modelList = '<li id="list_model"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Model"><select name="model" id="model_select_id" class="model_class">';

    $$.each(modelsObj, function( index, value ) {
      modelList += '<option value="'+ value.model + '">'+ value.model + '</option>';
    });

    modelList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Model</div><div class="item-after"></div></div></div></a>';

    $$("#ul_stock_list").append(modelList).trigger('create');
*/

    }, timeout: 5000
    , beforeSend: function(){
      console.log('beforeSend getMySkis');
      myApp.showIndicator();

    }, complete: function(){
        console.log('complete getMySkis');
        myApp.hideIndicator();

    }, error: function(mySkisObj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + mySkisObj + status + err);
        } else {
          console.log("error: "  + status + err);
        }
    }
  }) // END ajax function for mySkis
}
