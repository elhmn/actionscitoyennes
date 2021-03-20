<?php


/* ************************************************************************** */
/*                                                                            */
/*  HttpError.class.php                                                       */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Thu Jul 26 11:21:22 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	class		HttpError
	{
		public static	$errorCodes = array(
			200 => array('200 ok', 'OK'),
			201 => array('201 Created', 'Created'),
			204 => array('204 No Content', 'No content.'),
			304 => array('304 Not Modified', 'Not Modified.'),
			400 => array('400 Bad Request', 'The request cannot be fulfilled due to bad syntax.'),
			403 => array('403 Forbidden', 'The server has refused to fulfil your request.'),
			404 => array('404 Not Found', 'The page you requested was not found on this server.'),
			405 => array('405 Method Not Allowed', 'The method specified in the request is not allowed for the specified resource.'),
			408 => array('408 Request Timeout', 'Your browser failed to send a request in the time allowed by the server.'), // Debug
			409 => array('409 Conflict', 'Resource already exists.'), // Debug
			500 => array('500 Internal Server Error', 'The request was unsuccessful due to an unexpected condition encountered by the server.'),
			502 => array('502 Bad Gateway', 'The server received an invalid response while trying to carry out the request.'),
			504 => array('504 Gateway Timeout', 'The upstream server failed to send a request in the time allowed by the server.'),
		);
	};
?>
