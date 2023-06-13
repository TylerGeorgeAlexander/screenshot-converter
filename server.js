const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); // specify the destination for uploaded files
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/upload', upload.single('jsonFile'), async (req, res) => {
  // handle the uploaded JSON file
  // use 'req.file' to access the file
  // use 'req.body' to access other form fields

  // call dataToMongo function with the uploaded data
  // send a response when done
});

app.post('/api/convert', async (req, res) => {
  // trigger the conversion and upload process
  // call convertScreenshots function
  // send a response when done
});

app.post('/api/manage', async (req, res) => {
  // manage the MongoDB collection based on the request
  // 'req.body.action' could indicate what action to perform (e.g., "drop" or "insert")
  // 'req.body.data' could contain data for a new project, if the action is "insert"
  // send a response when done
});

app.listen(port, () => console.log(`Server running on port ${port}`));
