module.exports.getDate = getDate;  //getDate function is exported to modules in which date.js is required

function getDate(){
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  var date = new Date();
  var formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

//module.exports is an object , it can have any number of properties and methods
//below part is just for illustrating a sophistication
module.exports.getDay = function(){
  var options = {
    weekday: 'long'
  };
  var date = new Date();
  return date.toLocaleDateString("en-US", options);
}
