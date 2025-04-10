const express = require('express');
const verifyToken = require('../../../middlewares/verifyToken');
const router = express.Router();
const cartController = require('../../controllers/user/cartController');

router.post('/add-item', verifyToken, cartController.addToCart);
router.get('/', verifyToken, cartController.getCart);
router.put('/:id', verifyToken, cartController.updateCartQuantity);
router.delete('/:id', verifyToken, cartController.deleteCartItem);
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
