import { IFileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  saveTempEvidence(file: IFileUpload, userId: string) {
    return new Promise<void>((resolve, reject) => {
      //Crear carpetas de archivos
      const path = this.createUserPath(userId);
      //Modificar nombre del archivo
      const fileName = this.generateFileName(file.name);
      //Mover el archivo al path
      file.mv(`${ path }/${ fileName }`, (err: any) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
      });
    });
  }

  private generateFileName(originalName: string) {
    const nameArr = originalName.split('.');
    const ext = nameArr[nameArr.length - 1];

    const id = uniqid();

    return `${id}.${ext}`;
  }

  private createUserPath(userId: string) {
    const userPath = path.resolve(__dirname, "../uploads/", userId);
    const userPathTemp = userPath + '/tmp';

    const exists = fs.existsSync(userPath);
    
    if (!exists) {
      fs.mkdirSync(userPath);
      fs.mkdirSync(userPathTemp);
    }
  }
}
