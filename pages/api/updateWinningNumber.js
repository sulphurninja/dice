import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const { username, couponNum, nextToDrawtime } = req.body;

  try {
    // Assuming you have a specific file for each user
    const filePath = path.join(process.cwd(), `/results/fetchResults_${username}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const results = JSON.parse(data);
    
    const index = results.findIndex((item) => item.drawTime === nextToDrawtime);

    if (index !== -1) {
      results[index].couponNum = couponNum;
      await fs.writeFile(filePath, JSON.stringify(results, null, 2));
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ message: `No entry found for draw time: ${nextToDrawtime}` });
    }
  } catch (err) {
    console.error('Error updating JSON file:', err);
    res.status(500).json({ success: false });
  }
}
