/* ************************************************************************** */
/*                                                                            */
/*  Profile.js                                                                */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Apr 14 23:53:11 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	'../../../css/Profile.css';
import	React from 'react';
import	{ Row, Col, Upload, Icon } from 'antd';
import	{ Input } from 'antd';
import	{ Button, Avatar, message } from 'antd';
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import  { AppConsumer } from '../../store/AppContext';

const Field = (props) => {
	const field = props.field || {};
	const FieldComponent = props.fieldComponent;

	return (
		<Row type="flex" justify="start" align="middle" style={{ marginTop: 30}} gutter={10}>
			<Col span={6}>
				<span> { field.label } : </span>
			</Col>
			{ !props.isModify ?
				(<Col>
					<span>{ field.value }</span>
				</Col>) :
				props.cantModify ?
				    (<Col>
					    <span>{ field.value }</span>
				    </Col>) :
				(<Col span={18}>
					{ FieldComponent
						? (<FieldComponent
								placeholder={field.value}
								size="default"
								onChange={ (event) => props.onChange(event, field.type)}/>)
						: (<Input
								placeholder={field.value}
								size="large"
								onChange={ (event) => props.onChange(event, field.type)}/>)
					}
					</Col>)
			}
		</Row>
	);
};

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isGoodType = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isGoodType) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isGoodType && isLt2M;
}

class	Profile extends React.Component
{
	constructor(props)
	{
		super(props);
        const user = {...this.props.store.user} || {};

		this.state = {
			isModify: false,
			user,
			prevuser: user,
			imageLoading: false,
		}

		this.onChange = this.onChange.bind(this);
	}

    updateUserData(data)
    {
        const token = localStorage.getItem('token');

        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
			this.props.store.actions.fetchUserData(); // Debug
            message.success('user data updated successfully');
        };

        const onerror = (response) => {
			const user = this.props.store.user || {};

			this.setState({
				user,
				prevuser: user
			});
            message.error('user data failed to update');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/users/${data.id}`,
            data,
            method: 'patch',
            onsuccess,
            onerror
        });
    }

	onButtonclick()
	{
		let user = {...this.state.user};
		const { prevuser } = this.state;

		if (this.state.isModify
			&&
			JSON.stringify(user)
				!== JSON.stringify(prevuser))
		{
			if (user.email === prevuser.email)
			{
				user.email = undefined;
			}
			const User = this.props.store.user || {};
			this.updateUserData(user);
		}
		this.props.store.actions.fetchUserData();
		this.setState({ isModify: !this.state.isModify });
	}

	onChange(event, type)
	{
		const { value } = event.target;
		let user = this.state.user;
		const prevuser = {...user};

		user[type] = value;

		this.setState({
			user,
			prevuser,
		});
	}


    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

	render ()
	{
		const { user } = this.props.store;

        const uploadButton = (
            <div>
                <Icon type={this.state.imageLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const token = localStorage.getItem('token');

		return (
            <Row id="profile-container" type="flex" justify="space-around" align="middle">
				<Col span={6} xs={22} sm={22} md={6}>
                    {
                        !this.state.isModify && (
					        <Row type="flex" justify="space-around" align="middle">
						        <Avatar icon="user" src={ user.image && `${Config.apiDomainName}/v1/public/images/users/${user.image[0].src}`} size={150}/>
					        </Row>
	                    )
                    }
                    {
                        this.state.isModify && (
		                    <Row type="flex" justify="center" align="middle" style={{ marginTop: 30}} gutter={10}>
			                    <Col span={7}>
			                        <Upload
			                            name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={`${Config.apiDomainName}/v1/private/${token}/images`}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange}>
			                            {imageUrl ? <Avatar src={imageUrl} alt="avatar" size={150}/> : uploadButton}
                                    </Upload>
			                    </Col>
			                </Row>
                        )
                    }

					<Field
						isModify={this.state.isModify}
						field={{value: user && user.lastname,
								label: 'Nom',
								type: 'lastname'}}
						onChange={this.onChange}/>

					<Field
						isModify={this.state.isModify}
						field={{value: user && user.firstname,
								label: 'Prenom',
								type: 'firstname'}}
						onChange={this.onChange}/>
					<Field
						isModify={this.state.isModify}
						cantModify={true}
						field={{value: user && user.email,
								label: 'Email',
								type: 'email'}}
						onChange={this.onChange}/>
					<Field
						isModify={this.state.isModify}
						field={{value: user && user.bio || 'about me',
								label: 'Bio',
								type: 'bio'}}
						fieldComponent={Input.TextArea}
						onChange={this.onChange}/>

					<Row type="flex" justify="space-around" align="middle">
						<Button type="primary" style={{ marginTop: 50 }} size="large" onClick={ () => this.onButtonclick()}> { this.state.isModify ? 'Enregistrer' : 'Modifier' } </Button>
					</Row>
				</Col>
            </Row>
		);
	}
};

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <Profile {...props} store={store}/>
		}
		</AppConsumer>
	);
}
