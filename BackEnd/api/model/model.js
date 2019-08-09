const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filePath:{type:String}
})
module.exports = mongoose.model('File',FileSchema);