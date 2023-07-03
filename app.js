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







  const PORT = process.env.PORT;
  const Pass_Key = process.env.PASS_KEY;
  const user_id = process.env.USER_ID;
  
  
  
  const URL = `mongodb+srv://${user_id}:${encodeURIComponent(Pass_Key)}@cluster0.sbpkrhp.mongodb.net/`;

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
        res.render("generate")
    })
    app.post("/generate",(req,res)=>{

        const questions = JSON.parse(req.body.data)
        const noOfQuestions = req.body.number
        console.log("from form:",questions);

              
            // if (questions && questions.length > 0) {
            //     const sectionValues = questions.map(q => q.section);
            //     const markValues = questions.map(q => q.mark);
            //     const levelValues = questions.map(q => q.level);
            //     const cognitiveValues = questions.map(q => q.Cognitive);
              
            //     Question.find({
            //       section: { $in: sectionValues },
            //       mark: { $in: markValues },
            //       Dlevel: { $in: levelValues },
            //       Clevel: { $in: cognitiveValues }
            //     })
            //     .then(questions => {
            //       console.log('Matching questions:', questions);
            //       const questionIds = questions.map(q => q._id);

            //       const updatedPaperData = {
            //         questions: questionIds,
            //         noOfQuestions
            //       };
            //       const paper = new Paper(updatedPaperData);

            //       paper.save()
            //         .then(savedPaper => {
            //           console.log('Paper saved:', savedPaper);
            //           questions.forEach(question => {
            //             if (question.tableData) {
            //               question.tableData = JSON.parse(question.tableData);
            //             }
            //           })  
            //           res.render("question-paper",{questions})
            //         })
            //         .catch(error => {
            //           console.error('Error saving paper:', error);
            //         });
                  
            //     })
            //     .catch(error => {   
            //       console.error('Error fetching questions:', error);
            //     });
            //   } else {
            //     console.log('No questions provided in the paperData object.');
            //   }






            if (questions && questions.length > 0) {
              const questionPromises = questions.map(questionObj => {
                const { section, mark, level, Cognitive } = questionObj;
                
            
                const query = {
                  section,
                  mark: parseInt(mark),
                  Dlevel: level,
                  Clevel: Cognitive
                };
            
                return Question.aggregate([
                  { $match: query },
                  { $sample: { size: 1 } }
                ]).exec();
              });
            
              Promise.all(questionPromises)
                .then(results => {
                  const filteredQuestions = results.filter(question => question.length > 0);
            
                  if (filteredQuestions.length === 0) {
                    console.log('No matching questions found.');
                    return;
                  }
            
                  console.log('Matching questions:', filteredQuestions);
            
                  const questionIds = filteredQuestions.map(question => question[0]._id.toString());
                  const uniqueQuestionIds = [...new Set(questionIds)];
            
                  console.log('Unique question IDs:', uniqueQuestionIds);
            
                  const updatedPaperData = {
                    questions: uniqueQuestionIds,
                    noOfQuestions
                  };
                  const paper = new Paper(updatedPaperData);
            
                  paper.save()
                    .then(savedPaper => {
                      console.log('Paper saved:', savedPaper);
            
                      const questionPromises = uniqueQuestionIds.map(questionId =>
                        Question.findById(questionId)
                          .then(question => {
                            if (question && question.tableData) {
                              question.tableData = JSON.parse(question.tableData);
                            }
                            return question;
                          })
                      );
            
                      Promise.all(questionPromises)
                        .then(questions => {
                          console.log('Questions:', questions);
                          res.render("question-paper", { questions });
                        })
                        .catch(error => {
                          console.error('Error fetching questions:', error);
                        });
                    })
                    .catch(error => {
                      console.error('Error saving paper:', error);
                    });
                })
                .catch(error => {
                  console.error('Error fetching questions:', error);
                });
            } else {
              console.log('No questions provided in the paperData object.');
            }
            
            
            
            




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

          console.log(question);


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


    app.get("/database",(req,res)=>{
          Question.find()
      .then(questions => {
        console.log("questions",questions);
        res.render("database",{questions})
      })
      .catch(error => {
        console.error(error);
      });
    })



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


