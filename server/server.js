const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // specify the destination for uploaded files
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

// Enable CORS for all routes
app.use(cors());

// TODO: test and implement the new dataToMongo
const dataToMongo = require('./utils/dataToMongo');


app.use(express.json());


app.post('/api/upload', upload.single('jsonFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Read the file
        // Use fs.promises.readFile to read the file as a promise
        const fileContents = await fs.promises.readFile(req.file.path, 'utf8');

        // Parse JSON
        const jsonData = JSON.parse(fileContents);

        // Get additional form fields
        const dbName = req.body.dbName;
        const collectionName = req.body.collectionName;
        const isBulkInsert = req.body.isBulkInsert === 'true';

        // Insert data into MongoDB
        await dataToMongo(jsonData, dbName, collectionName, isBulkInsert);

        // Delete the file after processing
        await fs.promises.unlink(req.file.path);

        // Send response
        res.json({ message: 'Data successfully uploaded to MongoDB' });

    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
