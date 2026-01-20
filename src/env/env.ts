export const environment = {
  production: false,
  spotify: {
    clientId: 'x', 
    clientSecret: 'x',
    redirectUri: 'http://localhost:4200/callback',
    scopes: ['user-read-private', 'user-read-email', 'user-read-recently-played', 'user-top-read'],
  },
};
