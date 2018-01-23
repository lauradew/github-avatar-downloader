var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filepath) {
  request.get(url)
  .on('error', function (err) {
    console.log("Error, unspecified filepath");
  })
  .on('response', function (response) {
    console.log(response.statusMessage);
  })
  .pipe(fs.createWriteStream(filepath));
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  result.forEach(function(element) {
    console.log(element.avatar_url);
    downloadImageByURL(element.avatar_url, './avatars/' + element.login + ".jpg")
  })
});