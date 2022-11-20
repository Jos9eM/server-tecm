import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  avatar: {
    type: String,
    default: "av-1.png",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es necesaria"],
  },
});

userSchema.method("passwordCompare", function (password = ""): boolean {
  return bcrypt.compareSync(password, this.password);
});

interface userInterface extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;

  passwordCompare(password: string): boolean;
}

export const User = model<userInterface>("User", userSchema);
