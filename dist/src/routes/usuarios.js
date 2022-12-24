"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userEntity_1 = require("../models/userEntity");
const token_1 = __importDefault(require("../token"));
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
// Login
userRoutes.post("/login", user_controller_1.loginUser);
/*User.findOne({ email: body.email }, (err: any, userDB: any) => {
  if (err) throw err;
  if (!userDB) {
    return res.json({
      ok: false,
      message: "Usuario invalido",
    });
  }

  if (userDB.passwordCompare(body.password)) {
    const tokenUser = Token.getJwtToken({
      _id: userDB._id,
      name: userDB.name,
      email: userDB.email,
      avatar: userDB.avatar,
    });

    return res.json({
      ok: true,
      token: tokenUser,
    });
  } else {
    return res.json({
      ok: false,
      message: "La contraseña no es valida",
    });
  }
});*/
// User Create
userRoutes.post("/createUser", user_controller_1.createUser);
/*(req: Request, res: Response) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  User.create(user)
    .then((userDB) => {
      const tokenUser = Token.getJwtToken({
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
    });*/
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
