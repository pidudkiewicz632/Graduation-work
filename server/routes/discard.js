const express = require( "express" );
const router = express.Router();
const customFunctions = require( "../config/customFunctions" );
const GroupMembersModel = require( "../models/groupMembers" );
const DiscardModel = require( "../models/discard" );
const DiscardCycleModel = require( "../models/discardCycle" );
const UserObligationModel = require( "../models/userObligation" );
const PaymentModel = require( "../models/payment" );
const dayjs = require( "dayjs" );

router.use( customFunctions.authenticate );

router.get( "/group/add/:groupId", customFunctions.userGroupPermissions ,async ( req,res ) =>{
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	if( permissions ){
		try{
			let tempMembers = await GroupMembersModel.find( {
				idGroup: req.params.groupId,
				permission: {
					$nin: [ "pending","deleted" ],
				}
			} )
				.populate( {
					path: "idUser",
					select: "login status",
				} )
				.select( "permission" );

			tempMembers = tempMembers.filter( ( item ) => item.idUser.status === "active" );

			if( tempMembers.length ){
				const members = tempMembers.map( ( element ) => element.idUser );

				return res.status( 200 )
					.json( {
						message: "Success",
						members: members,
					} );
			}

			return res.status( 200 )
				.json( {
					message: "No results",
				} );

		}catch ( err ){
			customFunctions.handleError( err,res );
		}
	}else{
		return res.status( 405 ).json( {
			message: "No premissions to do that",
		} );
	}
} );

router.post( "/group/add/", customFunctions.userGroupPermissions ,async ( req,res ) =>{
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	if( permissions ){
		let newDiscard, newDiscardCycle;

		try {

			if( req.body.members ){

				const currentDate = dayjs( dayjs().format( "YYYY-MM-DD" ) );
				const dateOfPayment = dayjs( req.body.date );

				if( currentDate > dateOfPayment ){
					res.status( 400 ).json( {
						message:"Date of payment cannot be less than the current date.\n"
					} );
				}

				newDiscard = new DiscardModel( {
					name: req.body.name,
					description: req.body.description,
					idGroup: req.body.groupId,
					type: "group",
					isCyclic: req.body.isCyclic,
					cyclicalInterval: req.body.cyclicalInterval
				} );

				await newDiscard.save();

				newDiscardCycle = new DiscardCycleModel( {
					dateOfPayment: req.body.date,
					idDiscard: newDiscard._id,
					typeOfSpread: req.body.spreadType
				} );

				await newDiscardCycle.save();

				const members = JSON.parse( req.body.members );

				const membersToAdd = [];

				for( let element of members ) {
					let isAdded = membersToAdd.find( ( item ) => {
						return item.idUser === element.id;
					} );

					if( isAdded )
						continue;

					let memberTemp = await GroupMembersModel.findOne( {
						idGroup: req.body.groupId,
						idUser: element.id,
						permission: {
							$nin: [ "pending","deleted" ],
						}
					} );

					if( memberTemp ) {
						membersToAdd.push( {
							idUser: element.id,
							idDiscardCycle: newDiscardCycle._id,
							amount: Number( element.amount ),
						} );
					}
				}

				if( !membersToAdd.length ){
					throw ( {
						message: "Something went wrong while adding users.",
					} );
				}

				await UserObligationModel.create( membersToAdd );

				members.splice( members.findIndex( ( item )=>  item.id.toString() == req.user.id.toString() ),1 );

				const notifiMembers = members.map( ( item )=> item.id );

				const message = "Użytkownik "+ req.user.login +" dodał Cię do zrzutki " + req.body.name;

				await customFunctions.createNotifications( notifiMembers, message, newDiscardCycle.id , "newDiscard" );

				return res.status( 200 ).json( {
					message: "Success",
				} );
			}

			throw ( {
				message: "Members cannot be empty"
			} );

		}catch ( err ){
			if( newDiscard ){
				DiscardModel.deleteOne( {
					_id: newDiscard._id
				} );
			}

			if( newDiscardCycle ){
				DiscardCycleModel.deleteOne( {
					_id: newDiscardCycle._id
				} );
			}

			customFunctions.handleError( err,res );
		}
	}else{
		return res.status( 405 ).json( {
			message: "No premissions to do that",
		} );
	}
} );

router.post( "/group/delete", customFunctions.groupDiscardPermissions, async( req,res ) => {
	await customFunctions.deleteDiscard( req,res );
} );

router.post( "/single/delete", customFunctions.singleDiscardPermission, async( req,res ) => {
	await customFunctions.deleteDiscard( req,res );
} );

router.get( "/user", ( req,res ) =>{

	const obligationFilter = {
		idUser: req.user._id,
	};

	if( req.params.isPaid ) {
		obligationFilter.$expr = {
			$gte: [ "$paidIn", "$amount" ]
		};
	}else {
		obligationFilter.$expr = {
			$lt: [ "$paidIn", "$amount" ]
		};
	}

	UserObligationModel.find( obligationFilter )
		.populate( {
			path: "idDiscardCycle",
			select: "-__v",
			populate: {
				path: "idDiscard",
				select: "-__v -description",
				populate: [ {
					path: "idGroup",
					select: "-__v -description",
				},{
					path: "idRecipient",
					select: "login",
				} ],
			},
		} )
		.select( "-__v -idUser" )
		.then( ( result ) =>{
			if( result.length ){

				result.forEach( ( item ) => {
					item.idDiscardCycle.dateOfPayment = dayjs( item.idDiscardCycle.dateOfPayment ).format( "YYYY-MM-DD" );
				} );

				return res.status( 200 ).json( {
					message: "Success",
					data: result,
				} );
			}
			return res.status( 200 ).json( {
				message: "No results",
			} );
		} )
		.catch( ( err ) => {
			customFunctions.handleError( err,res );
		} );
} );

router.get( "/group/details/:discardCycleId",customFunctions.groupDiscardPermissions, async ( req,res ) => {
	try{

		const discardCycle = await DiscardCycleModel.findById( req.params.discardCycleId ).populate( {
			path: "idDiscard",
			populate: {
				path: "idGroup"
			},
			select: "-__v",
		}  )
			.select( "-__v" );

		if( !discardCycle ){
			return res.status( 200 ).json( {
				message: "No results",
			} );
		}

		const allObligations = await UserObligationModel.find( {
			idDiscardCycle: req.params.discardCycleId,
		} )
			.populate( {
				path: "idUser",
				select: "-__v",
			}  );

		if( !allObligations.length ){
			return res.status( 200 ).json( {
				message: "No results",
			} );
		}

		const userObligation = await UserObligationModel.findOne( {
			idDiscardCycle: req.params.discardCycleId,
			idUser: req.user._id
		} )
			.select( "-__v -idDiscardCycle -idUser" );

		const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

		let payments = null;

		if( permissions ){
			payments = await PaymentModel.find( {
				idDiscardCycle: req.params.discardCycleId
			} ).populate( {
				path: "idUser"
			} );
		}

		return res.status( 200 ).json( {
			message: "Success",
			data: {
				discard: discardCycle,
				userObligation: userObligation,
				permission: req.groupPermissions,
				obligations: allObligations,
				payments: payments
			}
		} );
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.get( "/group/payment/create/:discardCycleId",customFunctions.groupDiscardPermissions, async ( req,res )=>{
	await customFunctions.getInfoForPayment( req,res );
} );

router.post( "/group/payment/create", customFunctions.groupDiscardPermissions , async ( req,res )=>{
	await customFunctions.createPayment( req,res );
} );

router.post( "/payment/accept",customFunctions.paymentPermissions , async ( req,res )=>{
	try{
		const permissions = req.permissions === "admin" || req.permissions === "owner" || req.permissions === "recipient";

		if( permissions ){
			let message = "";

			let notifiMessage = "";
			const payment = await PaymentModel.findById( req.body.paymentId );

			if( req.body.isAccepted ){

				if( !payment ) {
					return res.status( 400 ).json( {
						message: "Payment not found.",
					} );
				}

				const userObligation = await UserObligationModel.findOne( {
					idDiscardCycle: payment.idDiscardCycle,
					idUser: payment.idUser,
				} );

				userObligation.paidIn = userObligation.paidIn ? userObligation.paidIn : 0;

				const paidInAmount = payment.amount + userObligation.paidIn;

				await UserObligationModel.updateOne( {
					idDiscardCycle: payment.idDiscardCycle,
					idUser: payment.idUser,
				}, {
					paidIn: paidInAmount,
					isPaid: paidInAmount >= userObligation.amount
				} );

				message = "Payment accepted.";

				notifiMessage = "Użytkownik "+ req.user.login + " zaakceptował twpją płatność.";


			}else{
				message = "Payment rejected.";
				notifiMessage = "Użytkownik "+ req.user.login + " odrzucił twpją płatność.";
			}

			const discardCycle = await DiscardCycleModel.findById( payment.idDiscardCycle ).populate( "idDiscard" );

			const type = discardCycle.type === "single" ? "changeSinglePaymentState" : "changeGroupPaymentState";

			if( payment.idUser !== req.user.login ){
				await customFunctions.createNotifications( [ payment.idUser ] , notifiMessage, payment.idDiscardCycle, type );
			}

			await PaymentModel.deleteOne( {
				_id:req.body.paymentId,
			} );

			return res.status( 200 ).json( {
				message: message,
			} );
		}
		return res.status( 405 ).json( {
			message: "No premissions to do that",
		} );
	}catch( e ){
		customFunctions.handleError( e, res );
	}
} );

router.get( "/obligations/edit/:discardCycleId", customFunctions.groupDiscardPermissions , async ( req, res ) =>{
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	try{
		if( permissions ){
			const discard = await DiscardCycleModel.findById( req.params.discardCycleId )
				.populate( [ {
					path: "idDiscard",
					select: "name idGroup"
				},
				{
					path: "obligations",
					select: "-__v",
					populate: {
						path: "idUser",
						select: "-__v -password -email",
					}
				} ] );

			if( !discard || !discard.obligations.length ) {
				return res.status( 200 ).json( {
					message: "No results",
				} );
			}

			let members = await GroupMembersModel.find( {
				idGroup: discard.idDiscard.idGroup,
				permission: { $nin: [ "pending", "deleted" ] }
			} ).populate( {
				path: "idUser",
				select: "-__v -password -email",
			} );

			members = members.filter( ( item ) => item.idUser.status === "active" );

			if( !members.length ) {
				return res.status( 200 ).json( {
					message: "No results",
				} );
			}

			members = members.map( ( item )=>{
				return {
					id: item.idUser.id,
					login: item.idUser.login
				};
			} );

			return res.status( 200 ).json( {
				message: "No results",
				data: {
					discard: discard,
					members: members
				}
			} );

		}else{
			return res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	}catch( e ){
		customFunctions.handleError( e, res );
	}
} );

router.post( "/obligations/edit/", customFunctions.groupDiscardPermissions , async ( req, res ) =>{
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	try{
		if( permissions ) {
			const discard = await DiscardCycleModel.findById( req.body.discardCycleId ).populate( "idDiscard" );
			
			if( req.body.removedObligations ) {
				let obligationsToRemove = JSON.parse( req.body.removedObligations );
				
				if( obligationsToRemove.length ){
					const obligations = await UserObligationModel.find( { _id: { $in: obligationsToRemove } } )
						.select( "idUser" );
					await UserObligationModel.deleteMany( { _id: { $in: obligationsToRemove } } );
					const users = obligations.map( ( item ) => item.idUser );
					users.splice( users.findIndex( ( item ) => item.toString() === req.user.id.toString() ),1 );
					
					const message = req.user.login + " usunął Cię ze zbiórki " + discard.idDiscard.name;

					await customFunctions.createNotifications( users , message,req.body.discardCycleId, "removeUserFromDiscard" );
				}
			}

			if( req.body.newAndModifiedObligations ) {
				const newAndModifiedObligations = JSON.parse( req.body.newAndModifiedObligations );

				if( !newAndModifiedObligations.length ) {
					return res.status( 400 ).json( {
						message: "modifedObligations can not be empty",
					} );
				}

				for( let item of newAndModifiedObligations ) {
					if( item.obligationId ) {
						await UserObligationModel.updateOne( {
							_id: item.obligationId,
						}, {
							amount: item.amount,
							paidIn: item.paidIn
						}, {
							runValidators: true
						}  );
					} else {
						const newObligation = new UserObligationModel( {
							idDiscardCycle: req.body.discardCycleId,
							amount: item.amount,
							paidIn: item.paidIn,
							idUser: item.userId,
						} );

						await newObligation.save();
					}
				}

				await DiscardCycleModel.updateOne( {
					_id: req.body.discardCycleId,
				}, {
					typeOfSpread: req.body.spreadType
				}, {
					runValidators: true
				}  );

				let users = newAndModifiedObligations.filter( ( item ) => item.userId !== req.user.id.toString() && item.obligationId )
					.map( ( item ) => item.userId );
				
				let message = "Użytkownik "+ req.user.login + " zmienił należności w zrzutce " + discard.idDiscard.name;

				await customFunctions.createNotifications( users, message,req.body.discardCycleId, "modifedDiscardObligations" );

				users = newAndModifiedObligations.filter( ( item ) => item.userId !== req.user.id.toString() && item.obligationId === null )
					.map( ( item ) => item.userId );

				message = "Użytkownik "+ req.user.login + " dodał cię do zrzutki " + discard.idDiscard.name;

				await customFunctions.createNotifications( users, message,req.body.discardCycleId, "newDiscard" );


				return res.status( 200 ).json( {
					message: "Success",
				} );

			}else{
				return res.status( 400 ).json( {
					message: "modifedObligations can not be empty",
				} );
			}
		} else {
			return res.status( 405 ).json( {
				message: "No permission to do that.",
			} );
		}
	}catch( e ){
		customFunctions.handleError( e, res );
	}
} );

router.get( "/group/discard/info/edit/:discardCycleId", customFunctions.groupDiscardPermissions, ( req, res ) => {
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	if( permissions ) {
		DiscardCycleModel.findById( req.params.discardCycleId )
			.populate( {
				path: "idDiscard",
				select: "-__v -idGroup"
			} )
			.select( "-__v" )
			.then( ( result ) => {
				res.status( 200 ).json( {
					message: "Success",
					data: result
				} );
			} );
	}else{
		return res.status( 405 ).json( {
			message: "No permission to do that.",
		} );
	}
} );

router.post( "/group/discard/info/edit/", customFunctions.groupDiscardPermissions, async ( req, res ) => {
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";
	try{
		if( permissions ) {
			await DiscardCycleModel.updateOne( {
				_id: req.body.discardCycleId
			},{
				dateOfPayment: req.body.dateOfPayment,
			} ,{
				runValidators: true
			} );

			await DiscardModel.updateOne( {
				_id: req.body.discardId,
			},{
				name: req.body.name,
				description: req.body.description,
				isCyclic: req.body.isCyclic,
				cyclicalInterval: req.body.cyclicalInterval,
			} ,{
				runValidators: true
			} );

			const obligations = await UserObligationModel.find( { idDiscardCycle: req.body.discardCycleId } )
				.populate( "idUser" )
				.select( "idUser" );

			const users = obligations.map( ( item ) => item.idUser );
			users.splice( users.findIndex( ( item ) => item.toString() === req.user.id.toString() ),1 );

			const message = "Użytkownik "+ req.user.login + " zmienił informacje w zrzutce " + req.body.name;

			await customFunctions.createNotifications( users, message,req.body.discardCycleId, "modifedDiscardInfo" );

			return res.status( 200 ).json( {
				message: "Success",
			} );
		}else{
			return res.status( 405 ).json( {
				message: "No permission to do that.",
			} );
		}
	}catch ( e ) {
		customFunctions.handleError( e, res );
	}

} );

router.post( "/single/add/", async ( req,res ) =>{
	let newDiscard, newDiscardCycle;

	try {
		const currentDate = dayjs( dayjs().format( "YYYY-MM-DD" ) );
		const dateOfPayment = dayjs( req.body.date );

		if( currentDate > dateOfPayment ){
			res.status( 400 ).json( {
				message:"Date of payment cannot be less than the current date."
			} );
		}

		newDiscard = new DiscardModel( {
			name: req.body.name,
			description: req.body.description,
			idRecipient: req.body.recipientId,
			type: "single",
			isCyclic: req.body.isCyclic,
			cyclicalInterval: req.body.cyclicalInterval
		} );

		await newDiscard.save();

		newDiscardCycle = new DiscardCycleModel( {
			dateOfPayment: req.body.date,
			idDiscard: newDiscard._id,
			typeOfSpread: "manual"
		} );

		await newDiscardCycle.save();

		const userObligation = UserObligationModel( {
			idUser: req.body.debtorId,
			idDiscardCycle: newDiscardCycle._id,
			amount: Number( req.body.amount ),
		} );

		await userObligation.save();

		return res.status( 200 ).json( {
			message: "Success",
			data: {
				discardId: newDiscardCycle._id
			}
		} );

	}catch ( err ){
		if( newDiscard ){
			DiscardModel.deleteOne( {
				_id: newDiscard._id
			} );
		}

		if( newDiscardCycle ){
			DiscardCycleModel.deleteOne( {
				_id: newDiscardCycle._id
			} );
		}

		customFunctions.handleError( err,res );
	}
} );

router.get( "/single/details/:discardCycleId",customFunctions.singleDiscardPermission, async ( req, res ) => {
	try{
		const discard = await DiscardCycleModel.findById( req.params.discardCycleId )
			.populate( [ {
				path: "obligation",
				populate: {
					path: "idUser",
					select: "login"
				},
				select: "-__v"
			}, {
				path: "idDiscard",
				populate: {
					path: "idRecipient",
					select: "login"
				},
				select: "-__v"
			} ] )
			.select( "-__v" );

		if( !discard ){
			return res.status( 200 ).json( {
				message: "No results",
			} );
		}

		const payments = await PaymentModel.find( {
			idDiscardCycle: req.params.discardCycleId
		} )
			.populate( {
				path: "idUser"
			} );

		return res.status( 200 ).json( {
			message: "Success",
			info: discard,
			payments: payments,
			permission: req.discardPermission
		} );
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.get( "/single/edit/:discardCycleId",customFunctions.singleDiscardPermission, async ( req, res ) => {
	try{
		if( req.discardPermission === "recipient" ) {
			const discard = await DiscardCycleModel.findById( req.params.discardCycleId )
				.populate( [ {
					path: "obligation",
					populate: {
						path: "idUser",
						select: "login"
					},
					select: "-__v"
				}, {
					path: "idDiscard",
					populate: {
						path: "idRecipient",
						select: "login"
					},
					select: "-__v"
				} ] )
				.select( "-__v" );

			if( !discard ){
				return res.status( 200 ).json( {
					message: "No results",
				} );
			}

			return res.status( 200 ).json( {
				message: "Success",
				info: discard,
			} );
		}else{
			res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.post( "/single/edit/",customFunctions.singleDiscardPermission, async ( req, res ) => {
	try{
		if( req.discardPermission === "recipient" ) {

			await DiscardCycleModel.update( {
				_id: req.body.discardCycleId
			},{
				dateOfPayment: req.body.date,
			} );

			await UserObligationModel.update( {
				idDiscardCycle: req.body.discardCycleId
			},{
				amount: req.body.amount,
				paidIn: req.body.paidIn,
			} );

			const discardCycle = await DiscardCycleModel.findById( req.body.discardCycleId );

			await DiscardModel.updateOne( {
				_id: discardCycle.idDiscard
			},{
				name: req.body.name,
				description: req.body.description,
				isCyclic: req.body.isCyclic,
				cyclicalInterval: req.body.cyclicalInterval
			} );

			const obligation = await UserObligationModel.findOne( {
				idDiscardCycle: req.body.discardCycleId
			} ).select( "idUser" );

			const message = "Użytkownik "+ req.user.login + " zmienił informacje w zrzutce " + req.body.name;

			await customFunctions.createNotifications( [ obligation.idUser ], message,req.body.discardCycleId, "modifedSingleDiscardInfo" );

			return res.status( 200 ).json( {
				message: "Success",
			} );
		}else{
			res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.get( "/single/payment/create/:discardCycleId",customFunctions.singleDiscardPermission, async ( req,res )=>{
	await customFunctions.getInfoForPayment( req, res );
} );

router.post( "/single/payment/create", customFunctions.singleDiscardPermission , async ( req,res )=>{
	await customFunctions.createPayment( req,res );
} );

router.get( "/all", async ( req,res )=>{
	try{
		let userGroups = await GroupMembersModel.find( {
			idUser: req.user._id,
			permission: {
				$nin:  [ "pending","deleted","member" ],
			},
		} ).select( "idGroup" );

		userGroups = userGroups.map( ( item ) => item.idGroup );

		let discardsIds = await DiscardModel.find( {
			$or: [ { idRecipient: { $eq: req.user._id } }, { idGroup: { $in: userGroups } } ]
		} ).select( "id" );

		discardsIds = discardsIds.map( ( item )=>item.id );

		let discardsCycleIds = await DiscardCycleModel.find( {
			idDiscard: {
				$in: discardsIds
			}
		} );

		discardsCycleIds = discardsCycleIds.map( ( item )=> item.id.toString() );

		let discardsCycleIdsAsDebtor = await UserObligationModel.find( {
			idUser: req.user._id
		} );

		discardsCycleIdsAsDebtor = discardsCycleIdsAsDebtor.map( ( item ) => item.idDiscardCycle.toString() );
		discardsCycleIds = discardsCycleIds.concat( discardsCycleIdsAsDebtor );
		discardsCycleIds = [ ...new Set( discardsCycleIds ) ];

		const allDiscards = await DiscardCycleModel.find( {
			_id: {
				$in: discardsCycleIds
			}
		} )
			.populate( [ {
				path: "obligation",
				match: {
					idUser: {
						$eq: req.user._id,
					}
				},
				populate: {
					path: "idUser",
					select: "login"
				}
			},{
				path: "obligations",
				populate: {
					path: "idUser",
					select: "login"
				}
			}, {
				path: "idDiscard",
				populate: [ {
					path: "idGroup",
					select: "name"
				},{
					path: "idRecipient",
					select: "login"
				} ]
			} ] );

		return res.status( 200 ).json( {
			message: "Success",
			data: allDiscards
		} );

	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

module.exports = router;
