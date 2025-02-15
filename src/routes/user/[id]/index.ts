import express, { Request, Response } from 'express';
import { db2 } from '@/utils/db2';

const router = express.Router();

// GET user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userData = await db2.pHP_ms_login.findFirst({
            where: {
                expired_date_temp: null,
                lg_nik: id
            },
            select: {
                lg_nik: true,
                lg_name: true,
                lg_email_aio: true,
            },
        });

        if (!userData) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.json({ status: true, data: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { lg_name, lg_email_aio } = req.body;
        const { id } = req.params;

        const userData = await db2.pHP_ms_login.update({
            where: { lg_nik: id },
            data : {
                lg_name: lg_name,
                lg_email_aio: lg_email_aio,
            }
        });
        return res.json({
            status: true,
            data: userData,
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error"});
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const userData = await db2.pHP_ms_login.update({
        where: { lg_nik:id },
        data: {
            expired_date_temp: new Date(),
        }
    })

    return res.json({
        status: true,
        data: userData,
    })
})

export default router;
