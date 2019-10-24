var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
    on: {
        pageInit: function () {
          // do something on page init
          console.log(" ------ > page init in route.js for home page");

          // INITIALIZE OBJECT TO STORE VARIABLES FOR SKI LOOKUP
          myApp.data.lookup={};
          myApp.data.settingArray={};

          $$("#user_name").val(localStorage.getItem("user_name"));
          $$("#pwd").val(localStorage.getItem("pwd"));

          if (localStorage.getItem('activation_code') ) { // check to see if there is any pending activation of a user account
            var pendingUserName=localStorage.getItem('pending_user_name');
            $$(".page #registerBtn").text('Pending Activation for '+ pendingUserName);
          } else {
            $$(".page #registerBtn").text('Register to Begin');
          }

          $$('.page #loginBtn').click(function() {
            console.log('initiating LOGIN from onPageInit in router!');
            //loginEventStr += "\r\nlogin initiated from onPageInit for login page";
            loginUser();
          });

          $$('.page #forgotBtn').click(function() {
            var forgetSomething = myApp.dialog.create({
              title: 'Forget Something?',
              text: 'Retrieve your user name or reset your password.',
              buttons: [
                {
                  text: 'User Name',
                  bold: true,
                  onClick: function () {
                    retrieveUserName();
                  }
                },
                {
                  text: 'Password',
                  bold: true,
                  onClick: function () {
                    forgotPassword();
                  }
                },
              ]
            }).open();
        });

        function retrieveUserName() {
              myApp.dialog.prompt('Please enter the Email Address associated with finDB.', 'Retrieve User Name', function (value) {
                if (validEmail(value)) {
                  requestUserName(value);
                } else {
                  console.log("invalid email format");
                  myApp.dialog.alert("Email address <span class='bold'>" + value + "</span> is not properly formatted.  Please re-enter.","Invalid Email Format",function() {retrieveUserName()});
                }
              });
            }


        function forgotPassword() {
              myApp.dialog.prompt('Please enter your User Name or Email Address.', 'Forgot Password', function (value) {
                  generatePwResetCode(value);
              });
              // wait until prompt is generated, then populate with username if available
              if (typeof localStorage.getItem("user_name") !== "undefined") {
                $$(".dialog .dialog-inner .dialog-input").val(localStorage.getItem("user_name"));
              }
          }






    },  // END PAGEINIT
        pageAfterIn: function () {

        }
    }
  },

  {
    path: '/register/',
    url: './pages/register.html',
    name: 'register',
    on: {
        pageInit: function () {
          // do something on page init
          console.log(" ------ > page init in route.js for register page");

          $$('.create-popup').on('click', function () {
            viewTerms();
          });

          $$('.page #registerBtn').click(function() {
            console.log('clicked registerBtn');
            registerUser();
          });


          if (localStorage.getItem('activation_code') ) { // check to see if there is any pending activation of a user account
            var pendingUserName=localStorage.getItem('pending_user_name');
            console.log("pendActivation initiated");
            showActivationPrompt(localStorage.getItem('pending_user_name'));
          }

        },
        pageAfterIn: function (e, page) {
          console.log('-------> on.pageAfterIn EVENT called from router for register');

          $$('#t_and_c').on('change', function () {
            console.log("t_and_c value is " + this.value );
            if (this.value==0) {
              this.value=1;
            } else {
              this.value=0
            }
          });

        },
    }
  },






  {
    path: '/mySettings/',
    url: './pages/mySettings.html',
    name: 'mySettings',
    on: {
        pageInit: function () {
          // do something on page init
          console.log(" ------ > page init in route.js for mySettings page");
          init_ski();

          $$('.page #viewStockBtn').click(function() {
            toggleViewStock();
          });

          $$('.page #editFinBtn').click(function() {
            console.log("editFinBtn clicked");
            init_slider();
          });

        } ,
        pageAfterIn: function () {
          console.log(" ------ > page after in for mySettings ");

          console.log("update msg is " + $$("#app .panel #update_msg") );
          if (typeof vers_Obj != "undefined" && vers_Obj.vers_update<0) {
            console.log('need an update');
            $$("#versBadge").removeClass('hide');
            $$("#app .panel #update_msg").html("<a href='#' id='versDetails'>Software update available.  <i class='icon f7-icons color-white'>info_fill</i></a>");
            $$("#app .panel #update_msg").css("display","inline-block");
          } else {
            console.log('NO update needed');
            $$("#app .panel #update_msg").html("");
            $$("#app .panel #update_msg").hide();
          }

          $$('#versDetails').click(function() {
              console.log('versDetails via clicked from router');
              versionDetails(vers_Obj);
          });

          displaySetupNotes();
        } ,
        pageBeforeRemove: function () {
          console.log(" ------ > pageBeforeOut in for mySettings page ");
          if (typeof thisSetting=='undefined') {
            console.log(" No settings saved for user in session ");

          }
        }
    }
  },


// popup route below
  {
    path: '/popupNoteC/',
    popup: {
      //componentUrl: './components/popup_setting_note.html',
      content: '\
      <div class="popup popup-notes">\
          <div class="page">\
          <div class="navbar">\
          <div class="navbar-inner">\
          <div class="title">Notes</div>\
          <div class="right"><a href="#" class="link popup-close">Close</a></div>\
          </div>\
          </div>\
          <div class="page-content">\
            <div class="block">\
            SOME TEXT \
              <div class="item-input">\
                <div class="range-slider range-slider-init">\
                    <input type="range" name="lengthRange" id="lengthRange" min="0" max="100" value="50" step="0.001">\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
      '
    },
  },

  {
    path: '/mySkis/',
    url: './pages/mySkis.html',
    name: 'mySkis',
    on: {
        pageInit: function () {
          // do something on page init
          console.log(" ------ > page init in route.js for mySkis page with G_LOOKUP_TYPE="+G_LOOKUP_TYPE);

          G_LOOKUP_TYPE='addSki';

          getMySkis(thisUser.user_name);

          $$('.page #ul_mySkis_list').change(function() {
            var ski_id=$$("input[name='my-radio']:checked"). val();
            console.log('change current ski triggered with ski_id ' + ski_id);
            setCurrentSki(thisUser.user_name, ski_id);
          });

          $$(document).on('click', '#addSkiBtn', function () {
            //addSki();
            skiLookup();
          });

          $$(document).on('page:back', '.smart-select-page', function (e) {
          //myApp.on('pageInit', '.page[data-select-name="brand_add"]' => { // new V2 page init
              console.log('brands smart select initialized in addski ');

              $$('.smart-select #brand_select_id_add').change(getModels_add); // run getModels function
                $$('.page[data-select-name="brand_add"]').find(("input[type='radio']:checked")).prop('checked', false);
          });


        }
    }
  },

  {
    path: '/profile/',
    url: './pages/profile.html',
    name: 'profile',
    on: {
        pageAfterIn: function () {
          // do something on page init
          console.log(" ------ > pageAfterIn in route.js for profile page");


              init_profile();

              $$('#editProfileBtn').click(function() {
                toggleEditSave();
              });


                  $$('#profileMeasureId').click(function() {
                    var measureIDPopover=myApp.popover.create({
                      targetEl: '#'+$$(this).attr('id'),
                      content:'<div class="popover">'+
                                  '<div class="popover-inner">'+
                                    '<div class="content-block">'+
                                      '<p class="bold">Why offer this data?</p>' +
                                      '<p>How you measure your settings will be stored with each setting saved. If you change how you measure, change this profile.</p>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'});
                        measureIDPopover.open();
                  });



                  $$('#profileDemographicId').click(function() {
                    var DemographicIdPopover=myApp.popover.create({
                      targetEl: '#'+$$(this).attr('id'),
                      content:'<div class="popover">'+
                                  '<div class="popover-inner">'+
                                    '<div class="content-block">'+
                                      '<p class="bold">Why offer this data?</p>' +
                                      '<p>As the systems gathers more data, you will be able to view the averages of other users settings for your demographic.</p>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'});
                        DemographicIdPopover.open();
                  });

        }
    }
  },

  {
    path: '/lookup/',
    url: './pages/lookup/index.html',
    name: 'lookup',
    on: {
        pageInit: function () {
          // do something on page init
          console.log(" ------ > page init in route.js for lookup page with G_LOOKUP_TYPE="+G_LOOKUP_TYPE);

          G_LOOKUP_TYPE='findSki';


          if ( getLocalStorage('stockSkis') ) {
              getLocalSettings();
          } else { // show message on front page so user knows how to get started
            $$('<div class="center">Start by selecting the link below, then choose a ski brand, model, length and year (optional).<p>Save for quick access in the future.</div>').insertAfter('#indexTitle');
          }

          console.log('triggering getHowToMeasure function');
          var measureObj={}; // make object global
          getHowToMeasure();

        },
        pageAfterIn: function (e, page) {

          console.log("------> pageAfterIn fired for lookup in routes.js file.")

          //GET STOCK SETTINGS OF THE SELECTED SKI...this only runs when all 4 values are present to retrieve the data
          if (Object.getOwnPropertyNames(myApp.data.lookup).length==4) {
            getStockSettings();
          }

        }
      }
  },



{
  path: '/lookup/brands/',
  async(to, from, resolve, reject) {
    var logged_in=false;
    if (typeof thisUser !== 'undefined') logged_in=true;
    data={'ski_attr':'brands','logged_in':logged_in};
    myApp.request( {
    url: wsURL+'ws_ski_lookup_ret_json.php',
    dataType: 'json',
    data: data,
    method: "POST",
    crossDomain: true,
    statusCode: {
      404: function(xhr) {
        console.log('page not found');
      }
    },
    complete: function() {
    console.log('complete');
    },
    success: function(response) {
      console.log('success');
      console.log(response);
      resolve(
        {
        componentUrl: './pages/lookup/brand_list.html',
        },
        {
        context: {
          brand: response,
        },
        }
      );
    },
    error: function() {
    console.log('error');
    }
    });
  },
  on: {
    pageMounted: function (e, page) {
      console.log('-------> on.pageMounted EVENT called from router for BRANDS');
      console.log('-------> e is ' + e); thise=e;
      console.log('-------> page is ' + page); thispage=page;
      $$(".page-current .page-content ul li").on("click", function() {
        console.log("this value is is " + this.innerText); thisVal=this;
      });

      $$(".page-current").on('click', function() {
        console.log('clicked here');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });


    },
    pageInit: function (e, page) {
      console.log('-------> on.pageInit EVENT called from router for BRANDS');

      $$(".page-current").on('click', function() {
        console.log('clicked here pageInit');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    },
    pageAfterIn: function (e, page) {
      console.log('-------> on.pageAfterIn EVENT called from router for BRANDS');
      $$(".page-current").on('click', function() {
        console.log('clicked here afterIn');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    }
  }
},


{
  path: '/lookup/models/',
  async(to, from, resolve, reject) {
    console.log("myApp.data.lookup.skiBrand="+myApp.data.lookup.skiBrand);
    data={'ski_attr':'models','brand':myApp.data.lookup.skiBrand};
    myApp.request( {
    url: wsURL+'ws_ski_lookup_ret_json.php',
    dataType: 'json',
    data: data,
    method: "POST",
    crossDomain: true,
    statusCode: {
      404: function(xhr) {
        console.log('page not found');
      }
    },
    complete: function() {
    console.log('complete');
    },
    success: function(response) {
      console.log('success');
      console.log(response);
      resolve(
        {
        componentUrl: './pages/lookup/model_list.html',
        },
        {
        context: {
          model: response,
        },
        }
      );
    },
    error: function() {
    console.log('error');
    }
    });
  },
  on: {
    pageMounted: function (e, page) {
      console.log('-------> on.pageMounted EVENT called from router for MODELS');
      //console.log('-------> e is ' + e); thise=e;
      //console.log('-------> page is ' + page); thispage=page;
      $$(".page-current .page-content ul li").on("click", function() {
        console.log("this value is is " + this.innerText); thisVal=this;
      });

      $$(".page-current").on('click', function() {
        console.log('clicked here');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });


    },
    pageInit: function (e, page) {
      console.log('-------> on.pageInit EVENT called from router for BRANDS');
      $$(".page-current").on('click', function() {
        console.log('clicked here pageInit');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    },
    pageAfterIn: function (e, page) {
      console.log('-------> on.pageAfterIn EVENT called from router for BRANDS');
      $$(".page-current").on('click', function() {
        console.log('clicked here afterIn');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    }
  }
},






{
  path: '/lookup/length/',
  async(to, from, resolve, reject) {
    console.log("myApp.data.lookup.skiLength="+myApp.data.lookup.skiLength);
    data={'ski_attr':'lengths','brand':myApp.data.lookup.skiBrand,'model':myApp.data.lookup.skiModel};
    myApp.request( {
    url: wsURL+'ws_ski_lookup_ret_json.php',
    dataType: 'json',
    data: data,
    method: "POST",
    crossDomain: true,
    statusCode: {
      404: function(xhr) {
        console.log('page not found');
      }
    },
    complete: function() {
    console.log('complete');
    },
    success: function(response) {
      console.log('success');
      console.log(response);
      resolve(
        {
        componentUrl: './pages/lookup/length_list.html',
        },
        {
        context: {
          skiLength: response,
        },
        }
      );
    },
    error: function() {
    console.log('error');
    }
    });
  },
  on: {
    pageMounted: function (e, page) {
      console.log('-------> on.pageMounted EVENT called from router for LENGTH');
      //console.log('-------> e is ' + e); thise=e;
      //console.log('-------> page is ' + page); thispage=page;
      $$(".page-current .page-content ul li").on("click", function() {
        console.log("this value is " + this.innerText); thisVal=this;
      });

      $$(".page-current").on('click', function() {
        console.log('clicked here');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });


    },
    pageInit: function (e, page) {
      console.log('-------> on.pageInit EVENT called from router for LENGTH');
      $$(".page-current").on('click', function() {
        console.log('clicked here pageInit');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    },
    pageAfterIn: function (e, page) {
      console.log('-------> on.pageAfterIn EVENT called from router for LENGTH');
      $$(".page-current").on('click', function() {
        console.log('clicked here afterIn');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    }
  }
},




{
  path: '/lookup/year/',
  async(to, from, resolve, reject) {
    console.log("myApp.data.lookup.skiYear="+myApp.data.lookup.skiYear);
    data={'ski_attr':'years','brand':myApp.data.lookup.skiBrand,'model':myApp.data.lookup.skiModel};
    var hasYear; // to determine if the ski has a year value to show or not show year page
    myApp.request( {
    url: wsURL+'ws_ski_lookup_ret_json.php',
    dataType: 'json',
    data: data,
    method: "POST",
    crossDomain: true,
    statusCode: {
      404: function(xhr) {
        console.log('page not found');
      }
    },
    complete: function(xhr, status) {
    console.log('================> >   > complete lookup for year request with xhr='+xhr+' and status='+status);
    if (!hasYear) {
      routeSkiLookup();
    }
    //if (myApp.data.lookup.skiYear=='') {
    //  routeSkiLookup();
    //}
    },
    success: function(response) {
      console.log('success with response='+response);
      console.log('success with response[0]='+response[0]);
      console.log('response.length='+response.length);
      console.log('response[0].length='+response[0].length);

      if (response!='') {
        console.log('resolved this to year with data=' + response);
        hasYear=true;

        resolve(
          {
          componentUrl: './pages/lookup/year_list.html',
          },
          {
          context: {
            skiYear: response,
          },
          }
        );

    } else {
      hasYear=false;
      myApp.data.lookup.skiYear='';
      reject();
      }
    },
    error: function() {
    console.log('error');
    }
    });
  },
  on: {
    pageMounted: function (e, page) {
      console.log('-------> on.pageMounted EVENT called from router for YEAR');
      //console.log('-------> e is ' + e); thise=e;
      //console.log('-------> page is ' + page); thispage=page;
      $$(".page-current .page-content ul li").on("click", function() {
        console.log("this value is " + this.innerText); thisVal=this;
      });

      $$(".page-current").on('click', function() {
        console.log('clicked here');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });


    },
    pageInit: function (e, page) {
      console.log('-------> on.pageInit EVENT called from router for YEAR');
      $$(".page-current").on('click', function() {
        console.log('clicked here pageInit');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    },
    pageAfterIn: function (e, page) {
      console.log('-------> on.pageAfterIn EVENT called from router for YEAR');
      $$(".page-current").on('click', function() {
        console.log('clicked here afterIn');
      });

      $$(".page-current .page-content .list").on('click', function() {
        console.log('clicked here');
      });

    },
    pageBeforeIn: function (e, page) {
      console.log('*****************-------> on.pageBeforeIn EVENT called from router for YEAR');
      if (myApp.data.lookup.skiYear==null) {
        console.log('its null ***************');
        //routeSkiLookup();
      } else {
        console.log('its not null ***************');
      }

    }

  }
},


];
