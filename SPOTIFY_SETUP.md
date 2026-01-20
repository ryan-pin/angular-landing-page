# Integração com Spotify - Guia de Configuração

## 📋 Pré-requisitos

1. Conta no [Spotify for Developers](https://developer.spotify.com/)
2. Aplicação criada no Spotify Dashboard
3. Angular CLI instalado

## 🚀 Configuração do Spotify

### 1. Criar Aplicação no Spotify

1. Acesse [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Clique em **"Create app"**
3. Preencha os dados:
   - **App name**: Nome da sua aplicação
   - **App description**: Descrição da aplicação
   - **Redirect URI**: `http://localhost:4200/callback`
   - **Which API/SDKs are you planning to use?**: Web API

### 2. Configurar Credenciais

1. Na sua aplicação criada, clique em **"Settings"**
2. Copie o **Client ID** e **Client Secret**
3. Adicione a URI de redirecionamento: `http://localhost:4200/callback`

### 3. Configurar no Projeto

Edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  spotify: {
    clientId: 'SEU_CLIENT_ID_AQUI',
    clientSecret: 'SEU_CLIENT_SECRET_AQUI',
    redirectUri: 'http://localhost:4200/callback',
    scopes: [
      'user-read-private',
      'user-read-email',
      'user-read-recently-played',
      'user-top-read'
    ]
  }
};
```

## 🎵 Funcionalidades Implementadas

### ✅ Login com Spotify
- Autenticação OAuth 2.0
- Interface moderna e responsiva
- Tratamento de erros

### ✅ Músicas Ouvidas Recentemente
- Lista das últimas 5 músicas
- Informações completas (artista, álbum, duração)
- Links diretos para o Spotify
- Timestamps relativos (ex: "2h atrás")

### ✅ Recursos Adicionais
- Logout seguro
- Proteção de rotas com guards
- Interface responsiva
- Tratamento de erros de API
- Loading states

## 🎯 Estrutura de Componentes

```
src/app/
├── guards/
│   └── auth.guard.ts           # Proteção de rotas
├── pages/
│   ├── login/                  # Página de login
│   ├── callback/              # Callback do Spotify
│   └── musicas-ouvidas/       # Lista de músicas
├── services/
│   └── spotify.service.ts     # Integração com API
└── models/
    └── spotify.ts             # Tipos TypeScript
```

## 🔧 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Credenciais
Edite `src/environments/environment.ts` com suas credenciais do Spotify.

### 3. Executar Aplicação
```bash
npm start
```

### 4. Navegar
1. Acesse `http://localhost:4200`
2. Clique em **"Entrar com Spotify"**
3. Autorize a aplicação
4. Veja suas músicas recentes!

## 🛡️ Segurança

⚠️ **IMPORTANTE**: Nunca exponha seu `Client Secret` em produção. Use variáveis de ambiente ou um proxy backend.

### Para Produção
- Configure um backend proxy para ocultar credenciais
- Use HTTPS para todas as comunicações
- Configure CORS adequadamente

## 🎨 Customização

### Estilos
Os componentes usam CSS Grid e Flexbox com:
- Gradientes do Spotify (verde + preto)
- Animações suaves
- Design responsivo
- Efeitos hover

### Escopos do Spotify
Você pode adicionar mais escopos em `environment.ts`:
```typescript
scopes: [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',    // Estado atual de reprodução
  'user-modify-playback-state',  // Controlar reprodução
  'playlist-read-private',       // Ler playlists privadas
  'playlist-modify-public'       // Modificar playlists públicas
]
```

## 🐛 Troubleshooting

### Erro: "Invalid client"
- Verifique se o Client ID está correto
- Confirme se a URL de callback está configurada

### Erro: "Invalid redirect URI"
- A URI deve estar **exatamente** igual no Spotify Dashboard
- Use `http://localhost:4200/callback` (sem trailing slash)

### Erro: "Token expirado"
- O token expira após 1 hora
- Implemente refresh token para renovação automática

### Músicas não carregam
- Verifique os escopos configurados
- Toque algumas músicas no Spotify primeiro
- Verifique o console do navegador para erros

## 📚 Próximos Passos

- [ ] Implementar refresh token automático
- [ ] Adicionar player integrado
- [ ] Criar playlists personalizadas
- [ ] Análise de hábitos musicais
- [ ] Integração com outras APIs musicais