import { Response, Request } from "express";
import { db1 } from "../../utils/db1";
import { authenticateJWT } from '../../middlewares/bearerToken';

export const put = [ authenticateJWT,async (req: Request, res: Response) => {
  
  try {
    const updateDoc = await db1.tr_document.update({
      where: { id: parseInt(req.params.id) },
      data: req.body.form_data,
    });
    
    return res.json(updateDoc);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}];

export const get = [ authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const id = parseInt(req.params.id);
    const type = req.query.type as string;

    if (isNaN(id) || !type) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const data = await db1.tr_document.findMany({
      where: {
        type: type,
        type_id: id,
        is_deleted: "0"
      }
    });

    return res.json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}];