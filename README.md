# @lskjames/qrcode-generate

[![npm (scoped)](https://img.shields.io/npm/v/@bamblehorse/tiny.svg)](https://www.npmjs.com/package/@lskjames/qrcode-generate)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@bamblehorse/tiny.svg)]https://www.npmjs.com/package/@lskjames/qrcode-generate)

Generate qrcodes into pdf files with customizable physical printed size and saving the QR code into mongodb database.
QR code generation modules used: https://www.npmjs.com/package/easyqrcodejs-nodejs
pdf generation module used: https://www.npmjs.com/package/pdfkit

## Install

```
$ npm install @lskjames/qrcode-generate
```

## Usage

```js
const genQR = require("@lskjames/qrcode-generate")
let data = {
        myurl: "https://testing.com.my",
        code: "1041020203"
}

/// generate single and to pdf
genQR.generateOne(data, "./temp", "./path.png", "pdf", 4, null, () => {
   console.log('done generate')
})

/// generate single but save to mongodb database
genQR.generateOne(data, "./temp", "./path.png", "toDB", 4, Store, () => {
  console.log('done generate')
})
let datas = [
  { 
    myurl: "https://testing.com.my",
    code: "1041020203"
  },
  { 
    myurl: "https://testing.com.my",
    code: "1041020213"
  },
  { 
    myurl: "https://testing.com.my",
    code: "1041020283"
  }
]
/// generate multiple qrcodes and print to pdf
genQR.generateMany(datas, "./pdfFolder", "./path.png", "pdf", 3, null, () => {
  console.log('done')
})
/// generate multiple qrcodes and save to mongodb database
genQR.generateMany(datas, "./pdfFolder", "./path.png", "toDB", 3, null, () => {
  console.log('done')
})

```
