import fs from 'fs/promises';
import path from 'path';
import connectDB from '../../utils/connectDB';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    try {
        // Connect to MongoDB
        await connectDB();

        const DB_NAME = 'test'; // Assuming you have specified the database name in the connectDB.js

        // Now you can interact with MongoDB using mongoose models and methods

        // For example, if you have a mongoose model for users:
        const User = mongoose.model('user');

        // Fetch all users from MongoDB
        const users = await User.find({});

        // Process each user
        for (const user of users) {
            const userName = user.userName;

            // Check if JSON file for user already exists
            const jsonFilename = `fetchResults_${userName}.json`;
            const filePath = path.join(process.cwd(), 'results', jsonFilename);

            // Ensure the parent directory (/results/) exists
            const directoryPath = path.join(process.cwd(), 'results');
            await fs.mkdir(directoryPath, { recursive: true }); // Create the directory if it doesn't exist

            try {
                await fs.access(filePath); // Check if the file exists

                // File exists, do something if needed
                console.log(`JSON file for ${userName} already exists.`);
            } catch (err) {
                // Check if the error is due to the file not existing
                if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
                    // JSON file doesn't exist, generate and save it
                    const jsonData = generateFetchResultsData(userName);
                    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                    console.log(`${filePath} generated successfully for user: ${userName}`);
                } else {
                    // Handle other errors
                    console.error(`Error accessing file for ${userName}:`, err);
                }
            }
        }

        res.status(200).json({ message: 'JSON files checked and generated if needed.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Function to generate a random number between 0 and 9
function getRandomCouponNum() {
    return Math.floor(Math.random() * 10);
}

// Function to generate the fetchResults data
function generateFetchResultsData(userName) {
    const fetchResults = [];
    const minutesInDay = 24 * 60; // Total minutes in a day

    for (let minute = 0; minute < minutesInDay; minute++) {
        const isAM = minute < 12 * 60; // Assuming AM is from midnight to 11:59 AM
        const period = isAM ? 'AM' : 'PM';

        let hours = Math.floor(minute / 60);
        if (hours > 12) {
            hours -= 12; // Convert to 12-hour format (except for 12:00 PM)
        } else if (hours === 0) {
            hours = 12; // Set 0 to 12 for 12:00 AM
        }

        const minutes = minute % 60;
        const drawTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

        const entry = {
            couponNum: getRandomCouponNum(),
            drawTime: drawTime
        };

        fetchResults.push(entry);
    }

    return fetchResults;
}
