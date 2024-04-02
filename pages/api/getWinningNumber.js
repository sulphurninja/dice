// getWinningNumber.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { userName, drawTime } = req.query;
    const filePath = path.join(process.cwd(), `/results/fetchResults_${userName}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const results = JSON.parse(data);
    const result = results.find((item) => item.drawTime === drawTime);

    if (result) {
      res.status(200).json({ couponNum: result.couponNum });
    } else {
      res.status(404).json({ message: `No winning number found for draw time: ${drawTime}` });
    }
  } catch (err) {
    console.log('Error reading JSON file:', err);
    res.status(500).json({ message: 'Error reading JSON file' });
  }
}
