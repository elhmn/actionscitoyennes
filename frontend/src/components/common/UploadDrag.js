/* ************************************************************************** */
/*                                                                            */
/*  UploadDrag.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Wed Oct 03 18:57:35 2018                        by elhmn        */
/*   Updated: Fri Feb 22 05:31:18 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import {
	Upload,
	Icon,
	message,
	Button
} from 'antd';

import { JsonRequest } from '../../utilities/DataHandler';
import Config from '../../config.js'

const Dragger = Upload.Dragger;

const getToken = () => {
	return (localStorage.getItem('token'));
}

class uploadDrag extends React.Component {
	constructor(props)
	{
		super(props);

		this.state = {
			uploading: false,
		};
	}

	handleUpload = (fileList) => {
		const token = getToken();
		const formData = new FormData();

		fileList.forEach((file) => {
			formData.append(file['uid'], file);
		});
		for (var value of formData.entries()) {
		}

		this.setState({
			uploading: true,
		});

		JsonRequest({
			url: `${Config.apiDomainName}/v1/private/${token}/images/action_id`,
			method: 'post',
			data: formData,
			isFormData: true,
			onsuccess: () => {
				this.setState({
					uploading: false,
				});
				message.success('upload successfully.');
			},
			onerror: () => {
				this.setState({
					uploading: false,
				});
				message.error('upload failed.');
			},
		});
	}

	render ()
	{
		const props = {
			name: 'file',
			beforeUpload: (file) => {
				if (file.size > 2000000)
				{
					message.error('your image size must be less than 2mb');
					return (false);
				}
				if (this.props.fileList.length >= 5)
				{
					message.error("you can't add more than 5 images");
					return (false);
				}

				this.props.beforeUpload([...this.props.fileList, file]);
				return (false);
			},
			onRemove: (file) => {
				const index = this.props.fileList.indexOf(file);
				const newFileList = this.props.fileList.slice();

				newFileList.splice(index, 1);
				this.props.onRemove(newFileList);
			},
			fileList: this.props.fileList,
			accept: '.png,.jpg,.jpeg,.bmp',
			defaultFileList: this.props.fileList,
			listType: this.props.listType,
		};


		return (
			<React.Fragment>
			<Dragger {...props} actions={() => {this.props.onUpload()}}>
			<p className="ant-upload-drag-icon">
			<Icon type="inbox" />
			</p>
			<p className="ant-upload-text">Click or drag file to this area to upload</p>
			<p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
			</Dragger>
			</React.Fragment>
		);
	}
};

export default uploadDrag
