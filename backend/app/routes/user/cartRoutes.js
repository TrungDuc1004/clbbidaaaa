const express = require('express');
const verifyToken = require('../../../middlewares/verifyToken');
const router = express.Router();
const cartController = require('../../controllers/user/cartController');

router.post('/add-item', verifyToken, cartController.addToCart);
router.get('/cart', verifyToken, cartController.getCart);
router.put('/cart/:id', verifyToken, cartController.updateCartQuantity);
router.delete('/cart/:id', verifyToken, cartController.deleteCartItem);
router.delete('/cart', verifyToken, cartController.clearCart);

module.exports = router;
