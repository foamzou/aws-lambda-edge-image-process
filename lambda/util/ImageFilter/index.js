const SUPPORT_FILTER_NAME = ['w', 'h', 'e', 'l', 'p', 'q', 'r'];

const parseFilterParam = (param) => {
    if (!param) {
        return false;
    }
    let filterName = param[param.length - 1];
    if (!SUPPORT_FILTER_NAME.includes(filterName)) {
        return false;
    }
    let filterValue = param.slice(0, -1);

    let filterEntity = {
        name: filterName,
        value: filterValue,
    };

    if (checkValueValidAndOptimizeEntity(filterEntity)) {
        return filterEntity;
    }

    return false;
};

const checkValueValidAndOptimizeEntity = (filterEntity) => {
    filterEntity.value = parseInt(filterEntity.value);
    switch (filterEntity.name) {
        case 'w':
        case 'h':
            return filterEntity.value >= 1 && filterEntity.value <= 4096;
        case 'e':
            return [0, 1, 2].includes(filterEntity.value);
        case 'l':
        case 'r':
            return [0, 1].includes(filterEntity.value);
        case 'p':
            return filterEntity.value >= 1 && filterEntity.value <= 1000;
        case 'q':
            return filterEntity.value >= 1 && filterEntity.value <= 100;
    }
    return false;
};

module.exports = {
    parseFilterParam,
};
