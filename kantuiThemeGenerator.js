const fs = require("fs");
const path = require("path");
const glob = require("glob");
const less = require("less");
const NpmImportPlugin = require('less-plugin-npm-import');

/**
 * less.renser的封装，基础方法供调用
 */
function render ( text, modifyVars, paths) {
  return less.render (
    text,
    { javascriptEnabled: true, 
      modifyVars: modifyVars, 
      paths: paths,
      compress: true ,
      plugins: [new NpmImportPlugin({ prefix: '~' })] }
  ).then (({ css }) => (css) );
};


/**
 * 编译antd的Less->Css
 */
function genAntdCSS ( antdPath, modifyVars, paths ) {
  const styles = glob.sync(path.join(antdPath, './**/index.less'));
  let content = "";
  styles.forEach(style => {
    content += `@import "${style}";\n`;
  });
  return render(content, modifyVars, paths);

};

/**
 * 编译Knat-ui的Less->Css
 */
function genKantCSS ( kantPath, modifyVars, paths ) {
  const styles = glob.sync(path.join(kantPath, './**/*.less'));
  let content = "";
  styles.forEach(style => {
    content += `@import "${style}";\n`;
  });
  return render(content, modifyVars, paths);
};

/**
 * 编译项目的Less->Css
 */
function genCustomCSS ( customLessPath, modifyVars, paths ) {
  const styles = glob.sync(path.join(customLessPath, './**/*.less'));
  let content = "";
  styles.forEach(style => {
    content += `@import "${style}";\n`;
  });
  return render(content, modifyVars, paths);
};

/**
 * lightenCSS，样式文件精简
 * 颜色属性保留（当前仅#HEX）、属性值含配置变量保留（changeColorOnly为false时）
 * 其余部分从文本中删除
 * @param {String}          text                  待精简CSS文本
 * @param {Object}          modifyVars            主题变量，arrayLike对象
 * @param {changeColorOnly} changeColorOnly       精简时是否只保留颜色属性，默认false
 */
function lightenCSS (text, modifyVars, changeColorOnly) {
  const isColorOnly = changeColorOnly || false;
  const themeVars = Object.values(modifyVars);
  const regval = /(?<=:).*(?=[\};])/;                           // 用于获取CSS属性值，校验是否可能与主题相关
  const regcolorHex = /#[a-z0-9]{3,8}/i;                        // 用于验证是否为HEX颜色（防止精简CSS时误删衍生色）
  const regcolorRgba = /rgba\(.*?\)/i;                          // 用于验证是否为rgba颜色(防止精简CSS时误删衍)
  let rules = text.split(/(?<=\})(?=\S*[\.@#])/g);

  let skipFlag = false;
  for (let i = 0; i < rules.length; i++){
    if(rules[i].startsWith("@")){
      skipFlag = true;
    };
    if (skipFlag){
      skipFlag = rules[i] === "}" ? false : true;
      rules[i] = "";
      continue;
    };
    let matches = [];
    matches = rules[i].match(/(?=.+:)(.*?)?(?<=[;\}\{])/g);
    let attrDeleteCount = 0;
    for (let j = 1; j < matches.length; j++) {
      let cssVar = regval.exec(matches[j]);
      cssVar = cssVar ? cssVar[0] : "";
      if (regcolorHex.test(cssVar) || regcolorRgba.test(cssVar) || 
      (isColorOnly ? false : themeVars.some((v)=>( cssVar.indexOf(v) != -1 )))) {
        continue;
      };
      rules[i] = rules[i].replace(matches[j], j === matches.length - 1 ? "}" : "");
      attrDeleteCount = attrDeleteCount + 1;
    };
    if (attrDeleteCount === matches.length - 1) {
      rules[i] = "";
    };
  };

  return rules.join("");
};

/**
 * @param {*} antdPath          antd目录
 * @param {*} kantPath          kantui目录
 * @param {*} customLessPath    工程Less文件目录
 * @param {*} modifyVars        主题配置，arrayLike对象
 * @param {*} isColorOnly       主题目标文件瘦身时，是否只保留颜色属性,默认false
 */
function renderCSS ( antdPath, kantPath, customLessPath, modifyVars, isColorOnly) {
  return genAntdCSS(antdPath, modifyVars)
    .then((antdcss) => {
      return genKantCSS(kantPath, modifyVars, [kantPath, antdPath])
        .then((kantCss) => {
          return genCustomCSS(customLessPath, modifyVars, [customLessPath, antdPath])
            .then((customeCss) => 
              lightenCSS(antdcss + kantCss + customeCss, modifyVars, isColorOnly)
            );
        });

    });

};
module.exports = renderCSS;
