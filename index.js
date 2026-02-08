const express = require('express');
const app = express();

const campusRoutes = require('./src/routes/campus-routes');

app.use(express.json());

app.use('/campus', campusRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
