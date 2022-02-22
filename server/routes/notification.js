const express = require( "express" );
const router = express.Router();
const NotificationsModel = require( "../models/notification" );
const passport = require( "passport" );
const customFunctions = require( "../config/customFunctions" );

router.use( passport.authenticate( "jwt", {
	session: false,
} ) );

router.get( "/all", async ( req, res ) => {
	try {
		let notifications = await NotificationsModel.find( {
			idUser: req.user._id
		} )
			.select( "-idUser -__v" );

		const a = await NotificationsModel.updateMany( {
			idUser: req.user._id,
			read: false,
		},{
			read: true,
		} );

		return res.status( 200 ).json( {
			message: "Success",
			data: notifications,
		} );
	} catch ( e ) {
		customFunctions.handleError( e, res );
	}
}
);

router.get( "/number", async ( req, res ) => {
	try {
		let notifications = await NotificationsModel.find( {
			idUser: req.user._id,
			read: false,
		} )
			.select( "-idUser -__v" );
			
		return res.status( 200 ).json( {
			message: "Success",
			data: notifications.length,
		} );
	} catch ( e ) {
		customFunctions.handleError( e, res );
	}
}
);

router.post( "/delete", async ( req, res ) => {
	try {
		if(req.body.notifications){
			let notifications = JSON.parse( req.body.notifications );

			await NotificationsModel.deleteMany({
				_id: {
					$in: notifications,
				}
			} );
		}

		return res.status( 200 ).json( {
			message: "Success",
		} );
	} catch ( e ) {
		customFunctions.handleError( e, res );
	}
}
);

module.exports = router;
