var express     =   require('express');
var mongoose    =   require('mongoose');
var userModel   =   require('./models/user');
var bodyParser  =   require('body-parser');
var QRCode      =   require('qrcode');

//connect to db
mongoose.connect('mongodb://localhost:27017/qrdemo',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the reuqest
app.use(bodyParser.urlencoded({extended:false}));

//default page load
app.get('/',(req,res)=>{
       userModel.find((err,data)=>{
          if(err){
              console.log(err);
          }else{
              if(data!=''){
                  var temp =[];
                  for(var i=0;i< data.length;i++){
                      var name = {
                          data:data[i].name
                      }
                      temp.push(name);
                      var phno = {
                          data:data[i].phno
                      }
                      temp.push(phno);
                  }
                  QRCode.toDataURL(temp,{errorCorrectionLevel:'H'},function (err, url) {
                    console.log(url)
                    res.render('home',{data:url})
                  });
              }else{
                  res.render('home',{data:''});
              }
          }
       });
});

app.post('/',(req,res)=>{
        var userr = new userModel({
            name:req.body.name,
            phno:req.body.phno
        });
        userr.save((err,data)=>{
             if(err){
                 console.log(err);
             }else{
                 res.redirect('/');
             }
        });
});

//assign port
var port  = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at '+port));