var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
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
    url: {
      type: String,
      default: '/todos/' + this._id
    }
});

// // Virtual for todo's URL
// Todo
// .virtual('url')
// .get(function () {
//   return '/todos/' + this._id;
// });

module.exports = {Todo};