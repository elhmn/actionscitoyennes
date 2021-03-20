<?php

/* ************************************************************************** */
/*                                                                            */
/*  CommentsRequestUtilities.class.php                                        */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Jun 16 12:23:30 2019                        by elhmn        */
/*   Updated: Sun Jun 16 12:39:26 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

class		CommentsRequestUtilities
{
	public static function		SanitizeData($data)
	{
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			return(null);
		}

		$data->content = (isset($data->content)) ? htmlspecialchars(strip_tags(trim($data->content))) : null ;
		$data->user_id = (isset($data->user_id)) ? intval(htmlspecialchars(strip_tags(trim($data->user_id)))) : null ;
		$data->action_id = (isset($data->action_id)) ? intval(htmlspecialchars(strip_tags(trim($data->action_id)))) : null ;

		return ($data);
	}
};

?>
