const mongoose = require( "mongoose" );

const NotificationSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [ "invite", "groupInfo", "newDiscard", "newSinglePayment", "newGroupPayment", "changeSinglePaymentState", "changeGroupPaymentState", "removeUserFromDiscard", "modifedDiscardObligations", "modifedDiscardInfo", "modifedSingleDiscardInfo", "removedFromGroup", "changeGroupInviteState" ],
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		message: {
			type: String,
			maxlength: 200,
			required: true,
		},
		idOfEvent: {
			type: mongoose.Schema.ObjectId,
			required: true,
		},
		date: {
			type: Date,
			default: new Date()
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

const NotificationModel = mongoose.model( "Notification", NotificationSchema );

module.exports = NotificationModel;
