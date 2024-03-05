
console.log(json);

let d = new Date();
      document.body.innerHTML = "<h1>Today's date is " + d + "</h1>"

var jsonlocal = '{"id": 1,"name": "Asef"},{"id": 2,"name": "Bsef"}';

var jsonremote = JSON.parse("https://raw.githubusercontent.com/pantaire/mano/main/mano.json")
var json = JSON.parse(jsonlocal);
var jsontest = JSON.parse("[1, 2, 3, 4,]");


console.log("loaded json:" + json);

/* 
fetch('./mano.json')
    .then((response) => response.json())
    .then((json) => console.log(json)); */
