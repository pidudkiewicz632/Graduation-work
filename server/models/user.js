const mongoose = require( "mongoose" );
const crypt = require( "bcrypt" );

const schemaUser = new mongoose.Schema( {
	login: {
		type: String,
		required: true,
		validate: {
			validator: function ( value ) {
				return /^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,19}[a-zA-Z0-9]$/.test( value );
			},
			message: "Login jest zły.",
		},
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: function ( value ) {
				return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test( value );
			},
			message: "E-mail jest zły.",
		},
	},
	password: {
		type: String,
		validate: {
			validator: function ( value ) {
				return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test( value );
			},
			message: "Hasło jest złe.",
		},
		required: true,
	},
	status: {
		type: String,
		enum: [ "active", "notActive", "deleted" ],
		default: "notActive",
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

schemaUser.pre( "save", function ( next ) {
	var user = this;

	crypt.hash( user.password, 10, function ( err, hash ) {
		if ( err ) return next( err );
		user.password = hash;
		return next();
	} );
} );

schemaUser.pre( "updateOne", function ( next ) {
	var user = this.getUpdate();

	if( user.password ){
		crypt.hash( user.password, 10, function ( err, hash ) {
			if ( err ) return next( err );
			user.password = hash;
			return next();
		} );
	}else{
		return next();
	}
} );


const User = mongoose.model( "User", schemaUser );

module.exports = User;
