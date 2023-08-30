function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function uniqueID() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}


module.exports = {slugify, uniqueID}