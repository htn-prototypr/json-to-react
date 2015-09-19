var fs = require('fs');

function get_json (callback) {
    fs.readFile('structure.json', function (err, data) {
        // check if read file succeeds
        if (err) {
            callback(false, err);
        }

        var json = null;
        
        // build JSON object
        try {
            json = JSON.parse(data);
        } catch (e) {
            callback(false, e);
        }

        callback(true, json);
    });
}

function generate_react () {
    var writable = fs.createWriteStream('./react_gen/test.js');
    var readable = fs.createReadStream('react_template/android_template.js');

    readable.pipe(writable);

    writable.on('finish', function () {
        console.log("HELLO!");
    });
}

get_json(function (success, data) {
    if (!success) console.log(data);
    else {
        build_jsx(data);
    }
});

function build_jsx (view_json) {
    var JSXArray = [];
    JSXArray.push("<View style={_root}>");
    recurse_build_jsx(JSXArray, view_json["root"]["children"]);
    JSXArray.push("</View>");
    print_jsx_array(JSXArray);
}

function recurse_build_jsx (JSXArray, view_array) {
    for (var i in view_array) {
        var closing = false;
        var view = view_array[i];
        JSXArray.push(convert_to_xml_tags(view.type, view.id, closing));
        recurse_build_jsx (JSXArray, view.children);
        closing = true;
        JSXArray.push(convert_to_xml_tags(view.type, view.id, closing));
    }
}

function print_jsx_array (JSXArray) {
    for (var i in JSXArray) {
        console.log(JSXArray[i]);
    }
}

function convert_to_xml_tags (type, id, closing) {
    if (!closing) {
        switch(type) {
            case 'container': 
                return "<View style={" + id + "}>";
            default:
                return false;
        }
    } else {
        switch(type) {
            case 'container':
                return "</View>";
            default:
                return false;
        }
    }
}


