const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountSchema = new Schema({
    company :{
        type:String
    },
    weburl :{
        type:String,
        required:true
    },
   /* status:{
        type:Number,
        default:1,
        required:true
    }
   /* userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }*/
});
module.exports= mongoose.model("Account",accountSchema);