<template>
  <ion-page>
    <ion-content class="auth-page">
      <div class="auth-shell">
        <div class="brand-block">
          <div class="brand-badge">A</div>
          <p class="eyebrow">Bem-vindo de volta</p>
          <h1>Albumfy</h1>
          <p class="subtitle">Organize suas músicas, playlists e momentos favoritos.</p>
        </div>

        <ion-card class="auth-card">
          <ion-card-content>
            <h2>Entrar</h2>

            <ion-item lines="none" class="input-item">
              <ion-icon :icon="mailOutline" slot="start" />
              <ion-input v-model="email" type="email" placeholder="E-mail" autocomplete="email" />
            </ion-item>

            <ion-item lines="none" class="input-item">
              <ion-icon :icon="lockClosed" slot="start" />
              <ion-input v-model="password" type="password" placeholder="Senha" autocomplete="current-password" />
            </ion-item>

            <ion-text color="danger" v-if="errorMessage">
              <p class="error-text">{{ errorMessage }}</p>
            </ion-text>

            <ion-button expand="block" class="primary-button" @click="handleLogin" :disabled="isSubmitting">
              {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
            </ion-button>

            <div class="switch-link">
              <span>Não tem conta?</span>
              <ion-button fill="clear" size="small" @click="goToRegister">Cadastre-se</ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/vue';
import { lockClosed, mailOutline } from 'ionicons/icons';
import { authService } from '@/services/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Preencha seu e-mail e senha.';
    return;
  }

  isSubmitting.value = true;

  try {
    authService.loginUser({ email: email.value, password: password.value });
    router.push('/home');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao entrar.';
  } finally {
    isSubmitting.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.ion-page {
  --background: linear-gradient(135deg, #f5f7ff 0%, #eef3ff 100%);
}

.auth-page {
  --background: linear-gradient(135deg, #f5f7ff 0%, #eef3ff 100%);
}

.auth-shell {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 32px 20px;
}

.brand-block {
  text-align: center;
  margin-bottom: 22px;
}

.brand-badge {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #7c5cff 0%, #53b5ff 100%);
  box-shadow: 0 16px 40px rgba(124, 92, 255, 0.35);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: #6a7ba5;
}

h1 {
  margin: 10px 0 8px;
  color: #1b2440;
  font-size: clamp(2.1rem, 6vw, 3.1rem);
}

.subtitle {
  margin: 0 auto;
  max-width: 360px;
  color: #5f6d9a;
  line-height: 1.5;
}

.auth-card {
  width: min(100%, 420px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(32, 48, 88, 0.12);
}

h2 {
  margin: 0 0 18px;
  color: #1d2a4a;
  font-size: 1.6rem;
}

.input-item {
  --background: rgba(126, 141, 214, 0.06);
  --border-radius: 16px;
  --padding-start: 14px;
  --inner-padding-end: 14px;
  margin-bottom: 14px;
  border-radius: 16px;
}

ion-icon {
  color: #7c5cff;
}

.primary-button {
  --background: linear-gradient(135deg, #7c5cff 0%, #53b5ff 100%);
  --background-hover: linear-gradient(135deg, #6d4ff0 0%, #4ba4f5 100%);
  --border-radius: 16px;
  margin-top: 12px;
  font-weight: 700;
}

.switch-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  color: #5d6c97;
  gap: 8px;
}

.switch-link ion-button {
  --color: #5d6c97;
  font-weight: 700;
}

.error-text {
  margin: 0 0 10px;
  font-size: 0.88rem;
}
</style>
