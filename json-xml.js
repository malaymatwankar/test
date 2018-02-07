function objectToXml(obj) {
  var xml = '';

  for (var prop in obj) {
    if (!obj.hasOwnProperty(prop)) {
      continue;
    }
    if (obj[prop] == undefined)
      continue;
    if (typeof obj[prop] == "object" && obj[prop].constructor !== Array) {
      xml += objectToXml(new Object(obj[prop]));
    } else if (obj[prop].constructor === Array) {
      obj[prop].map(function(elem) {
        var json = {
          [prop]: elem
        }
        if (typeof elem === "object") {
          xml += "<" + prop + ">";
          xml += objectToXml(json);
          xml += "</" + prop + ">";
        } else {
          xml += objectToXml(json);
        }
      });
    } else {
      xml += "<" + prop + ">";
      xml += obj[prop];
      xml += "</" + prop + ">";
    }
  }

  return xml;
}


var jsonObj = {
  "name": "Malay",
  "id": 123,
  "contact": [
    "12345656",
    "12354968"
  ],
  "addressDet": [{
      "office": "asdsc",
      "phone": "123546"
    },
    {
      "office": "dsadf",
      "phone": "143546"
    }
  ]
};
var xml = objectToXml(jsonObj);
console.log("XML:: " + xml);
