import { createContext, useContext, useEffect, useState } from "react"

export type Photo = {
   id: number;
   title: string;
   url: string;
   price: number;
   gallery_id: number;
   location_id: number;
}

type PhotoContextType = {
   photos: Photo[];
   error: string | null;
   fetchPhotos: () => Promise<void>;
   filterByGallery: (galleryId: number) => void;
   filterByLocation: (locationId: number) => void;
   selectedGalleryId: number | null;
   selectedLocationId: number | null;
   addPhoto: (photo: Omit<Photo, "id">) => Promise<void>;
   updatePhoto: (photo: Photo) => Promise<void>;
   deletePhoto: (photoId: number) => Promise<void>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: React.ReactNode}) => {
   const [photos, setPhotos] = useState<Photo[]>([]);
   const [error, setError] = useState<string | null>(null);
   const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
   const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
   
   const fetchPhotos = async (): Promise<void> => {
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photos`);
         const data = await res.json();
         setPhotos(data);
         setError(null);
      } catch (err) {
         setError("Erreur lors du chargement des photos");
      }
   };
   
   useEffect(() => {
      fetchPhotos();
   }, []);

   const filterByGallery = (galleryId: number) => {
      setSelectedGalleryId(galleryId);
   };

   const filterByLocation = (locationId: number) => {
      setSelectedLocationId(locationId);
   };

   const addPhoto = async (photo: Omit<Photo, "id">): Promise<void> => {
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photo`, {
            method: "POST",
            headers: {
               "Content-type": "application/json"
            },
            body: JSON.stringify(photo),
         });
         if (!res.ok) throw new Error();
         await fetchPhotos();
      } catch {
         setError("Erreur lors de l'ajout de la photo");
      }
   };

   const updatePhoto = async (photo: Photo): Promise<void> => {
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photo/${photo.id}`, {
            method: "PUT",
            headers: {
               "Content-type": "application/json"
            },
            body: JSON.stringify(photo),
         });
         if (!res.ok) throw new Error();
         await fetchPhotos();
      } catch {
         setError("Erreur lors de la mise à jour");
      }
   };

   const deletePhoto = async (photoId: number): Promise<void> => {
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photo/${photoId}`, {
            method: "DELETE",
         });
         if (!res.ok) throw new Error();
         await fetchPhotos();
      } catch {
         setError("Erreur lors de la suppression");
      }
   };

   return (
      <PhotoContext.Provider
         value={{
            photos,
            error,
            fetchPhotos,
            filterByGallery,
            filterByLocation,
            selectedGalleryId,
            selectedLocationId,
            addPhoto,
            updatePhoto,
            deletePhoto,
         }}
      >
         {children}
      </PhotoContext.Provider>
   );
};

export const usePhotoContext = () => {
   const context = useContext(PhotoContext);
   if (!context) {
      throw new Error("usePhotoContext doit etre utilisé dans un PhotoProvider");
   }
   return context;
};
