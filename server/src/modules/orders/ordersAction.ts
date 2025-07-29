import type { RequestHandler } from "express";
import orderRepository from "./ordersRepository";
import type { Order, OrderItem } from "./ordersRepository";


// Créer une commande
const create: RequestHandler<unknown, { orderId: number }, { userId: number }> = async (req, res, next) => {
  try {
    const orderId = await orderRepository.create(req.body.userId);
    res.status(201).json({ orderId });
  } catch (err) {
    next(err);
  }
};

// Lire une commande par ID
const read: RequestHandler<{ id: string }, Order & { items: OrderItem[] } | null> = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const order = await orderRepository.read(orderId);
    if (!order) {
      res.sendStatus(404);
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// Lire toutes les commandes (admin)
const readAll: RequestHandler<unknown, Order[]> = async (req, res, next) => {
  try {
    const orders = await orderRepository.readAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Lire commandes d’un utilisateur
const readByUser: RequestHandler<{ userId: string }, Order[]> = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const orders = await orderRepository.readByUser(userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Modifier le statut
const updateStatus: RequestHandler<{ id: string }, { success: boolean }, { status: string }> = async (req, res, next) => {
  try {
    const updated = await orderRepository.updateStatus(Number(req.params.id), req.body.status);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  read,
  readAll,
  readByUser,
  updateStatus,
};
