const mongoose = require( "mongoose" );
const dayjs = require( "dayjs" );

const DiscardCycleSchema = new mongoose.Schema(
	{
		dateOfPayment: {
			type: Date,
			required: true,
			validate: [
				{
					validator: function ( value ) {
						const currentDate = dayjs( dayjs().format( "YYYY-MM-DD" ) );
						const dateOfPayment = dayjs( value );
						const diffrence = Math.abs( dateOfPayment.diff( currentDate, "year" ) );
						return !diffrence;
					},
					message: "Max diffrence is one year.",
				}
			],
		},
		idDiscard: {
			type: mongoose.Schema.ObjectId,
			ref: "Discard",
			required: true,
		},
		typeOfSpread: {
			type: String,
			enum: [ "spreading", "specified", "manual" ],
			required: true,
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

DiscardCycleSchema.virtual( "obligations", {
	ref: "UserObligation",
	localField: "_id",
	foreignField: "idDiscardCycle",
} );

DiscardCycleSchema.virtual( "obligation", {
	ref: "UserObligation",
	localField: "_id",
	foreignField: "idDiscardCycle",
	justOne: true
} );

const DiscardCycleModel = mongoose.model( "DiscardCycle", DiscardCycleSchema );

module.exports = DiscardCycleModel;
