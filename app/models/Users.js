var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var userSchema = new Schema ({

   userName     :  {type:String,required:true},
   firstName    :  {type:String,default:''},
   lastName     :  {type:String,},
   emailId      :  {type:String,default:''},
   phoneNumber  :  {type:Number,default:''},
   password     :  {type:String,default:''},
   securityQuestion : {type:String,default:'',required:true},
   securityAnswer : {type:String,default:'',required:true},
   addressLine1 :   {type:String,default:''},
   addressLine2  :  {type:String,default:''},
   pincode      :   {type:Number,default:''},
   city			: 	{type:String,default:''},
   state        : 	{type:String,default:''},
   country		: 	{type:String,default:'India'},
   wishList     :   []

});

mongoose.model('user',userSchema);