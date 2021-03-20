<?php

/* ************************************************************************** */
/*                                                                            */
/*  ResetPasswordUtilities.class.php                                          */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Aug 29 14:51:25 2020                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

require __APP_DIR__ . 'srcs/pkgs/sendgrid/sendgrid-php.php';

class		ResetPasswordUtilities
{
	public static function		SanitizeData($data)
	{
		if (!$data) {
			internal_error("data set to null", __FILE__, __LINE__);
			return (null);
		}

		if (property_exists($data, 'email'))
			$data->email = htmlspecialchars(strip_tags(($data->email)));

		return ($data);
	}

	public static function	IsEmailValid($email)
	{
		return filter_var($email, FILTER_VALIDATE_EMAIL);
	}

	public static function postData($url, $data)
	{
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		$response = curl_exec($ch);
		curl_close($ch);
		return $response;
	}

	public static function sendPasswordRecoveryEmail($email, $data)
	{
		$apiKey = trim(file_get_contents(".sendgrid.env"));
		if ($apiKey) {
			return self::sendPasswordRecoveryEmailSendGrid($apiKey, $email, $data);
		} else {
			return self::sendPasswordRecoveryEmailSTMPServer($email, $data);
		}
	}

	private static function sendPasswordRecoveryEmailSTMPServer($email, $data)
	{
		$url = "https://" . Config::GetInstance()->frontendHostName . "/resetpassword/$data->token/$data->userid";
		$from = Config::GetInstance()->emailAddress;
		$to = $email;
		$subject = "Password recovery";
		$message = 'Bonjour, cliquez sur ce lien pour modifier votre mot de passe ' . $url;
		$headers = "From:" . $from;
		if (!mail($to, $subject, $message, $headers)) {
			$errorMessage = error_get_last()['message'];
			http_error(400, "Error while sending email : $errorMessage");
			return (0);
		}
	}

	private static function sendPasswordRecoveryEmailSendGrid($apiKey, $receiverEmail, $data)
	{
		$url = "https://" . Config::GetInstance()->frontendHostName . "/resetpassword/$data->token/$data->userid";
		$from = Config::GetInstance()->emailAddress;
		$subject = "Password recovery";
		$message = 'Bonjour, cliquez sur ce lien pour modifier votre mot de passe ' . $url;

		$email = new \SendGrid\Mail\Mail();
		$email->setFrom($from, "");
		$email->setSubject($subject);
		$email->addTo($receiverEmail, "");
		$email->addContent("text/plain", "$message");
		$sendgrid = new \SendGrid($apiKey);
		try {
			$response = $sendgrid->send($email);
			$code = $response->statusCode();
			if ($code >= 400 && $code <= 599) {
				http_error($code, "Error while sending email : ". $code .":" . $response->body());
				return (0);
			}
		} catch (Exception $e) {
			echo 'Caught exception: ' . $e->getMessage() . "\n";
			http_error(400, "Failed to send email");
			return (0);
		}
	}
};

?>
