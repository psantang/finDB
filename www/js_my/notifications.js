

// Called from deviceReady event
function initNotifications() {
  window.FirebasePlugin.hasPermission(function(data){
    if (data.isEnabled) {

      window.FirebasePlugin.getToken(function(token) {
          // save this server-side and use it to push notifications to this device
          console.log("getToken is " + token);
          saveFCMToken(token);
      }, function(error) {
          console.error(error);
      });

      // Get notified when a token is refreshed
      window.FirebasePlugin.onTokenRefresh(function(token) {
          // save this server-side and use it to push notifications to this device
          console.log("Refresh to get new token: " + token);
          saveFCMToken(token);
      }, function(error) {
          alert(error);
      });

    } else if (isIos){ // IOS only
      window.FirebasePlugin.grantPermission();
      console.log("Requesting IOS permission to receive notifications.");
    }

  });
}

function showNotifications() {
  // Get notified when the user opens a notification
  window.FirebasePlugin.onNotificationOpen(function(notification) {
      let title=notification.aps.alert.title;
      let msg=notification.aps.alert.body;
      console.log("Notification payload from cordova.plugin.firebase: " + JSON.stringify(notification));
      if (notification.score==850) {
        var fcmNotification = myApp.notification.create({
          icon: '<img src="../res/icon/ios/icon-40.png" width="24" height="24" />',
          title: title,
          titleRightText: 'now',
          subtitle: 'Notification',
          text: msg,
          closeButton: true,
          closeOnClick: true,
        });
        fcmNotification.open();

      } else {
        alert("The notification is open!");
      }
      window.FirebasePlugin.setBadgeNumber(0); // clear the badge after showing notifications
  }, function(error) {
      console.error(error);
  });
}

function saveFCMToken(token) {
  var url=wsURL+'ws_set_fcm_token_ret_json.php';
  var user_name = localStorage.user_name;
  if (typeof user_name != 'undefined') {
    var data={'user_name':user_name,'fcm_token':token}
    ajaxPostRequest (url, data, showNotifications);
  }
}
