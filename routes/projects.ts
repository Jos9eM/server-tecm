import { Router, Response } from "express";
import { IFileUpload } from "../interfaces/file-upload";
import { tokenVerify } from "../middlewares/auth";
import { Project } from "../models/projectEntity";
import FileSystem from "../classes/file-system";

const projectRoutes = Router();
const fileSystem = new FileSystem();

//Crear Projects
projectRoutes.post("/", [tokenVerify], (req: any, res: Response) => {
  const body = req.body;
  body.user = req.user._id;

  const evidence = fileSystem.evidenceFromTempToProjects(req.user._id);
  body.evidence = evidence;

  Project.create(body)
    .then(async (projectDB) => {
      await projectDB.populate("user", "-password");
      res.json({
        ok: true,
        project: projectDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        message: err,
      });
    });
});

//Obtener Projects Paginados
projectRoutes.get("/", async (req: any, res: Response) => {
  let paginate = Number(req.query.paginate) || 1;
  let skip = paginate - 1;
  skip = skip * 10;

  const projects = await Project.find()
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
});

//Servicio subir archivos
projectRoutes.post(
  "/upload",
  [tokenVerify],
  async (req: any, res: Response) => {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        message: "No se ha encontrado ningun archivo",
      });
    }

    const file: IFileUpload = req.files.evidence;

    if (!file) {
      return res.status(400).json({
        ok: false,
        message: "No se subio ningun archivo",
      });
    }

    await fileSystem.saveTempEvidence(file, req.user._id);

    res.json({
      ok: true,
      file: file.mimetype,
    });
  }
);

//Servicio mostrar archivos
projectRoutes.get("/evidence/:userId/:file", (req: any, res: Response) => {
  const userId = req.params.userId;
  const file = req.params.file;

  const pathFile = fileSystem.getFileUrl(userId, file);

  res.sendFile(pathFile);
});

export default projectRoutes;
