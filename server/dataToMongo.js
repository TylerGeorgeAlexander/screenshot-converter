const { MongoClient } = require('mongodb');
const { projects } = require('./data.js');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const insertProjectsData = async () => {
    try {
        await client.connect();

        const database = client.db('my-portfolio-projects');
        const collection = database.collection('projects');

        const result = await collection.insertMany(projects);
        console.log(`${result.insertedCount} documents inserted.`);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
};

insertProjectsData();
