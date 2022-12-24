import { Request, Response } from "express";
import { connect } from "../database";
import Token from "../token";
import { User } from "../interfaces/User";
import bcrypt from "bcrypt";

export function indexUser(req: Request, res: Response): Response {
  return res.json("Welcome to User Services");
}

export async function loginUser(req: Request, res: Response) {
  try {
    const user: User = req.body;
    const connection = await connect();

    const exists = await connection
      .query("SELECT EXISTS(SELECT * FROM users WHERE email = ?)", user.email)
      .then(async (exs) => {
        if (!exs) {
          return res.json({
            ok: false,
            code: "0079",
            message: "Error: " + "User not found",
          });
        } else {
          await connection
            .query("INSERT INTO users SET ?", [user])
            .then((result) => {
              return res.json({
                ok: true,
                code: "0001",
                message: "User Login Success",
              });
            });
        }
      });
  } catch (err: any) {
    return res.json({
      ok: false,
      code: err.code,
      message: "Error: " + err.message,
    });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const user: User = req.body;
    const connection = await connect();

    const exists = await connection.query(
      "SELECT EXISTS(SELECT * FROM users WHERE email = ?)",
      user.email
    );

    if (!exists) {
      user.password = bcrypt.hashSync(req.body.password, 10);
      await connection
        .query("INSERT INTO users SET ?", [user])
        .then((result) => {
          const tokenUser = Token.getJwtToken({
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
    } else {
      return res.json({
        ok: false,
        code: "0079",
        message: "Error: " + "User already exists",
      });
    }
  } catch (err: any) {
    return res.json({
      ok: false,
      code: err.code,
      message: "Error: " + err.message,
    });
  }
}
