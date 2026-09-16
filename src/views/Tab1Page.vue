<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>camera</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
 
      <img v-if="fotoSrc" :src="fotoSrc" style="width:100%;border-radius:12px"/>
 
 
      <ion-card v-else>
        <ion-card-content>
          nenhuma foto
        </ion-card-content>
      </ion-card>
 
      <ion-button expand="block" @click="tirarFoto">Tirar Foto</ion-button>
      <ion-button expand="block" fill="outline" @click="verFotos">Ver Fotos</ion-button>
 
   
    </ion-content>
  </ion-page>
</template>
 
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { toastController } from '@ionic/vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton } from '@ionic/vue';
 
const fotoSrc = ref<string | null>(null)
 
  async function salvarImagem(dataUrl: string) {
    const base64Data = dataUrl.split(',')[1];
    const fileName = `foto_${new Date().getTime()}.jpeg`;
 
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents
      });
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      await mostrarToast('Erro ao salvar imagem', 'danger');
    }
  }
 
  async function tirarFoto(){
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 90,
        width: 800
      })
      fotoSrc.value = foto.dataUrl ?? null
      await salvarImagem(foto.dataUrl ?? '')
    }catch (err: unknown){
      if (String(err).includes('cancelled'))
      return
    await mostrarToast('Não foi possivel acessar a camêra', 'danger')
    }
  }
 
  async function abrirGaleria(){
    const foto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    })
    fotoSrc.value = foto.dataUrl ?? null
  }
 
  async function verFotos(){
    await abrirGaleria()
  }
 
  async function mostrarToast(message: string, color: string = 'primary', duration = 2000) {
    const toast = await toastController.create({
      message,
      color,
      duration,
      position: 'bottom'
    })
    await toast.present()
  }
 
  async function verificarPermissao() {
    const status = await Camera.checkPermissions();
 
    if (status.camera !== 'granted') {
      const result = await Camera.requestPermissions();
      if (result.camera !== 'granted') {
        await mostrarToast('Permissão negada. Por favor, habilite as permissões nas configurações do aplicativo.', 'danger');
        return false;
      }
    }
    return true;
  }
 
onMounted(verificarPermissao)
</script>