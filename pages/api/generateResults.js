import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set up the connection URL and database name
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const dbName = 'test';

  // Connect to the database
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('fetchResults');

    // Generate the list of draw times
    const startHour = 1;
    const startMinute = 0;
    const interval = 1;
    const numDraws = 1440;

    const drawTimes = [];
    for (let hour = startHour; hour <= 12; hour++) {
      for (let minute = startMinute; minute < 60; minute += interval) {
        drawTimes.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`);
        drawTimes.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`);
      }
    }

    // Generate and insert the documents
    const docs = [];
    for (let i = 0; i < numDraws; i++) {
      const doc = {
        couponNum: Math.floor(Math.random() *10) ,
        drawTime: drawTimes[i]
      };
      docs.push(doc);
    }

    await collection.insertMany(docs);
    console.log('Documents inserted successfully');

    res.status(200).json({ message: 'Documents inserted successfully' });
  } catch (err) {
    console.log('Error connecting to database:', err);
  } finally {
    await client.close();
  }
}
