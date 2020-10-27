const Changelog = require("../models/Changelog");
const Account = require("../models/account");
const User = require("../models/user");
const marked =require('marked');
//const slugify =require('slugify');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);


 

exports.getHome =async (req, res, next) => {
 
   
    const acc = getactiveaccount(req.user);
   
   const changelog=  await Changelog.find({accountId:acc.accountId}).sort({createdAt: 'desc'})
  
    req.user
  .populate('accounts.accountId')
  .execPopulate().then(account=>{
   const accounts=account.accounts;
     
      res.render('changelog/home', {
      changelog:changelog,
      accounts:accounts,
      pageTitle: 'Home',
      head:acc.accountId.weburl
    }); 
  }).catch(e=>{
    console.log(e)
  }) 
}; 


function getactiveaccount(account){
      const acc=account.accounts;
     
      let active="";
       acc.forEach(acc1 => {
            if(acc1.status === 1){
                 active=acc1;
                //console.log(active.accountId);
            }
       
     });
    /* Account.findById(active.accountId).then(result=>{
     active= result;
     })
     console.log(active)*/
    return active;
      
  };
exports.frontPage=(req,res,next)=>{
  res.render('frontpage',{
    pageTitle:'Welcome to Online Changelog'
  });
};  

exports.newchangelog=(req,res,next)=>{
  res.render('changelog/new',{
    pageTitle:'New Changelog',
    editMode:false,
    changelog:new Changelog()
  });
};

exports.getEdit = (req,res,next) =>{
  const editMode= req.query.edit;
  if(!editMode){
    return res.redirect('/home');
  }
  const changelogId=req.params.id
  Changelog.findById(changelogId)  
  .then(changelog=>{
    if(!changelog){
      return res.redirect('/home');
    }
    res.render('changelog/edit',{
      changelog: changelog,
      editing:editMode
    });
  })
  .catch(err=>{
    console.log(err) ;
  });
};
exports.postEdit = (req,res,next) => {
  const acc=getactiveaccount(req.user );
  const changelogId=req.body.changelog_Id;
  const updatedTitle=req.body.title;
  const updatedCategory=req.body.category;
  const updatedMarkdown=req.body.markdown;
  const updatesanitizedHtml = dompurify.sanitize(marked(updatedMarkdown));
  Changelog.findById(changelogId)
  .then(changelog=>{
    changelog.title=updatedTitle;
    changelog.category=updatedCategory;
    changelog.markdown=updatedMarkdown;
    changelog.UserId=req.user;
    changelog.sanitizedHtml=updatesanitizedHtml;
    changelog.accountId= acc.accountId;
    return changelog.save();
  })
  .then(result=>{
    res.redirect('/home');
  })
  .catch(err=> console.log(err));
}

exports.getChangelog=  async (req, res, next) => { 
  const changelog= await Changelog.findById(req.params.id)
  if (changelog ==null)res.redirect('/home')
  res.render('changelog/show',{
    changelog: changelog
  })
  
};

exports.postAddChangelog= (req,res,next) =>{
  const acc=getactiveaccount(req.user );
  const title=req.body.title;
  const category=req.body.category;
  const markdown=req.body.markdown;
 const sanitizedHtml = dompurify.sanitize(marked(markdown));
  const userId = req.user;
  const changelog = new Changelog({
    title:title,
    category:category,  
    markdown:markdown,
    userId:userId,
    sanitizedHtml:sanitizedHtml,
    accountId:acc.accountId
  });
  changelog
  .save()
  .then(result=>{
    res.redirect(`/home/show/${changelog.id}`);
  })
  .catch(err=>{
    console.log(err);
    res.redirect('/home');

  });
}

    //
//     res.redirect(`/home/${changelog.id}`);
//    }catch (e) {
//      console.log(e);
//      res.render('changelog/new',{changelog:changelog});
     
//    }
// } 
exports.postDeleteChangelog = (req, res, next) => {
  const changelogId = req.body.changelogId;
  Changelog.findByIdAndRemove(changelogId)
    .then(() => {
      res.redirect('/home');
    })
    .catch(err => console.log(err));
};


exports.getswitchingaccount =(req,res,next) => {
  const active =req.params.id;
 //console.log(active)
  const acc = getactiveaccount(req.user);
 
 //res.redirect('/home')
  const id=acc._id;
 // res.render('/home')

User.findOneAndUpdate(
  {_id: req.user._id},
  {$set: {"accounts.$[el].status":0 } },
  { 
    arrayFilters: [{ "el._id": acc._id }],
    new: true
  }
).then(()=>{
  User.findOneAndUpdate(
  {_id: req.user._id},
  {$set: {"accounts.$[el].status":1 } },
  { 
    arrayFilters: [{ "el._id": active }],
    new: true
  }
).then(result=>{
  console.log(result)
  res.redirect('/home');
})
})


}

exports.createaccount=(req,res,next)=>{
  res.render('changelog/newaccount',{
    pageTitle:'New Account',
  
  });
};

exports.postaccount=(req,res,next)=>{
const  weburl=req.body.weburl;
const  company=req.body.company;
console.log(weburl);
const account=new Account({
   company:company,
   weburl:weburl
});
account.save().then(result=>{
   User.findById(req.user).then(doc=>{
      const acc= doc.accounts
       acc.push({
           accountId:result._id,
           status:0
       });
       doc.accounts=acc;
       return doc.save()
       .then(result=>{
        res.redirect(`/home`); 
   }).catch(e=>{
     console.log(e);
   })
})
})
}