//download.js v4.2, by dandavis; 2008-2017. [MIT] see http://danml.com/download.html for tests/usage
(function(r,l){"function"==typeof define&&define.amd?define([],l):"object"==typeof exports?module.exports=l():r.download=l()})(this,function(){return function l(a,e,k){function q(a){var h=a.split(/[:;,]/);a=h[1];var h=("base64"==h[2]?atob:decodeURIComponent)(h.pop()),d=h.length,b=0,c=new Uint8Array(d);for(b;b<d;++b)c[b]=h.charCodeAt(b);return new f([c],{type:a})}function m(a,b){if("download"in d)return d.href=a,d.setAttribute("download",n),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout(function(){d.click(),document.body.removeChild(d),!0===b&&setTimeout(function(){g.URL.revokeObjectURL(d.href)},250)},66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),!window.open(a)&&confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=a),!0;var c=document.createElement("iframe");document.body.appendChild(c),!b&&/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),c.src=a,setTimeout(function(){document.body.removeChild(c)},333)}var g=window,b=k||"application/octet-stream",c=!e&&!k&&a,d=document.createElement("a");k=function(a){return String(a)};var f=g.Blob||g.MozBlob||g.WebKitBlob||k,n=e||"download",f=f.call?f.bind(g):Blob;"true"===String(this)&&(a=[a,b],b=a[0],a=a[1]);if(c&&2048>c.length&&(n=c.split("/").pop().split("?")[0],d.href=c,-1!==d.href.indexOf(c))){var p=new XMLHttpRequest;return p.open("GET",c,!0),p.responseType="blob",p.onload=function(a){l(a.target.response,n,"application/octet-stream")},setTimeout(function(){p.send()},0),p}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(a)){if(!(2096103.424<a.length&&f!==k))return navigator.msSaveBlob?navigator.msSaveBlob(q(a),n):m(a);a=q(a),b=a.type||"application/octet-stream"}else if(/([\x80-\xff])/.test(a)){e=0;var c=new Uint8Array(a.length),t=c.length;for(e;e<t;++e)c[e]=a.charCodeAt(e);a=new f([c],{type:b})}a=a instanceof f?a:new f([a],{type:b});if(navigator.msSaveBlob)return navigator.msSaveBlob(a,n);if(g.URL)m(g.URL.createObjectURL(a),!0);else{if("string"==typeof a||a.constructor===k)try{return m("data:"+b+";base64,"+g.btoa(a))}catch(h){return m("data:"+b+","+encodeURIComponent(a))}b=new FileReader,b.onload=function(a){m(this.result)},b.readAsDataURL(a)}return!0}});

function init() {
    (function(){

    RK.STLExporter = function () {};

    RK.STLExporter.prototype = {

        constructor: THREE.STLExporter,

        parse: ( function () {

            var vector = new THREE.Vector3();
            var normalMatrixWorld = new THREE.Matrix3();

            return function ( scenes ) {
                console.log(scenes);
                var output = '';
                output += 'solid exported\n';
                for(var scene_nr in scenes) {
                    scenes[scene_nr].traverse( function ( object ) {
                        if(object instanceof RK.Mesh){		    
                            // if object is hidden - exit
                            if(object.visible == false) return; 

                            var geometry = object.geometry;
                            var matrixWorld = object.matrixWorld;
                            var skeleton = object.skeleton;
                            var mesh = object;

                            if(geometry instanceof RK.BufferGeometry){
                                var oldgeometry = geometry.clone();
                                geometry = new RK.Geometry().fromBufferGeometry(geometry);
                                var skinIndex = oldgeometry.getAttribute('skinIndex');
                                var skinWeight = oldgeometry.getAttribute('skinWeight');
                                var morphTarget = oldgeometry.getAttribute('morphTarget0');
                                var mtcount = 0;
                                while(typeof morphTarget !== 'undefined') {
                                    mtcount++;
                                    morphTarget = oldgeometry.getAttribute('morphTarget' + mtcount);
                                }
                                if(typeof skinIndex !== 'undefined') {
                                    geometry.skinIndices = [];
                                    geometry.skinWeights = [];
                                    geometry.morphTargets = [];
                                    for(var j = 0; j < mtcount; j++) {
                                        geometry.morphTargets[j] = {};
                                        geometry.morphTargets[j].vertices = [];
                                    }
                                    for(var i = 0; i < geometry.vertices.length; i++) {
                                        geometry.skinIndices.push((new THREE.Vector4 ()).fromBufferAttribute(skinIndex,i));
                                        geometry.skinWeights.push((new THREE.Vector4 ()).fromBufferAttribute(skinWeight,i));
                                        for(var j = 0; j < mtcount; j++) {
                                            geometry.morphTargets[j].vertices.push((new THREE.Vector3 ()).fromBufferAttribute(oldgeometry.getAttribute('morphTarget' + j)));
                                        }
                                    }
                                }
                            }

                            if ( geometry instanceof RK.Geometry) {

                                var vertices = geometry.vertices;
                                var faces = geometry.faces;

                                normalMatrixWorld.getNormalMatrix( matrixWorld );

                                if(typeof faces != 'undefined'){
                                    for ( var i = 0, l = faces.length; i < l; i ++ ) {
                                        var face = faces[ i ];

                                        vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

                                        output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                        output += '\t\touter loop\n';

                                        var indices = [ face.a, face.b, face.c ];

                                        for ( var j = 0; j < 3; j ++ ) {
                                            var vertexIndex = indices[ j ];
                                            if (typeof geometry.skinIndices !== 'undefined' && geometry.skinIndices.length == 0) {
                                                vector.copy( vertices[ vertexIndex ] ).applyMatrix4( matrixWorld );
                                                output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                            } else {
                                                vector.copy( vertices[ vertexIndex ] ); //.applyMatrix4( matrixWorld );

                                                // see https://github.com/mrdoob/three.js/issues/3187
                                                var boneIndices = [
                                                    geometry.skinIndices[vertexIndex].x,
                                                    geometry.skinIndices[vertexIndex].y,
                                                    geometry.skinIndices[vertexIndex].z,
                                                    geometry.skinIndices[vertexIndex].w
                                                ];

                                                var weights = [
                                                    geometry.skinWeights[vertexIndex].x,
                                                    geometry.skinWeights[vertexIndex].y,
                                                    geometry.skinWeights[vertexIndex].z,
                                                    geometry.skinWeights[vertexIndex].w
                                                ];

                                                var inverses = [
                                                    skeleton.boneInverses[ boneIndices[0] ],
                                                    skeleton.boneInverses[ boneIndices[1] ],
                                                    skeleton.boneInverses[ boneIndices[2] ],
                                                    skeleton.boneInverses[ boneIndices[3] ]
                                                ];

                                                var skinMatrices = [
                                                    skeleton.bones[ boneIndices[0] ].matrixWorld,
                                                    skeleton.bones[ boneIndices[1] ].matrixWorld,
                                                    skeleton.bones[ boneIndices[2] ].matrixWorld,
                                                    skeleton.bones[ boneIndices[3] ].matrixWorld
                                                ];

                                                //this checks to see if the mesh has any morphTargets - jc
                                                if (geometry.morphTargets !== 'undefined') {										
                                                    var morphMatricesX = [];
                                                    var morphMatricesY = [];
                                                    var morphMatricesZ = [];
                                                    var morphMatricesInfluence = [];

                                                    for (var mt = 0; mt < geometry.morphTargets.length; mt++) {
                                                        //collect the needed vertex info - jc
                                                        morphMatricesX[mt] = geometry.morphTargets[mt].vertices[vertexIndex].x;
                                                        morphMatricesY[mt] = geometry.morphTargets[mt].vertices[vertexIndex].y;
                                                        morphMatricesZ[mt] = geometry.morphTargets[mt].vertices[vertexIndex].z;
                                                        morphMatricesInfluence[mt] = mesh.morphTargetInfluences[mt];
                                                    }
                                                }

                                                var finalVector = new THREE.Vector4();

                                                if (mesh.geometry.morphTargets !== 'undefined') {

                                                    var morphVector = new THREE.Vector4(vector.x, vector.y, vector.z);

                                                    for (var mt = 0; mt < geometry.morphTargets.length; mt++) {
                                                        //not pretty, but it gets the job done - jc
                                                        morphVector.lerp(new THREE.Vector4(morphMatricesX[mt], morphMatricesY[mt], morphMatricesZ[mt], 1), morphMatricesInfluence[mt]);
                                                    }

                                                }

                                                for (var k = 0; k < 4; k++) {

                                                    var tempVector = new THREE.Vector4(vector.x, vector.y, vector.z);
                                                    tempVector.multiplyScalar(weights[k]);
                                                    //the inverse takes the vector into local bone space
                                                    tempVector.applyMatrix4(inverses[k])
                                                    //which is then transformed to the appropriate world space
                                                        .applyMatrix4(skinMatrices[k]);
                                                    finalVector.add(tempVector);

                                                }

                                                output += '\t\t\tvertex ' + finalVector.x + ' ' + finalVector.y + ' ' + finalVector.z + '\n';
                                            }
                                        }
                                        output += '\t\tendloop\n';
                                        output += '\tendfacet\n';
                                    }
                                }
                            }
                        }
                    } );
                }
                output += 'endsolid exported\n';

                return output;
            };
        }() )
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = RK.STLExporter
    } 
    else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
        define([], function() {
            return saveAs;
        });
    }


    var character_area = jQuery(".characterArea");
    var stl = jQuery("<a />").css({"margin-left": "20px", "font-size": "1.4em", "color" : "rgba(255, 255, 255, 0.8)", "cursor" : "pointer"}).text("Export Figure");
    var stl_base = jQuery("<a />").css({"margin-left": "20px", "font-size": "1.4em", "color" : "rgba(255, 255, 255, 0.8)", "cursor" : "pointer" }).text("Export Figure + Base");
    var sjson = jQuery("<a />").css({"margin-left": "20px", "font-size": "1.4em", "color" : "rgba(255, 255, 255, 0.8)", "cursor" : "pointer" }).text("Save JSON");
    var ljson  = jQuery("<input/>").attr({"type": "file", "id": "ljson"}).css({"display":"none"}).text("Load JSON");
    var labeljson  = jQuery("<label/>").attr({"for": "ljson"}).css({"margin-left": "20px", "font-size": "1.4em", "color" : "rgba(255, 255, 255, 0.8)", "cursor" : "pointer"}).text("Load JSON");
    character_area.append(stl);
    character_area.append(stl_base);
    character_area.append(sjson);
    character_area.append(ljson);
    character_area.append(labeljson);
    character_area.css("right", 0);

    stl.click(function(e) {
        e.preventDefault(); 
        var exporter = new RK.STLExporter();    
        var objs = CK.activeCharacter.threeObj.children;    
        var character = objs[0];
        var figure = [];
        var max_objs = 0;
        var i;
        for(i in objs) { // find character
            if (objs[i].children.length > objs[max_objs].children.length) {
                console.log("Id " + max_objs + " is not the character");
                character = objs[i];
                max_objs = i;
            }        
        }
        if(character.children.length > 9) { // There is an option to hide the character. Since I do not know where this option is saved
            // we use the following heuristic: If there is no object with 10 or more children, the character
            // must be hidden...
            console.log("Found Character, id=" + max_objs);
            console.log(character);
            figure.push(character);
        }
        if(CK.activeCharacter.characterData.parts.mount !== undefined) {
            console.log("Exporting Mount");
            var mount = undefined;
            for(i in objs) { // find mount
                var j;
                for(j in objs[i].children) {
                    if(objs[i].children[j].name == "mount" && objs[i].children.length < 10) {
                        console.log("Found mount, id=" + i + "," + j)
                        mount = objs[i];
                    }
                }
            }
            console.log(mount);
            figure.push(mount);
            console.log(figure);
        }
        console.log(figure);
        var stlString = exporter.parse(figure)
        var name = CK.activeCharacter.name
        name = name === "" ? "unnamed" : name
        download(stlString, name + '.stl', 'application/sla');
    });
    stl_base.click(function(e) {
        e.preventDefault(); 
        var exporter = new RK.STLExporter();    
        var stlString = exporter.parse([CK.activeCharacter.threeObj])
        var name = CK.activeCharacter.name
        name = name === "" ? "unnamed" : name
        download(stlString, name + '_base.stl', 'application/sla');
    });


    sjson.click(function(e) {
        e.preventDefault();
        var char_json = JSON.stringify(CK.activeCharacter.characterData);
        var name = CK.activeCharacter.name
        name = name === "" ? "unnamed" : name
        download(char_json, name + ".json", "text/plain");
    });

    ljson.on('change', function(e) {
        e.preventDefault();
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                e.preventDefault();
                CK.change(JSON.parse(e.target.result));
            };
        })(file);
        reader.readAsText(file);
    });
})()};

function inject_script(url, callback) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = url; 
  script.onload = function(e) { 
      callback() };
  head.appendChild(script);
}

inject_script("//code.jquery.com/jquery-3.3.1.min.js", function () {
    inject_script("//cdnjs.cloudflare.com/ajax/libs/three.js/100/three.js", function () { init() })
});
