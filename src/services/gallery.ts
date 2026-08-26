export type GalleryPhoto = {
  id: string;
  src: string;
  createdAt: string;
};

const STORAGE_KEY = 'albumfy_gallery_photos';

export const galleryService = {
  getPhotos(): GalleryPhoto[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    try {
      return JSON.parse(raw) as GalleryPhoto[];
    } catch {
      return [];
    }
  },

  addPhoto(src: string): GalleryPhoto {
    if (!src || !src.startsWith('data:image')) {
      throw new Error('A photo is required.');
    }

    const photo: GalleryPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      src,
      createdAt: new Date().toISOString(),
    };

    const photos = this.getPhotos();
    photos.unshift(photo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

    return photo;
  },

  removePhoto(id: string) {
    const photos = this.getPhotos().filter((photo) => photo.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  },
};
