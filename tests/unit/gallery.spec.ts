import { beforeEach, describe, expect, it } from 'vitest';
import { galleryService } from '@/services/gallery';

describe('galleryService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and removes photos from the gallery', async () => {
    const created = await galleryService.addPhoto(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAF',
    );

    expect(created.id).toBeTruthy();
    expect(galleryService.getPhotos()).toHaveLength(1);

    galleryService.removePhoto(created.id);
    expect(galleryService.getPhotos()).toHaveLength(0);
  });
});
