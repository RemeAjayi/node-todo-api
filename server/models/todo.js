var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
       type: Number,
       default: null
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var Todo  = mongoose.model('Todo', TodoSchema);
// Virtual for todo's URL
TodoSchema
.virtual('url')
.get(function () {
  return '/todos/' + this._id;
});

module.exports = {Todo};