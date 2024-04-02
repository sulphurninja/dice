import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Extract the draw time from the request payload
    const { drawTime, userName } = req.query;

    // Load data from the local JSON file
    const filePath = path.join(process.cwd(), `/results/fetchResults_${userName}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const results = JSON.parse(data);

    // Find the document with the corresponding draw time
    const result = results.find((item) => item.drawTime === drawTime);

    // If a document is found, return the winning number
    if (result) {
      res.status(200).json({ couponNum: result.couponNum });
    } else {
      res.status(404).json({ message: `No winning number found for draw time: ${drawTime}` });
    }
  } catch (err) {
    console.log('Error reading from JSON file:', err);
    res.status(500).json({ message: 'Error reading from JSON file' });
  }
}
