import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";
import userRepository from "../user/userRepository";

const tokenKey = process.env.JWT_SECRET;
if (!tokenKey) {
  throw new Error("La clé secrète du token n'est pas définie dans le .env");
}

// Connexion d'un utilisateur
const signIn = async (request:Request, response: Response):Promise<any> => {
   const {email, password} = request.body;

   try {
      const user = await userRepository.findByEmail(email);

      if (!user) {
         return response.status(401).json({message: "Erreur d'authentification"});
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash || "");

      if (!isPasswordValid) {
         return response.status(401).json({message: "Mot de passe incorrect"});
      }

      const token = jwt.sign({id: user.id, email:user.email}, tokenKey, {
         expiresIn: "1h",
      });

      response.json({
         message: "Authentification réussie",
         token,
         user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            is_admin: Boolean(user.is_admin),
            is_actif: Boolean(user.is_actif),
         },
      });
   } catch (err) {
      response.status(500).json({message: "Erreur serveur", error:err});
   }
};

// Inscription d'un nouvel utilisateur
const signUp = async (request: Request, response: Response):Promise<any> => {
   const {
      firstname,
      lastname,
      email,
      password,
      is_admin = false,
      is_actif = true,
   } = request.body;

   try {
      const password_hash = await bcrypt.hash(password, 10);

      const insertId = await userRepository.create({
         firstname,
         lastname,
         email,
         password_hash,
         is_actif,
         is_admin,
      });

      const newUser = await userRepository.read(insertId);

      const token = jwt.sign({ id:newUser?.id, email: newUser?.email}, tokenKey, {
         expiresIn: "1h",
      });

      response.status(201).json({
         message: "Utilisateur crée",
         token,
         user: newUser,
      });
   } catch (err) {
      response.status(500).json({ message: "Erreur à la création de l'utilisateur", error: err});
   }
};

export default { signIn, signUp}