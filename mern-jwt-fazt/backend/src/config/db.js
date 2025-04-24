const mongoose = requuire('mongoose')

const connectDB = async () => {
    try{
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (e) {
        console.error(`Error: ${e.message}`)
        process.exit(1)
    }
}

module.exports = connectDB