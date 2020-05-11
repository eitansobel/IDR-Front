var replace = require('replace-in-file');
var package = require("./package.json");
var buildVersion = package.version;
var now = new Date();
var buildTimestamp = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes()
    );

var options = {
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '"+ buildVersion + "'",
    allowEmptyPaths: false,
};
var optionsTimestamp = {
    files: 'src/environments/environment.prod.ts',
    from: /timestamp: '(.*)'/g,
    to: "timestamp: '"+ buildTimestamp + "'",
    allowEmptyPaths: false,
};

try {
    var changedFiles = replace.sync(options);
    if (changedFiles == 0) {
        //console.log "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
    console.log('Build version set: ' + buildVersion);

    var timestampFiles = replace.sync(optionsTimestamp);
    if (changedFiles == 0) {
        //throw "Please make sure that file '" + optionsTimestamp.files + "' has \"versionTimestamp: ''\"";
    }
    console.log('Build timestamp set: ' + buildTimestamp);
}
catch (error) {
    console.error('Error occurred:', error);
}
