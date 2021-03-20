import	React from 'react';
import	{ Tooltip, Tag } from 'antd';
import moment from 'moment';

export const getActionStateComponent = (data) => {
    if (moment(data.date).isBefore(moment()))
    {
        return (
        <Tooltip title="Cette action a terminé">
	      <Tag color="#108ee9">terminée</Tag>
        </Tooltip>);
    }

    return (<Tooltip title="Cette action est encore ouverte">
	  <Tag color="#87d068">ouverte</Tag>
    </Tooltip>);
//     else if (3)
//     {
//         return (<Tooltip title="Cette action a echoué">
// 	      <Tag color="#ff0000">echoué</Tag>
//         </Tooltip>);
//     }
//     else if (4)
//     {
//         return (
//         <Tooltip title="Cette action en cours de realisation">
// 	      <Tag color="#87d068">en cours</Tag>
//         </Tooltip>);
//     }
}

export const getActionState = (data) => {
    if (moment(data.date).isBefore(moment()))
    {
        return "finish";
    }
    return "open";
}

export default {
    getActionStateComponent,
    getActionState,
};
