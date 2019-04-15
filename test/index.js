var CacheDb = require("../src/index");
var assert  = require("assert");
let fs      = require('fs');



it("init", function()
{
    let path = 'CacheDb.json';
    new CacheDb();
    setTimeout(()=>{
        assert.equal( fs.existsSync( path ) , true);
        fs.unlinkSync( path );
    },300)
});
