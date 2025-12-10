// backend/swagger.js
import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger_output.json' // arquivo que será gerado
const endpointsFiles = [
  './server.js',
  './src/routes/auth.js',
  './src/routes/machines.js',
  './src/routes/maintenances.js',
]

const doc = {
  info: {
    title: 'API SMPM',
    description: 'Documentação da API de Manutenção Preventiva de Máquinas',
    version: '1.0.0',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Ambiente local' },
    { url: 'https://smpm-backend.onrender.com', description: 'Produção (Render)' },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticação (login, registro, Google)' },
    { name: 'Máquinas', description: 'Cadastro e listagem de máquinas' },
    { name: 'Manutenções', description: 'Abertura e controle de manutenções' },
  ],
}

const swaggerAutogenInstance = swaggerAutogen({ openapi: '3.0.0' })

swaggerAutogenInstance(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Documentação Swagger gerada: swagger_output.json')
})