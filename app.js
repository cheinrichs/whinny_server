var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var knex = require('./lib/knex.js');
var knex = require('./db/config')
var cors = require('cors');
var fs = require('fs');

var S3FS = require('s3fs');

var jwt = require('jsonwebtoken');


var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET;

var S3_GroupProfilePhotos = new S3FS('whinnyphotos/group_profile_photos', {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

var S3_PersonalProfilePhotos = new S3FS('whinnyphotos/profile_photos', {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

var S3_BroadcastMessagePhotos = new S3FS('whinnyphotos/broadcast_message_photos', {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

var S3_ChatMessagePhotos = new S3FS('whinnyphotos/chat_images', {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

var s3_GroupMessagePhotos = new S3FS('whinnyphotos/group_chat_images', {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());

// Set user object on request
app.use(function(req, res, next){

  var token = req.headers.authentication;
  if(token){
    try {
      var decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
      console.log(e);
      return res.status(401).send({errors: ["Invalid token"]})
    }
    console.log(decoded);
    knex('users').where({id: decoded.userId}).first().then(function(user){
      delete user.password;
      req.user = user;
      next();
    }).catch(function(err){
      console.log(err);
      next();
    })
  }else{
    next();
  }
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multipartyMiddleware);


app.post('/chatMessageUpload', function (req, res, next) {
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  return S3_ChatMessagePhotos.writeFile(file.originalFilename, stream).then(function () {
    fs.unlink(file.path, function (err) {
      if(err) console.err(err);
      res.json({ chatMessageUpload: "Success" });
    })
  })
})

app.post('/groupMessageUpload', function (req, res, next) {
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  return s3_GroupMessagePhotos.writeFile(file.originalFilename, stream).then(function () {
    fs.unlink(file.path, function (err) {
      if(err) console.err(err);
      res.json({ groupMessageUpload: "Success" });
    })
  })
})

app.post('/personalProfilePhotoUpload', function (req, res, next) {

  var file = req.files.file;

  S3_PersonalProfilePhotos.unlink(file.originalFilename).then(function () {

    var stream = fs.createReadStream(file.path);

    return S3_PersonalProfilePhotos.writeFile(file.originalFilename, stream).then(function () {

      fs.unlink(file.path, function (err) {
        if(err){
          console.err(err);
          res.json({ personalProfilePhotoUpload: "Failed" })
        } else {
          console.log("success?");
          res.json({ personalProfilePhotoUpload: "Success" });
        }
      })
    })
  })
})

app.post('/groupProfilePhotoUpload', function (req, res, next) {
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  return S3_GroupProfilePhotos.writeFile(file.originalFilename, stream).then(function () {
    fs.unlink(file.path, function (err) {
      if(err) console.err(err);
      res.json({success: true})
    })
  })
})

app.post('/website/uploadBroadcastImage', function (req, res, next) {
  console.log(req.body);
  if(!req.body.newMessageId) res.json({ error: "No newMessageId given"})
  //TODO error handling for no given photo?

  var newFileName = 'broadcast_message_photo_' + req.body.newMessageId;

  if(req.files.file[0].type === 'image/png'){
    newFileName += '.png';
  } else if(req.files.file[0].type === 'image/jpg'){
    newFileName += '.jpg';
  } else if(req.files.file[0].type === 'image/jpeg'){
    newFileName += '.jpeg';
  } else {
    res.json({error: "Incorrect filetype provided"});
  }


  var file = req.files.file[0];
  var stream = fs.createReadStream(file.path);

  return S3_BroadcastMessagePhotos.writeFile(newFileName, stream).then(function () {
    fs.unlink(file.path, function (err) {
      if(err) console.err(err);
      res.json({success: true})
    })
  })
})

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
