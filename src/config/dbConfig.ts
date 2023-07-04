import mongoose, { model } from 'mongoose';
const dbUrl:any = process.env.DB_HOST_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('Database connected...');
    } catch (error: any) {
        console.log(error.message);
    }
};

module.exports = connectDB;