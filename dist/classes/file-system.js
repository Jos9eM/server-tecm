"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveTempEvidence(file, userId) {
        return new Promise((resolve, reject) => {
            //Crear carpetas de archivos
            const path = this.createUserPath(userId);
            //Modificar nombre del archivo
            const fileName = this.generateFileName(file.name);
            //Mover el archivo al path
            //Volumes/Esclavo/TESE/AppsMoviles/Proyectos/tecnm-server/
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generateFileName(originalName) {
        const nameArr = originalName.split(".");
        const ext = nameArr[nameArr.length - 1];
        const id = (0, uniqid_1.default)();
        return `${id}.${ext}`;
    }
    createUserPath(userId) {
        const userPath = path_1.default.resolve(__dirname, "../uploads/", userId);
        const userPathTemp = userPath + "/tmp";
        const exists = fs_1.default.existsSync(userPath);
        if (!exists) {
            fs_1.default.mkdirSync(userPath);
            fs_1.default.mkdirSync(userPathTemp);
        }
        return userPathTemp;
    }
    evidenceFromTempToProjects(userId) {
        const tempPath = path_1.default.resolve(__dirname, "../uploads/", userId, "tmp");
        const pathProject = path_1.default.resolve(__dirname, "../uploads/", userId, "projects");
        if (!fs_1.default.existsSync(tempPath)) {
            return "";
        }
        if (!fs_1.default.existsSync(pathProject)) {
            fs_1.default.mkdirSync(pathProject);
        }
        const evidenceTemp = this.getEvidenceInTemp(userId);
        evidenceTemp.forEach((element) => {
            fs_1.default.renameSync(`${tempPath}/${element}`, `${pathProject}/${element}`);
        });
        return evidenceTemp;
    }
    getEvidenceInTemp(userId) {
        const tempPath = path_1.default.resolve(__dirname, "../uploads/", userId, "tmp/");
        console.log(tempPath);
        return fs_1.default.readdirSync(tempPath) || [];
    }
    getFileUrl(userId, fileName) {
        const projectPath = path_1.default.resolve(__dirname, "../uploads/", userId, "projects", fileName);
        const exists = fs_1.default.existsSync(projectPath);
        if (!exists) {
            return path_1.default.resolve(__dirname, "../assets/not_found.png");
        }
        return projectPath;
    }
}
exports.default = FileSystem;
