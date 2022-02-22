const passport = require( "passport" );
const path = require( "path" );
const GroupMembersModel = require( "../models/groupMembers" );
const DiscardModel = require( "../models/discard" );
const UserObligationModel = require( "../models/userObligation" );
const DiscardCycleModel = require( "../models/discardCycle" );
const NotificationsModel = require( "../models/notification" );
const UserModel = require( "../models/user" );
const PaymentModel = require( "../models/payment" );
const dayjs = require( "dayjs" );
const intervals = require( "./intervals" );
const fs = require( "fs" );
const mailer = require( "nodemailer" );

module.exports = {
	handleError: function ( err, res ) {
		if ( err.message ) {
			res.status( 400 ).json( {
				message: err.message
			} );
		} else {
			res.status( 500 ).json( {
				message: "Server Error"
			} );
		}
	},
	authenticate: passport.authenticate( "jwt", {
		session: false
	} ),
	sendEmail: async function( email, topic, message ) {
		const transporter = mailer.createTransport( {
			service: "gmail",
			auth: {
				user: "sharecash70@gmail.com",
				pass: "1Weresdfqdf."
			}
		} );

		const emailMessage = {
			from: "sharecash70@gmail.com",
			to: email,
			subject: topic,
			html: message
		};

		await transporter.sendMail( emailMessage );
	},
	saveImage: function( image,name,folder ) {
		const ext = path.extname( image.name ).toUpperCase();
		let allowedExt = [ ".JPG", ".PNG" ];
		let pathFile = "";

		switch ( ext ) {
		case ".JPG":
			pathFile = "./files/"+ folder +"/" + name + ".png";
			break;
		case ".PNG":
			pathFile = "./files/"+ folder +"/" + name + ".jpg";
			break;
		}
		
		if( fs.existsSync( pathFile ) ){
			fs.unlinkSync( pathFile );
		}

		if ( allowedExt.includes( ext ) ) {
			image.mv( "./files/"+ folder +"/" + name + ext.toLowerCase() );
		}
	},
	newMembers: async function( newMembers, group, user, type ) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise( async ( resolve,reject ) =>{
			try{
				let members = new Array();

				newMembers = [
					...new Set( newMembers.map( ( element ) => element.idUser ) ),
				];

				for ( let element of newMembers ) {
					let temp = await UserModel.findById( element );
					const isInGroup = await  GroupMembersModel.findOne( {
						idGroup: group._id,
						idUser: element
					} );

					if ( temp && !isInGroup ) {
						members.push( {
							idUser: element,
							idGroup: group._id,
							permission: "pending",
						} );
					}
				}

				if( type ){
					let findOwner = members.find( ( element ) => element.idUser == user._id );

					if ( findOwner ) {
						findOwner.permission = "owner";
					} else {
						members.push( {
							idUser: user._id,
							idGroup: group._id,
							permission: "owner",
						} );
					}
				}

				const message = "Użytkownik "+ user.login +" wysłał Tobie zaproszenie do grupy " + group.name;

				if( members.length ) {
					await GroupMembersModel.create( members );
				}

				const notifiMembers = members.filter( ( item )=> item.permission === "pending" )
					.map( ( item )=>item.idUser );
				
				await this.createNotifications( notifiMembers , message,group._id, "invite" );

				resolve();
			}catch ( err ){
				reject( err );
			}
		} );
	},
	createNotifications: async function( users, message, idOfEvent, type ) {
		const notifications = new Array();

		for ( let element of users ) {
			notifications.push( {
				idUser: element,
				type: type,
				message: message,
				idOfEvent: idOfEvent,
			} );
		}
		if( notifications.length ) {
			await NotificationsModel.create( notifications );
		}
	},
	userGroupPermissions: function ( req,res,next ){
		let groupId = req.body.groupId || req.params.groupId;

		GroupMembersModel.findOne( {
			idUser: req.user._id,
			idGroup: groupId
		} )
			.then( ( result ) => {

				if( result && result.permission !== "pending" && result.permission !== "deleted" ){
					req.groupPermissions = result.permission;
					next();
				}else{
					res.status( 405 ).json( {
						message: "No premissions to do that",
					} );
				}
			} )
			.catch( () =>{
				res.status( 405 ).json( {
					message: "No premissions to do that",
				} );
			} );

	},
	emailNotifications: async function(){
		try{
			const dateDown = dayjs().subtract( 3, "day" ).format( "YYYY-MM-DD" );
			const dateUp = dayjs().format( "YYYY-MM-DD" );

			const sendEmail = async function( email, topic, message ) {
				const transporter = mailer.createTransport( {
					service: "gmail",
					auth: {
						user: "sharecash70@gmail.com",
						pass: "1Qexuugik."
					}
				} );

				const emailMessage = {
					from: "sharecash70@gmail.com",
					to: email,
					subject: topic,
					html: message
				};

				await transporter.sendMail( emailMessage );
			};

			const discards = await DiscardCycleModel.find( {
				dateOfPayment:  {
					$gte: dateDown,
					$lte: dateUp
				},
			} ).populate( [ {
				path: "obligations",
				match: { notificationSend: { $eq: false } },
				populate: {
					path: "idUser",
					select: "email status"
				}
			},{
				path: "idDiscard"
			} ] );

			const obligastionsToUpdate = [];

			for( let discard of discards ) {
				for( let obligation of discard.obligations ) {
					const amountLeft = obligation.amount -  obligation.paidIn;

					if( amountLeft > 0 && obligation.idUser.status ) {
						await sendEmail( obligation.idUser.email, "Przypomienie o kończącym się terminie wpłaty na zbiórkę", `Zbliża się termin płatności (${dayjs( discard.dateOfPayment ).format( "YYYY-MM-DD" )}) na zbiórkę ${discard.idDiscard.name}, pozostała kwota ${amountLeft}.` );
						obligastionsToUpdate.push( obligation.id );
					}
				}
			}

			await UserObligationModel.updateMany( {
				_id: { $in: obligastionsToUpdate }
			}, {
				notificationSend: true
			} );

		}catch ( err ){
			console.log( err );
		}
	},
	refreshDiscards: async function() {
		let newDiscardCycle;
		try{
			const discards = await DiscardModel.find( {
				isCyclic: true,
			} ).populate( {
				path: "idGroup",
				populate: {
					path: "members",
					match: { permission: { $in: [ "owner", "admin", "member" ] } },
				}
			} );

			const today = dayjs( dayjs().format( "YYYY-MM-DD" ) ).format();
			let currentDate;

			for( let item of discards ) {
				const lastCycle = await DiscardCycleModel.findOne( {
					idDiscard: item.id,
				} ).sort( "-dateOfPayment" );
				currentDate = dayjs( dayjs( lastCycle.dateOfPayment ).subtract( 2, "day" ).format( "YYYY-MM-DD" ) ).format();

				if( today >= currentDate ){
					const valueToAdd = intervals[item.cyclicalInterval.toString()];
					const diffrence = dayjs( today ).diff( currentDate, valueToAdd[1] );
					let newDate;

					if( diffrence/valueToAdd[0] ) {
						newDate = dayjs( today ).add( valueToAdd[0], valueToAdd[1] ).format( "YYYY-MM-DD" );
					}else{
						newDate = dayjs( lastCycle.dateOfPayment ).add( valueToAdd[0], valueToAdd[1] ).format( "YYYY-MM-DD" );
					}
					let userObligations = await UserObligationModel.find( {
						idDiscardCycle: lastCycle.id,
					} ).populate( {
						path: "idUser",
						select: "status login"
					} );

					if( item.type === "single" ) {
						userObligations = userObligations.filter( ( obligation ) => obligation.idUser.status === "active" );
						const recipient = await UserModel.findById( item.idRecipient );

						if( recipient.status !== "active" ) {
							userObligations = [];
						}
					}else if ( item.idGroup.active ){
						switch ( lastCycle.typeOfSpread ) {
						case "spreading":
							const amountSum = userObligations.reduce( function( a, b ) {
								return a + b.amount;
							},0 );

							userObligations = userObligations.filter( ( obligation ) => {
								if( obligation.idUser.status !== "active" ) {
									return false;
								}
								const userMember = item.idGroup.members.find( ( member ) => member.idUser == obligation.idUser.id );

								if( userMember ){
									return true;
								}
								return false;

							} );
							const amount = ( amountSum / userObligations.length ).toFixed( 2 );
							userObligations.forEach( ( item ) => {
								item.amount = amount;
							} );
							break;
						default:
							userObligations = userObligations.filter( ( obligation ) => {
								if( obligation.idUser.status !== "active" ) {
									return false;
								}
								const userMember = item.idGroup.members.find( ( member ) => member.idUser == obligation.idUser.id );

								if( userMember ){
									return true;
								}
								return true;
							} );
							break;
						}
					}

					if( userObligations.length ) {
						newDiscardCycle = new DiscardCycleModel( {
							dateOfPayment: newDate,
							idDiscard: item.id,
							typeOfSpread: lastCycle.typeOfSpread
						} );

						await newDiscardCycle.save( { validateBeforeSave: false } );

						const obligationsToAdd = [];

						for( let obligation of userObligations ) {
							obligationsToAdd.push( {
								idUser: obligation.idUser,
								idDiscardCycle: newDiscardCycle.id,
								amount: obligation.amount,
							} );
						}

						await UserObligationModel.create( obligationsToAdd );
					}
					
				}

			}
		}catch ( err ){
			console.log( err );
		}
	},
	checkEmail: async function ( email ) {
		const user = await UserModel.findOne( {
			email: email,
		} );

		if ( user ) {
			return true;
		}
		return false;
	},
	deleteDiscard: async function( req,res ){
		try{

			const discardCycle = await DiscardCycleModel.findById( req.body.discardCycleId );
			
			if( discardCycle ) {
				const numberOfDiscard = await DiscardCycleModel.count( {
					idDiscard: discardCycle.idDiscard
				} );

				await DiscardCycleModel.deleteOne( {
					_id: discardCycle.id
				} );

				await UserObligationModel.deleteMany( {
					idDiscardCycle: discardCycle.id
				} );

				if( numberOfDiscard < 2 ) {
					await DiscardModel.deleteOne( {
						_id: discardCycle.idDiscard
					} );
				}

				return res.status( 200 ).json( {
					message: "Discard was deleted",
				} );
			}
			
			return res.status( 400 ).json( {
				message: "Something went wrong",
			} );
		}catch ( err ){
			this.handleError( err,res );
		}
	},
	checkLogin: async function ( login ) {
		let userFilter = {
			login: login,
		}
		const user = await UserModel.findOne( userFilter ).select( "id status" );

		if( user ){
			return {
				message: true,
				data: user
			};
		}
		return {
			message: false,
		};
	},
	groupDiscardPermissions: function ( req,res,next ){
		let discardCycleId = req.body.discardCycleId || req.params.discardCycleId;

		DiscardCycleModel.findById( discardCycleId ).populate( "idDiscard" )
			.then( ( result ) => {
				if( result ) {
					GroupMembersModel.findOne( {
						idUser: req.user._id,
						idGroup: result.idDiscard.idGroup
					} ).then( ( result ) => {
						if ( result && result.permission != "deleted" && result.permission != "pending" ) {
							req.groupPermissions = result.permission;
							next();
						} else {
							res.status( 405 ).json( {
								message: "No premissions to do that",
							} );
						}
					} ).catch( () =>{
						res.status( 405 ).json( {
							message: "No premissions to do that",
						} );
					} );
				}else {
					res.status( 405 ).json( {
						message: "No premissions to do that",
					} );
				}
			} )
			.catch( () =>{
				res.status( 405 ).json( {
					message: "No premissions to do that",
				} );
			} );
	},
	paymentPermissions: function ( req,res,next ){
		let paymentId = req.body.paymentId || req.params.paymentId;

		PaymentModel.findById( paymentId ).populate( {
			path: "idDiscardCycle",
			populate: {
				path: "idDiscard"
			}
		} )
			.then( ( result ) => {
				if( result ){
					if( result.idDiscardCycle.idDiscard.type === "single" ){
						if( result.idDiscardCycle.idDiscard.idRecipient.toString() === req.user.id.toString() ){
							req.permissions = "recipient";
							next();
						}else{
							res.status( 405 ).json( {
								message: "No premissions to do that",
							} );
						}
					}else{
						GroupMembersModel.findOne( {
							idUser: req.user._id,
							idGroup: result.idDiscardCycle.idDiscard.idGroup
						} ).then( ( result ) =>{
							if( result && result.permission != "deleted" && result.permission != "pending" ){
								req.permissions = result.permission;
								next();
							}else{
								res.status( 405 ).json( {
									message: "No premissions to do that",
								} );
							}
						} )
							.catch( () =>{
								res.status( 405 ).json( {
									message: "No premissions to do that",
								} );
							} );
					}
				}else{
					res.status( 405 ).json( {
						message: "No premissions to do that",
					} );
				}
			} ).catch( () =>{
				res.status( 405 ).json( {
					message: "No premissions to do that",
				} );
			} );
	},
	singleDiscardPermission: function ( req, res, next ) {
		const discardCycleId = req.body.discardCycleId || req.params.discardCycleId;

		DiscardCycleModel.findById( discardCycleId ).populate( [ {
			path: "obligation",
		}, {
			path: "idDiscard",
		} ] )
			.then( ( result ) => {
				if ( result ) {
					if ( result.idDiscard.idRecipient.toString() === req.user._id.toString() ) {
						req.discardPermission = "recipient";
					} else {
						req.discardPermission = "debtor";
					}
					next();
				} else {
					res.status( 405 ).json( {
						message: "No premissions to do that",
					} );
				}
			} ).catch( () => {
				res.status( 405 ).json( {
					message: "No premissions to do that",
				} );
			} );
	},
	createPayment: async function( req,res ) {
		try{

			const obligation = await UserObligationModel.findOne( {
				idDiscardCycle: req.body.discardCycleId,
				idUser: req.user._id
			} )
				.select( "amount isPaid" );

			if( obligation ) {

				if( req.body.amount > obligation.amount ){
					return res.status( 400 ).json( {
						message: "Amount can not be greater than the receivables.",
					} );
				}

				const newPeyment = new PaymentModel( {
					idDiscardCycle: req.body.discardCycleId,
					idUser: req.user._id,
					amount: req.body.amount,
				} );

				await newPeyment.save();
				
				const discardCycle = await DiscardCycleModel.findById( req.body.discardCycleId ).populate( "idDiscard" );

				const message = "Użytkownik "+ req.user.login +" dokonał płatności na zbiórkę " + discardCycle.idDiscard.name;
				const type = discardCycle.idDiscard.type === "group" ? "newGroupPayment" : "newSinglePayment";

				let notifiMembers = [];

				if( discardCycle.idDiscard.type === "group" ){
					const members = await GroupMembersModel.find( {
						idGroup: discardCycle.idDiscard.idGroup,
						permission: {
							$nin: [ "pending","deleted", "member" ],
						},
						idUser: {
							$ne: req.user.id,
						},
					} );
					notifiMembers = members.map( ( item ) => item.idUser );
				}else {
					notifiMembers = [ discardCycle.idDiscard.idRecipient ];
				}

				console.log(notifiMembers);

				await this.createNotifications( notifiMembers , message,req.body.discardCycleId, type );

				return res.status( 200 ).json( {
					message: "Payment was created",
				} );
			}else{
				return res.status( 400 ).json( {
					message: "Something went wrong",
				} );
			}

		}catch ( err ){
			this.handleError( err,res );
		}
	},
	getInfoForPayment: async function( req,res ){
		try{
			const discardCycle = await DiscardCycleModel.findById( req.params.discardCycleId ).populate( {
				path: "idDiscard",
				select: "-__v",
			}  )
				.select( "-__v" );

			const obligation = await UserObligationModel.findOne( {
				idDiscardCycle: req.params.discardCycleId,
				idUser: req.user._id
			} )
				.select( "amount paidIn" );

			if( obligation && discardCycle ){
				return res.status( 200 ).json( {
					message: "Success",
					data: {
						discard: discardCycle,
						obligation: obligation,
					},
				} );
			}

			return res.status( 200 ).json( {
				message: "No results",
			} );
		}catch ( err ){
			this.handleError( err,res );
		}
		// eslint-disable-next-line no-unused-vars
	}
};
