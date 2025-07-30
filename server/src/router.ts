import express from "express";
import { checkEmailExist } from "./middlewares/checkEmailExist";
import { checkToken } from "./middlewares/security";

const router = express.Router();

import photoAction from "./modules/photos/photoAction";
router.get("/photos",photoAction.browse);
router.get("/photo/:id",photoAction.read);
router.put("/photo/:id",photoAction.edit);
router.post("/photo",photoAction.add);
router.delete("/photo/:id",photoAction.destroy);

import galleryAction from "./modules/gallery/galleryAction";
router.get("/gallery",galleryAction.browse);
router.get("/gallery/:id",galleryAction.read);
router.put("/gallery/:id",galleryAction.edit);
router.post("/gallery",galleryAction.add);
router.delete("/gallery/:id",galleryAction.destroy);

import locationAction from "./modules/location/locationAction";
router.get("/location",locationAction.browse);
router.get("/location/:id",locationAction.read);
router.put("/location/:id",locationAction.edit);
router.post("/location",locationAction.add);
router.delete("/location/:id",locationAction.destroy);

import ordersAction from "./modules/orders/ordersAction";
router.post("/order",checkToken,ordersAction.create);
router.get("/order/:id",ordersAction.read);
router.get("/orders",ordersAction.readAll);
router.get("/orders/user/:id",ordersAction.readByUser);
router.put("/order/:id",ordersAction.updateStatus);


import cartItemAction from "./modules/cartItem/cartItemAction";
router.get("/cartItem",cartItemAction.browseByUser);
router.post("/cartItem",checkToken,cartItemAction.addToCart);
router.put("/cartItem/:id/quantity",cartItemAction.updateQuantity);
router.put("/cartItem/:id/status",cartItemAction.updateStatus);
router.delete("/cartItem/:id",cartItemAction.destroy);
router.delete("/cartItem",cartItemAction.destroyAll);

import userAction from "./modules/user/userAction";
router.get("/user",checkToken,userAction.browse);
router.get("/user/:id",userAction.read);
router.put("/user/:id",checkToken,userAction.edit);
router.post("/user",userAction.add);
router.delete("/user/:id",checkToken,userAction.destroy);

import authAction from "./modules/auth/authAction";
router.post("/auth/login", authAction.signIn);
router.post("/auth/register",checkEmailExist, authAction.signUp);

export default router;