import type { RequestHandler } from "express";
import cartItemRepository from "./cartItemRepository";

const browseByUser: RequestHandler = async (req, res, next) => {
   try {
      const userId = Number(req.params.userId);

      const cartItems = await cartItemRepository.readByUser(userId);
      res.json(cartItems)
   } catch (err) {
      next (err);
   }
};

const addToCart: RequestHandler = async (req, res, next) => {
   try {
      const newCartItem = {
         user_id: req.body.user_id,
         photo_id: req.body.photo_id,
         quantity: req.body.quantity,
         unit_price: req.body.unit_price,
      };
      const insertId = await cartItemRepository.create(newCartItem);

      res.status(201).json({insertId})
   } catch (err) {
      next (err);
   }
};

const updateQuantity: RequestHandler = async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: "Quantité invalide." });
      return;
    }

    const updated = await cartItemRepository.updateQuantity(cartItemId, quantity);

    if (!updated) {
      res.sendStatus(404); // rien mis à jour
    } else {
      res.json({ message: "Quantité mise à jour." });
    }
  } catch (err) {
    next(err);
  }
};

const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Statut manquant." });
      return;
    }

    const updated = await cartItemRepository.updateStatus(cartItemId, status);

    if (!updated) {
      res.sendStatus(404); // rien mis à jour
    } else {
      res.json({ message: "Statut mis à jour." });
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.id);
    const deleted = await cartItemRepository.delete(cartItemId);
    if (!deleted) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const destroyAll: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const cleared = await cartItemRepository.clearByUser(userId);
    if (!cleared) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};


export default {
   browseByUser,
   addToCart,
   updateQuantity,
   updateStatus,
   destroy,
   destroyAll,
}