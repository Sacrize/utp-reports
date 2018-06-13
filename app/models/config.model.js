//@ts-check
const path = require("path");

class Config {
    /**
     * Model konfiguracji aplikacji.
     * @constructor
     * @prop {String} env
     * @prop {String} root
     * @prop {String} rootPath
     * @prop {Object} app
     * @prop {Number} port
     * @prop {Object} clamscan
     */
    constructor() {
        this.env = process.env.NODE_ENV || "development";
        this.root = path.normalize(__dirname + "/..");
        this.rootPath = process.env.ROOT_PATH || "/";
        this.app = {
            name: "Express-Vue-MVC-Starter",
        };
        this.port = Number(process.env.PORT) || 9000;
        this.clamscan = {};
    }
}
module.exports = Config;
