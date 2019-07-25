var linkId;
/** */
module.exports =
{
  changeColor: (themeName) => {
    let themeStyle;
    if (linkId) {
      themeStyle = document.getElementById(linkId);
    } 
    else {
      themeStyle = document.head.appendChild(document.createElement('link'));
      linkId = 'css_' + (+new Date());
      themeStyle.setAttribute("id", linkId);
      themeStyle.setAttribute("rel", "stylesheet");
      themeStyle.setAttribute("type", "text/css");
    };
    themeStyle.setAttribute("href", `/${themeName}` );
  },
  getThemeList: () =>{
    let list = [];
    let xhr = new XMLHttpRequest();

    xhr.open('GET', "asset-manifest.json",false);
    xhr.send();
    let fileList = Object.keys(JSON.parse(xhr.responseText));
    list = fileList.filter((ele)=>(/^theme-.*\.css$/.test(ele)));
    console.log(list);
    return list;
  },
};