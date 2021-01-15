const Sharp = require('sharp');

const initOption = (option) => {
    option.w = option.w || 0;
    option.h = option.h || 0;
    option.e = option.e || 0;
    option.l = option.l || 0;
    option.p = option.p || 100;
    option.q = option.q || 80;
    option.r = option.r || 0;
};

const resize = (sharp, option, originImageMeta) => {
    let resizeOption = {
        width: null,
        height: null,
    };

    // Both of width and height has been specified
    if (option.w && option.h) {
        if (option.e === 0) { // Keep the aspect ratio, base on long side
            if (originImageMeta.width > originImageMeta.height) {
                option.h = 0;
            } else {
                option.w = 0;
            }
        } else if (option.e === 1) { // Keep the aspect ratio, base on short side
            if (originImageMeta.width > originImageMeta.height) {
                option.w = 0;
            } else {
                option.h = 0;
            }
        } else if (option.e === 2) { // Force resize with width and height
            resizeOption.fit = 'fill'; // ignore the aspect ratio, and fill the image to input size
        }
        resizeOption.width = option.w || null;
        resizeOption.height = option.h || null;
    } else {
        if (option.w) {
            resizeOption = {width: option.w};
        }
        if (option.h) {
            resizeOption = {height: option.h};
        }
    }

    // Size percent
    if (option.p !== 100) {
        if (resizeOption.width) {
            resizeOption.width = parseInt(resizeOption.width * option.p / 100);
        }
        if (resizeOption.height) {
            resizeOption.height = parseInt(resizeOption.height * option.p / 100);
        }
        if (!resizeOption.width && !resizeOption.height) {
            resizeOption.width = parseInt(originImageMeta.width * option.p / 100);
            resizeOption.height = parseInt(originImageMeta.height * option.p / 100);
        }
    }

    // Whether to process if the target thumbnail is larger than the original image.1: no processing; 0: will processing. Default 0
    if (option.l === 1 && resizeOption.width && resizeOption.height) {
        if (resizeOption.width * resizeOption.height > originImageMeta.height * originImageMeta.width) {
            resizeOption = {};
        }
    }

    // When the total area exceeds 4096px * 4096px, or the length of one side exceeds 4096px * 4, the image will not be scaled
    if (resizeOption.width && resizeOption.height) {
        if (resizeOption.width * resizeOption.height > 4096 * 4096) {
            resizeOption = {};
        }
    } else if (resizeOption.width > 4096*4) {
        resizeOption = {};
    } else if (resizeOption.height > 4096*4) {
        resizeOption = {};
    }

    console.log(`resize option: ${JSON.stringify(resizeOption)}`);

    if (resizeOption.width || resizeOption.height) {
        sharp.resize(resizeOption).withMetadata(); // https://sharp.pixelplumbing.com/api-resize
    }
};

const format = (sharp, toFormat, option) => {
    let formatOption = {quality: option.q};
    if (toFormat === 'jpg' && option.r === 1) {
        console.log('use progressive jpeg')
        formatOption.progressive = true;
        formatOption.chromaSubsampling = '4:2:0';
    }
    sharp.toFormat(toFormat, formatOption);
};

const adjustImage = async (imageBuffer, toFormat, option) => {
    initOption(option)
    console.log(`init option: ${JSON.stringify(option)}`)
    const sharp = new Sharp(imageBuffer);

    // Resize
    let originImageMeta = await sharp.metadata(); // {width, height, format ...}
    resize(sharp, option, originImageMeta);

    // Output format & quality
    format(sharp, toFormat, option);

    return await sharp.toBuffer();
};

module.exports = {
    adjustImage
};
