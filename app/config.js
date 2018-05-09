//@ts-check
const dotenv = require("dotenv");
const Models = require("./models");

let envFile = "development.env";
const env = process.env.NODE_ENV || "development";

if (process.env.ENV !== undefined) {
    envFile = env + ".env";
}

dotenv.config({
    path: "environment/" + envFile,
});

const config = new Models.Config();

config.clamscan = {
    "remove_infected": true,
    "quarantine_infected": false,
    "scan_log": null,
    "debug_mode": true,
    "file_list": null,
    "scan_recursively": true,
    "clamscan": {
        "path": "/usr/bin/clamscan",
        "db": null,
        "scan_archives": true,
        "active": true
    },
    "clamdscan": {
        "path": "/usr/bin/clamdscan",
        "config_file": "/etc/clamd.conf",
        "multiscan": true,
        "reload_db": false,
        "active": false
    },
    "preference": "clamscan"
};

module.exports = config;
