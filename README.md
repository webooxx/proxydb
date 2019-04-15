
# proxydb

适用于浏览器、Node环境下的超简易JSON数据库，在浏览器环境下会存储到 localStorage 中、在 node 环境下则以文件存储，其内容均为JSON字符串

操作时和正常的JS对象一致，使用过程中会自动在合适的时候写入。

## Usage

```bash
npm i proxydb
```


### 简单例子

```js
var ProxyDb = require('proxydb');
var Db = new ProxyDb();

Db.name = 'foo';  //  ProxyDb.json 文件内容为："foo"

```

### 复杂点的例子


```js


var ProxyDb = require('proxydb');
var Db1 = new ProxyDb('objDb',{name:"foo"});

Db1.age = 12; //  objDb.json 文件内容为： {"name":"foo","age":12}

var ProxyDb = require('proxydb');
var Db2 = new ProxyDb('arrDb',['foo']);

Db2.push( 'bar' ); //  arrDb.json 文件内容为：["foo","bar"]

```


### 初始化时使用了简单数据类型



```js
var ProxyDb = require('proxydb');
var Db = new ProxyDb('badDb',"foo bar" );

console.log( Db.data ); // output: "foo bar"

//  badDb.json 文件内容为：{"data":"foo bar"}

```


## API

### new ProxyDb( [filename , [initialization, [isLazy] ] ] )

传入了 filename 后，会自动读取该文件的内容，若没有 数据文件时，则会创建一个，并且以  initialization 的值作为初始值

- **filename** 
  - 类型： `string` 
  - 默认值：`ProxyDb.json`
  - 描述：数据文件的名称，若不提供，默认使用 ，如果已有此文件，则不会创建。
- **initialization** 
  - 类型：`object|array` 
  - 默认值：无
  - 描述：初始化的数据，建议使用 object|array ，当然传一个 string 是允许的，但是会被强制转换为 object 读写时使用 `Db.data`
- **isLazy** 
  - 类型： `boolean`
  - 默认值：`true` 
  - 描述：是否延迟写入，要注意，在值为 false 时，连续写数据时，内容会立即写入到文件中

