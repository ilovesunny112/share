const db = require('../db/config.js');
const express = require('express');
const router = express.Router();
const util = require('util');
const formidable = require('formidable');
const sd = require("silly-datetime");
const path = require("path");
const fs = require('fs');
const config = require('../config');
const client = require('scp2');



const NumTurnWord = (rule, id) => {
	for(var key in rule) {
		if(id == key) {
			return rule[key];
		}
	}
}



router.get('/', function(req, res){
    var sql = "select * from sharetable";
    if(req.query.q) {
      sql = "select * from sharetable where srcinfoid="+ req.query.q + " or ditch= "+ req.query.q + " or topic= "+ req.query.q+";";
    }
    console.log(sql);
     db.dbSelect(sql,(result) => {
     	for (var i = 0; i < result.length; i++) {
     		for(var key in result[i]) {
     			switch(key) {
     				case "type":
     					result[i]['type'] = NumTurnWord(global.shareType, result[i]['type']);
     					break;
     				case "planform":
     					result[i]['planform'] = NumTurnWord(global.sharePlatform, result[i]['planform']);
     					break;
     				case "red":
     					result[i]['red'] = NumTurnWord(global.isShareRed, result[i]['red']);
     					break;
     				case "device":
     					result[i]['device'] = NumTurnWord(global.device, result[i]['device']);
     					break;
     				case "media":
     					result[i]['media'] = NumTurnWord(global.shareMedia, result[i]['media']);
     					break;
     				case "channel":
     					result[i]['channel'] = NumTurnWord(global.shareChannle, result[i]['channel']);
     					break;
     			}
			}
     	}
     	//console.log(result)
        res.render('index', {result: result, title: '分享系统'})
     })
});

router.all('/profile', function (req, res) {
   var result = {};
   var form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "uploads/";
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制    
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
      var t = sd.format(new Date(),'YYYYMMDDHHmmss');
      //生成随机数
      var ran = parseInt(Math.random() * 8999 +10000);
      //拿到扩展名
      var extname = path.extname(files.upload.name);
      //旧的路径
      var oldpath = __dirname + "/../" + files.upload.path;
      //新的路径
      //var newpath = __dirname + '/../uploads/'+files.upload.name;
      var newpath = __dirname + '/../uploads/share_'+ t +　extname;

      var updateSqlStr = "";
	    for(var key in fields) {
      	updateSqlStr += key + "='" + fields[key] + "',";
      }
      if(files.upload.name == "") {
        console.log(oldpath)
        var sqlstr = "UPDATE sharetable set "+ updateSqlStr.slice(0, updateSqlStr.length-1) + " where id = '"+ fields['id'] +"'";
        db.dbUpdate(sqlstr, ()=> {
          fs.unlink(oldpath, ()=> {
            console.log("删除成功");
          })
          res.redirect('/');
          return;
          res.json({code: 0, message: '保存成功', data:{result: result} });
        })
        return false;
      }else {
      	fs.rename(oldpath,newpath,function (err) {
      		  console.log(err);
            if(err){
                throw  Error("改名失败");
            }
            //result['imgurl'] = '/uploads/'+files.upload.name;
            result['imgurl'] = '/uploads/share_'+ t +　extname;
        	  var sqlstr = "UPDATE sharetable set imgurl = '"+ result['imgurl'] + "'," + updateSqlStr.slice(0, updateSqlStr.length-1) + " where id = '"+ fields['id'] +"'";
            db.dbInsert(sqlstr, ()=> {
              fs.unlink(oldpath, ()=> {
                console.log("删除成功");
              })
              res.redirect('/');
              return;
              res.json({code: 0, message: '保存成功', data:{result: result} });
            })
      	});
      }

    });
})

router.all('/save', function (req, res) {
   var result = {};
   var form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "uploads/";
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制    
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
      var valStr = "";
      for(var key in fields) {
      	if(key != "id"){
      		valStr += "'"+fields[key]+"',"
      		result[key] = fields[key];
      	}
      }
      var sqlstr = "INSERT INTO sharetable ("+ Object.keys(fields).join(',') +") values ("+ valStr.slice(0,valStr.length-1) +");";
      console.log(sqlstr)

      var t = sd.format(new Date(),'YYYYMMDDHHmmss');
      //生成随机数
      var ran = parseInt(Math.random() * 8999 +10000);
      //拿到扩展名
      var extname = path.extname(files.upload.name);
      //旧的路径
      var oldpath = __dirname + "/../" + files.upload.path;
      //新的路径
      //var newpath = __dirname + '/../uploads/'+files.upload.name;
      var newpath = __dirname + '/../uploads/share_'+ t +　extname;
      
      if(files.upload.name == "") {
        console.log(sqlstr);
        var sqlstr = "INSERT INTO sharetable ("+ Object.keys(fields).join(',') +") values ("+ valStr.slice(0,valStr.length-1) +");";
        db.dbUpdate(sqlstr, ()=> {
          fs.unlink(oldpath, ()=> {
            console.log("删除成功");
          })
          res.redirect('/');
          return;
          res.json({code: 0, message: '保存成功', data:{result: result} });
        })
        return false;
      }else {
      	fs.rename(oldpath,newpath,function (err) {
      		console.log(err);
            if(err){
                throw  Error("改名失败");
            }
            //result['imgurl'] = '/uploads/'+files.upload.name;
            result['imgurl'] = '/uploads/share_'+ t +　extname;
            console.log(sqlstr);
            var sqlstr = "INSERT INTO sharetable ("+ Object.keys(fields).join(',') +",imgurl) values ("+ valStr +"'" + result['imgurl']  + "');";
            db.dbInsert(sqlstr, ()=> {
              fs.unlink(oldpath, ()=> {
                console.log("删除成功");
              })
              res.redirect('/');
              return;
              res.json({code: 0, message: '保存成功', data:{result: result} });
            })
      	});
      }
    });
})

router.get('/add', function(req, res){
   res.render('add', {result:[{
      srcinfoid: "",
      title: "",
      des: "",
      url: "",
      imgurl: "",
      type: "",
      device: "",
      planform: "",
      red: "",
      channel: "",
      media: ""
   }], title: '添加分享_分享系统'})
});


router.get('/about', (req, res) => {
  res.render('about', {title: '关于系统_分享系统',isActive:3})
})

router.get('/doc', (req, res) => {
  res.render('doc', {title: '关于系统_分享系统',isActive:2})
})


/*srcinfoid 文章id
title     分享标题
des       分享描述
url       分享地址
imgurl    分享logo
type      分享类型
device    分享设备
planform  分享平台
red       是否红包分享
channel   渠道
media     媒体来源 */


router.get('/del/:id', function(req, res){
    db.dbDelete('delete from sharetable where id='+req.params.id, () => {
      res.redirect('/');
      return;
    })
//   res.json({data: 0})
});

router.get('/edit/:id', function(req, res){
   db.dbSelect('select * from sharetable where id='+req.params.id, (data) => {
      if(data.length>0) {
        res.render('add', {result: data, title: '编辑分享_分享系统'})
      }
   })
});

module.exports = router;
