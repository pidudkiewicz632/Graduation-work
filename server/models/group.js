const mongoose = require( "mongoose" );

const schemaGroup = new mongoose.Schema( {
	name: {
		type: String,
		required: true,
		validate: {
			validator: function ( value ) {
				return /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test( value );
			},
			message: "Group name is bad.",
		},
	},
	description: {
		type: String,
		required: false,
		validate: {
			validator: function ( value ) {
				return /^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,100}$/.test( value );
			},
			message: "Group description is bad.",
		},
	},
	active: {
		type: Boolean,
		default: true,
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

schemaGroup.virtual( "members", {
	ref: "GroupMembers",
	localField: "_id",
	foreignField: "idGroup",
} );

const Group = mongoose.model( "Group", schemaGroup );

module.exports = Group;
