
//index is our server
// import or require express because that's what we are using(used to create our server and API Endpoint)

const express = require('express')

// import or require express because that's what we are using(used to create our database)

const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const dotenv = require('dotenv');


//why do we need this schema file()
const User = require('./schemas/userschema.js')


const cors = require('cors');


const app = express()
//you will need it because we are using json,we need to let express use json.
app.use(express.json());

//where you are directing your form to(external)
app.use(express.urlencoded({ extended: false }));

//where you are directing your form to(internal)
app.use(express.static(__dirname));

//for security purpose, end-end encryption,used to secure your website,
// but if you don't bring it your code will run
app.use(cors());


dotenv.config()

 
//const port = process.env.PORT;
const port = process.env.PORT || 5000 || 3000;


//there is a database called local in our env File, process that file
const db = process.env.DB_LOCAL
const dbonline = process.env.DB_ONLINE



//copy the link in the database and paste here to link your database to your server
// we connect our mongoose database to our server.
mongoose.connect(dbonline

  , {
    //if you dont bring it your code will still run

    //  use this code to pass our data. or send or encode our data
    useNewUrlParser: true,
    // 
    useUnifiedTopology: true

    // now we want a callback, that is if it is successful or if there is an error
  }).then(() => {
    console.log('Database Connected Successfully');
  }).catch((err) => (
    console.log(err)
  ))





app.get('/', (req, res) => {
  res.send('This is Homepage')
})

app.get('/login', (req, res) => {
  res.send('This is Homepage')
})

app.get('/aboutus', (req, res) => {
  res.send('This is Homepage')
})




// How to create a user router
// Create a todo record and store it in the database

app.post('/register', async (req, res) => {


  try {
    const salt = await bcrypt.genSalt(10);

    //we are hashing the password and telling it to encode it  use the salt function
    //const password = await bcrypt.hash(req.body.password, salt)

    const { name, dateofbirth, gender, phoneNumber, email, password } = req.body;

    //create a user and pass these keywords to them
    //destructure the database or schema that is coming
    //meaning all these database we are going to send, we are expecting the database to store it

    const user = await User.create({
      name,
      dateofbirth,
      gender,
      phoneNumber,
      email,
      password
    });


    //then  
    if (user) {
      res.status(201).json({
        //then this info or status is true
        status: true,
        message: 'User was created',
        data: user
      })

    } else {
      res.status(400).json({
        status: false,
        message: 'User not created',


      })
    }


  } catch (err) {
    console.log(err)
  }


});

//(User with capital use is a database, user with small u is variable, can be anything)

app.get('/getAllUsers', async (req, res) => {

  //find the users 
  const users = await User.find()
  console.log(users)

  if (users) {

    res.status(200).json({
      status: true,
      message: 'You are a genius',
      data: users
    })

    res.send(users)

  } else {
    res.status(404).json({
      status: false,
      message: 'You are lost'
    })
  }
});



app.delete('/remove/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (user) {
    res.status(200).json({
      status: true,
      message: "User has been deleted successfully",
      data: user,
    })


  } else {
    res.status(400).json({
      status: false,
      message: " Sorry unable to delete User"

    })
  }
});



app.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, password } = req.body;

  const user = await User.updateOne({
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    password: password,
  }).where({ _id: id });


  if (User) {
    res.status(200).json({
      status: true,
      message: "Updated",
      data: user
    })

  } else {
    res.status(400).json({
      status: false,
      message: "Sorry something went wrong"
    })
  }

})



//  app.patch("/edit/:id",async(req,res)=>{
//   const {id}=req.params;
//   const{change}=req.body;

//   const user =await User.updateOne({changes }).where({_id: id});


// if(User){
//   res.status(200).json({
//     status:true,
//     message:"Updated",
//     data:user
//   })

// }else{
//   res.status(400).json({
//     status:false,
//     message:"Sorry something went wrong"
//   })
// }

// })


app.put("/add/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, password } = req.body;

  const user = await User.updateOne({
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    password: password,
  }).where({ _id: id });


  if (User) {
    res.status(200).json({
      status: true,
      message: "Updated",
      data: user
    })

  } else {
    res.status(400).json({
      status: false,
      message: "Sorry something went wrong"
    })
  }

})


//using email and password(the password is encoded) to login
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {

    //check if the email is invalid
    if (!user) return res.status(400).json({ message: "Invalid Email" })


    //if email is valid, then check for password and
    //use the bcrypt.compare to check what the user typed and what we have in our database
    // the password you dont have,ie,you type it in the thunderclient,and the hased password you have
    bcrypt.compare(password, user.password, (err, data) => {
      if (err) return err;


      //check for successful login or failed
      //where data is email and password
      if (data) {
        res.status(200).json({ message: "Welcome back user" })
      } else {
        res.status(400).json({ message: "Invalid Password" })
      }
    })
  });
});




//directing to your html form
//app.get("/", (req, res) => {
 // res.sendFile(__dirname + "/form.html");
//});


//directing to your a different place like youtube,facebook,etc
app.get("/",(req,res)=>{
res.redirect( "https://www.google.com/ ");
});





app.listen(3000, () => {

  console.log('listening on port')
})




