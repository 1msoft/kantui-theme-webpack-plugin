# webpack-emweb-theme-plugin





webpack-emweb-theme-plugin是一款webpack插件，该插件可以完成在线主题切换。
该插件适用于使用了andt或kant-ui组件、且使用LESS样式的项目。


## 安装
```
npm install webpack-emweb-theme-plugin -D
```
或者
```
yarn add webpack-emweb-theme-plugin -D
```
## 配置主题
  theme.js
```javascript
let themes = [
    { themeName: "red", value: {
        'primary-color': '#ff0000',
        'success-color': '#4ac375',
        }
    },
    { themeName: "blue", value: {
        'primary-color': '#0000ff',
        'success-color': '#4ac375',
        }
    },
];
module.exports = themes;
```
主题文件为一个数组，数组元素中themeName指定了主题名称，value是主题配置，是一系列键值对。上述代码定义了red、blue2个主题。


## 配置插件
```javascript
const EmWebThemePlugin = require('webpack-emweb-theme-plugin');

const themeOption = { 
  theme: require(".themes.js"),         // theme 引入上文主题配置
  antdDir: "./node_modules/antd/lib",   // antd样式目录
  kantDir: "./node_modules/@1msoft/kant-ui/lib",    // kant-ui样式目录
  customLessDir: "./src",    // 项目页面目录，包含项目样式
  colorOnly: true,           // 目标主题是否只保留颜色，当前为false时可能出现问题，建议true
};

const themePlugin = new EmWebThemePlugin(themeOption);
// 添加插件至plugin array
plugins: [
    themePlugin
  ]
```

## 主题切换
```
```