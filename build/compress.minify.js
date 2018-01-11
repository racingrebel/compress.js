(function(global,factory){if(typeof define==='function'&&define.amd){define(['module','exports','./core/base64.js','./core/converter.js','./core/file.js','./core/image.js','./core/photo.js','./core/rotate.js'],factory)}else if(typeof exports!=='undefined'){factory(module,exports,require('./core/base64.js'),require('./core/converter.js'),require('./core/file.js'),require('./core/image.js'),require('./core/photo.js'),require('./core/rotate.js'))}else{var mod={exports:{}};factory(mod,mod.exports,global.base64,global.converter,global.file,global.image,global.photo,global.rotate);global.compress=mod.exports}})(this,function(module,exports){'use strict';(function(a,b){if('function'==typeof define&&define.amd)define(['module','./core/base64.js','./core/converter.js','./core/file.js','./core/image.js','./core/photo.js','./core/rotate.js'],b);else if('undefined'!=typeof exports)b(module);else{var c={exports:{}};b(c,a.base64,a.converter,a.file,a.image,a.photo,a.rotate),a.compress=c.exports}})(void 0,function(a,b,c,d,e,f,g){'use strict';function h(t){return t&&t.__esModule?t:{default:t}}function j(t){if(Array.isArray(t)){for(var u=0,v=Array(t.length);u<t.length;u++)v[u]=t[u];return v}return Array.from(t)}function k(t,u){if(!(t instanceof u))throw new TypeError('Cannot call a class as a function')}var l=h(b),m=h(c),n=h(d),o=h(e),p=h(f),q=h(g),r=function(){function t(u,v){for(var w=0;w<v.length;w++){var x=v[w];x.enumerable=x.enumerable||!1,x.configurable=!0,'value'in x&&(x.writable=!0),Object.defineProperty(u,x.key,x)}}return function(u,v,w){return v&&t(u.prototype,v),w&&t(u,w),u}}(),s=function(){function t(){k(this,t)}return r(t,[{key:'attach',value:function value(v,w){var x=this;return new Promise(function(y){var z=document.querySelector(v);z.setAttribute('accept','image/*'),z.addEventListener('change',function(A){var B=x.compress([].concat(j(A.target.files)),w);y(B)},!1)})}},{key:'compress',value:function value(v,w){function x(A,B){var C=new p.default(B);C.start=window.performance.now(),C.alt=A.name,C.ext=A.type,C.startSize=A.size,Promise.resolve().then(q.default.orientation(A)).then(function(D){return C.orientation=D,n.default.load(A)}).then(y(C))}function y(A){return function(B){return o.default.load(B).then(function(C){if(A.startWidth=C.naturalWidth,A.startHeight=C.naturalHeight,A.resize){var D=o.default.resize(A.maxWidth,A.maxHeight)(C.naturalWidth,C.naturalHeight),E=D.width,F=D.height;A.endWidth=E,A.endHeight=F}else A.endWidth=C.naturalWidth,A.endHeight=C.naturalHeight;return m.default.imageToCanvas(A.endWidth,A.endHeight,A.orientation)(C)}).then(function(C){return A.iterations=1,A.base64prefix=l.default.prefix(A.ext),z(C,A.startSize,A.quality,A.size,A.minQuality,A.iterations)}).then(function(C){return A.finalSize=l.default.size(C),l.default.data(C)}).then(function(C){A.end=window.performance.now();var D=A.end-A.start;return{data:C,prefix:A.base64prefix,elapsedTimeInSeconds:D/1e3,alt:A.alt,initialSizeInMb:m.default.size(A.startSize).MB,endSizeInMb:m.default.size(A.finalSize).MB,ext:A.ext,quality:A.quality,endWidthInPx:A.endWidth,endHeightInPx:A.endHeight,initialWidthInPx:A.startWidth,initialHeightInPx:A.startHeight,sizeReducedInPercent:100*((A.startSize-A.finalSize)/A.startSize),iterations:A.iterations}})}}function z(A){var B=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1,C=arguments[3],D=4<arguments.length&&void 0!==arguments[4]?arguments[4]:1,E=arguments[5],F=m.default.canvasToBase64(A,B),G=l.default.size(F);return E+=1,G>C?z(A,G,B-0.1,C,D,E):B>D?z(A,G,B-0.1,C,D,E):0.5>B?F:F}return Promise.all(v.map(function(A){return x(A,w)}))}}],[{key:'convertBase64ToFile',value:function value(v,w){return m.default.base64ToFile(v,w)}}]),t}();a.exports=s})});