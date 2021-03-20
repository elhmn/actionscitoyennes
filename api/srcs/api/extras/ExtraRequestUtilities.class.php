<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserPostUtilities.class.php                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Aug 05 09:27:59 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */


class		ExtraRequestUtilities
{
	public static function		SanitizeData($data)
	{
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			return(null);
		}
		
		$data->id = (isset($data->id)) ? htmlspecialchars(strip_tags(trim($data->id))) : null ;
		$data->title = (isset($data->title)) ? htmlspecialchars(strip_tags(trim($data->title))) : null ;
		$data->street = (isset($data->street)) ? htmlspecialchars(strip_tags(trim($data->street))) : null ;
		$data->address_info = (isset($data->address_info)) ? htmlspecialchars(strip_tags(trim($data->address_info))) : null ;
		$data->postal_code = (isset($data->postal_code)) ? htmlspecialchars(strip_tags(trim($data->postal_code))) : null ;
		$data->city = (isset($data->city)) ? htmlspecialchars(strip_tags(trim($data->city))) : null ;
		$data->country = (isset($data->country)) ? htmlspecialchars(strip_tags(trim($data->country))) : null ;
		$data->description = (isset($data->description)) ? htmlspecialchars(strip_tags(trim($data->description))) : null ;
		$data->date = (isset($data->date)) ? htmlspecialchars(strip_tags(trim($data->date))) : null ;
		$data->time = (isset($data->time)) ? htmlspecialchars(strip_tags(trim($data->time))) : null ;
		$data->duration = (isset($data->duration)) ? htmlspecialchars(strip_tags(trim($data->duration))) : null ;
		$data->action_id = (isset($data->action_id)) ? intval(htmlspecialchars(strip_tags(trim($data->action_id)))) : null ;
		$data->user_id = (isset($data->user_id)) ? intval(htmlspecialchars(strip_tags(trim($data->user_id)))) : null ;

		return ($data);
	}
	
	public static function		IsOwn($db, $id, $userId)
	{	
			
		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (false);
		}

		$query = "SELECT * "
		."FROM Extras "
		."WHERE id = :id AND user_id = :userId";
		
		$conn = $db->Connect();
		$stmt = $conn->prepare($query);

		try
		{
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
		}
		catch(Exception $e)
		{
			internal_error("stmt->bindParam : " . $e->getMessage(), __FILE__, __LINE__);
			return (false);				
		}

		try
		{
			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if( count($ret) === 0 )
			{
				return false;
			}
		}
		catch(Exception $e)
		{
			internal_error("stmt->execute : " . $e->getMessage(), __FILE__, __LINE__);
			return (false);				
		}

		return (true);
	}

};

?>
