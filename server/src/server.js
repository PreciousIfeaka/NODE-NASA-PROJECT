const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');

const { loadPlanetsData } = require('./models/planetsModel')

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  })
}

startServer();
