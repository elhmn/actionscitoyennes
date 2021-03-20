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


class		LaborNeedRequestUtilities
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
		$data->description = (isset($data->description)) ? htmlspecialchars(strip_tags(trim($data->description))) : null ;
		$data->required = (isset($data->required)) ? intval(htmlspecialchars(strip_tags(trim($data->required)))) : null ;
		$data->collected = (isset($data->collected)) ? intval(htmlspecialchars(strip_tags(trim($data->collected)))) : null ;
		$data->action_id = (isset($data->action_id)) ? intval(htmlspecialchars(strip_tags(trim($data->action_id)))) : null ;
		$data->extra_id = (isset($data->extra_id)) ? intval(htmlspecialchars(strip_tags(trim($data->extra_id)))) : null ;

		return ($data);
	}
	
	public static function		IsOwn($db, $id, $userId)
	{	
			
		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (false);
		}

		$query = "SELECT l.* "
		."FROM LaborNeeds l "
		."LEFT JOIN Actions a ON l.action_id = a.id "
		."LEFT JOIN Extras e ON l.extra_id = e.id "
		."WHERE (l.id = :id AND a.user_id = :userId) OR (l.id = :id AND e.user_id = :userId)";
		
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
