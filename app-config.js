const fs = require('fs');

const CONFIG_FILE = "app-config.json";

let appConfig;

exports.getAppConfig = function () {
    if (!appConfig) {
        if (fs.existsSync(CONFIG_FILE)) {
            let json = fs.readFileSync(CONFIG_FILE);
            appConfig = JSON.parse(json);
        } else {
            appConfig = {};
            appConfig.mysql = {};
        }
    }
    return appConfig;
}
