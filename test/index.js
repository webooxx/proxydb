var ProxyDb = require("../src/index");
var assert = require("assert");
let fs = require('fs');


let path = 'testDb.json';
let initData = { foo: "bar" };
let dbHandler = null;

it("init file build", function () {
    fs.existsSync(path) && fs.unlinkSync(path);
    dbHandler = new ProxyDb(path, { ...initData }, false);
    assert.equal(fs.existsSync(path), true);
});

it("check init file value", function () {
    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});

it("set value", function () {
    initData.tagName   = "div";
    initData.nodeId    = 4;
    initData.data      = ['fast'];
    initData.children  = [{ tagName: "p", nodeId: 9, data: [], children: [] }];

    dbHandler.tagName  = "div";
    dbHandler.nodeId   = 4;
    dbHandler.data     = ['fast'];
    dbHandler.children = [{ tagName: "p", nodeId: 9, data: [], children: [] }];

    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});


it("change value", function () {

    initData.tagName = 'block';
    initData.data.push('easy');
    initData.nodeId += 1;
    initData.children[0].data.push('simple');

    dbHandler.tagName = 'block';
    dbHandler.data.push('easy');
    dbHandler.nodeId += 1;
    dbHandler.children[0].data.push('simple');

    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});

it("set long chain value", function () {

    initData.long  = { b: { c: { d: { e: { f: { g: { h: 1 } } } } } } };
    dbHandler.long = { b: { c: { d: { e: { f: { g: { h: 1 } } } } } } };

    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});



it("change long chain value", function () {

    initData.long.b2              = ['push'];
    initData.long.b.c.d.e.f.g.h   = 2;
    initData.long.b.c.d.e.f.g.h2  = { a: 1 };

    dbHandler.long.b2             = ['push'];
    dbHandler.long.b.c.d.e.f.g.h  = 2;
    dbHandler.long.b.c.d.e.f.g.h2 = { a: 1 };

    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});


let lazyPath = 'delayDb.json';
let delayHandler = null;

it("delay mode", async function () {
    fs.existsSync(lazyPath) && fs.unlinkSync(lazyPath);
    delayHandler = new ProxyDb(lazyPath, {});
    assert.equal(fs.existsSync(lazyPath), false);

    let delayExists = await new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove(fs.existsSync(lazyPath));
        }, 300);
    });

    assert.equal(delayExists, true);
});

it("delay mode write", async function () {

    delayHandler.foo = 'bar';
    setTimeout(() => {
        delayHandler.foo = 'zzz';
    }, 100)

    let content = await new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove(fs.readFileSync(lazyPath, 'utf-8'));
        }, 500);
    });

    assert.equal(content, JSON.stringify({ foo: 'zzz' }));
});


it("mulit-file delay mode init", async function () {

    let m1 = 'multi-1.json';
    let m2 = 'multi-2.json';

    fs.existsSync(m1) && fs.unlinkSync(m1);
    fs.existsSync(m2) && fs.unlinkSync(m2);

    new ProxyDb(m1, {});
    new ProxyDb(m2, {});

    assert.equal([fs.existsSync(m1), fs.existsSync(m2)].toString(), [false, false].toString());

    let existsDelay = await new Promise((reslove, reject) => {
        setTimeout(() => reslove([fs.existsSync(m1), fs.existsSync(m2)]), 300);
    });

    assert.equal(existsDelay.toString(), [true, true].toString());
});


it("set undefined ", function () {

    initData.test = undefined;
    initData.subTest = {z:undefined};
    
    dbHandler.tagName = 'block';
    dbHandler.test = undefined;
    dbHandler.subTest = {z:undefined};
    
    assert.equal(fs.readFileSync(path, 'utf-8'), JSON.stringify(initData));
});


it('clear', function () {
    fs.existsSync(path) && fs.unlinkSync(path);
    fs.existsSync(lazyPath) && fs.unlinkSync(lazyPath);

    let m1 = 'multi-1.json';
    let m2 = 'multi-2.json';

    fs.existsSync(m1) && fs.unlinkSync(m1);
    fs.existsSync(m2) && fs.unlinkSync(m2);
})

