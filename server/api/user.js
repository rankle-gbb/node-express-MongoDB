const express = require('express');
const User = require('../model/userModel')
const auth = require('../middleware/auth');
const cookie = require('../middleware/cookie');
const session = require('express-session');
const {
  check,
  validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// query all
router.get('/', auth, async (req, res) => {
    const { pageSize, pageIndex } = req.query;
    console.log(req.query);
    try {
        const userData = await User.find().limit(Number(pageSize)).skip(Number(pageIndex) * Number(pageSize));
        const total = await User.countDocuments();

        res.send({
            data: userData,
            total,
            msg: 'Query user data successfully'
        })
    } catch (error) {
        res.send('error msg')
    }
})


// query one
router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await User.findById(id)
        res.send({
            data: result,
            msg: 'Query data according to user id succeeded!'
        })
    } catch (error) {
        res.send('error msg')
    }
})

// create one
router.post('/create', [
  check('userName', "Please Enter a Valid Username")
  .not()
  .isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("passWord", "Please enter a valid password").isLength({
      min: 6
  })
],
auth,
cookie,
async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array()
      });
  }
  const {
      userName,
      email,
      passWord
  } = req.body;
  try {
      let user = await User.findOne({
          email
      });
      if (user) {
          return res.status(400).json({
              msg: "User Already Exists"
          });
      }

      user = new User({
          userName,
          email,
          passWord
      });

      const salt = await bcrypt.genSalt(10);
      console.log(salt, 'saltHash:::::::');
      user.passWord = await bcrypt.hash(passWord, salt);

      await user.save();

      const payload = {
          user: {
              id: user.id
          }
      };
      console.log(payload, 'payload::::::::::');

      jwt.sign(
          payload,
          "randomString", {
              expiresIn: 10000
          },
          (err, token) => {
              if (err) throw err;
              res.status(200).json({
                  data: {
                      id: user._id,
                      userName: user.userName,
                      email: user.email
                  },
                  token,
                  status:200,
                  msg: 'Registered user successfully!'
              });
          }
      );

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error in Saving");
    }
  }
)

// update one
router.put('/update', auth, cookie, async (req, res) => {
    const { id } = req.body;
    const bodyParam = req.body;
   
    // 这个判断主要是为了确认新密码是否有6位 并且加密
    if(bodyParam.passWord && bodyParam.passWord.length < 6) {
      res.send({
        msg:'Please enter a valid password'
      })
      return;
    } else if(bodyParam.passWord && bodyParam.passWord.length >= 6){
      const salt = await bcrypt.genSalt(10);
      bodyParam.passWord = await bcrypt.hash(bodyParam.passWord, salt);
    }
    if(bodyParam.jurisdiction === 0) {
      bodyParam.jurisdiction = 'superAdmin';
    } else {
      bodyParam.jurisdiction = 'admin';
    }
    try {
        const findUser = await User.findById(id)
        if (findUser) {
            const data = await User.updateOne({
                _id: id
            }, bodyParam);
            res.send({
                status: 200,
                msg: 'Update user successfully!'
            })
        } else {
            res.send(findUser)
        }
    } catch (error) {
        res.send(error)
    }
})

// delete one
router.delete('/delete', auth, cookie, async (req, res) => {
    // const id = req.params.id;
    const { id } = req.body;
    try {
        const result = await User.deleteOne({
            _id: id
        })
        res.send({
            status: 200,
            msg: 'Delete user successfully!'
        })
    } catch (error) {
        res.send('error')
    }
})

// 根据createDate字段获取年月日数据统计
router.get('/query/querybyDate', async (req, res) => {
    try {
        const data = await User.aggregate([{
                $group: {
                    _id: {
                        year: {
                            $year: "$createDate"
                        },
                        month: {
                            $month: "$createDate"
                        },
                        day: {
                            $dayOfMonth: "$createDate"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                },

            },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    dailyData: {
                        $push: {
                            day: "$_id.day",
                            count: "$count"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year"
                    },
                    monthlyData: {
                        $push: {
                            month: "$_id.month",
                            dailyData: "$dailyData"
                        }
                    },
                }
            },

        ]);
        res.send({
            data,
            msg: 'Data statistics obtained successfully!'
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router