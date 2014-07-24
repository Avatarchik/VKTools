//
// HalfBusVKUtils.js
//
// Author:
//        Dmitry Minsky <dmitry.minsky@halfbusstudio.com>
//
// Copyright (c) 2014 HalfBus Studio
//


var unityGameObjectName = 'SocialManager';     // Name of GameObject in scene to communicate with Unity
var photoIdToPost = 'photo18281470_327334430'; // This image would be used in wall posts. VK image id http://monosnap.com/image/D7PdMOfLr8EpOtRysJmI9BuW58gHaT
var vkAppId = '4312846'; // You can find it here http://monosnap.com/image/uZyZaC8rZezJA0PLlXFPtcbFgmVpFP
var testModeState = 1;   // (1 - to enable test mode) Some VK methods work only in test mode, when you app is disabled in general settings


// See method description here https://vk.com/dev/Javascript_SDK
VK.init(
	// API initialization succeeded
	function() {
		// Add callbacks for hiding/showing Unity Player, for example
		// when you call post to wall, or invite friends, or any other method
		// that show VK native window. There is bug, when this window would be
		// UNDER Unity window, so, you need to hide unity and show it again,
		// when VK window would be closed.
		VK.addCallback( 'onWindowBlur', function( settings ) { unityHide(); } );
		VK.addCallback( 'onWindowFocus', function( settings ) { unityShow(); } );
	},
	// API initialization failed
	function() { 
		// You can reload page here
		alert( 'VK API initialization failed!' );
	},
	// VK api version
	'5.21' // Latest version for 20/04/2014
);

// See var u = new UnityObject2(config); in Unity generated html file
function getUnity() {
	return u.getUnity();
}

// Need, for example when you show friend request window
function unityHide() {
	getUnity().style.visibility = 'visible';
}

// Need, for example after closing friend request window
function unityShow() {
	getUnity().style.visibility = 'hidden';
}

// Call your Unity code from JS
// https://docs.unity3d.com/Documentation/Manual/UnityWebPlayerandbrowsercommunication.html
function callUnityMethod( methodName, params ) {
	getUnity().SendMessage( unityGameObjectName, methodName, params );
}

function getUserProfile( uid ) {
	VK.api(
		'users.get',
		{ user_ids: uid,
		  fields: 'first_name, photo, last_name',
		  test_mode: testModeState },
		function( data ) {
			var fname = '';
			var lname = '';
			var photo = '';
			if ( data.response ) {
				fname = data.response[0]['first_name'];
				lname = data.response[0]['last_name'];
				photo = data.response[0]['photo'];
				var profile = [uid, fname, lname, photo];
				callUnityMethod( 'OnGetUserProfileComplete', '' + profile );
			}
		}
	);
}

function postToWall( text ) {
	VK.api(
		'wall.post',
		{ message: text,
		  test_mode: testModeState,
		  attachments: photoIdToPost + ',https://vk.com/app' + vkAppId },
		function( data ) {
			alert( JSON.stringify( data ) );
		}
	);
}

function showInvite() {
	VK.callMethod( 'showInviteBox' );
}

function getParams() {
	// var params = splitURLToHashtable( document.location.href );
	callUnityMethod( 'RecvParams', document.location.href + '' );
}

function splitURLToHashtable( url ) {
	var urlParams = url.split( '?' )[1];
	var params = {};                       // init param obj
	urlParams = urlParams.split( '&' );    // ['this=true','that=good']
	for ( var i = 0; i < urlParams.length; i++ ) {
		var split_cache = urlParams[ i ].split( '=' ); // ['this','true'], ...
		params[ split_cache[0] ] = split_cache[1]; // {this:true}, ...
	}
	return params; // {this:"true", that:"good"}
}