const name = document.getElementById('text');

name.innerText = 1;

navigator.permissions.query({name:'geolocation'}).then(function(result) {
  if (result.state === 'granted') {
    // showLocalNewsWithGeolocation();
  } else if (result.state === 'prompt') {
    // showButtonToEnableLocalNews();
  }
  // Don't do anything if the permission was denied.
});