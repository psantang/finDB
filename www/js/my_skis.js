

function getMySkis(user_name) {
  if (offline) return onOffline();

  console.log('getMySkis function fired with user_name ' + user_name);

  var url=wsURL+'ws_get_my_skis_ret_json.php';

  $$.ajax({url:url,data:{ user_name:user_name },type:'POST',dataType: 'json',success:function(mySkisObj) {
    if (mySkisObj.length>0) { // RETURNED RESULTS
      if (mySkisObj[0].RETURN_CODE==1) {
        console.log('success with obj ' + mySkisObj)
        //var str = '<div class="list-block">';
          var str='<ul id="saved_ski_list">';

            // iterate here.
            $$.each(mySkisObj, function( index, value ) {

              if (value.current==1) {
                str+='<li class="lightOrangeBG swipeout transitioning">';
              } else {
                str+='<li class="swipeout transitioning">';
              }

              str+='<label class="label-radio item-content">';
              str+='<div class="swipeout-content item-content">';

              str+='<input type="radio" name="my-radio" value="'+value.id+'"';
              if (value.current==1) {
                str+=' checked="checked">';
              } else {
                str+='>';
              }
              str+='<div class="item-inner">';
              if (value.current==1) {
                str+='<div class="item-title checkedRadio" id="ski_name_'+value.id+'">'+value.my_ski_name+'</div>';
              } else {
                str+='<div class="item-title" id="ski_name_'+value.id+'">'+value.my_ski_name+'</div>';
              }
              str+='</div>';
              str+='</div>';
              str+='<div class="swipeout-actions-right"><a href="#" id="ski_id_'+value.id+'" class="renameSki swipeout-close">Rename</a></div>';
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



function changeSkiName(ski_id) {
  var curName=$$("#ski_name_"+ski_id).text();
  myApp.prompt('Current name is<div class="bold">'+curName+'</div>', 'Rename Your Ski',

    function (value) { // OK BUTTON FOR CHANGE NAME ON SWIPEOUT PROMPT

      var url=wsURL+'ws_set_rename_ski_ret_json.php';
      var returnCode;

      $$.ajax({url:url,data:{ user_name:thisUser.user_name,ski_id:ski_id,my_ski_name:value },type:'POST',dataType: 'json'
      ,success:function(json_Obj) {
          console.log('ajax success.');
          if (json_Obj.length>0) { // RETURNED RESULTS
            if (json_Obj[0].RETURN_CODE==1) {
              returnCode=1;
              console.log('my_ski_name is ' + json_Obj[0].my_ski_name);
              console.log('id is ' + json_Obj[0].id);

            } else {
              returnCode=json_Obj[0].RETURN_CODE;
              console.log('return code is NOT 1');
            }
          }
        }, complete: function(){
            console.log('ajax complete for rename Ski.')
            if (returnCode==1) {
              // close the swiper
              $$("#ski_name_"+ski_id).text(value);
              if (thisSki.id==ski_id) thisSki.my_ski_name=value;
            } else {

            }
            $$("#ski_id_"+ski_id).addClass('swipeout-close');
        }, // end COMPLETE
        timeout: 5000,
        error: function(json_Obj, status, err) {
          if (status == "timeout") {
              console.log("Timeout Error. " + json_Obj + status + err);
          } else {
              console.log("error: " + json_Obj + status + err);
          }
        }, // end error
          beforeSend: function(){
            console.log('ajax beforeSend.')
            } // END before Send
      });



    },
    function (value) { // CANCEL BUTTON ON SWIPEOUT PROMPT
      return null;
    }
  );


}
