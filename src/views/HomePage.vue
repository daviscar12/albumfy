<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Galeria</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="goToAbout">Sobre</ion-button>
          <ion-button fill="clear" @click="toggleTheme">
            <ion-icon :icon="isDark ? sunnyOutline : moonOutline" slot="icon-only" />
          </ion-button>
          <ion-button fill="clear" @click="handleLogout">
            <ion-icon :icon="logOutOutline" slot="icon-only" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-page">
      <div v-if="!online" class="offline-banner">Sem conexão com a internet</div>
      <div class="content-shell">
        <section class="hero-card">
          <div>
            <p class="eyebrow">Olá, {{ currentUser?.name || 'Usuário' }}</p>
            <h2>Sua galeria inteligente.</h2>
          </div>
          <div class="avatar-pill">{{ getInitials(currentUser?.name || 'Usuário') }}</div>
        </section>

        <section class="stats-grid">
          <ion-card>
            <ion-card-content>
              <p class="stat-label">Fotos</p>
              <h3>{{ photos.length }}</h3>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-content>
              <p class="stat-label">Última</p>
              <h3>{{ photos.length ? 'Hoje' : '---' }}</h3>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-content>
              <p class="stat-label">Status</p>
              <h3>Ativa</h3>
            </ion-card-content>
          </ion-card>
        </section>

        <div v-if="photos.length === 0" class="empty-state">
          <div class="empty-icon">✦</div>
          <h3>Nenhuma foto ainda</h3>
          <p>Use o botão abaixo para adicionar imagens da galeria ou da câmera.</p>
        </div>

        <div v-else class="photo-grid">
          <article v-for="photo in photos" :key="photo.id" class="photo-card">
            <img :src="photo.src" :alt="`Foto ${photo.id}`" />
            <button type="button" class="remove-btn" @click="removePhoto(photo.id)">Remover</button>
            <button type="button" class="share-btn" @click="sharePhoto(photo)">Compartilhar</button>
          </article>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onFileSelected"
      />
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openSourcePicker">
          <ion-icon :icon="cameraOutline" />
        </ion-fab-button>
      </ion-fab>

      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton,
  actionSheetController,
} from '@ionic/vue';
import { cameraOutline, logOutOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { authService } from '@/services/auth';
import { galleryService } from '@/services/gallery';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';

const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const photos = ref(galleryService.getPhotos());
const online = ref(true);
const currentUser = computed(() => authService.getCurrentUser());
const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  try {
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    // ignore
  }
};

const toggleTheme = async () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    // ignore
  }
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  } catch (e) {
    // ignore
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

const refreshPhotos = () => {
  photos.value = galleryService.getPhotos();
};

const openSourcePicker = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Adicionar foto',
    buttons: [
      {
        text: 'Galeria',
        handler: () => selectFile('gallery'),
      },
      {
        text: 'Câmera',
        handler: () => selectFile('camera'),
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      },
    ],
  });

  await actionSheet.present();
};

const selectFile = (source: 'gallery' | 'camera') => {
  const input = fileInput.value;

  if (!input) {
    return;
  }

  input.accept = 'image/*';
  input.removeAttribute('capture');

  if (source === 'camera') {
    input.setAttribute('capture', 'environment');
  }

  input.click();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    if (typeof reader.result === 'string') {
      galleryService.addPhoto(reader.result);
      refreshPhotos();
    }

    target.value = '';
  };

  reader.readAsDataURL(file);
};

const removePhoto = (id: string) => {
  galleryService.removePhoto(id);
  refreshPhotos();
};

const sharePhoto = async (photo: any) => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    // falha silenciosa em haptics
  }

  try {
    await Share.share({
      title: 'Minha foto',
      text: 'Veja essa foto',
      url: photo.src,
      dialogTitle: 'Compartilhar foto',
    });
  } catch (err) {
    console.error('Falha ao compartilhar via Capacitor Share:', err);
    // Fallback para Web Share API
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'Minha foto', text: 'Veja essa foto', url: photo.src });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(photo.src);
        console.info('Link copiado para a área de transferência como fallback.');
      }
    } catch (e) {
      console.error('Fallback de compartilhamento falhou:', e);
    }
  }
};

const goToAbout = () => {
  router.push('/about');
};

const handleLogout = () => {
  authService.logoutUser();
  router.push('/login');
};

onMounted(async () => {
  // aplicar preferência de tema inicial
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      isDark.value = true;
      applyTheme(true);
    } else if (saved === 'light') {
      isDark.value = false;
      applyTheme(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true;
      applyTheme(true);
    }
  } catch (e) {
    // ignore
  }

  try {
    const status = await Network.getStatus();
    online.value = status.connected;

    const handler = Network.addListener('networkStatusChange', (s) => {
      online.value = s.connected;
    });

    onUnmounted(() => {
      try {
        Promise.resolve(handler).then((h: any) => {
          if (h && typeof h.remove === 'function') {
            h.remove();
          }
        });
      } catch (e) {
        // ignore
      }
    });
  } catch (e) {
    console.warn('Não foi possível obter status de rede:', e);
  }

  if (!authService.isAuthenticated()) {
    router.replace('/login');
  } else {
    refreshPhotos();
  }
});
</script>

<style scoped>
.home-page {
  --background: linear-gradient(180deg, #0a1023 0%, #111a35 100%);
}

.content-shell {
  padding: 18px 18px 90px;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(104, 115, 255, 0.2), rgba(24, 200, 255, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 80px rgba(99, 108, 255, 0.2);
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.68rem;
  color: rgba(206, 214, 255, 0.9);
}

h2 {
  margin: 0;
  color: #f5f7ff;
  font-size: clamp(1.45rem, 4vw, 2.2rem);
}

.avatar-pill {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: linear-gradient(135deg, #7c5cff 0%, #3dc9ff 100%);
  color: #fff;
  box-shadow: 0 20px 40px rgba(93, 145, 255, 0.35);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.stats-grid ion-card {
  margin: 0;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(14, 21, 39, 0.72);
  box-shadow: none;
}

.stat-label {
  margin: 0 0 8px;
  color: rgba(196, 207, 255, 0.7);
  font-size: 0.72rem;
}

h3 {
  margin: 0;
  color: #f2f6ff;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 32px 18px;
  margin-top: 18px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 16px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c5cff, #35d0ff);
  font-size: 2rem;
  box-shadow: 0 18px 36px rgba(91, 110, 255, 0.32);
}

.empty-state p {
  color: rgba(214, 224, 255, 0.72);
  margin: 8px 0 0;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.photo-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 50px rgba(7, 11, 22, 0.28);
}

.photo-card img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  background: rgba(14, 14, 20, 0.72);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(12px);
}

.share-btn {
  position: absolute;
  left: 10px;
  bottom: 10px;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  background: rgba(59, 230, 199, 0.12);
  color: #e6fffa;
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.offline-banner {
  margin: 12px 18px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #ffefc2;
  color: #4a2b00;
  font-weight: 700;
  text-align: center;
}

ion-fab-button {
  --background: linear-gradient(135deg, #7c5cff 0%, #35d0ff 100%);
  --background-activated: linear-gradient(135deg, #6948f6 0%, #29bff8 100%);
  --color: white;
  width: 64px;
  height: 64px;
  box-shadow: 0 20px 45px rgba(120, 113, 255, 0.5);
}

@media (max-width: 360px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
