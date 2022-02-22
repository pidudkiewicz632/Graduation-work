const express = require( "express" );
const router = express.Router();
const path = require( "path" );
const fs = require( "fs" );

router.get( "/logo/:id", ( req, res ) => {
	const avatarLocationPNG = "./files/logo/" + req.params.id + ".png";
	const avatarLocationJPG = "./files/logo/" + req.params.id + ".jpg";

	if ( fs.existsSync( avatarLocationPNG ) ) {
		res.sendFile( path.resolve( avatarLocationPNG ) );
	} else if ( fs.existsSync( avatarLocationJPG ) ) {
		res.sendFile( path.resolve( avatarLocationJPG ) );
	} else {
		res.sendFile( path.resolve( "./files/logo/default.png" ) );
	}
} );

module.exports = router;
