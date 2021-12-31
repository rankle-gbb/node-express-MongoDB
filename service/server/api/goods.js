const express = require('express');
const Goods = require('../model/goodsModel')
const auth = require('../middleware/auth');
const cookie = require('../middleware/cookie');
const router = express.Router();

// query all goods
router.get('/', async (req, res) => {
  const { pageSize, pageIndex } = req.query;
  console.log(req.query);
  try {
      const goodsData = await Goods.find().limit(Number(pageSize)).skip(Number(pageIndex) * Number(pageSize));
      const total = await Goods.countDocuments();

      res.send({
          data: goodsData,
          total,
          msg: 'Query Goods data successfully'
      })
  } catch (error) {
    res.send({
      status: 500,
      msg: '查询失败！'
    })
  }
})

// query one goods
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const result = await Goods.findById(id)
      res.send({
          data: result,
          msg: 'Query data according to user id succeeded!'
      })
  } catch (error) {
      res.send({
        status: 500,
        msg: '查询失败！'
      })
  }
})

// create one goods 
router.post('/createGoods', async(req, res) => {
  const { goodsName, originalPrice, presentPrice, introduce, color, size } = req.body;
  console.log('res==', res)
  try {
    let goods = new Goods({ goodsName, originalPrice, presentPrice, introduce, color, size });
    console.log('goods',goods);
    await goods.save();
    res.status(200).json({
      data: {
        id: goods._id,
        goodsName: goods.goodsName,
        originalPrice: goods.originalPrice,
        presentPrice: goods.presentPrice,
        introduce: goods.introduce,
        color: goods.color,
        size: goods.size,
      },
      status:200,
      msg: 'Successfully added product'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: 500,
      msg: '创建失败！'
    });
  }
})

// update goods
router.put('/update', async(req, res) => {
  const { id } = req.body;
  const bodyParam = req.body;
  try {
    const findGoods = await Goods.findById(id)
    if (findGoods) {
        const data = await Goods.updateOne({
            _id: id
        }, bodyParam);
        res.send({
            status: 200,
            msg: 'Update Goods successfully!'
        })
    } else {
        res.send(findGoods)
    }
} catch (error) {
    res.send({
      status: 500,
      msg: 'Update Goods failed!'
    })
}
})

// delete goods
router.delete('/delete', async(req, res) => {
  const { id } = req.body;
  try {
    const result = await Goods.deleteOne({
        _id: id
    })
    res.send({
        status: 200,
        msg: 'Delete Goods successfully!'
    })
} catch (error) {
    res.send({
      status: 500,
      msg: 'Delete Goods failed!'
    })
}
})

module.exports = router