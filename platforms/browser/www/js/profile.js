function init_profile() {
  populateWeight();
  populateDOByears();
  populateProfile();

  $$("#editProfileBtn").text('Edit');
  $$('#profilePage_div .item-input').children().prop("disabled", true);

}


function populateProfile() {
  if (typeof thisUser != "undefined") {
    // populate the fields with values
    $$(".page #first_name").val(thisUser.first_name);
    $$(".page #last_name").val(thisUser.last_name);
    $$(".page #user_email").val(thisUser.user_email);
    $$(".page #weight").val(thisUser.weight);
    //$$(".page #weight").slider('refresh');
    $$(".page #height").val(thisUser.height);
    //$$(".page #height").selectmenu('refresh');
    $$(".page #dob_year").val(thisUser.dob_year);
    //$$(".page #dob_year").selectmenu('refresh');
    $$(".page #capability_level").val(thisUser.capability_level);
    //$$(".page #capability_level").selectmenu('refresh');
    $$(".page #ski_speed").val(thisUser.ski_speed);
    //$$(".page #ski_speed").selectmenu('refresh');
    $$(".page #measure_binding").val(thisUser.measure_binding);

    $$(".page #measure_length").val(thisUser.measure_length);
    //$$(".page #measure_length").selectmenu('refresh');
    $$(".page #measure_depth").val(thisUser.measure_depth);
    //$$(".page #measure_depth").selectmenu('refresh');
    $$(".page #measure_dft").val(thisUser.measure_dft);
    //$$(".page #measure_dft").selectmenu('refresh');
    //$$(".page #measure_dft").val(thisUser.notes_dft);
  }
}


function populateWeight() {
  var weight='';
  weight += '<select name="weight" id="weight">';
  weight+="<option value=''>Select...</option>";
  for (i=100;i<255; i+=5) {
    weight+="<option value='"+i+"'>"+i+" lbs</option>";
  }
  weight+='</select>';
  $$(".page #weightSelect").html(weight).trigger('create'); // APPLY TO PAGE
}

function populateDOByears() {
  var currentYear = (new Date).getFullYear();
  var years='';
  years += '<select name="dob_year" id="dob_year">';
  years+="<option value=''>Select...</option>";
  for (i=currentYear-99;i<currentYear-6; i++) {
    years+="<option value='"+i+"'>"+i+"</option>";
  }
  years+='</select>';
  $$(".page #dobYearSelect").html(years).trigger('create'); // APPLY TO PAGE
}


function toggleEditSave () {
  console.log("toggleEditSave clicked");
  if ($$("#editProfileBtn").text() == "Edit") {
    $$("#editProfileBtn").text("Save");
//    $$('#profilePage_div .content-block-title').hide();
    //$$('#profilePage_div .list-block ul').css('background-color','rgba(245,255,245,.5)');
    $$('#profilePage_div .list-block ul').addClass('lightOrangeBG');
    $$('#profilePage_div .item-input').children().prop("disabled", false);
  } else {



        var errorCondition=false;
        $$("#profilePage_div .redText").html(''); // clear all error fields
        if ($$("#measure_binding, #measure_length, #measure_depth, measure_dft").val() == "") {
          console.log('Empty required values for measure');
          $$("#errorMeasure").html(" Required fields");
          errorCondition=true;
        }

        if ($$("#first_name, #last_name, #user_email").val() == "") {
          console.log('Empty required values for user');
          $$("#errorUser").html(" Required fields");
          errorCondition=true;
        }

        if ( !validateEmail( $$("#user_email").val() ) ) {
          console.log('invalid email for user');
          $$("#errorUser").html(" Invalid email");
          errorCondition=true;
        }

        if (errorCondition) {
          console.log("do not save data");
          return null; // Don't save data
        }



    $$("#editProfileBtn").text("Edit");
    $$('#profilePage_div .content-block-title').show();
    //$$('#profilePage_div .list-block ul').css('background-color','rgba(255,255,255,1)');
    $$('#profilePage_div .list-block ul').removeClass('lightOrangeBG');
    $$('#profilePage_div .item-input').children().prop("disabled", true);



    var $$inputs = $$('#profilePage_div input, #profilePage_div select ,#profilePage_div textarea');
    //var values = {};
    $$inputs.each(function() {
      thisUser[this.name]=$$(this).val(); // ASSIGN USER OBJECT NEW VALUES
    });
    //console.log(values);
    //var postFields=JSON.stringify(thisUser); //{user_name:thisUser.user_name,name:thisUser.first_name}

    var form_data = new FormData();
    for ( var key in thisUser ) {
        form_data.append(key, thisUser[key]);
    }


    var url='http://finappv2.paulsantangelo.com/ws/ws_set_user_profile_ret_json.php';
    var firstLogin=false;

		$$.ajax({url:url,data: form_data ,type:'POST',dataType: 'json',success:function(profilesObj) {
      if (profilesObj.length>0) { // RETURNED RESULTS
        if (profilesObj[0].RETURN_CODE==1) {
          console.log('successful profile update');
          if (thisUser.profileActivated == 0) { //first enry and successful profile update/min fields submitted
            firstLogin=true;
            thisUser.profileActivated=1;
          }
        } else {
            if (profilesObj[0].RETURN_CODE==-2) { // required fields not met
              myApp.alert(
                'Required fields have not been populated.  Please complete the form.',
                'Required Fields',
                function () {
                  return null;
                }
              );
          } else {
            console.log("profile set failed, not return 1 or -2");
          }
        }
      }
    }, timeout: 5000

      , beforeSend: function(){
        console.log('beforeSend profile update');
        window.loginPreLoader = myApp.showPreloader('Saving Profile...');

      }, complete: function(){
          console.log('complete profile update.  firstLogin is ' + firstLogin);
          window.loginPreLoader = myApp.hidePreloader();
          if (firstLogin) {
            console.log('automatically sending user to mySettings page...');
            mainView.router.load( { url:'mysettings.html' });
          }

      }, error: function(profilesObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + profilesObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }); // END ajax function

  }
};


function validateEmail (user_email) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)) {
    return true;
  } else {
    //alert("You have entered an invalid email address!")
    return false;
  }
}
