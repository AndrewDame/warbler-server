require("dotenv").config();
const express = require("express"),
      app = express();
      cors = require("cors"),
      bodyParser = require('body-parser'),
      port = process.env.PORT || 8081,
      errorHandler = require('./handlers/error'),
      authRoutes = require('./routes/auth'),
      messagesRoutes = require('./routes/messages'),
      {loginRequired, ensureCorrectUser} = require('./middleware/auth'),
      db = require('./models')


app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users/:id/messages',
  loginRequired,
  ensureCorrectUser,
  messagesRoutes);

app.get("/api/messages", loginRequired, async function (req, res, next){
  try{
    let messages = await db.Message.find()
                            .sort({createdAt: "desc"})
                            .populate("user", {
                              username: true,
                              profileImageUrl: true
                            });
    return res.status(200).json(messages)
  }

  catch(error){
    return next(error)
  }
})

//all my routes here - they will come later!

app.use(function(req, res, next){ //to be called when a route is not defined
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use(errorHandler);
app.listen(port, function(){
  console.log(`Server is starting on port ${port}`);
})
