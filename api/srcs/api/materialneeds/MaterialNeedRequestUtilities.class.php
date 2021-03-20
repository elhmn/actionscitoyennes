<?php

/* ************************************************************************** */
/*                                                                            */
/*  MaterialNeedRequestUtilities.class.php                                    */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Wed Nov 28 16:07:17 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

class		MaterialNeedRequestUtilities
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
		$data->unit = (isset($data->unit)) ? htmlspecialchars(strip_tags(trim($data->unit))) : null ;
		$data->description = (isset($data->description)) ? htmlspecialchars(strip_tags(trim($data->description))) : null ;
		$data->required = (isset($data->required)) ? doubleval(htmlspecialchars(strip_tags(trim($data->required)))) : null ;
		$data->unit = (isset($data->unit)) ? htmlspecialchars(strip_tags(trim($data->unit))) : null ;
		$data->collected = (isset($data->collected)) ? doubleval(htmlspecialchars(strip_tags(trim($data->collected)))) : null ;
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

		$query = "SELECT * "
		."FROM MaterialNeeds m "
		."LEFT JOIN Actions a ON m.action_id = a.id "
		."LEFT JOIN Extras e ON m.extra_id = e.id "
		."WHERE (m.id = :id AND a.user_id = :userId) OR (m.id = :id AND e.user_id = :userId)";

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
