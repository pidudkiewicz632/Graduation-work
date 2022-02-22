const mongoose = require( "mongoose" );

const DiscardSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			validate: {
				validator: function ( value ) {
					return /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test( value );
				},
				message: "Discard name is bad.",
			},
		},
		description: {
			type: String,
			required: false,
			validate: {
				validator: function ( value ) {
					return /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,150}$/.test( value );
				},
				message: "Discard description is bad.",
			},
		},
		idRecipient: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: function() { return this.type === "single"; },
		},
		idGroup: {
			type: mongoose.Schema.ObjectId,
			ref: "Group",
			required: function() { return this.type === "group"; },
		},
		type: {
			type: String,
			enum: [ "single", "group" ],
			required: true,
		},
		isCyclic: {
			type: Boolean,
			required: true,
		},
		cyclicalInterval: {
			type: String,
			required: function() { return this.isCyclic; },
			enum: [ "oneWeek", "twoWeeks", "oneMonth", "twoMonths", "halfYear", "year" ],
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

DiscardSchema.virtual( "cycles", {
	ref: "DiscardCycle",
	localField: "_id",
	foreignField: "idDiscard",
} );

const DiscardModel = mongoose.model( "Discard", DiscardSchema );

module.exports = DiscardModel;
