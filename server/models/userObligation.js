const mongoose = require( "mongoose" );

const UserObligationSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
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
		paidIn: {
			type: Number,
			default: 0,
			min: 0,
		},
		notificationSend: {
			type: Boolean,
			default: false,
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

const UserObligationModel = mongoose.model( "UserObligation", UserObligationSchema );

module.exports = UserObligationModel;
