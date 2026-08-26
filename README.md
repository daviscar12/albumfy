# Albumfy

## Nome do aluno
Davi Scartezini

## Nome do curso
Desenvolvimento de Software / Sistemas para Internet

## Nome da unidade curricular
Desenvolvimento Mobile com Ionic / Aplicações Móveis 

## Explicação do projeto
O Albumfy é um aplicativo móvel desenvolvido em Ionic + Vue para gerenciar uma galeria de fotos de forma moderna, prática e visualmente elegante. O sistema conta com autenticação simples, cadastro de usuários, área protegida após login, galeria de fotos, opção de adicionar imagens pela câmera ou pela biblioteca do dispositivo e remoção individual de fotos.

A ideia do projeto é oferecer uma experiência semelhante a uma aplicação de organização visual, com interface premium e design atual, mantendo o funcionamento simples e funcional para uso acadêmico.

## Como rodar

### 1) Rodar no navegador
Abra o terminal dentro da pasta do projeto e execute:


npm install
npm run dev


Depois, acesse a URL que o Vite informar no terminal, normalmente:


http://localhost:5173


### 2) Rodar no Android Studio
1. Instale o Android Studio e o SDK do Android.
2. No projeto, instale as dependências:

```bash
npm install
```

3. Gere a estrutura do Capacitor:

```bash
npx cap init
```

4. Adicione a plataforma Android:

```bash
npx cap add android
```

5. Abra o projeto Android no Android Studio:

```bash
npx cap open android
```

6. No Android Studio, selecione um emulador ou dispositivo físico e execute o app.

7. Se quiser sincronizar alterações após modificar o código:

```bash
npm run build
npx cap sync android
```
