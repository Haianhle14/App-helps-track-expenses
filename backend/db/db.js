const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Đã kết nối DB')
    } catch (error) {
        console.log('Lỗi kết nối DB');
    }
}

module.exports = {db}