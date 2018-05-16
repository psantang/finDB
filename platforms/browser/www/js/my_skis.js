

function getMySkis(user_name) {
  if (offline) return onOffline();

  console.log('getMySkis function fired with user_name ' + user_name);

  var url=wsURL+'ws_get_my_skis_ret_json.php';

  myApp.request({url:url,data:{ user_name:user_name },type:'POST',dataType: 'json',success:function(mySkisObj) {
    if (mySkisObj.length>0) { // RETURNED RESULTS
      if (mySkisObj[0].RETURN_CODE==1) {
        console.log('success with return code 1');
        //var str = '<div class="list-block">';
          var str='<ul id="saved_ski_list">';
          window.mySkisObj=mySkisObj;
            // iterate here.
            //mySkisObj.forEach( function( index, value ) {
            for (a=0;a<mySkisObj.length;a++) {
              //console.log('in each loop with current=' + mySkisObj[a].current);
              if (mySkisObj[a].current==1) {
                str+='<li class="lightOrangeBG swipeout transitioning">';
              } else {
                str+='<li class="swipeout transitioning">';
              }

              str+='<label class="item-radio"> '; // V2: <label class="item-radio item-content"> // V1: <label class="label-radio">
              str+='<div class="item-content swipeout-content">';

              str+='<input type="radio" name="my-radio" value="'+mySkisObj[a].id+'"';
              if (mySkisObj[a].current==1) {
                str+=' checked="checked">';
              } else {
                str+='>';
              }

              str+='<i class="icon icon-radio"></i>';

              str+='<div class="item-inner">';
              //str+='<div class="item-title-row">';

              if (mySkisObj[a].current==1) {
                str+='<div class="item-title checkedRadio" id="ski_name_'+mySkisObj[a].id+'">'+mySkisObj[a].my_ski_name+'</div>';
              } else {
                str+='<div class="item-title" id="ski_name_'+mySkisObj[a].id+'">'+mySkisObj[a].my_ski_name+'</div>';
              }

              str+='<div class="item-after"><i class="icon f7-icons ">chevron_left</i><i class="chevronB icon f7-icons ">chevron_left</i><i class="chevronC icon f7-icons">chevron_left</i></div>';


              //str+='</div>'; // title row
              str+='</div>'; // inner

              str+='</div>'; //item-content
              str+='</label>';
              str+='<div class="swipeout-actions-right"><a href="#" id="ski_id_'+mySkisObj[a].id+'" class="renameSki swipeout-close">Rename</a></div>';


              str+='</li>';
      			//});
          } // end for loop
            str+='</ul>';
            //str+='</div>';
            //console.log ("str = " + str);

            $$(".page #ul_mySkis_list").append(str).trigger('create');
      } else {
        console.log('json success, but no stock ski data found.');
      }
      console.log('json success, mySkisObj > 1.');
    }
    }, timeout: 5000
    , beforeSend: function(){
      console.log('beforeSend getMySkis');
      //myApp.showIndicator();
      myApp.preloader.show();

    }, complete: function(){
        console.log('complete getMySkis');
        //myApp.hideIndicator();
        myApp.preloader.hide();

    }, error: function(mySkisObj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + mySkisObj + status + err);
        } else {
          console.log("ERROR!  status:"  + status + " err:" + err);
        }
    }
  }) // END ajax function for mySkis
}



function changeSkiName(ski_id) {
  var curName=$$("#ski_name_"+ski_id).text();
  //myApp.prompt('Current name is<div class="bold">'+curName+'</div>', 'Rename Your Ski',
  myApp.dialog.prompt('Current name is<div class="bold">'+curName+'</div>', 'Rename Your Ski',
    function (value) { // OK BUTTON FOR CHANGE NAME ON SWIPEOUT PROMPT

      var url=wsURL+'ws_set_rename_ski_ret_json.php';
      var returnCode;

      myApp.request({url:url,data:{ user_name:thisUser.user_name,ski_id:ski_id,my_ski_name:value },type:'POST',dataType: 'json'
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
