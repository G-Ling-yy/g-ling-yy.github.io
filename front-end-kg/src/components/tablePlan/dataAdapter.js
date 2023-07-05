/**
 * totalRoot default = datas>totalSize
 * pageSizeRoot default = datas>pageSize
 * pageNumberRoot default = datas>pageNumber
 * root default = datas>rows
 */

import service from '@/services/service';

let defaultConfig = {
    totalRoot: 'data>totalSize',
    pageSizeName: 'size',
    pageNumberName: 'current',
    root: 'data>records'
};

function adapter(options) {
    options = _.assign({}, defaultConfig, options);
    this.load = (pageSize, pageNumber, params, pageable, headers) => {
        let config = {};

        if (pageable) {
            config[options.pageSizeName] = pageSize;
            config[options.pageNumberName] = pageNumber;
        }

        let method = options.method ? options.method : 'get';

        return service[method](options.url, _.assign(config, params), headers).then(res => {
            let result = {
                total:
                    options.totalRoot.indexOf('>') !== -1
                        ? pickData(res, options.totalRoot)
                        : _.get(res, options.totalRoot),
                list: (options.root.indexOf('>') !== -1 ? pickData(res, options.root) : _.get(res, options.root)) || [],
                pageSize: pageSize,
                pageNumber: pageNumber,
                original: res
            };

            return result;
        });
    };
}

function pickData(data, root) {
    return _.get(data, root.replace(/>/g, '.'));
    /* var tempValue = data
    var rootArray = root.split('>')
    rootArray.forEach(function (item) {
        if (!tempValue || tempValue[item] === undefined) {
            return false
        }
        tempValue = tempValue[item]
    })
    return tempValue */
}

export default adapter;
