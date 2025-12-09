const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Machine = require('../models/Machine');
const Maintenance = require('../models/Maintenance');

async function seed() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);

  await User.deleteMany();
  await Machine.deleteMany();
  await Maintenance.deleteMany();

  // Criar Admin
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@smpm.com',
    password: '123456',
    role: 'admin'
  });

  // Criar Máquinas
  const m1 = await Machine.create({
    name: 'Compressor A',
    code: 'C-A-01',
    sector: 'Compressão',
    status: 'operational'
  });

  const m2 = await Machine.create({
    name: 'Prensa B',
    code: 'P-B-02',
    sector: 'Prensas',
    status: 'maintenance'
  });

  // Criar Manutenções
  await Maintenance.create({
    machine: m1.name,          // agora é STRING
    title: 'Troca de óleo',
    description: 'Substituição do óleo lubrificante',
    scheduledAt: new Date(Date.now() + 86400000),
    status: 'agendada',
    createdBy: admin._id
  });

  await Maintenance.create({
    machine: m2.name,          // agora é STRING
    title: 'Calibração',
    description: 'Calibração dos sensores',
    scheduledAt: new Date(Date.now() + 3 * 86400000),
    status: 'agendada',
    createdBy: admin._id
  });

  console.log('✅ Seed finalizado com sucesso!');
  process.exit(0);
}

seed();