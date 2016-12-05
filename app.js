var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');

var fs = require('fs');
var S3FS = require('s3fs');

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

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());

// view engine setup
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
  res.json({ todo: true });
})

app.post('/groupMessageUpload', function (req, res, next) {
  res.json({ todo: true });
})

app.post('/personalProfilePhotoUpload', function (req, res, next) {
  console.log("personal file upload");
  console.log(req);
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  return S3_PersonalProfilePhotos.writeFile(file.originalFilename, stream).then(function () {
    fs.unlink(file.path, function (err) {
      if(err) console.err(err);
      console.log("uploaded photo");
      console.log(file.originalFilename);
      var index;
      for(var i = 0; i < file.originalFilename; i++){
        if(fileName[i] === "_"){
          index = i;
        }
      }
      var user_id = fileName.substring(0,index);
      console.log(user_id);
      res.json({ success: true, filePath: file.path })
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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
