import { Request, Response } from "express";
import { db2 } from "@/utils/db2";

export const get = [
    async (req:Request, res: Response) => {
        const userData = await db2.pHP_ms_login.findMany({
            where: {
                expired_date_temp: null,
            },
            select: {
                lg_nik: true,
                lg_name: true,
                lg_email_aio: true,
            }
        });
        res.json({
            status: true,
            data: userData,
        })
    }
]

export const post = [
    async (req: Request, res: Response) => {
        try {
            const {lg_nik, lg_name, lg_email_aio} = req.body;

            const userData = await db2.pHP_ms_login.create({
                data: {
                   lg_nik: lg_nik,
                   lg_name: lg_name,
                   lg_email_aio: lg_email_aio 
                },
            });
            res.status(201).json({
                status: true,
                data: userData
            });
        }
        catch (error) {
            console.error(error)
            res.status(500).json({
                error
            })
        }
    }
]