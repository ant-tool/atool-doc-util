const marked = require('marked');
const highlight = require('highlight.js');

function generateArray(array) {
  return (array || []).map(function(each){
    return generateLine(each || {});
  }).join('\n');
}

function generateLine(each) {
  if(typeof each.children === 'string') {
    if(each.type === 'code') {
      return generateCode(each.children, each.props.lang);
    } else {
      return `<${each.type}>${each.children}</${each.type}>`;
    }
  } else {
    return `<${each.type}>${generateArray(each.children)}</${each.type}>`;
  }
}


function generateCode(code, lang) {
  
  const result = lang && highlight.getLanguage(lang)
    ? highlight.highlight(lang, code)
    : highlight.highlightAuto(code);

  return `<div class="highlight"><pre><code language=${result.language}>${result.value}</code></pre></div>`;
}

module.exports = function(markdown) {
  if(typeof markdown === 'string') {
    const render = new marked.Renderer();

    render.code = generateCode;

    marked.setOptions({
      renderer: render,
    });

    return marked(markdown);
  } else if(typeof markdown === 'object') {
    return generateArray(markdown);
  }

};
