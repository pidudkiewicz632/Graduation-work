const mongoose = require( "mongoose" );

const UserRequestSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
			justOne: true,
		},
		type: {
			type: String,
			enum: [ "email", "password", "login", "accountActivate", "restoreAccount" ],
			required: true,
		},
		data: {
			type: String,
			required: function() { return this.type === "email"; },
		},
		date: {
			type: Date,
			default: new Date(),
		}
	},
	{
		toObject: {
			transform: function ( doc, ret ) {
				ret.id = ret._id;
				delete ret._id;
			},
			virtuals: true,
		},
		toJSON: {
			transform: function ( doc, ret ) {
				ret.id = ret._id;
				delete ret._id;
			},
			virtuals: true,
		}
	}
);

const UserRequestModel = mongoose.model( "UserRequest", UserRequestSchema );

module.exports = UserRequestModel;
