var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema = new Schema({

	productName  	: {type:String,default:"",required:true},
	productId	    : {type:Number,required:true},
	productPrice    : {type:String,default:0,required:true} ,
	productQuantity : {type:Number,default:1,required:true},
	orderedOn		: {type:Date,required:true},
	deliveryBy      : {type:Date},
	shippingAddress1 : {type:String,required:true},
	addressLine2     : {type:String,required:true},
	pinCode			 : {type:Number,required:true},
	city			 : {type:String,required:true},
	state			 : {type:String,required:true},
	phoneNumber		 : {type:Number,required:true},
	paymentMode		 : {type:String,default:"Cash on delivery",required:true},
	promotionalCode  : {type:String,default:""},
	orderId			 : {type:String},
	trackOrder		 : [],

	// if order is delivered then default will be 0.
	deliveryStatus   : {type:Number,default:1}

});

mongoose.model('order',orderSchema);