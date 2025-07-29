import type { RequestHandler } from "express";

import locationRepository from "./locationRepository";

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    const location = await locationRepository.readAll();
    res.json(location);
  } catch (err) {
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
   try {
      // Fetch un élément spécifique à partir de l'ID fourni
      const locationId = Number(req.params.id);
      const location = await locationRepository.read(locationId)

      // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
      // Sinon, répondez avec l'élément au format JSON
      if (location == null) {
         res.sendStatus(404)
      } else {
         res.json(location)
      }
   } catch (err) {
      next(err);
   }
}

// Le E de BREAD
const edit: RequestHandler = async (req, res, next) => {
  try {
   const location = {
      id: Number(req.params.id),
      title: req.body.title,
   };

   const affectedRows = await locationRepository.update(location);
   // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (affectedRows ===0) {
      res.sendStatus(404);
    } else {
      res.json(location);
    }
  } catch (err) {
   next(err)
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Validate input before proceeding
    if (!req.body.title || typeof req.body.title !== 'string') {
      res.status(400).json({ error: "Invalid or missing title" });
      return;
    }
    // Extraire les données de l'élément du corps de la requête
    // Préparer un nouvel anime sans l'id et avec genre_id obligatoire
    const newLocation = {
      title: req.body.title,
    };
    // Create the location
    const insertId = await locationRepository.create(newLocation);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Le D de Destroy - Supprimer l'élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Supprimer une catégorie spécifique en fonction de l'ID fourni
    const locationId = Number(req.params.id);

    await locationRepository.delete(locationId);

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
};
