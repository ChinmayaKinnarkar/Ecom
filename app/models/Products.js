var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({


productName   : {type:String,default:"",required:true}, 
category      : {type:String,required:true}, 
ratings	      : {type:Number,default:0}, 
reviews		  : [],
images		  : [{ data: Buffer, contentType: String }], 
productPrice  : {type:Number,default:"",required:true}, 
discountPrice : {type:Number,default:""}, 
productDescription  : {type:String,default:"Not Specified  by Seller"}, 
stockQuantity : {type:Number,default:0}, 
size          : {type:String,default:"Not Specified  by Seller"}, 
color         : {type:String,default:"Not Specified by Seller"}, 
model         : {type:String,default:"Not Specified by Seller"}, 
brandName     : {type:String,default:"Not Specified  by Seller"}, 
createdOn     : {type:Date,default:Date.now}, 
updatedOn     : {type:Date,default:Date.now}, 
url           : {type:String} 

});

mongoose.model('product',productSchema);
