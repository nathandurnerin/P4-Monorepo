import type { RequestHandler } from "express";

import photoRepository from "./photoRepository"

interface Photo {
   id: number;
   title: string;
   url: string;
   price: number;
   gallery_id: number;
   location_id: number
}

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
   try {
      // Fetch toutes les photos
      const photos = await photoRepository.readAll()

      // Reponse avec les animes au format JSON
      res.json(photos);
   }catch (err) {
      next(err)
   }
}

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
   try {
      // Fetch un élément spécifique à partir de l'ID fourni
      const photoId = Number(req.params.id);
      const photo = await photoRepository.read(photoId)

      // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
      // Sinon, répondez avec l'élément au format JSON
      if (photo == null) {
         res.sendStatus(404)
      } else {
         res.json(photo)
      }
   } catch (err) {
      next(err);
   }
}

// Le E de BREAD
const edit: RequestHandler = async (req, res, next) => {
  try {
   const photo = {
      id: Number(req.params.id),
      title: req.body.title,
      url: req.body.url,
      price: req.body.price,
      gallery_id: req.body.gallery_id,
      location_id: req.body.location_id,
   };

   const affectedRows = await photoRepository.update(photo);
   // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (affectedRows ===0) {
      res.sendStatus(404);
    } else {
      res.json(photo);
    }
  } catch (err) {
   next(err)
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extraire les données de l'élément du corps de la requête
    // Préparer un nouvel anime sans l'id et avec genre_id obligatoire
    const newPhoto = {
      title: req.body.title,
      url: req.body.url,
      price: req.body.price,
      gallery_id: req.body.gallery_id,
      location_id: req.body.location_id,
    };
    // Create the photo
    const insertId = await photoRepository.create(newPhoto);

    res.status(201).json({insertId});
   } catch (err) {
      next(err)
   }
};

// Le D de Destroy - Supprimer l'élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Supprimer une catégorie spécifique en fonction de l'ID fourni
    const photoId = Number(req.params.id);

    await photoRepository.delete(photoId);

    // Répondez quand même avec HTTP 204 (Aucun contenu)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default {
   browse,
   read,
   edit,
   add,
   destroy,
}