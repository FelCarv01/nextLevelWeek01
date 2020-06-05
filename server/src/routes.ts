import express from "express";
import PointController from "./controllers/point_controller";
import ItemController from "./controllers/item_controller";

const routes = express.Router();
const pointController = new PointController();
const itemController = new ItemController();

routes.get('/items', itemController.index);

routes.get('/points', pointController.index)
routes.post('/points', pointController.create)
routes.get('/points/:id', pointController.show)

export default routes;