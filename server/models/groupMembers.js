const mongoose = require( "mongoose" );

const schemaGroupMembers = new mongoose.Schema(
	{
		idGroup: {
			type: mongoose.Schema.ObjectId,
			required: true,
		},
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		permission: {
			type: String,
			enum: [ "owner", "admin", "member", "pending", "deleted" ],
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

schemaGroupMembers.virtual( "group", {
	ref: "Group",
	localField: "idGroup",
	foreignField: "_id",
	justOne: true,
} );

const GroupMembers = mongoose.model( "GroupMembers", schemaGroupMembers );

module.exports = GroupMembers;
