const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
const { projects } = require('./data');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

// Function to delete an image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
    const publicId = imageUrl.split('/').pop().split('.').slice(0, -1).join('.');
    await cloudinary.uploader.destroy(publicId);
};

// Iterate over previous project objects and delete their images from Cloudinary
const deletePreviousImagesFromCloudinary = async () => {
    for (let project of projects) {
        await deleteImageFromCloudinary(project.image);
    }
};

// Call the function to delete previous images
deletePreviousImagesFromCloudinary()
    .then(() => {
        console.log('Previous images deleted from Cloudinary successfully!');
    })
    .catch((error) => {
        console.error('Error deleting previous images from Cloudinary:', error);
    });

    const convertAndUploadScreenshot = async (project) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        // Increase the timeout to wait for a longer duration (in milliseconds)
        await page.setDefaultNavigationTimeout(60000); // 60 seconds
      
        await page.goto(project.link);
      
        // Add a custom wait using the waitFor function to wait for specific elements or conditions on the page
        // Example: Wait for an element with a specific CSS selector to be visible
        // await page.waitFor('.my-element', { visible: true });
      
        // Wait for a specified amount of time (in milliseconds)
        await page.waitForTimeout(5000); // 5 seconds
      
        const screenshotPath = `./screenshots/${project.title}.png`;
        await page.screenshot({ path: screenshotPath });
        await browser.close();
      
        const upload = promisify(cloudinary.uploader.upload);
        const uploadResult = await upload(screenshotPath, { folder: 'screenshots' });
      
        fs.unlinkSync(screenshotPath); // Delete the local screenshot file
      
        const newImageUrl = uploadResult.secure_url;
      
        // Update the project object with the new Cloudinary URL
        const projectIndex = projects.findIndex((p) => p.title === project.title);
        if (projectIndex !== -1) {
          projects[projectIndex].image = newImageUrl;
        }
      
        return newImageUrl;
      };
      


const convertScreenshots = async () => {
    for (let project of projects) {
        const imageUrl = await convertAndUploadScreenshot(project);
        project.image = imageUrl;
    }

    console.log('Screenshots converted and uploaded successfully!');
};

convertScreenshots();

