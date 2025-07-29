import type { NextFunction, Request, Response } from "express";
import userRepository from "../modules/user/userRepository";

export const checkEmailExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ message: "Adresse e-mail requise" });
    return;
  }
  try {
    const checkEmail = await userRepository.findByEmail(email);
    if (checkEmail) {
      res.status(409).send({ message: "Adresse e-mail déjà existante" });
      return;
    }
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification de l'adresse e-mail", error);
    res.status(500).send({ message: "Erreur interne du serveur" });
  }
};
