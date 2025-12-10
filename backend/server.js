// backend/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { connectDB } from './src/utils/db.js'

import authRoutes from './src/routes/auth.js'
import maintenanceRoutes from './src/routes/maintenances.js'
import machineRoutes from './src/routes/machines.js'

const app = express()

app.use(cors())
app.use(express.json())

// =====================
// Swagger (API Docs)
// =====================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API SMPM',
      version: '1.0.0',
      description:
        'Documentação da API do Sistema de Manutenção Preventiva de Máquinas (SMPM).',
    },
    tags: [
      { name: 'Autenticação', description: 'Cadastro e login de usuários' },
      { name: 'Manutenções', description: 'Abertura e controle de manutenções' },
      { name: 'Máquinas', description: 'Cadastro e listagem de máquinas' },
    ],
    paths: {
      '/': {
        get: {
          tags: ['default'],
          summary: 'Status da API',
          description: 'Retorna uma mensagem indicando que a API está rodando.',
          responses: {
            200: {
              description: 'API respondendo normalmente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'API SMPM rodando' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ---------- AUTENTICAÇÃO ----------
      '/api/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Cadastrar novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Carina Tavares' },
                    email: { type: 'string', example: 'carina@email.com' },
                    password: { type: 'string', example: 'senha123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado com sucesso' },
            400: { description: 'Dados inválidos ou e-mail já cadastrado' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login com e-mail e senha',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'carina@email.com' },
                    password: { type: 'string', example: 'senha123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login realizado com sucesso (retorna token JWT)' },
            401: { description: 'Credenciais inválidas' },
          },
        },
      },
      '/api/auth/google': {
        get: {
          tags: ['Autenticação'],
          summary: 'Redireciona para login com Google',
          responses: {
            302: { description: 'Redireciona para a tela de login do Google' },
          },
        },
      },
      '/api/auth/google/callback': {
        get: {
          tags: ['Autenticação'],
          summary: 'Callback do Google OAuth2',
          description:
            'Endpoint chamado pelo Google após o usuário autorizar o login. Redireciona de volta para o frontend com o token JWT.',
          responses: {
            302: { description: 'Redireciona para o frontend com token' },
            400: { description: 'Código ausente ou inválido' },
          },
        },
      },

      // ---------- MANUTENÇÕES ----------
      '/api/maintenances': {
        get: {
          tags: ['Manutenções'],
          summary: 'Listar todas as manutenções',
          responses: { 200: { description: 'Lista de manutenções' } },
        },
        post: {
          tags: ['Manutenções'],
          summary: 'Criar nova manutenção',
          responses: {
            201: { description: 'Manutenção criada' },
            400: { description: 'Erro de validação' },
          },
        },
      },
      '/api/maintenances/{id}': {
        get: {
          tags: ['Manutenções'],
          summary: 'Buscar manutenção por ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Manutenção encontrada' },
            404: { description: 'Manutenção não encontrada' },
          },
        },
        put: {
          tags: ['Manutenções'],
          summary: 'Atualizar manutenção',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Manutenção atualizada' },
            404: { description: 'Manutenção não encontrada' },
          },
        },
        delete: {
          tags: ['Manutenções'],
          summary: 'Excluir manutenção',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            204: { description: 'Manutenção excluída' },
            404: { description: 'Manutenção não encontrada' },
          },
        },
      },

      // ---------- MÁQUINAS ----------
      '/api/machines': {
        get: {
          tags: ['Máquinas'],
          summary: 'Listar máquinas',
          responses: { 200: { description: 'Lista de máquinas' } },
        },
        post: {
          tags: ['Máquinas'],
          summary: 'Criar máquina',
          responses: {
            201: { description: 'Máquina criada' },
            400: { description: 'Erro de validação' },
          },
        },
      },
      '/api/machines/{id}': {
        get: {
          tags: ['Máquinas'],
          summary: 'Buscar máquina por ID',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Máquina encontrada' },
            404: { description: 'Máquina não encontrada' },
          },
        },
        put: {
          tags: ['Máquinas'],
          summary: 'Atualizar máquina',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Máquina atualizada' },
            404: { description: 'Máquina não encontrada' },
          },
        },
        delete: {
          tags: ['Máquinas'],
          summary: 'Excluir máquina',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Máquina excluída' },
            404: { description: 'Máquina não encontrada' },
          },
        },
      },
    },
  },
  // não vamos buscar nada em arquivos, o spec já está todo em definition.paths
  apis: [],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Disponibiliza a UI do Swagger em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// =====================
// Rotas da API
// =====================
app.use('/api/auth', authRoutes)
app.use('/api/maintenances', maintenanceRoutes)
app.use('/api/machines', machineRoutes)

// Rota simples pra testar
app.get('/', (req, res) => {
  res.json({ message: 'API SMPM rodando' })
})

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log('Swagger docs em /api-docs')
  })
})