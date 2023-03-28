import { Router } from "express";

import { getRecords } from "../controllers/RecordController";

const recordRoutes = Router();

recordRoutes.route("/api/records").get(getRecords);

export default recordRoutes;
