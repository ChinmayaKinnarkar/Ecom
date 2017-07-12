var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../middlewares/auth.js');
var userRouter = express.Router();
var orderModel = mongoose.model('order');
var responseGenerator = require('../../lib/responseGenerator');

module.exports.controller = function (app){
	userRouter.get('/addtocart/:productName',auth.isLoggedIn,function(req,res) {
		productModel.findOne({'productName': req.params.productName},function(err,result) {
			if (!err) {
				if (req.params.productName!=undefined && req.params.productName!=null) {
					var newOrder = new orderModel({
						userName	:  req.session.user.userName,
						userEmail	:  req.session.user.emailId,
						productName :  result.productName,
						category    :  result.category,
						productPrice : result.productPrice
					});

					newOrder.save(function(err) {
						if (err) {
							alert("Some error occurred");
							var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
							res.render('error',{
								message: myResponse.message,
								error: myResponse.data
							});
						} else {
							console.log(req.session);
							res.redirect('/users/products');
						}
					});
				}
			}
			else
			{
				alert("Some error occurred");
				var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
				res.render('error',{
					message: myResponse.message,
					error: myResponse.data
				});
			}
		});
	});

//route to view products in cart
userRouter.get('/cart',auth.isLoggedIn,function(req,res) {
	orderModel.find({'userName':req.session.user.userName},function(req,res) {
		if (err) {
			alert("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
				res.render('error',{
					message: myResponse.message,
					error: myResponse.data
				});
		} else{
			console.log(result);
			res.render('order',{
				orderItems:result,
				user:req.session.user
			});
		}
	});
});

//route to delete items from cart
userRouter.get('/cartdelete/:productName',auth.isLoggedIn,function(req,res) {
	orderModel.findOneAndRemove({$and:[{'productName':req.params.productName},{'userName':req.session.user.userName}]},function(req,res) {
		if (err) {
			alert("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Some error occurred "+err,500,null);
				res.send(myResponse);
		} else if(result== null || result==undefined|| result==" "){
			var myResponse = responseGenerator.generate(true,"Product not found",404,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} else{
			alert("Product deleted");
			res.redirect('/users/order');
		}
	});
});

// application level middleware for generic error
app.use(function(err,req,res,next) {
	console.log(err.status);
	res.status(err.status||500);
	if (err.status==404) {
		res.render('404',{
			message: err.message,
			error: err
		});
	} else{
		res.render('error',{
			message: err.message,
			error: err
		});
	}
});

app.use('/users',userRouter);
}