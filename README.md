# express 下载文件示例

## 下载文件示例

[下载文件示例](routes/index.js)中，指向download路径的为下载文件的示例

## 断点续传示例

[下载文件之断点续传示例](routes/index.js)中，指向transfer路径的为断点续传的示例

## 运行示例

> 克隆该库

```bash
git clone https://github.com/keyarea/Nodejs-download-demo.git
```

> 安装依赖

```bash
npm i
```

> 运行服务器

```bash
npm run start
```

> 下载文件

> 注意：现已移除`王五.mp4`文件，请自行将任意大文件拷贝至`public`文件夹下，进行测试，只需将`王五.mp4`替换为你的文件名。

在chrome浏览器中输入`localhost:3000/download/王五.mp4`测试下载文件的功能。

在chrome浏览器中输入`localhost:3000/transfer/王五.mp4`测试断点续传的功能。
