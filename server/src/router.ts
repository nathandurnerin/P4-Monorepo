import express from "express";
import check from "./middlewares/security";
const router = express.Router();
import upload from "./middlewares/upload";
/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items/joint", check.checkToken, itemActions.joint);
router.get("/api/items", itemActions.browse);
router.get("/api/items/:id([0-9]+)", check.checkToken, itemActions.read);
router.post("/api/items", check.checkToken, itemActions.add);
router.delete("/api/items/:id([0-9]+)", itemActions.destroy);
router.put("/api/items/:id([0-9]+)", itemActions.update);

import userAction from "./modules/user/userAction";
router.get(
  "/api/users/:id([0-9]+)",
  check.checkToken,
  check.isAdmin,
    userAction.read,
);
router.get("/api/users/my-account", check.checkToken, userAction.myAccount);

import authAction from "./modules/auth/authAction";
router.post("/api/auth/signin", authAction.signIn);
router.post("/api/auth/signup",  upload.single('file'), authAction.signUp);

/* ************************************************************************* */

export default router;
