const mongoose = require('mongoose');
const { schema } = require('./account');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name :{
        type:String,
        required: true
    },
    email :{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    image :{
        type:String
    },
    role:{
        type : String,
        required: true
    },
 
     accounts:[  {
                    accountId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Account',
                    required: true
                   },
                    status:{
                    type:Number,
                    required:true
                  }
                   }
         
            ]
    
             
});
module.exports= mongoose.model("User",userSchema);