"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const projectEntity_1 = require("../models/projectEntity");
const file_system_1 = __importDefault(require("../classes/file-system"));
const projectRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
//Crear Projects
projectRoutes.post("/", [auth_1.tokenVerify], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const evidence = fileSystem.evidenceFromTempToProjects(req.user._id);
    body.evidence = evidence;
    projectEntity_1.Project.create(body)
        .then((projectDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectDB.populate("user", "-password");
        res.json({
            ok: true,
            project: projectDB,
        });
    }))
        .catch((err) => {
        res.json({
            ok: false,
            message: err,
        });
    });
});
//Obtener Projects Paginados
projectRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let paginate = Number(req.query.paginate) || 1;
    let skip = paginate - 1;
    skip = skip * 10;
    const projects = yield projectEntity_1.Project.find()
        .where('user')
        .equals(req.query.userId)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate("user", "-password")
        .exec();
    res.json({
        ok: true,
        paginate,
        projects,
    });
}));
//Servicio subir archivos
projectRoutes.post("/upload", [auth_1.tokenVerify], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No se ha encontrado ningun archivo",
        });
    }
    const file = req.files.evidence;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: "No se subio ningun archivo",
        });
    }
    yield fileSystem.saveTempEvidence(file, req.user._id);
    res.json({
        ok: true,
        file: file.mimetype,
    });
}));
//Servicio mostrar archivos
projectRoutes.get("/evidence/:userId/:file", (req, res) => {
    const userId = req.params.userId;
    const file = req.params.file;
    const pathFile = fileSystem.getFileUrl(userId, file);
    res.sendFile(pathFile);
});
exports.default = projectRoutes;
