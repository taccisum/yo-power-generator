# Yo Power Generator

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![Build Status](https://www.travis-ci.org/taccisum/yo-power-generator.svg?branch=master)](https://www.travis-ci.org/deepexi/yo-power-generator)
[![codecov](https://codecov.io/gh/taccisum/yo-power-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/deepexi/yo-power-generator)

[npm-image]: https://img.shields.io/npm/v/yo-power-generator.svg
[npm-url]: https://www.npmjs.com/package/yo-power-generator
[download-image]: https://img.shields.io/npm/dm/yo-power-generator.svg
[download-url]: https://www.npmjs.com/package/yo-power-generator

a power generator implementation of yeoman.

一款功能丰富的yeoman generator的实现。

以下简称pg。

## How To

### Getting Started

#### 1. 创建index.js

```js
// generators/app/index.js
'use strict'

const path = require('path');

const args = {
  orgName: {
    prompting: {
      type: 'input',
      message: 'your org name(optional)'
    },
    option: { desc: '组织名称', type: String, default: '' }
  }
}
module.exports = require('yo-power-generator').getGenerator(args, {
  handlerDir: path.join(__dirname, 'handler'),
  templateDir: path.join(__dirname, 'templates')
});
```

更多配置请参考[Generator配置](#Generator配置)

#### 2. 创建模板文件

创建目录`generators/app/templates`，并在该目录下创建文件`foo.tmpl.js`，内容如下

```js
// generators/app/templates/foo.tmpl.js
'use strict'

console.log('${orgName}');
```

#### 3. 通过yo执行你的generator

首先将你的项目link到全局node_modules

```bash
$ cd {you_project_dir}
$ npm link
```

然后执行yo

```bash
$ mkdir /tmp/test
$ cd /tmp/test
$ yo {you_generator_name}
```

查看生成结果

```bash
$ cat /tmp/test/foo.js
```

## References

### Generator配置

```javascript
{
  handlerDir: 'dir/', // {string} template handler所在目录
  templateDir: 'dir/', // {string} template所在目录
  afterPropsSet: (props) => {}, // {function} props设置完毕后执行的回调
}
```

### Generator参数

原yeoman支持的参数分两种：prompting和option。pg对其进行了一些改造，使其使用起来更加容易，并且更加强大。其格式如下

```js
const args = {
  key: {
    prompting: {
      // 除了name不需要填写外与yeoman的prompting格式一致，影响交互模式内容
    },
    option: {
      // 与yeoman的option格式一致，影响命令模式内容
    },
    child: {
      subKey: {
        // 与key的格式一致，支持无限递归

        // 以下是子参数特有配置
        callbacks: {
          // 决定是否触发子参数的回调（仅在交互模式下生效），answer为此前所有的用户回答
          trigger (answers) {
            return answers.key === 'val';
          }
        }
      }
    }
  }
}
```

**注意**：子参数必须满足父参数被触发过这个条件才有可能被触发。

### Template

#### 位置

模板需要放在`templateDir`指定的目录下，并且以一定的格式命名，pg会自动对该目录递归扫描，并进行渲染。

#### 模板命名规则

文件名中包含tmpl字样且一定条件的文件才会被pg认为是一个模板，非模板文件不会被渲染。

以下举例了一些会被认为是模板的文件名，及其渲染后的名称

- 包含.tmpl：`foo.tmpl.js` -> `foo.js`
- 以.tmpl开头：`.tmpl.Dockerfile` -> `Dockerfile`
- 以tmpl结尾：`.gitignore.tmpl` -> `.gitignore`

每个模板文件还可以指定其对应的Template Handler，如果未指定（如上述例子），则采用[默认Temaplte Handler](#默认Template%20Handler)进行处理。

以下举例了会使用指定handler进行处理的模板的文件名，及其渲染后的名称

- `foo.tmpl_my_handler.js` -> `foo.js`

模板文件还支持简单的条件化渲染，可以通过在文件名中包含`if_cond`来指定条件cond，pg会自动检查`props`或`props.conditions`中是否存在key `cond`来决定是否渲染该文件

以下举例了能进行条件化渲染的模板的文件名，及其渲染后的名称

- `if_cond.foo.tmpl.js` -> `foo.js`

### Template Handler

每个模板都会经过一定的处理后被渲染成最终的文件并输出，在pg中这个过程是由被称为`Template Handler`的组件来处理的。

pg为你提供了默认的handler，你也可以定制自己的handler。

#### 默认Handler

默认的Handler将使用[loadsh](https://lodash.com/)的模板功能来处理模板内容。

#### 自定义Handler

自定义的Handler需要放在`handlerDir`指定的目录下，格式如下

```js
'use strict';

const AbstractTemplateHandler = require('yo-power-generator').AbstractTemplateHandler;

class MyTemplateHandler extends AbstractTemplateHandler {
  _handle0 () {
    // do something here
  }
}

module.exports = {
  key: 'custom',
  cls: MyTemplateHandler
};
```

### 常用工具类

#### File Utils

`FileUtils`提供了一些常用的工具方法，如将模板名称转换为文件名等，引入方式如下

```js
const fileUtils = require('yo-power-generator').FileUtils;
// do something with fileUtils
```

## Release Notes

[CHANGELOG](./CHANGELOG.md)
