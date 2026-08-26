<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text="Voltar" />
        </ion-buttons>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="about-page">
      <div class="content-shell">
        <section class="glass-card">
          <div class="badge">AI</div>
          <p class="eyebrow">Albumfy</p>
          <h2>Uma experiência visual moderna para guardar momentos.</h2>
          <p>
            Esta aplicação foi pensada para organizar fotos com um visual premium, elegante e
            funcional, com foco em simplicidade e fluidez de uso.
          </p>
        </section>

        <section class="info-list">
          <div class="info-item">
            <span class="label">Versão</span>
            <strong>1.0.0</strong>
          </div>
          <div class="info-item">
            <span class="label">Funcionalidades</span>
            <strong>Galeria, câmera, remoção e autenticação</strong>
          </div>
          <div class="info-item">
            <span class="label">Termos de uso</span>
            <strong>Este app foi desenvolvido para uso pessoal e acadêmico. O usuário deve utilizar a aplicação de forma responsável e não compartilhar conteúdos ofensivos, ilegais ou que violem direitos de terceiros.</strong>
          </div>
          <div class="info-item">
            <span class="label">Privacidade</span>
            <strong>As imagens selecionadas são armazenadas localmente no dispositivo pelo navegador, com finalidade de organização e visualização dentro do aplicativo.</strong>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from '@ionic/vue';
</script>

<style scoped>
.about-page {
  --background: linear-gradient(180deg, #0a1023 0%, #111a35 100%);
}

.content-shell {
  padding: 18px 18px 36px;
}

.glass-card {
  padding: 24px 20px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 70px rgba(8, 12, 22, 0.32);
}

.badge {
  width: 58px;
  height: 58px;
  margin-bottom: 12px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c5cff 0%, #3dc9ff 100%);
  color: white;
  font-weight: 800;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  color: rgba(202, 213, 255, 0.75);
}

h2 {
  margin: 0 0 12px;
  color: #f5f7ff;
  font-size: clamp(1.5rem, 5vw, 2.2rem);
}

p {
  margin: 0;
  color: rgba(227, 233, 255, 0.8);
  line-height: 1.7;
}

.info-list {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.label {
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(185, 195, 255, 0.7);
}

strong {
  color: #f5f7ff;
  font-size: 0.98rem;
  line-height: 1.6;
}
</style>
