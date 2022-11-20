import { Router, Request, Response } from "express";
import { User } from "../models/userEntity";
import bcrypt from "bcrypt";
import Token from "../classes/token";

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
    });
});

export default userRoutes;
