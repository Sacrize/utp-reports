//@ts-check
const path = require("path");

class Config {
    /**
     * Model konfiguracji aplikacji.
     * @constructor
     * @prop {String} env Środowisko konfiguracyjne production/development/stagging
     * @prop {String} root Ścieżka od obecnego katalogu
     * @prop {String} rootPath Ścieżka od roota
     * @prop {Object} app Konfiguracja aplikacji
     * @prop {Number} port Port, na którym nasłuchuje web server
     * @prop {Object} clamscan Konfiguracja antywirusa
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
