**My Portfolio Screenshot Uploader**

This is a comprehensive guide to the My Portfolio Screenshot Uploader app. The app enables users to upload JSON files containing their project information and have screenshots of their projects automatically generated, uploaded to Cloudinary, and stored in a MongoDB database.

**Table of Contents**
- Features
- Technologies
- Getting Started
  - Prerequisites
  - Installation
- Usage
  - Backend Usage
  - Frontend Usage
- Environment Variables
- Contributing
- License

**Features**
- Upload JSON files containing project information.
- Automatically generate screenshots of project web pages using Puppeteer.
- Upload generated screenshots to Cloudinary.
- Store project information including Cloudinary URLs in MongoDB.
- Front-end interface for users to upload JSON files and view uploaded projects.
- Option to specify custom database and collection names.
- Option to insert single or multiple projects.

**Technologies**
- Node.js
- Express
- React
- MongoDB
- Cloudinary
- Puppeteer

**Getting Started**
**Prerequisites**
To run this project, you need to have the following prerequisites:
- Node.js
- npm
- MongoDB (locally or a MongoDB Atlas account)
- Cloudinary account

**Installation**
Follow these steps to install the project:
1. Clone the repository:
   ```
   git clone https://github.com/your-repository/my-portfolio-screenshot-uploader.git
   ```
2. Install NPM packages for the backend:
   ```
   cd my-portfolio-screenshot-uploader/server
   npm install
   ```
3. Install NPM packages for the frontend:
   ```
   cd ../client
   npm install
   ```
4. Create a `.env` file in the server directory with your environment variables (see Environment Variables section).

**Usage**
**Backend Usage**
To start the backend server, run the following command:
```
cd server
npm start
```
The server will start on the specified port (default is 3000).

**Frontend Usage**
To start the frontend development server, run the following command:
```
cd client
npm start
```
Visit http://localhost:3001 (or the port you specified) in your browser.

Use the interface to upload a JSON file, specify a database name, and collection name, and submit the form.

The app will process the JSON file, take screenshots, upload them to Cloudinary, and store the data in MongoDB.

You can view the uploaded projects in your database.

**Environment Variables**
Create a `.env` file in the server directory and set the following variables:
- MONGO_URI: Your MongoDB connection string.
- CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name.
- CLOUDINARY_API_KEY: Your Cloudinary API key.
- CLOUDINARY_API_SECRET: Your Cloudinary API secret.

**Contributing**
Contributions are welcome. For major changes, please open an issue first to discuss what you would like to change.

**License**
This project is licensed under the MIT License.