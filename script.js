function submit() {
    let s = document.getElementById("json_data").value;
    let path = document.getElementById("path").value;
    let tag = document.getElementById("tag").value;
    let model = document.getElementById("model").value;
    let type = document.getElementById("type").value;
    let metadata=document.getElementById("metadata").value;

    if (!validateForm(s, path, tag, model, type)) {
        document.getElementById('yaml_out').value = 'Please Fill All Required Field';

    } else {
        try {
            document.getElementById('yaml_out').value = '';
            let json_object = JSON.parse(s);
            writeHead(path, tag, model, type);
            parse(json_object, '    ',generateMap(metadata));
        } catch (e) {
            document.getElementById('yaml_out').value = e;
        }
    }
}

function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function generateMap(metadata){
  var descriptionMap= new Map(); 
  var lengthMap= new Map(); 
  console.log(metadata);
  if(!(metadata === "")){
    metadata.split("\n").forEach(function(myString) {
      var array = myString.split("|");
      if(!(array[1]==="")){
        descriptionMap.set(array[0],array[1]);
      }
      if(!(array[2]==="")){
        lengthMap.set(array[0],array[2]);
      }
    });
    console.log(descriptionMap);
  }
  return [descriptionMap,lengthMap]
}

function parse(s, indent,metadata) {
    console.log(metadata[0])
    console.log(metadata[1])
    if (Array.isArray(s)) {
        write(indent + 'type: \"array\"');
        write(indent + 'items:');
        if (s.length !== 0) {
            parse(s[0], indent + '  ');
        } else {
            write(indent + '  type: \"object\"');
        }
    } else if (typeof s === 'object') {
        write(indent + 'type: \"object\"');
        if (isEmpty(s)) {
            return;
        }
        //write(indent + 'required:');
        //write(indent + '  '+'-  ""');
	    
        //write(indent + 'required:');  
	//for (let key in s) {
           // var regex = new RegExp("#");
           // if (regex.test(key)){
             // write(indent + '  ' + '-  "'+ key + '"');
           // }
       // }
	write(indent + 'required:');   
	for (let key in s) {
            write(indent + '  '+'- "'+ key +'"');
            }
	    
        write(indent + 'properties:');
        for (let key in s) {
            write(indent + '  ' + key + ':');
            if (s.hasOwnProperty(key)) {
                parse(s[key], indent + '    ');
            }
            
        }
    } else {
        write(indent + 'type: \"' + (typeof s) + '\"');
        write(indent + 'example:' + ' '+'\"'+(s)+'\"' );
	write(indent + 'maxLength:' + ' '+metadata[0].get(s)+' );
        write(indent + 'description:'+' '+'\""')
    }
}

function write(s) {
    // console.log(s);
    document.getElementById('yaml_out').value += s + "\n";
}

function writeHead(path, tag, model, type) {


    var header = `openapi: '3.0.0'
info:
  version:
  title:
  description:

tags:
  - name: `+ tag + `
    description: Everything about `+ tag + `
servers:
  - url: http://10.0.14.19:8084/OM
paths:
  /`+ path + `:
    `+ type + `:
      tags:
        - `+ tag + `
      summary: Add a operation
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/`+ model + `'
      responses:
          '200':
            description: successful operation
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/`+ model + `_response'
          '405':
            description: Invalid input
components:
  schemas:
    `+ model + `:`;
      write(header);

}

function validateForm(json, path, tag, model, type) {
    if (json == null || json == "" || path == null || path == "" || tag == null || tag == "" || model == null || model == "" || type == null || type == "") {

        return false;
    }
    return true;
}
