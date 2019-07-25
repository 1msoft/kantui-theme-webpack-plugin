const renderCSS = require('./emWebThemeGenerator');
const crypto = require('crypto');
/**
 * emweb主题插件
 */
class EmWebThemePlugin {
  /**
   * emweb主题插件
   * @param {Object}  options
   * @param {String}  options.antdDir              antd目录
   * @param {String}  options.kantDir              kantui目录
   * @param {String}  options.customLessDir        工程Less文件目录
   * @param {Array}   options.theme                主题配置
   * @param {String}  options.theme[].themeName    主题名称，建议ASCI字符
   * @param {Object}  options.theme[].value        主题配置，arrayLike对象
   * @param {Boolean} options.colorOnly            主题目标文件瘦身时，是否只保留颜色属性,默认false} options 
   */
  constructor(options) {
    this.options = options;
  };
  apply(compiler) {

    const options = this.options;
    compiler.hooks.emit.tapAsync('EmWebThemePlugin', (compilation, callback) => {

      Promise.all(options.theme.map((v)=>renderCSS(
        options.antdDir, 
        options.kantDir, 
        options.customLessDir, 
        v.value, 
        options.colorOnly
      ).then((css)=>{      
        let contentHash = crypto.createHash('md4')
          .update(css)
          .digest("hex");
        let fileName = 
          compilation.getPath(`theme-${v.themeName}.[contentHash:8].css`, { contentHash });
          
        compilation.assets[fileName] = {
          source: ()=>(css),
          size: ()=>(css.length)
        };
      })
      ))
        .then(() => {
          callback();
        });
    }); 
  }
};

module.exports = EmWebThemePlugin;
