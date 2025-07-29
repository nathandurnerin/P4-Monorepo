import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../modules/user/userRepository";
import type { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
  id: number;
}

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({ message: "Token requis" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).send({ message: "Clé secrète manquante" });

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.id;
    const user = await userRepository.read(userId);

    if (!user || !user.is_admin) {
      return res.status(403).send({ message: "Accès interdit" });
    }

    req.body.userID = userId;
    next();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    return res.status(401).send({ message: "Token invalide" });
  }
};

export default checkAdmin;
