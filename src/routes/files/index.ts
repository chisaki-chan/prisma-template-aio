import { Response, Request } from "express";
import { db1 } from "../../utils/db1";
import { db2 } from "../../utils/db2";
import { db3 } from "../../utils/db3";
import path from "path";
import fs from "fs";

interface CustomRequest extends Request {
  files?: {
    [key: string]: any;
  };
}

const saveFile = (file: any, folderName: string) => {
  if (!file || !file.data) return null;

  const uploadDir = path.resolve(__dirname, "../../../public/upload");
  const dir = path.join(uploadDir, folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileExtension = path.extname(file.name);
  const filename = `${folderName}_${Date.now()}${fileExtension}`;
  const filePath = path.join(dir, filename);

  try {
    fs.writeFileSync(filePath, file.data);
    return filename;
  } catch (error) {
    console.error(`Error saving ${folderName}:`, error);
    return null;
  }
};



export const post = async (req: CustomRequest, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const updates: any = {};

    const file = req.files?.file;
    let pathFile = '';
    if (file) {
      const filename = saveFile(file, 'request');
      if (filename) {
        pathFile = `upload/request/${filename}`;
      }
    }

    const fileNameWithExt = req.files.file.name;
    const fileExt = path.extname(fileNameWithExt);
    const fileNameWithoutExt = path.basename(fileNameWithExt, fileExt);

    const updatedFile = await db1.tr_document.create({
      data: {
        name: fileNameWithoutExt,
        filename: fileNameWithExt,
        filepath: pathFile,
        mime: req.files.file.mimetype,
        filesize: file.size
      }
    });


    return res.status(200).json({
      status: true,
      data:updatedFile
    });


    // if (Object.keys(updates).length > 0) {
    //   const updatedFile = await db1.tr_document.create({
    //     data: {
    //       name: 
    //     }
    //   });


   
    // } else {
    //   return res.status(400).json({ error: "No valid files were uploaded." });
    // }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};
