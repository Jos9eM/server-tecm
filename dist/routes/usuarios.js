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
const userEntity_1 = require("../models/userEntity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const userRoutes = (0, express_1.Router)();
// Login
userRoutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    userEntity_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: "Usuario invalido",
            });
        }
        if (userDB.passwordCompare(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            return res.json({
                ok: true,
                token: tokenUser,
            });
        }
        else {
            return res.json({
                ok: false,
                message: "La contraseña no es valida",
            });
        }
    });
}));
// User Create
userRoutes.post("/createUser", (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    userEntity_1.User.create(user)
        .then((userDB) => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        return res.json({
            ok: true,
            token: tokenUser,
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            message: err,
        });
    });
});
// Actualizar usuarios
userRoutes.post("/update", [auth_1.tokenVerify], (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar,
    };
    userEntity_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: "Usuario no encontrado",
            });
        }
        else {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            return res.json({
                ok: true,
                token: tokenUser,
            });
        }
    });
});
exports.default = userRoutes;
