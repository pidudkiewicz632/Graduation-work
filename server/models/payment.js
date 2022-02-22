const mongoose = require( "mongoose" );

const PaymentSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
			justOne: true,
		},
		idDiscardCycle: {
			type: mongoose.Schema.ObjectId,
			ref: "DiscardCycle",
			required: true,
			justOne: true,
		},
		amount: {
			type: Number,
			required: true,
			validate: {
				validator: function ( value ) {
					return value >= 1;
				},
				message: "Cannot be less 1.\n",
			},
		},
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

const PaymentModel = mongoose.model( "Payment", PaymentSchema );

module.exports = PaymentModel;
