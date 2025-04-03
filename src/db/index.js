import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}/vidtubee`).then(() => console.log('Connected to DB'))
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;