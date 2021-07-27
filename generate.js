const async = require('async');
const PDFDocument = require('pdfkit');
const fs = require('fs')
const QRCode = require('easyqrcodejs-nodejs');
const childProcess = require('child_process');


const generateMany = (datas, folderPath,logoPath, savingType, pdfsize, dbtoSave, callback) => {
	async.forEach(datas, (data, cbdata) => {
		console.log(data)
		convertMYQR(data.myurl, data.code, folderPath, logoPath, savingType, pdfsize, dbtoSave, () => {
			cbdata()
		})
	})
	callback()
}

const generateOne = (data, folderPath, logoPath, savingType, pdfsize, dbtoSave, callback) => {
	convertMYQR(data.myurl, data.code, folderPath, logoPath, savingType, pdfsize, dbtoSave)
}

function convertMYQR(url, code, folderPath, logoPath, savingType, pdfsize, dbtoSave, callback) {
 	const outletOptions = {
        text : url, //title : "For Retailer",
        title : code,
        width: 800,
        height: 800,
        titleFont : "bold 40px Arial",
        quietZone : 10,
        titleHeight : 52,
        titleTop : 32,
        correctLevel : QRCode.CorrectLevel.H,
        // dotScale : 1,
        logo : logoPath,
        logoWidth : 200,
        logoHeight : 200,
        logoBackgroundColor : "transparent",
        logoBackgroundTransparent : true
    };
    var mycode = code.replace(/[^A-Za-z0-9]/g, "")
    var myname = code.replace(/[^A-Za-z0-9]/g, "_")
	var myres = new QRCode(outletOptions);
	let tempFolder = './temp'
	if(savingType == "pdf") {
		if (!fs.existsSync(tempFolder)) {
			childProcess.exec('mkdir '+tempFolder, function(err, stdout, stderr){
			    if (err) {
			            console.error(err);
			            //return res.status(500).send('Internal Server Error');
			    }
			    console.log("Create image folder")
			    //return res.status(200).send('OK');
			    if (!fs.existsSync(folderPath)) {
			    	childProcess.exec('mkdir '+folderPath, function(err, stdout, stderr){
					    if (err) {
					            console.error(err);
					            //return res.status(500).send('Internal Server Error');
					    }
					    console.log("Create image folder")
					    myres.saveImage({path: tempFolder+'/'+myname+'.png'}).then(data => {
							// console.log(data)
							console.log("saved")
							//// 1inch = 72 points
							let points = pdfsize * 72
							const doc = new PDFDocument({
					  			size: [points, points]});
							doc.image(tempFolder+'/'+myname+'.png', 0,0, {width: points, height: points})
							doc.pipe(fs.createWriteStream(folderPath+'/'+myname+'.pdf'));
							doc.end();
							callback()
						});
					})
				} else {
					 myres.saveImage({path: tempFolder+'/'+myname+'.png'}).then(data => {
						// console.log(data)
						console.log("saved")
						//// 1inch = 72 points
						let points = pdfsize * 72
						const doc = new PDFDocument({
				  			size: [points, points]});
						doc.image(tempFolder+'/'+myname+'.png', 0,0, {width: points, height: points})
						doc.pipe(fs.createWriteStream(folderPath+'/'+myname+'.pdf'));
						doc.end();
						callback()
					});
				}
			});
		} else {
			if (!fs.existsSync(folderPath)) {
		    	childProcess.exec('mkdir '+folderPath, function(err, stdout, stderr){
				    if (err) {
				            console.error(err);
				            //return res.status(500).send('Internal Server Error');
				    }
				    console.log("Create image folder")
				    myres.saveImage({path: tempFolder+'/'+myname+'.png'}).then(data => {
						// console.log(data)
						console.log("saved")
						//// 1inch = 72 points
						let points = pdfsize * 72
						const doc = new PDFDocument({
				  			size: [points, points]});
						doc.image(tempFolder+'/'+myname+'.png', 0,0, {width: points, height: points})
						doc.pipe(fs.createWriteStream(folderPath+'/'+myname+'.pdf'));
						doc.end();
						callback()
					});
				})
			} else {
				 myres.saveImage({path: tempFolder+'/'+myname+'.png'}).then(data => {
					// console.log(data)
					console.log("saved")
					//// 1inch = 72 points
					let points = pdfsize * 72
					const doc = new PDFDocument({
			  			size: [points, points]});
					doc.image(tempFolder+'/'+myname+'.png', 0,0, {width: points, height: points})
					doc.pipe(fs.createWriteStream(folderPath+'/'+myname+'.pdf'));
					doc.end();
					callback()
				});
			}
		}
	} else if(savingType == "toDB") {
		myres.toDataURL().then(data=>{
			console.log(data)
			 dbtoSave.findOneAndUpdate({code: code}, {qrcodes: data}, {new: true, upsert: true}, (err, store) => {
			  	if (err) {
			  		console.log(err)
			  	} else {
			  		console.log(store)
			  		console.log("updated store database")
			  		callback()
			  	}
			 })
		})
	}
		
}

module.exports = {
    generateMany,
    generateOne
};