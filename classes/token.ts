import jwt from "jsonwebtoken";

export default class Token {
  private static seed: string = "seed-secreto-de-la-application";
  private static caducity: string = "30d";

  constructor() {}

  static getJwtToken(payload: any): string {
    return jwt.sign(
      {
        user: payload,
      },
      this.seed,
      { expiresIn: this.caducity }
    );
  }

  static verifyToken(userToken: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(userToken, this.seed, (err, decoded) => {
        if (err) {
          // no confiar en el token
          reject();
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
