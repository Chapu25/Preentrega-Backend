import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';

const productSchema = new Schema({
    title: { type: String,required: true,},
    description: {type: String, required: true,},
    code: {type: String, required: true,},
    category: {type: String, required: true,},
    price: {type: Number, required: true,},
    thumbnail: {type: String, required: true,},
    stock: {type: Number, required: true,},
    timestamp: {type: Date, default: Date.now,},
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('product', productSchema);


