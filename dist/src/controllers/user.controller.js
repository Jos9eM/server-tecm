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
exports.createUser = exports.loginUser = exports.indexUser = void 0;
const database_1 = require("../database");
const token_1 = __importDefault(require("../token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function indexUser(req, res) {
    return res.json("Welcome to User Services");
}
exports.indexUser = indexUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            const connection = yield (0, database_1.connect)();
            const exists = yield connection
                .query("SELECT EXISTS(SELECT * FROM users WHERE email = ?)", user.email)
                .then((exs) => __awaiter(this, void 0, void 0, function* () {
                if (!exs) {
                    return res.json({
                        ok: false,
                        code: "0079",
                        message: "Error: " + "User not found",
                    });
                }
                else {
                    yield connection
                        .query("INSERT INTO users SET ?", [user])
                        .then((result) => {
                        return res.json({
                            ok: true,
                            code: "0001",
                            message: "User Login Success",
                        });
                    });
                }
            }));
        }
        catch (err) {
            return res.json({
                ok: false,
                code: err.code,
                message: "Error: " + err.message,
            });
        }
    });
}
exports.loginUser = loginUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            const connection = yield (0, database_1.connect)();
            const exists = yield connection.query("SELECT EXISTS(SELECT * FROM users WHERE email = ?)", user.email);
            if (!exists) {
                user.password = bcrypt_1.default.hashSync(req.body.password, 10);
                yield connection
                    .query("INSERT INTO users SET ?", [user])
                    .then((result) => {
                    const tokenUser = token_1.default.getJwtToken({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        avatar: user.avatar,
                    });
                    return res.json({
                        ok: true,
                        token: tokenUser,
                    });
                });
            }
            else {
                return res.json({
                    ok: false,
                    code: "0079",
                    message: "Error: " + "User already exists",
                });
            }
        }
        catch (err) {
            return res.json({
                ok: false,
                code: err.code,
                message: "Error: " + err.message,
            });
        }
    });
}
exports.createUser = createUser;
