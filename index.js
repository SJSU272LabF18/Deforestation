var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var session=require('express-session');
var cookieParser=require('cookie-parser');
const mongoose=require('mongoose');

//Used for using ejs file in node
app.set('view engine','ejs');

//used for setting the directory
app.set('views','./views');

//keeping this as a static directory
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use(session({
    secret:'use_secret_session',
    resave:false,
    saveUninitialized:true

}));

const db=require('./config/mLabConnector.js').mongoURI;

mongoose.Promise=global.Promise;

mongoose.connect(db)
            .then(()=>{console.log("Connected to Mlab Mongodb")})
            .catch(err=>{console.log(err)});

const User=require('./models/User');            
const Tender=require('./models/tender');
var Users=[{
    "username":"admin",
    "password":"admin"
}]

var Students=[
    {"name":"Ketan Kodmelwar","studentid":"013312325","department":"MS SE"},
    {"name":"Aniket Chandak","studentid":"013314565","department":"MS CS"},
    {"name":"Prashant Pardeshi","studentid":"013312456","department":"MS CS"}
]


//routing to root 
app.get('/',function(req,res){
       
    res.render('home',{
        Students
    });
  
});



//login function of post
app.post('/login',function(req,res){
   
        console.log("Cursor inside login post method");
        console.log("Request body: ",req.body);
        User.findOne({emailID:req.body.emailID})
            .then(user=>{
                if(user){
                    console.log("User found. Logging in")
                    res.redirect('/submit-tender')
                }else{
                    console.log("User not found")
                }
            })
    
});

//create  post
app.post('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        if(!req.body.name || !req.body.studentid || !req.body.department){
            res.render('create');
        }
        else{
        var newStudent={name:req.body.name,studentid:req.body.studentid,department:req.body.department}; 
        Students.push(newStudent);
        res.redirect('/home');
        console.log('Student added successfully');
          console.log(newStudent);
        }
    }
})

//get to home
app.get('/home',function(req,res){
    if(!req.session.user)
    {
        res.redirect('/');
    }else{
        
       
        
        res.render('home',{
            Students
        });
    
   
    }
});

//get to create
app.get('/create',function(req,res){
    if(!req.session.user)
    {
        res.redirect('/');
    }else{
        res.render('create');
    }
});

app.get('/findMaps',function(req,res){
    res.render('findMaps')
});

app.get('/register',function(req,res){
    res.render('register')
});


app.get('/policy',function(req,res){
    res.render('policy')
});

//-----
app.post('/submit-tender',function(req,res){
    console.log("Inside The post of submit tender");
    console.log("Request body: ",req.body);
        loc_latitude=req.body.loc_latitude;
        loc_longitude=req.body.loc_longitude;
        console.log("Latitude of the user",loc_latitude);
        console.log("Longitude of the user",loc_longitude);

      const newTender=new Tender({
          name:req.body.projectName,
          company:req.body.company,
          forestArea:req.body.forestArea,
          bufferArea:req.body.bufferArea,
          bufferLength:req.body.bufferLength,
          resultArea:req.body.resultArea,
          Percentagecheck:req.body.Percentagecheck
      })
      newTender.save()
        .then(console.log("New Tender saved"))
        // res.redirect('/findMaps');

      dataSend={
          bufferArea:req.body.bufferArea,
          resultArea:req.body.resultArea,
          Percentagecheck:req.body.Percentagecheck,
          acceptance:req.body.acceptance,
          myurl:req.body.myurl,
          bufferLength:req.body.bufferLength
      }

      dataSend=JSON.stringify(dataSend);
      
      res.render('result',{
          company:req.body.company,
        bufferArea:req.body.bufferArea,
        resultArea:req.body.resultArea,
        Percentagecheck:req.body.Percentagecheck,
        acceptance:req.body.acceptance,
        bufferLength:req.body.bufferLength,
        myurl:req.body.myurl,
        deforest:req.body.deforest
      });      
});



app.post('/register',function(req,res){
    console.log("Inside node of Register");
    console.log("Request body: ",req.body);
    User.findOne({emailID:req.body.emailID})
        .then(user=>{
            if(user){
                console.log("Email already exists");
            }else{
                const newUser=new User({
                    name:req.body.name,
                    emailID:req.body.emailID,
                    password:req.body.password
                })

                newUser.save()
                    .then(user=>{
                        console.log("User registered.")
                        res.redirect("/login")
                    })
            }
        })
})

app.get('/login',function(req,res){
    res.render('login')
})

app.get('/submit-tender',function(req,res){
    res.render('submit-tender')
})

var Students=[
    {"name":"Ketan Kodmelwar","studentid":"013312325","department":"MS SE"},
    {"name":"Aniket Chandak","studentid":"013314565","department":"MS CS"},
    {"name":"Prashant Pardeshi","studentid":"013312456","department":"MS CS"}
]

app.get('/delete/:id',function(req,res){
    //console.log("Session Data : ", req.session.user);
    if(!req.session.user){
        res.redirect('/');
    } else {
       var id=req.params.id;
        //console.log(id);
        var index =  Students.map(function(i){
            return i.studentid
        }).indexOf(id);
        console.log("Record of "+Students[index].name+" deleted");
        Students.splice(index,1);
        //console.log('Record deleted');
        res.redirect('/home');
    }    
});


var server=app.listen(4500,function(){
    console.log("Server on port 4500");
});