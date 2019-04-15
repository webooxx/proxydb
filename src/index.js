
let Store;
if ( typeof window !== 'undefined' && window.localStorage) {
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

let timeId = 0;
let lazyWrite = (file, data) => {
    if (timeId) {
        clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
        Store.write(file, data);
        timeId = 0;
        // console.log('REAL WRITE', { file: JSON.stringify(data) })
    }, 200)
}

let ProxyDb = function (file = 'ProxyDb.json', data = {}, isLazy = true) {
    file = file.toString();
    if (['Object', 'Array'].indexOf(data.constructor.name) === -1) {
        data = { data };
    }
    if (Store.exists(file)) {
        data = Store.read(file);
    } else {
        isLazy ? lazyWrite(file, data) : Store.write(file, data);
    }
    let handler = {
        set: function (obj, prop, value) {
            if (['Object', 'Array'].indexOf(value.constructor.name) > -1) {
                obj[prop] = new Proxy(value, handler);;
            } else {
                obj[prop] = value;
            }
            isLazy ? lazyWrite(file, data) : Store.write(file, data);
            return true;
        }
    };
    return new Proxy(data, handler);
};

module.exports = ProxyDb;

