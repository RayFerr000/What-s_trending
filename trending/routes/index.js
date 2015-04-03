var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var now = require('performance-now')
var async = require('async')
var asyncTasks = []

var api = new Object()
api['Youtube'] = new Object()
api['Instagram'] = new Object()


function youTube(callback){
  request('https://gdata.youtube.com/feeds/api/standardfeeds/US/most_popular?v=2&alt=json', function(e, r, body){
    json = JSON.parse(body)
    var popular_channels = []
    for(var key in json.feed.entry){
      if(json.feed.entry.hasOwnProperty(key)){
        channel = json.feed.entry[key].author
        popular_channels.push(channel[0].name['$t'])
        
      }
    }
    api['Youtube']['Most Viewed Channels'] = popular_channels
    
  })
}

function instaGram(callback){
  request('https://api.instagram.com/v1/media/popular?client_id=b1a391a91f074970bf29518a6de3101d', function (error, response, body) {
    json = JSON.parse(body);
    var popular_tags = [];
    
    for (var key in json.data){
      if (json.data.hasOwnProperty(key) && json.data[key]['tags'].length != 0){
        tag = json.data[key]['tags']
        var count = Object.keys(tag).length
        
        if (count < 1){
          popular_tags.push(tag[0])
        }
        else{
         
          for (var i = 0 ; i < count ; i++){
            popular_tags.push(tag[i])
          }
        }
      }
    }
    api['Instagram']['Popular Tags'] = popular_tags
    
  })
}

asyncTasks.push(youTube());
asyncTasks.push(instaGram());

router.get('/', function(req, res, next){
 
  
  async.parallel(asyncTasks);
  
  res.json(api);
})


/*router.get('/', function(req, res, next) {
  
  request('https://gdata.youtube.com/feeds/api/standardfeeds/US/most_popular?v=2&alt=json', function(e, r, body){
    json = JSON.parse(body);
    var popular_channels = [];
    for(var key in json.feed.entry){
      if(json.feed.entry.hasOwnProperty(key)){
        channel = json.feed.entry[key].author;
        popular_channels.push(channel[0].name['$t']);
        
      }
    }
    api['Youtube']['Most Viewed Channels'] = popular_channels;
    
  })
  request('https://api.instagram.com/v1/media/popular?client_id=b1a391a91f074970bf29518a6de3101d', function (error, response, body) {
  json = JSON.parse(body);
  var popular_tags = [];
  
  for (var key in json.data){
    if (json.data.hasOwnProperty(key) && json.data[key]['tags'].length != 0){
      tag = json.data[key]['tags'];
      var count = Object.keys(tag).length;
      
      if (count < 1){
        popular_tags.push(tag[0]);
      }
      else{
       
        for (var i = 0 ; i < count ; i++){
          popular_tags.push(tag[i]);
        }
      }
    }
  }
  api['Instagram']['Popular Tags'] = popular_tags;
    
  })
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
