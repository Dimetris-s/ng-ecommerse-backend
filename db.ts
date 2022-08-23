const mongoose = require('mongoose');
export const db = async () => {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DB_URL, {
        dbName: 'eshop',
    });
    console.log('Database connected!');
};
