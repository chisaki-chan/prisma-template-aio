import 'module-alias/register';

import path from "path";
import cors from "cors";
import express, { json, urlencoded } from "express";
import createRouter, { router } from "express-file-routing";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import userRoutes from './routes/user/[id]/index';

const main = async () => {
  dotenv.config();

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(fileUpload());
  app.use(morgan('dev')); // Add Morgan middleware
  app.use(express.static(path.join(__dirname, '../public')));

  const router = express.Router();

  let bodyParser = require('body-parser');

  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  await createRouter(router, {
    directory: path.join(__dirname, "routes"),
  });

  app.use("/api", router);

  await createRouter(router, {
    directory: path.join(__dirname, "views"),
  });

  app.use("/views", router);

  app.listen(4999, () => {
    console.log("Server started on port 4999");
  });

  app.use('/views/user', userRoutes);

};

main();
