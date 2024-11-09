const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({origin:'https://83bb-178-127-94-164.ngrok-free.app'}));

// Обслуживание статических файлов из папки client
app.use(express.static(path.join(__dirname, '../client'))); 
app.use('/icons', express.static(path.join(__dirname, '../client/icons')));

// Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api/crypto', apiRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} — http://localhost:5000`);
});
