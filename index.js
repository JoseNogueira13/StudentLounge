const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const alumniRoutes = require('./routes/alumniRoutes');
const companyRoutes = require('./routes/companyRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/alumni', alumniRoutes);
app.use('/companies', companyRoutes);
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
