const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
//
const Schema = mongoose.Schema;

const ProductCart = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    tableName: {type: String, require: true},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, require: true },
    image: { type: String, maxLength: 255 },
    newPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: [1] },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('ProductCart', ProductCart);