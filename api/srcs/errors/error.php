<?php

/* ************************************************************************** */
/*                                                                            */
/*  error.php                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Tue Feb 19 13:27:32 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

function	internal_error($str = "", $filename = "", $line = "")
{
	if (!is_string($str))
		return (-1);
	error_log(format_error($str, $filename, $line), 3, Config::GetInstance()->errorLogFileName);
}

//Send HttpError after internal error
function	http_internal_error($str = "", $filename = "",
								$line = "", $code = 500, $messageIndex = 1)
{
	http_error($code, $messageIndex);
	if (!is_string($str))
		return (-1);
	error_log(format_error($str, $filename, $line), 3, Config::GetInstance()->errorLogFileName);
}

function	format_error($str = "", $filename = "", $line = "")
{
	return (date("Y-m-d H.i.s") . " : Error : "
				. $filename
				. " : "
				. $line
				. " : "
				. $str
				. " "
				. PHP_EOL);
}

function	http_error($code, $message = "", $messageIndex = 1, $lastInsertId = -1)
{
	$httpCode = $code;
	$httpMessage = $message;

	if (!is_numeric($code))
	{
		internal_error("'$code' is not numeric code", __FILE__, __LINE__);
		return (-1);
	}

	if (isset(HttpError::$errorCodes[$code])) {
		$httpCode = HttpError::$errorCodes[$code][0];
		$httpMessage = HttpError::$errorCodes[$code][$messageIndex];
	}

	http_response_code($code);
	echo "{ \"error\" : \""
		. $httpCode 
			."\","
			. " \"message\" : \""
			. (empty($message) ?
				$httpMessage	
				: $message)
				. "\""
				. (($lastInsertId !== -1) ? ", \"lastInsertId\": \"$lastInsertId\"" : "")
				."}"
			. PHP_EOL;
}

?>
