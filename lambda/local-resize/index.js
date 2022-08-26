// native node modules
const https = require('https');
const fs = require('fs');
const path = require('path');

// yargs cmd line helpers
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

// lambda functions
const ImageLib = require('../util/ImageLib');
const QueryParser = require('../util/QueryParser');
const ALLOW_IMAGE_EXT = ['jpg', 'png', 'jpeg', 'webp'];

// script args
const defaultImgs = {
    landscape: 'https://d113q3lewv5kc2.cloudfront.net/images/Charleston-IN-Steadfast.jpg',
    portrait: 'https://d113q3lewv5kc2.cloudfront.net/images/IMG_1682_(1).jpg'
}
const imgUrl = argv.imgUrl || defaultImgs[argv.orientation] || defaultImgs.portrait;
const format = argv.format || '@600w_400h.webp';

// global vars
const subdir = `${__dirname}/images`;
const imgProperties = (() => {
    const splitUrl = imgUrl.split('/');
    const lastEl = splitUrl[splitUrl.length - 1];
    const extension = ALLOW_IMAGE_EXT.find((ext) => lastEl.includes(ext));
    const indexEnd = lastEl.indexOf('.');
    const name = lastEl.substring(0, indexEnd);

    return {
        name,
        extension,
        fullName: `${name}.${extension}`
    }
})();

// run resizer
resizeImage(imgUrl);

async function resizeImage(imgUrl) {
    // dowload/read original image
    const imgPath = await downloadImage(imgUrl);
    const imgBuffer = fs.readFileSync(imgPath);

    // resize image
    console.log('Resizing image');
    console.log(`isBuffer: ${imgBuffer instanceof Buffer}`);
    const sanitizedUri = (() => {
        // removes any url garbage after file extension
        const indexEnd = imgUrl.indexOf(imgProperties.fullName) + imgProperties.fullName.length;
        return imgUrl.substring(0, indexEnd) + format;
    })();
    const { targetFormatExt, filterMap } = QueryParser.parseUri(sanitizedUri);
    const resizedBuffer = await ImageLib.adjustImage(imgBuffer, targetFormatExt, filterMap);

    // save resized image under new name
    let resizedName = `${imgProperties.name}${format}`;
    if(!resizedName.includes('.')) {
        resizedName += `.${imgProperties.extension}`;
    }
    const resizedPath = path.resolve(subdir, resizedName);
    fs.writeFileSync(resizedPath, resizedBuffer);
    console.log('Resize Complete');
}

async function downloadImage (imgUrl) {
    return new Promise((resolve) => {
        const savePath = path.resolve(subdir, imgProperties.fullName);

        // skip download if file already exists
        if(fs.existsSync(savePath)) {
            console.log('Image already downloaded')
            return resolve(savePath);
        }

        // create /images subdir if needed
        if(!fs.existsSync(subdir)) {
            fs.mkdirSync(subdir);
        }

        // download file
        console.log('Downloading image');
        const file = fs.createWriteStream(savePath);
        https.get(imgUrl, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                console.log("Download Complete");
                file.close();
                return resolve(savePath);
            });
        });
    });
};