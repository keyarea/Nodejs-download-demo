var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const PUBLIC_PATH = path.resolve(__dirname, '../public');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 文件的下载
router.get('/download/:path', function(req, res, next) {
  // 获取参数
  let filePath = req.params.path;
  // 拼接文件的绝对路径
  let downloadPath = path.resolve(PUBLIC_PATH, filePath);

  // 得到文件名
  let {base: fileName} = path.parse(downloadPath);

  // 文件的信息
  let stat;
  try{
    // 通过fs模块获取文件的信息，报错就代表着不存在该文件
    stat = fs.statSync(downloadPath);
  }catch(error) {
    // 不存在该文件
    return res.status(404).end();
  }

  // 获取文件的大小
  let {size: total} = stat;
  // 设置响应头信息，指示内容应该被下载
  res.setHeader("Content-Disposition", "attachment; filename="+ encodeURIComponent(fileName));

  // 说明了实体主体内对象的媒体类型，这是一个二进制文件类型
  res.setHeader("Content-Type", "application/octet-stream");

  // 响应状态为200
  res.status(200);

  // 通过fs模块创建二进制流，并将其二进制流推送到响应主体中
  fs.createReadStream(downloadPath).pipe(res);
});


// 文件下载之断点续传
router.get("/transfer/:path", function(req, res, next) {
  // 获取参数
  let filePath = req.params.path;
  // 拼接文件的绝对路径
  let downloadPath = path.resolve(PUBLIC_PATH, filePath);

  // 得到文件名
  let {base: fileName} = path.parse(downloadPath);

  // 文件的信息
  let stat;
  try{
    // 通过fs模块获取文件的信息，报错就代表着不存在该文件
    stat = fs.statSync(downloadPath);
  }catch(error) {
    // 不存在该文件
    return res.status(404).end();
  }

  // 获取文件的大小
  let {size: total} = stat;

  // 获取请求头部信息
  let range = req.get("range");

  // 如果包含该头部
  if(range) {
    // 获取范围请求的开始和结束位置
    let [, start, end] = range.match(/(\d*)-(\d*)/);

    // 处理请求头中范围参数不传的问题
    start = start ? parseInt(start) : 0;
    end = end ? parseInt(end) : total - 1;

    // 如果范围是合理的，服务器会返回所请求的部分内容，并带上 206 Partial Content 状态码. 当前内容的范围会在 Content-Range 消息头中申明。
    res.status(206);

    // 服务器告诉浏览器，该内容可以使用 Accept-Ranges 消息头进行分部分请求。
    res.setHeader("Accept-Ranges", "bytes");
    // 当前内容的范围会在 Content-Range 消息头中申明。
    res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
    // 以二进制流进行文件的传输
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename=' + encodeURIComponent(fileName));
    res.setHeader("Content-Length", total);

    fs.createReadStream(downloadPath, { start, end }).pipe(res);
  }else {
    res.status(200);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename=' + encodeURIComponent(fileName));
    res.setHeader("Content-Length", total);

    fs.createReadStream(downloadPath).pipe(res);
  }


})


module.exports = router;
