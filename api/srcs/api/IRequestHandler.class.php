<?php

/* ************************************************************************** */
/*                                                                            */
/*  IRequestHandler.class.php                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Thu Jul 26 10:36:59 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	interface	IRequestHandler
	{
		public	function	Post($kwargs);
		public	function	Get($kwargs);
		public	function	Patch($kwargs);
		public	function	Delete($kwargs);
	}

?>
