const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Datos iniciales
const data = {
  "eventos-confesiones": [
    {
      "id": 1,
      "nombre": "Retiro Espiritual Verano",
      "aforo": 50,
      "fecha": "2024-08-15"
    },
    {
      "id": 2,
      "nombre": "Congreso de Jóvenes",
      "aforo": 300,
      "fecha": "2024-09-20"
    },
    {
      "id": 3,
      "nombre": "Encuentro Familiar",
      "aforo": 150,
      "fecha": "2024-10-05"
    },
    {
      "id": 4,
      "nombre": "Seminario de Liderazgo",
      "aforo": 80,
      "fecha": "2024-11-15"
    },
    {
      "id": 5,
      "nombre": "Retiro de Adviento",
      "aforo": 100,
      "fecha": "2024-12-01"
    }
  ],
  "gastos": [
    {
      "id": 1,
      "eventoId": 1,
      "nombre": "Materiales de oración",
      "categoria": "Materiales",
      "precio": 150000.00,
      "fecha": "2024-08-10"
    },
    {
      "id": 2,
      "eventoId": 1,
      "nombre": "Alimentación participantes",
      "categoria": "Alimentación",
      "precio": 450000.00,
      "fecha": "2024-08-15"
    },
    {
      "id": 3,
      "eventoId": 2,
      "nombre": "Alquiler auditorio",
      "categoria": "Instalaciones",
      "precio": 1200000.00,
      "fecha": "2024-09-18"
    },
    {
      "id": 4,
      "eventoId": 2,
      "nombre": "Material didáctico",
      "categoria": "Materiales",
      "precio": 300000.00,
      "fecha": "2024-09-19"
    },
    {
      "id": 5,
      "eventoId": 3,
      "nombre": "Decoración",
      "categoria": "Ambientación",
      "precio": 250000.00,
      "fecha": "2024-10-03"
    }
  ],
  "ingresos": [
    {
      "id": 1,
      "eventoId": 1,
      "nombre": "Inscripciones temprana",
      "categoria": "Inscripciones",
      "precio": 750000.00,
      "fecha": "2024-07-15"
    },
    {
      "id": 2,
      "eventoId": 1,
      "nombre": "Donaciones",
      "categoria": "Donaciones",
      "precio": 300000.00,
      "fecha": "2024-08-01"
    },
    {
      "id": 3,
      "eventoId": 2,
      "nombre": "Inscripciones grupos",
      "categoria": "Inscripciones",
      "precio": 1500000.00,
      "fecha": "2024-09-15"
    },
    {
      "id": 4,
      "eventoId": 2,
      "nombre": "Venta de libros",
      "categoria": "Merchandising",
      "precio": 450000.00,
      "fecha": "2024-09-20"
    },
    {
      "id": 5,
      "eventoId": 3,
      "nombre": "Aportes familiares",
      "categoria": "Contribuciones",
      "precio": 800000.00,
      "fecha": "2024-10-01"
    }
  ]
};

const router = jsonServer.router(data);
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware para headers
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.header('Accept', 'application/json');
  next();
});

// Rutas personalizadas para totales
server.get('/api/v1/eventos-confesiones/:id/ingresos-totales', (req, res) => {
  const eventoId = parseInt(req.params.id);
  const ingresosEvento = router.db
    .get('ingresos')
    .filter({ eventoId })
    .value();

  const total = ingresosEvento.reduce((sum, ingreso) => sum + ingreso.precio, 0);
  
  res.json({ total });
});

server.get('/api/v1/eventos-confesiones/:id/gastos-totales', (req, res) => {
  const eventoId = parseInt(req.params.id);
  const gastosEvento = router.db
    .get('gastos')
    .filter({ eventoId })
    .value();

  const total = gastosEvento.reduce((sum, gasto) => sum + gasto.precio, 0);
  
  res.json({ total });
});

// Rutas para obtener gastos e ingresos por evento
server.get('/api/v1/eventos-confesiones/:id/gastos', (req, res) => {
  const eventoId = parseInt(req.params.id);
  const gastos = router.db
    .get('gastos')
    .filter({ eventoId })
    .value();
  
  res.json(gastos);
});

server.get('/api/v1/eventos-confesiones/:id/ingresos', (req, res) => {
  const eventoId = parseInt(req.params.id);
  const ingresos = router.db
    .get('ingresos')
    .filter({ eventoId })
    .value();
  
  res.json(ingresos);
});

// Montar el router en el prefijo api/v1
server.use('/api/v1', router);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}/api/v1`);
});