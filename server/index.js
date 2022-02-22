require( "dotenv" ).config();
const express = require( "express" );
const bodyParser = require( "body-parser" );
const morgan = require( "morgan" );
const mongoose = require( "mongoose" );
const uploadExpress = require( "express-fileupload" );
const cors = require( "cors" );
const customFunctions = require( "./config/customFunctions" );
const path = require( "path" );

mongoose.connect( "mongodb://127.0.0.1:27017/praca", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
// eslint-disable-next-line no-unused-vars
} ).then( ( i ) => console.log( "Connected to DB" ) ).catch( err => console.log( "Error with connection to DB:" + err ) );

const app = express();
const port = process.env.PORT || 8000;

const refreshTime = 6 * 3600000;

customFunctions.refreshDiscards();


setInterval( customFunctions.refreshDiscards,refreshTime );
setInterval( customFunctions.emailNotifications,refreshTime );

app.use( cors() );
app.use( bodyParser.urlencoded( {
	extended: true
} ) );
app.use( uploadExpress( {
	createParentPath: true
} ) );
app.use( bodyParser.json() );
app.use( morgan( "combined" ) );

require( "./config/passportConfig" )( app );

app.use( "/api/user", require( "./routes/user" ) );
app.use( "/api/group", require( "./routes/groupUnprotected" ) );
app.use( "/api/group", require( "./routes/group" ) );
app.use( "/api/notification", require( "./routes/notification" ) );
app.use( "/api/discard", require( "./routes/discard" ) );

app.get( "/login/*", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/login.html" ) );
} );

app.get( "/login", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/login.html" ) );
} );

app.get( "/login.html", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/login.html" ) );
} );

app.get( "/", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/groups", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/notifications/", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/addGroup/", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/group/*", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/discard/*", ( req,res ) => {
	console.log("aaaa" );
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/payment/*", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/discards", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/invites", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/settings", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/index.html" ) );
} );

app.get( "/css/:name", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/css/" + req.params.name ) );
} );

app.get( "/js/:name", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/js/" + req.params.name ) );
} );

app.get( "/img/:name", ( req,res ) => {
	res.sendFile( path.join( __dirname + "/client/img/" + req.params.name ) );
} );

app.listen( port, () => {
	console.log( `App listen on ${port}` );
} );
