import mongoose from "mongoose"

const connectDB = async () => {
    try {        
        await mongoose.connect(`mongodb+srv://sudo:qt87PYmvuCuuGwXr@cluster0.ifgbm.mongodb.net/vidtubee`).then(() => console.log('Connected to DB'))
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;