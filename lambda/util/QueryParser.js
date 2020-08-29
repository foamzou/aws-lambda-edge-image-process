l = m => console.log(m);

const ALLOW_IMAGE_EXT = ['jpg', 'png', 'jpeg', 'webp'];
const ImageFilter = require('./ImageFilter');

const getExtByPath = (path) => {
    for (let ext of ALLOW_IMAGE_EXT) {
        if (path.endsWith(`.${ext}`)) {
            return ext.replace('jpeg', 'jpg');
        }
    }
    return false;
};

const parseUri = (uri) => {
    let match = uri.match(/@(?!.*@)(.[^?]*)/);
    if (!match || !match[1]) {
        return false;
    }

    // Parse path of origin image
    let originImagePath = uri.replace(match[0], '');
    let originImageExt = getExtByPath(originImagePath);
    if (!originImageExt) {
        l('originImagePath empty');
        return false;
    }
    l(originImageExt);
    l(originImagePath);

    match = match[1];

    // Parse target format ext
    let targetFormatExt = originImageExt;
    if (match.indexOf('.') !== -1) {
        let matchArr = match.split('.');
        let format = matchArr.pop();
        if (ALLOW_IMAGE_EXT.includes(format)) {
            targetFormatExt = format;
            match = matchArr.join('.'); // Remove the ext
        }
    }

    let filterMap = {};
    // Deal with params
    match.split('_').map(item => {
        let filterEntity = ImageFilter.parseFilterParam(item);
        if (filterEntity) {
            filterMap[filterEntity.name] = filterEntity.value;
        }
    });

    return {
        originImagePath,
        originImageExt,
        targetFormatExt,
        filterMap
    };
};

module.exports = {
    parseUri,
    getExtByPath
};
