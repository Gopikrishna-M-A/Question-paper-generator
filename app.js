const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
require('dotenv').config();


const app = express()

const storage = multer.diskStorage({
    destination:  (req, file, cb)=>{
      cb(null, './public/question-images')
    },
    filename:  (req, file, cb)=>{
      return cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })






  //.env variables
  const PORT = process.env.PORT;
  const Pass_Key = process.env.PASS_KEY;
  const user_id = process.env.USER_ID;
  
  
  
  const URL = `mongodb+srv://${user_id}:${encodeURIComponent(Pass_Key)}@cluster0.sbpkrhp.mongodb.net/`;
  // const URL = "mongodb://localhost:27017/Questions";

mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true });

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')  
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true
  }));




// questions Collection

const questionSchema = mongoose.Schema(
    {
    question:String,
    Dlevel:String,
    Clevel:String,
    section:String,
    mark:Number,
    imageSrc:{
        type:String,
        default: null
    },
    tableData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
    row:{
        type:Number,
        default: null
    },
    col:{
        type:Number,
        default: null
    },
    opta:{
        type:String,
        default: null
    },
    optb:{
        type:String,
        default: null
    },
    optc:{
        type:String,
        default: null
    },
    optd:{
        type:String,
        default: null
    },
    space:Number
    }
)
questionSchema.set('timestamps', true);

const Question = new mongoose.model('Question',questionSchema)

    


// questions Collection
const paperSchema = new mongoose.Schema({
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }],
    noOfQuestions:Number
  });
paperSchema.set('timestamps', true);

const Paper = new mongoose.model('Paper',paperSchema)

    






// const isLoggedIn = (req, res, next) => {
//     if (req.cookies.loggedIn === 'true') {
//       next();
//     } else {
//       res.redirect("/login")
//     }
// }


// **************************************************************** routes ***************************************************************

// route

    app.get("/",(req,res)=>{
        res.render("home")
    })
    app.get("/generate",(req,res)=>{
      
      Question.distinct('section')
      .exec()
      .then((Sections) => {
        res.render("generate",{Sections})
      })
      .catch((err) => {
        console.error('Error fetching unique sections:', err);
        // Handle the error if needed
      });


    })

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      // console.log(array);
      return array;
    }


    app.post("/generate", async (req, res) => {
      const criteriaArray = JSON.parse(req.body.data)
      const noOfQuestions = req.body.number

      // Fetch all questions from the database
      Question.find({})
        .then((allQuestions) => {
          const view = shuffleArray([...allQuestions]) // Create a copy of all questions as the view
          const matchedQuestions = []

          // Iterate through the criteria array
          for (const criterion of criteriaArray) {
            const { section, mark, level, Cognitive } = criterion
            

            // Find the first question that matches the criterion in the view
            const matchedQuestion = view.find((question) => {
              return (
                question.section === section &&
                question.mark == mark &&
                question.Dlevel === level &&
                question.Clevel === Cognitive
              )
            })

            if (matchedQuestion) {
              matchedQuestions.push(matchedQuestion)
              // Remove the matched question from the view
              const index = view.indexOf(matchedQuestion)
              if (index > -1) {
                view.splice(index, 1)
              }
            } else {
              res.render("generate",{err:true,section,mark,level,Cognitive})
              // If no match is found for a criterion, alert an error
              
            }
          }
          // Create a new Paper and add the matchedQuestions and noOfQuestions
          const newPaper = new Paper({
            questions: matchedQuestions.map((question) => question._id),
            noOfQuestions,
          });

          // Save the new Paper to the database
          newPaper
            .save()
            .then((savedPaper) => {
              res.render('question-paper', { questions: matchedQuestions })
            })
            .catch((error) => {
              console.error("Error saving the paper:", error)
              res.status(500).json({ error: "Internal server error" })
            })
        }).catch((error) => {
          console.error("Error retrieving questions:", error)
          res.status(500).json({ error: "Internal server error" })
        })
    })



    app.get("/add-questions",(req,res)=>{
        res.render("add-question")
    })

    app.post("/add-questions",upload.single('image'),(req,res)=>{
        const {
          question,
          Dlevel,
          Clevel,
          section,
          mark,
          img,
          table,
          tableData,
          row,
          col,
          opta,
          optb,
          optc,
          optd,
          space
        } = req.body;   



        if(img){
            const imagePath = req.file.path;
            imageSrc = imagePath.substring(6);

            const newQuestion = new Question({
                question,
                Dlevel,
                Clevel,
                section,
                mark,
                imageSrc,
                tableData,
                row,
                col,
                opta,
                optb,
                optc,
                optd,
                space
              });

       
            newQuestion.save()
            .then((question) => {
                res.redirect("/add-questions")
            })
            .catch((error) => {
                console.error(error);
            });    
        }else {
            const newQuestion = new Question({
                question,
                Dlevel,
                Clevel,
                section,
                mark,
                tableData,
                row,
                col,
                opta,
                optb,
                optc,
                optd,
                space
              });


            newQuestion.save()
            .then((question) => {
                res.redirect("/add-questions")
            })
            .catch((error) => {
                console.error(error);
            });    
        }
            
            

      })

    app.get("/about",(req,res)=>{
        res.render("about")
    })


    app.get("/database", (req, res) => {
      Question.find()
        .sort({ section: 1 }) // Sort by section number in ascending order (change to -1 for descending order)
        .then(questions => {
          res.render("database", { questions });
        })
        .catch(error => {
          console.error(error);
        });
    });


app.get("/verify",(req,res)=>{
    res.render("verify")
})
app.post("/verify",(req,res)=>{
    const digit1 = req.body.digit1
    const digit2 = req.body.digit2
    const digit3 = req.body.digit3
    const digit4 = req.body.digit4

    const key = digit1+digit2+digit3+digit4

    if(key=="1234"){
        res.render("add-question")
    }else{
        res.redirect("/")
    }
})











app.listen(PORT||3000,(err)=>{
    if(err)
        console.log("err");
    else
        console.log("server started at port 3000");    
})





