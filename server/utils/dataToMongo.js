const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI; // Connection string to your MongoDB

const dataToMongo = async (jsonData, dbName, collectionName, isBulkInsert = false) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        
        // Specify the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Insert data into the collection
        if (isBulkInsert) {
            // jsonData should be an array of documents
            await collection.insertMany(jsonData);
        } else {
            // jsonData should be a single document
            await collection.insertOne(jsonData);
        }

        console.log('Data successfully inserted into MongoDB');
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
    } finally {
        // Close the database connection
        await client.close();
    }
};

// Export the dataToMongo function
module.exports = dataToMongo;