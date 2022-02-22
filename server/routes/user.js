const express = require( "express" );
const passport = require( "passport" );
const jwt = require( "jsonwebtoken" );
const router = express.Router();
const path = require( "path" );
const fs = require( "fs" );
const UserModel = require( "../models/user" );
const UserRequestModel = require( "../models/userRequest" );
const customFunctions = require( "../config/customFunctions" );
const crypt = require( "bcrypt" );
const dayjs = require( "dayjs" );

router.post( "/register", async function( req, res ) {
	let newUser, newRequest;
	try {

		if( await customFunctions.checkLogin( req.body.login ).message ){
			throw ( {
				message: "Login: must be unique",
			} );
		}

		if( await customFunctions.checkEmail( req.body.email ) ){
			throw ( {
				message: "Email: must be unique",
			} );
		}
		
		newUser = new UserModel( {
			login: req.body.login,
			password: req.body.password,
			email: req.body.email,
		} );

		let result = await newUser.save();

		newRequest = new UserRequestModel( {
			idUser: newUser.id,
			type: "accountActivate",
		} );

		await newRequest.save();

		const link = "http://" + process.env.ADDRESS + "/login/account/activate/"+newRequest.id;

		await customFunctions.sendEmail( req.body.email, "Potwierdzenie zmiany email", `Dostaliśmy prośbę o urworzenie konta o loginie ${req.body.login}. Aby potwierdzić utworzenie konta kliknij w link: <br> <a href="${link}">${link}</a>` );

		if ( req.files ) {
			let avatar = req.files.userAvatar;

			customFunctions.saveImage( avatar , result._id , "avatar" );
		}
		return res.status( 200 ).json( {
			message: "User was created.",
		} );
	} catch ( err ) {
		if( newUser ) {
			UserModel.deleteOne( {
				_id: newUser.id
			} );
		}
		if( newRequest ) {
			UserRequestModel.deleteOne( {
				_id: newRequest.id
			} );
		}
		customFunctions.handleError( err, res );
	}
} );

router.get( "/list",customFunctions.authenticate,async ( req,res ) => {
	try{
		let users = await UserModel.find( {
			status: "active"
		} ).select( "login" );

		return res.status( 200 ).json( {
			message: "Success",
			data: users,
		} );

	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.post( "/account/activate", async ( req, res ) => {
	try{
		if( req.body.requestId ){
			const request = await UserRequestModel.findOne( {
				_id: req.body.requestId,
				type: "accountActivate",
			} );

			if( request ){
				await  UserModel.updateOne( {
					_id: request.idUser,
				}, {
					status: "active"
				},{
					runValidators: true,
				} );

				await UserRequestModel.deleteOne( {
					_id: request.id,
				} );

				return res.status( 200 ).json( {
					message: "Account is active.",
					data: true
				} );
			}

			return res.status( 400 ).json( {
				message: "Request is bad.",
				data: false,
			} );

		}else{
			throw ( {
				message: "RequestId is required.",
			} );
		}
	}catch ( err ) {
		customFunctions.handleError( err, res );
	}
} );

router.post( "/login", function( req, res, next ) {
	passport.authenticate(
		"local", {
			session: false,
		},
		// eslint-disable-next-line no-unused-vars
		function( error, user, info ) {
			if ( error ) {
				return next( error );
			}
			if ( !user ) {
				return res.status( 400 ).json( {
					message: "Login or password is bad",
					data: "badData",
				} );
			}

			if ( user.status === "notActive" ) {
				return res.status( 400 ).json( {
					message: "Account is not active.",
					data: "notActive",
				} );
			}

			if ( user.status === "deleted" ) {
				return res.status( 400 ).json( {
					message: "Account is deleted.",
					data: "deleted",
				} );
			}

			req.logIn(
				user, {
					session: false,
				},
				( error ) => {
					if ( error ) {
						return next( error );
					}

					const userToken = jwt.sign( user._id.toString(), process.env.WEB_KEY );

					return res.status( 200 ).json( {
						user: {
							login: user.login,
							id: user._id,
							token: userToken,
						},
					} );
				}
			);
		}
	)( req, res, next );
} );

router.get( "/checkEmail", async function( req, res ) {
	try {
		res.status( 200 ).json( {
			message: await customFunctions.checkEmail( req.query.email ),
		} );
	} catch ( e ) {
		res.status( 500 ).json( {
			message: "Server error.",
		} );
	}
} );

router.get( "/checkLogin", async function( req, res ) {
	try {
		res.status( 200 ).json( await customFunctions.checkLogin( req.query.login ) );
	} catch ( e ) {
		res.status( 500 ).json( {
			message: "Server error.",
		} );
	}
} );

router.get( "/avatar/:id", ( req, res ) => {
	const avatarLocationPNG = "./files/avatar/" + req.params.id + ".png";
	const avatarLocationJPG = "./files/avatar/" + req.params.id + ".jpg";

	if ( fs.existsSync( avatarLocationPNG ) ) {
		res.sendFile( path.resolve( avatarLocationPNG ) );
	} else if ( fs.existsSync( avatarLocationJPG ) ) {
		res.sendFile( path.resolve( avatarLocationJPG ) );
	} else {
		res.sendFile( path.resolve( "./files/avatar/default.png" ) );
	}
} );

router.get( "/info", customFunctions.authenticate, ( req,res ) => {
	res.status( 200 ).json( {
		message: "Success",
		data: req.user.email,
	} );
} );

router.post( "/info/edit", customFunctions.authenticate, async function( req, res ) {
	let newRequest;
	try {
		if( req.body.login !== req.user.login ){

			if( await customFunctions.checkLogin( req.body.login  ).message ){
				throw ( {
					message: "Login: must be unique",
				} );
			}

			await UserModel.updateOne( {
				_id: req.user.id,
			}, {
				login: req.body.login
			},{
				runValidators: true,
			} );
		}

		if( req.body.email !== req.user.email ){
			if( await customFunctions.checkEmail( req.body.email ) ){
				throw ( {
					message: "Email: must be unique",
				} );
			}

			newRequest = new UserRequestModel( {
				idUser: req.user.id,
				type: "email",
				data: req.body.email
			} );

			await newRequest.save();

			const link = "http://" + process.env.ADDRESS + "/login/email/change/confirmation/"+newRequest.id;

			await customFunctions.sendEmail( req.user.email, "Potwierdzenie zmiany email", `Dostaliśmy prośbę o zmiane przypisanego do konta adresu e-mail na ${req.body.email}. Aby potwierdzić zmianę, kliknij w link: <br> <a href="${link}">${link}</a>` );
		}

		if ( req.files ) {
			let avatar = req.files.userAvatar;
			customFunctions.saveImage( avatar , req.user.id , "avatar" );
		}
		return res.status( 200 ).json( {
			message: "User was uptaded.",
		} );
	} catch ( err ) {
		if( newRequest ) {
			await UserRequestModel.deleteOne( {
				_id: newRequest.id,
			} );
		}
		customFunctions.handleError( err, res );
	}
} );

router.post( "/password/change",customFunctions.authenticate, async function( req, res ) {
	try{
		if( req.body.oldPassword ){
			const isCorrectOldPassword = await crypt.compare( req.body.oldPassword, req.user.password );

			if( !isCorrectOldPassword ) {
				return res.status( 403 ).json( {
					message: "Old Password is incorrect",
				} );
			}

			await  UserModel.updateOne( {
				_id: req.user.id,
			}, {
				password: req.body.password
			},{
				runValidators: true,
			} );

			return res.status( 200 ).json( {
				message: "Password was uptaded.",
			} );
		}else{
			throw ( {
				message: "Old Password is incorrect",
			} );
		}
	}catch ( err ) {
		customFunctions.handleError( err, res );
	}
} );

router.post( "/password/reset", async function( req, res ) {
	let newRequest;
	try{
		const user = await UserModel.findOne( { email: req.body.email } );

		if( user ) {
			newRequest = new UserRequestModel( {
				idUser: user.id,
				type: "password"
			} );

			await newRequest.save();

			const link = "http://" + process.env.ADDRESS + "/login/password/change/"+newRequest.id;

			await customFunctions.sendEmail( req.body.email, "Przypomienie hasła", `Dostaliśmy prośbę o resetowanie hasła. Aby tego dokonać, kliknij w link: <br> <a href="${link}">${link}</a>` );

			return res.status( 200 ).json( {
				message: "Success",
			} );
		}else{
			throw( {
				message: "User not found."
			} );
		}
	}catch ( err ) {
		if( newRequest ) {
			await UserRequestModel.deleteOne( {
				_id: newRequest.id,
			} );
		}
		customFunctions.handleError( err, res );
	}
} );

router.post( "/login/remember", async function( req, res ) {
	let newRequest;
	try{
		const user = await UserModel.findOne( { email: req.body.email } );

		if( user ) {

			await customFunctions.sendEmail( req.body.email, "Przypomienie loginu", `Dostaliśmy prośbę o przypomnienie loginu. Twój login to: ${user.login}` );

			return res.status( 200 ).json( {
				message: "Success",
			} );
		}else{
			throw( {
				message: "User not found."
			} );
		}
	}catch ( err ) {
		if( newRequest ) {
			await UserRequestModel.deleteOne( {
				_id: newRequest.id,
			} );
		}
		customFunctions.handleError( err, res );
	}
} );

router.post("/remove", customFunctions.authenticate, async (req,res) =>{
	let newRequest;
	try{
		await UserModel.updateOne({
			_id: req.user.id
		},{
			status: "deleted"
		} );

		newRequest = new UserRequestModel( {
			idUser: req.user.id,
			type: "restoreAccount",
			data: req.user.login
		} );

		await newRequest.save();

		const link = "http://" + process.env.ADDRESS + "/login/user/restore/"+newRequest.id;

		await customFunctions.sendEmail( req.user.email, "Usunięcie konta", `Twoje konto zostało usunięte. Aby je przywrócić, kliknij w link: <br> <a href="${link}">${link}</a>` );

		return res.status( 200 ).json( {
			message: "Success",
		} );

	}catch ( err ) {
		if( newRequest ) {
			await UserRequestModel.deleteOne( {
				_id: newRequest.id,
			} );
		}
		customFunctions.handleError( err, res );
	}
});

router.post( "/password/reset/change", async function( req, res ) {
	try{
		if( req.body.requestId ){
			const request = await UserRequestModel.findOne( {
				_id: req.body.requestId,
				type: "password",
			} );

			if( request ){
				await  UserModel.updateOne( {
					_id: request.idUser,
				}, {
					password: req.body.password
				},{
					runValidators: true,
				} );

				await UserRequestModel.deleteOne( {
					_id: request.id,
				} );

				return res.status( 200 ).json( {
					message: "Password was uptaded.",
				} );
			}

			return res.status( 400 ).json( {
				message: "Request is bad.",
			} );

		}else{
			throw ( {
				message: "RequestId is required.",
			} );
		}
	}catch ( err ) {
		customFunctions.handleError( err, res );
	}
} );

router.post( "/email/change/confirmation", async( req,res )=>{
	try{
		if( req.body.requestId ){
			const request = await UserRequestModel.findOne( {
				_id: req.body.requestId,
				type: "email",
			} ).populate( "idUser" );

			if( request ){
				await UserModel.updateOne( {
					_id: request.idUser.id,
				}, {
					email: request.data
				},{
					runValidators: true,
				} );

				await UserRequestModel.deleteOne( {
					_id: request.id,
				} );

				return res.status( 200 ).json( {
					message: "Success",
					data: request.data,
				} );
			} else {
				return res.status( 200 ).json( {
					message: "Fail"
				} );
			}
		}
		return res.status( 400 ).json( {
			message: "requestId jest wymagane."
		} );
	}catch ( err ) {
		customFunctions.handleError( err, res );
	}
} );

router.post( "/restore", async( req,res )=>{
	try{
		if( req.body.requestId ){
			const request = await UserRequestModel.findOne( {
				_id: req.body.requestId,
				type: "restoreAccount",
			} ).populate( "idUser" );

			if( request ){
				await UserModel.updateOne( {
					_id: request.idUser.id,
				}, {
					status: "active"
				} );

				await UserRequestModel.deleteOne( {
					_id: request.id,
				} );

				return res.status( 200 ).json( {
					message: "Success",
					data: request.data,
				} );
			} else {
				return res.status( 200 ).json( {
					message: "Fail"
				} );
			}
		}
		return res.status( 400 ).json( {
			message: "requestId jest wymagane."
		} );
	}catch ( err ) {
		customFunctions.handleError( err, res );
	}
} );

router.get( "/request/check/:id",( req,res ) => {
	UserRequestModel.findOne( {
		_id: req.params.id,
		type: "password",
	} )
		.then( ( result ) => {
			if( result ){
				const today = dayjs();
				const dateDiffrence = today.diff( dayjs( result.date ), "day", true );

				if( dateDiffrence >1 ) {
					return res.status( 200 ).json( {
						message: "Request Expired",
						data: false,
					} );
				}

				return res.status( 200 ).json( {
					message: "Request Exists",
					data: true,
				} );
			}
			return res.status( 200 ).json( {
				message: "Not Exist",
				data: false,
			} );
		} );
} );

module.exports = router;
