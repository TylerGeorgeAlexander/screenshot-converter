const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
require('dotenv').config();
const { MongoClient } = require('mongodb');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts.pop();
    const folderName = urlParts.pop();
    const publicId = `${folderName}/${fileName.split('.').slice(0, -1).join('.')}`;

    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

const deletePreviousImagesFromCloudinary = async (collection) => {
  try {
    const previousProjects = await collection.find().toArray();
    for (let project of previousProjects) {
      console.log('Deleting image:', project.image); // Log the image being deleted
      await deleteImageFromCloudinary(project.image);
    }

    console.log('Previous images deleted from Cloudinary successfully!');
  } catch (error) {
    console.error('Error deleting previous images from Cloudinary:', error);
  }
};


const convertAndUploadScreenshot = async (project) => {
  console.log('Starting convertAndUploadScreenshot for project:', project.title); // Added log
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);
    await page.goto(project.link);
    await page.waitForTimeout(5000);

    const screenshotPath = `./screenshots/${project.title}.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const upload = promisify(cloudinary.uploader.upload);
    const uploadResult = await upload(screenshotPath, { folder: 'screenshots' });

    console.log('Upload Result:', uploadResult);

    fs.unlinkSync(screenshotPath);

    if (uploadResult && uploadResult.secure_url) {
      console.log('Successfully uploaded image for project:', project.title); // Added log
      return uploadResult.secure_url;
    } else {
      console.error('Failed to upload the image to Cloudinary');
      return null;
    }
  } catch (error) {
    console.error('Error in convertAndUploadScreenshot:', error);
    return null;
  }
};

const convertScreenshots = async () => {
  console.log('Starting convertScreenshots'); // Added log
  
  try {
    await client.connect();
    const database = client.db('my-portfolio-projects'); // Specify database name
    const collection = database.collection('projects'); // Specify collection name    

    await deletePreviousImagesFromCloudinary(collection);

    const projects = await collection.find().toArray();
    console.log('Projects to process:', projects); // Added log

    for (let project of projects) {
      const imageUrl = await convertAndUploadScreenshot(project);

      if (imageUrl) {
        project.image = imageUrl;
        
        const updateResult = await collection.updateOne({ _id: project._id }, { $set: { image: imageUrl } });
        console.log('Database update result:', updateResult);
      } else {
        console.error('Failed to get a new image URL for project:', project);
      }
    }

    console.log('Screenshots converted and uploaded successfully!');
  } catch (error) {
    console.error('Error converting and uploading screenshots:', error);
  } finally {
    await client.close();
    console.log('MongoDB client closed'); // Added log
  }
};

convertScreenshots();

