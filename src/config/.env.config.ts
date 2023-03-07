export const EnvConfiguration = () => ({
  port: process.env.PORT || 3001,
  hostApi: process.env.HOST_API || 'http://localhost:3001/api',
});
