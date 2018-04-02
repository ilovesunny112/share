const db = require('../../db/config.js');
const express = require('express');
const router = express.Router();
const util = require('util');
const formidable = require('formidable');
const sd = require("silly-datetime");
const path = require("path");
const fs = require('fs');
const config = require('../../config');
const client = require('scp2');



const NumTurnWord = (rule, id) => {
	for(var key in rule) {
		if(id == key) {
			return rule[key];
		}
	}
}


router.get('/edit', (req, res) => {
		res.render('rules/index', {title: '分享规则_分享系统', isActive: 1})
})

router.post('/save', (req, res) => {
  fs.writeFile('test/index.txt', req.body.text, (err) => {
    if(err) {
      res.json({code:0, message: '写入失败'});
      throw err
    };
    console.log('写入成功');
    res.json({code:0, message: '写入成功'});
  })
})


router.get('/build', (req, res) => {
  fs.unlink('uploads/share.js', ()=> {
    console.log("删除成功");
  })
	var ruleStr = ';var sqlData = [';
	db.dbSelect('select * from sharetable',(result) => {
		for (var i = 0; i < result.length; i++) {
			ruleStr += "{";
			for(var key in result[i]) {
				if(result[i][key] == null) {
					ruleStr += '"' + key + '":' + result[i][key]+',';
				}else {
					ruleStr += '"' + key + '":"' + result[i][key]+'",';
				}
			}
			ruleStr += "},";
		}
		ruleStr += "]";


    fs.readFile('test/index.txt','utf-8', function(err,data){ 
      if(err){ 
          console.log(err); 
      }
      fs.writeFile('uploads/share.js', ruleStr + data, function (err) {
        if (err) throw err;
        console.log('写入数据成功');
        res.send({code: 0, message: '生成成功'});
      });
    })
	})
})


router.get('/release', (req, res) => {
    client.scp('uploads/**', {
      host: '47.93.36.138',
      username: 'root',
      password: '^shaoqingyu$0906',
      path: '/home/www/uploads/'
    }, function(err) {
      if(err) {
        throw err;
      } else {
        res.json({code: 0, data: {}, message: 'SUCCESS'})
      }
    });
})

    /*host: 'lanfile.caixin.com',
      username: 'shaoqingyu92',
      password: 'ksldj(skdld2',*/
module.exports = router;