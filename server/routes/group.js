const express = require( "express" );
const router = express.Router();
const GroupModel = require( "../models/group" );
const GroupMembersModel = require( "../models/groupMembers" );
const DiscardCycleModel = require( "../models/discardCycle" );
const DiscardModel = require( "../models/discard" );
const UserModel = require( "../models/user" );
const NotificationsModel = require( "../models/notification" );
const customFunctions = require( "../config/customFunctions" );
const mongoose = require( "mongoose" );
const dayjs = require( "dayjs" );

router.use( customFunctions.authenticate );

router.post( "/add", async ( req, res ) => {
	let groupId;

	try {

		const newGroup = new GroupModel( {
			name: req.body.name,
			description: req.body.description,
		} );

		await newGroup.save();
		groupId = newGroup._id;

		let members = [];

		if( req.body.members ){
			members = JSON.parse( req.body.members );
		}

		await customFunctions.newMembers( members, newGroup, req.user,true );

		if ( req.files ) {
			let logo = req.files.logo;
			customFunctions.saveImage( logo, groupId, "logo" );
		}

		return res.status( 200 ).json( {
			message: "Group was created",
		} );

	} catch ( e ) {

		GroupModel.deleteOne( {
			_id: groupId,
		} );

		GroupMembersModel.deleteMany( {
			idGroup: groupId,
		} );

		customFunctions.handleError( e, res );
	}
}
);

router.get( "/userGroups", async ( req, res ) => {
	try {
		const groups = await GroupMembersModel.find( {
			idUser: req.user._id,
			permission: {
				$nin:  [ "pending","deleted" ],
			},
		} )
			.populate( {
				path: "group",
				select: "name active -_id",
			} )
			.select( "permission idGroup -_id" );

		if ( groups.length ) {
			let responseGroups = new Array();
			for ( let item of groups ) {
				if( item.group.active ){
					responseGroups.push( {
						id: item.idGroup,
						name: item.group.name,
						permission: item.permission,
					} );
				}
			}

			return res.status( 200 ).json( {
				message: "Sucess",
				data: responseGroups,
			} );
		}

		return res.status( 200 ).json( {
			message: "No groups",
			data: null,
		} );
	} catch ( e ) {
		customFunctions.handleError( e, res );
	}
}
);

router.get( "/type/choose", async ( req,res ) => {
	try{
		const groups = await GroupMembersModel.find( {
			idUser: req.user._id,
			permission: {
				$in:  [ "owner","admin" ],
			},
		} )
			.populate( {
				path: "group",
				select: "name active -_id",
			} )
			.select( "permission idGroup -_id" );

		let responseGroups = new Array();
		for ( let item of groups ) {
			if( item.group.active ){
				responseGroups.push( {
					id: item.idGroup,
					name: item.group.name
				} );
			}
		}

		return res.status( 200 ).json( {
			message: "Sucess",
			data: responseGroups,
		} );
	}catch( err ){
		customFunctions.handleError( err,res );
	}
} );

router.get( "/invites", async ( req,res )=>{

	try{
		const invites = await GroupMembersModel.find( {
			idUser: req.user.id,
			permission: "pending"
		} )
			.populate( {
				path: "group",
				select: "name -_id",
			} );

		return res.status( 200 ).json( {
			message: "Success",
			data: invites
		} );
	}catch ( e ) {
		customFunctions.handleError( e, res );
	}
} );

router.post( "/invite", async ( req,res )=>{
	try{
		let message = "";

		if( req.body.isAccepted ){
			await GroupMembersModel.updateOne( { idGroup: req.body.idGroup, idUser: req.user._id }, { permission: "member" }, { runValidators: true }  );
			message = "Invite accepted.";
		}else{
			await GroupMembersModel.deleteOne( { idGroup: req.body.idGroup, idUser: req.user._id } );
			message = "Invite rejected.";
		}

		const group = await GroupMembersModel.find( {
			idGroup: req.body.idGroup,
			permission: {
				$in:  [ "admin","owner" ],
			},
		} );

		const groupInfo = await GroupModel.findById( req.body.idGroup );

		const notifiMembers = group.map( ( item ) => item.idUser );
		const action = req.body.isAccepted ? " zaakceptował " : " odrzucił ";

		const notifiMessage = "Użytkownik "+ req.user.login + action + "zaproszenie do grupy " + groupInfo.name;

		await customFunctions.createNotifications( notifiMembers, notifiMessage, req.body.idGroup , "changeGroupInviteState" );

		return res.status( 200 ).json( {
			message: message,
		} );
	}catch( e ){
		console.log( e );
		customFunctions.handleError( e, res );
	}
} );

router.get( "/details/:groupId",customFunctions.userGroupPermissions,async ( req,res ) =>{
	try {
		const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

		const groupInfo = await GroupModel.findById( req.params.groupId )
			.populate( {
				path: "members",
				select: "-__v",
				populate: {
					path: "idUser",
					select: "login",
				}
			} )
			.select( "-__v" );

		if( groupInfo ){
			const groupDiscardsTemp = await DiscardModel.find( { idGroup: req.params.groupId } )
				.populate( {
					path: "cycles",
					select: "-__v",
					populate: [ {
						path: "obligation",
						match: {
							idUser: {
								$eq: req.user._id
							}
						}
					},{
						path: "obligations",
					} ]
				} );

			const groupDiscards = [];

			for( let item of groupDiscardsTemp ) {
				for( let discardCycle of item.cycles ){

					let tempDiscardItem;
					tempDiscardItem = {
						id: discardCycle.id,
						name: item.name,
						dateOfPayment: dayjs( discardCycle.dateOfPayment ).format( "YYYY-MM-DD" )
					};

					if( discardCycle.obligation ){
						tempDiscardItem.takePart = true;
						tempDiscardItem.amount = discardCycle.obligation.amount;
						tempDiscardItem.paidIn = discardCycle.obligation.paidIn;
					}else if ( discardCycle.obligations.length ){
						tempDiscardItem.takePart = false;
						tempDiscardItem.amount = 0;
						tempDiscardItem.paidIn = 0;
						discardCycle.obligations.forEach( ( item ) => {
							tempDiscardItem.amount += item.amount;
							tempDiscardItem.paidIn += item.paidIn;
						} );
					}

					if ( permissions || tempDiscardItem.takePart ){
						groupDiscards.push( tempDiscardItem );
					}
				}
			}

			return res.status( 200 ).json( {
				message: "Success",
				info: groupInfo,
				permission: req.groupPermissions,
				discards: groupDiscards,
			} );
		}

		return res.status( 200 ).json( {
			message: "No results.",
		} );

	}catch( e ){
		customFunctions.handleError( e, res );
	}
} );

router.get( "/edit/info/:groupId",customFunctions.userGroupPermissions,( req,res ) =>{

	const permisions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

	if( permisions ){
		GroupModel.findById( req.params.groupId )
			.select( "-__v" )
			.then( ( result ) => {
				if( result ){
					return res.status( 200 ).json( {
						message: "Success",
						data: result
					} );
				}
				return res.status( 200 ).json( {
					message: "No results",
				} );
			} )
			.catch( ( err ) => {
				customFunctions.handleError( err, res );
			} );
	} else {
		return res.status( 405 ).json( {
			message: "No premissions to do that",
		} );
	}
} );

router.post( "/delete",customFunctions.userGroupPermissions, async ( req,res ) => {
	try{
		const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

		if( permissions ){
			await GroupModel.findOneAndUpdate( { _id: mongoose.Types.ObjectId( req.body.groupId ) },{ active: false }, { runValidators: true } );
			return res.status( 200 ).json( {
				message: "Success",
			} );
		} else {
			return res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.post( "/edit/info/",customFunctions.userGroupPermissions, async ( req,res ) =>{
	try{
		const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";

		if( permissions ){
			await GroupModel.findOneAndUpdate( { _id: mongoose.Types.ObjectId( req.body.groupId ) },{ name: req.body.name, description: req.body.description }, { runValidators: true } );

			if ( req.files ) {
				let logo = req.files.logo;
				customFunctions.saveImage( logo, req.body.groupId, "logo" );
			}

			const users = await GroupMembersModel.find( {
				idGroup: req.body.groupId,
				permission: {
					$nin: [ "pending","deleted" ],
				},
			} );

			users.splice( users.findIndex( ( item )=>  item.idUser == req.user.id ),1 );
			const notifiMembers = users.map( ( item )=> item.idUser );

			const message = "Użytkownik "+ req.user.login +" zaktualizował informacje o grupie " + req.body.name;

			await customFunctions.createNotifications( notifiMembers, message, req.body.groupId , "groupInfo" );
			
			res.status( 200 ).json( {
				message: "Success",
			} );
		} else {
			return res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.get( "/edit/members/:groupId",customFunctions.userGroupPermissions, async ( req,res ) =>{
	try{
		const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";
		if( permissions ){
			let members = await GroupMembersModel.find( { idGroup: mongoose.Types.ObjectId( req.params.groupId ) } )
				.populate( {
					path: "idUser",
					select: "login",
				} );

			if( members.length ){

				let users = await UserModel.find( {
					status: "active"
				} ).select( "login" );

				return res.status( 200 ).json( {
					message: "Success",
					data: {
						members: members,
						users: users,
					},
					permissions: req.groupPermissions,
				} );
			}
			return res.status( 200 ).json( {
				message: "No results",
			} );
		}else{
			return res.status( 405 ).json( {
				message: "No premissions to do that",
			} );
		}
	
	}catch ( err ){
		customFunctions.handleError( err,res );
	}
} );

router.post( "/edit/members",customFunctions.userGroupPermissions, async ( req,res ) => {
	const permissions = req.groupPermissions === "admin" || req.groupPermissions === "owner";
	const groupId = mongoose.Types.ObjectId( req.body.groupId );

	if( permissions ) {
		try {
			const group = await GroupModel.findById( groupId );
			console.log( req.body.newMembers );
			if( req.body.newMembers ) {
				let newMembers = JSON.parse( req.body.newMembers );
				await customFunctions.newMembers( newMembers, group, req.user,false );
			}

			if( req.body.modificatedMemberPermissions ) {
				const owner = await GroupMembersModel.findOne( {
					idGroup: groupId,
					permission: "owner",
				} );
				const ownerId = owner._id;
				let modificatedMemberPermissions = JSON.parse( req.body.modificatedMemberPermissions );

				for( let element of modificatedMemberPermissions ) {
					if( element.idUser !== ownerId ) {
						if( element.permission === "deleted" ){
							const user = await GroupMembersModel.findOne( {
								idGroup: groupId,
								idUser: element.idUser,
							} );

							if( user.permission === "pending" ){
								await NotificationsModel.deleteOne(
									{
										idUser: element.idUser,
										idOfEvent: groupId,
									}
								);
								await GroupMembersModel.deleteOne( {
									idUser: element.idUser,
									idGroup: groupId
								} );
								continue;
							}
						}

						await GroupMembersModel.updateOne(
							{ idUser: element.idUser,idGroup: groupId },
							{ permission: element.permission },
							{ runValidators: true }
						);
					}
				}

				const deletedMembers = modificatedMemberPermissions.filter( ( item ) => item.permission === "deleted" )
					.map( ( item ) => item.idUser );
				const modifedMembers = modificatedMemberPermissions.filter( ( item ) => item.permission !== "deleted" )
					.map( ( item ) => item.idUser );

				const deleteMessage = "Użytkownik "+ req.user.login +" usunął Cię z grupy " + group.name;
				const message = "Użytkownik "+ req.user.login +" zmienił twoje uprawnienia w grupie " + group.name;

				await customFunctions.createNotifications( modifedMembers, message, req.body.groupId , "groupInfo" );
				await customFunctions.createNotifications( deletedMembers, deleteMessage, req.body.groupId , "removedFromGroup" );
			}
			res.status( 200 ).json( {
				message: "Success"
			} );
		}catch ( err ){
			customFunctions.handleError( err,res );
		}
	}
} );

module.exports = router;
