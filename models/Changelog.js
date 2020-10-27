const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked =require('marked');
const slugify =require('slugify');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);

const changelogSchema = new Schema({
   
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    markdown:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      
      },
       sanitizedHtml:{
        type: String,
       required: true,
      // default: dompurify.sanitize(marked(markdown))
    },
    accountId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }

})

/*changelogSchema.pre('validate', function(next) {
    /*if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }*/
  /*  if ( this.markdown) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
      
    next();
});
    */
module.exports =mongoose.model('Changelog',changelogSchema);
