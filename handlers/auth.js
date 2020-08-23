const db = require('../models'),
      jwt = require('jsonwebtoken')

exports.signin = async function(req, res, next){
  try{
    let user = await db.User.findOne({
      email: req.body.email
    });

    let {id, username, profileImageUrl} = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch){
      let token = jwt.sign({
        id,
        username,
        profileImageUrl
      },
      process.env.SECRET_KEY)

      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      })
    }

    else{
      return next({
        status: 400,
        message: "Invalid Email/Password"
      })
    }
  }

  catch(e){
    return next({
      status: 400,
      message: "Invalid Email/Password"
    })
  }
}

exports.signup = async function(req, res, next){
  try{
    let user = await db.User.create(req.body);
    console.log(user)
    let {id, username, profileImageUrl} = user;
    let token = jwt.sign({
      id, username, profileImageUrl
    }, process.env.SECRET_KEY);

    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    })
    //create a username
    //create a token (signing a token)
  }
  catch(err){
    //if a validation fails!
    if(err.code === 110000){
      err.message = "Sorry, that username and/or email is taken"
    }
    return next({
      status: 400,
      message: err.message
    })
  }
};