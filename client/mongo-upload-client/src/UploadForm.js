import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [dbName, setDbName] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [isBulkInsert, setIsBulkInsert] = useState(false);
    const [message, setMessage] = useState('');

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('jsonFile', file);
        formData.append('dbName', dbName);
        formData.append('collectionName', collectionName);
        formData.append('isBulkInsert', isBulkInsert);

        try {
            const response = await axios.post('http://localhost:3000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading file');
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <h3>Upload JSON File to MongoDB</h3>
            <label htmlFor="file">Choose JSON file:</label>
            <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="dbName">Database Name:</label>
            <input type="text" name="dbName" value={dbName} onChange={(e) => setDbName(e.target.value)} />
            <label htmlFor="collectionName">Collection Name:</label>
            <input type="text" name="collectionName" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
            <label htmlFor="isBulkInsert">Bulk Insert:</label>
            <input type="checkbox" name="isBulkInsert" checked={isBulkInsert} onChange={(e) => setIsBulkInsert(e.target.checked)} />
            <button type="submit">Upload</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UploadForm;
