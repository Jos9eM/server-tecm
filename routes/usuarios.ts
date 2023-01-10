import { Router, Request, Response } from "express";
import { User } from "../models/userEntity";
import Token from "../classes/token";
import { tokenVerify } from "../middlewares/auth";

const bcrypt = require("bcrypt");
const userRoutes = Router();

// Login
userRoutes.post("/login", async (req: Request, res: Response) => {
  const body = req.body;

  User.findOne({ email: body.email }, (err: any, userDB: any) => {
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
  });
});

// User Create
userRoutes.post("/createUser", (req: Request, res: Response) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
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
    });
});

// Actualizar usuarios
userRoutes.post("/update", [tokenVerify], (req: any, res: Response) => {
  const user = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    avatar: req.body.avatar || req.user.avatar,
  };

  User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
    if (err) throw err;
    if (!userDB) {
      return res.json({
        ok: false,
        message: "Usuario no encontrado",
      });
    } else {
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
    }
  });
});

// Vericacion usuarios
userRoutes.get("/", [tokenVerify], (req: any, res: Response) => {
  const user = req.user;

  res.json({
    ok: true,
    user
  });
});

export default userRoutes;
