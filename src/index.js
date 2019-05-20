
let Store;
if (typeof window !== 'undefined' && window.localStorage) {
    // navigator
    Store = {
        write: (file, data) => {
            return localStorage.setItem(file, JSON.stringify(data));
        },
        read: (file) => {
            return JSON.parse(localStorage.getItem(file));
        },
        exists: (file) => {
            return localStorage.getItem(file) !== null;
        }
    }
} else {
    //  node
    let fs = require('fs');
    Store = {
        write: (file, data) => {
            return fs.writeFileSync(file, JSON.stringify(data));
        },
        read: (file) => {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        },
        exists: (file) => {
            return fs.existsSync(file);
        }
    }
}

let isNeedHandler = function( value ){
    return Boolean(value) && ['Object', 'Array'].indexOf(value.constructor.name) > -1;
}


let ProxyDb = function (file = 'ProxyDb.json', data = {}, isLazy = true) {
    let handler, getProxyObject, lazyWrite, timeId = 0;

    lazyWrite = (file, data) => {
        if (timeId) {
            clearTimeout(timeId);
        }
        timeId = setTimeout(() => {
            Store.write(file, data);
            timeId = 0;
            // console.log('REAL WRITE', { file: JSON.stringify(data) })
        }, 200)
    }

    file = file.toString();
    if ( !isNeedHandler(data) ) {
        data = { data };
    }
    if (Store.exists(file)) {
        data = Store.read(file);
    } else {
        isLazy ? lazyWrite(file, data) : Store.write(file, data);
    }


    getProxyObject = (data) => {
        let _proxy = new Proxy(data, handler);
        Object.keys(data).forEach(k => {
            _proxy[k] = data[k];
        })
        return _proxy;
    }

    handler = {
        set: function (obj, prop, value) {
            // console.log('HANDLER SET', { obj, prop, value })
            if ( isNeedHandler(value) ) {
                obj[prop] = getProxyObject(value);
            } else {
                obj[prop] = value;
            }
            isLazy ? lazyWrite(file, data) : Store.write(file, data);
            return true;
        }
    };
    return getProxyObject(data);
};


module.exports = ProxyDb;

