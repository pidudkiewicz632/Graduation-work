const passport = require( "passport" );
const LocalStrategy = require( "passport-local" ).Strategy;
const jwtPassport = require( "passport-jwt" );
const jwtStrategy = jwtPassport.Strategy;
const jwtExtract = jwtPassport.ExtractJwt;
const bcrypt = require( "bcrypt" );
const user = require( "../models/user" );

const authenticateUser = async ( username, password, done ) => {
	try {
		user
			.findOne( {
				login: username,
			} )
			.then( ( userTemp ) => {
				bcrypt
					.compare( password, userTemp.password )
					.then( ( result ) => {

						if ( result ) {
							if( result.status === "notActive" ) {
								return done( null, false, {
									message: "Account is not active.",
								} );
							}
							return done( null, userTemp );
						}

						return done( null, false, {
							message: "Password is incorrect.",
						} );
					} )
					.catch( ( err ) => {
						throw err;
					} );
			} )
			.catch( ( err ) => {
				return done( null, false, {
					message: "User with that login not exist.",
				} );
			} );
	} catch ( e ) {
		return done( e );
	}
};

module.exports = function ( app ) {
	app.use( passport.initialize() );

	passport.use(
		new LocalStrategy(
			{
				usernameField: "login",
				passwordField: "password",
			},
			authenticateUser
		)
	);

	passport.use(
		new jwtStrategy(
			{
				secretOrKey: process.env.WEB_KEY,
				jwtFromRequest: jwtExtract.fromHeader( "authorization-token" ),
			},
			function ( userId, next ) {
				user
					.findById( userId )
					.then( ( result ) => {
						return next( null, result );
					} )
					.catch( ( err ) => {
						return next( err );
					} );
			}
		)
	);
};
