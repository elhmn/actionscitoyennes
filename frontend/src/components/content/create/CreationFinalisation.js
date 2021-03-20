/* ************************************************************************** */
/*                                                                            */
/*  CreationFinalisation.js                                                   */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 16 03:08:17 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';

import
{
	Row,
	Col,
	Form,
	Button,
	Input,
	InputNumber,
	Divider,
	Table,
	Icon,
    Modal,
    message,
	Upload,
} from 'antd';

import LoginForm from '../login/LoginForm';
import { PAGES, timeFormat, dateFormat } from '../../common/Constants';
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js';
import { withRouter } from "react-router-dom";

const buildMaterials = (data) =>
{
    let     ret = [];

    if (!data || !data.matKeys)
        return (ret);
    for (let i = 0; i < data.matKeys.length; i++)
    {
		const	ids = data.materialsIds;

        if (data.materials[i])
        {
            ret.push({
                title: data.materials[i] || '',
                required: data.materialsCount[i] || '',
                unit: data.materialsUnit[i] || 'unit',
                id: ids && ids[i]
					&& ids[i].id,
                action_id: ids && ids[i]
					&& ids[i].action_id,
                extra_id: ids && ids[i]
					&& ids[i].extra_id,
                user_id: ids && ids[i]
					&& ids[i].user_id,
			});
        }
    }
    return (ret);
}

class	CreationFinalisation extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    toggleModal()
    {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    onLoginSuccess()
    {
        this.toggleModal();
    }

    FormatActionData(data)
    {
        data = data && {
            ...data,
            street: '',
            time:  data.timePicker.format(timeFormat),
            date: data.datePicker.format(dateFormat),
            postal_code: isNaN(parseInt(data.postalcode)) ? "99" : data.postalcode,
            participants: { required: data.participants },
            materials: buildMaterials(data),
        }
        return (data);
    }

    FormatExtraData(data, actionData)
    {
        data = data && {
            ...data,
            street: '',
            time: data.timePicker.format(timeFormat),
            date: actionData.datePicker.format(dateFormat),
            postal_code: isNaN(parseInt(data.postalcode)) ? "99" : data.postalcode,
            participants: { required: data.participants },
            materials: buildMaterials(data, actionData),
        }
        return (data);
    }

    PostActionRequest(data)
    {
		const { fileList } = data.actionData;

		const formData = new FormData();
		fileList && fileList.forEach((file) => {
			formData.append(file['uid'], file);
		});

        data = {
            token: localStorage.getItem('token'),
            action: (Object.keys(data.actionData).length !== 0) ? this.FormatActionData(data.actionData) : undefined,
            extra: (Object.keys(data.afterData).length !== 0) ? this.FormatExtraData(data.afterData, data.actionData) : undefined,
        }

		const obj = JSON.stringify(data);
		const blob = new Blob([obj], {
			type: 'application/json'
		});
		formData.append("document", blob);

		for (var value of formData.entries()) {
		}


        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
			window.scrollTo(0, 0);
            message.success('action created');
			this.props.history.push('/activity');
        };

        const onerror = (response) => {
            message.error('action creation failed');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/createaction`,
            data: formData,
			isFormData: true,
            method: 'post',
            onsuccess,
            onerror
        });
    }

	PatchLaborNeedRequest(data, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
        };

        const onerror = (response) => {
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/laborneeds/${data.labneed_id}`,
            data: {
				...data.participants,
			},
            method: 'patch',
            onsuccess,
            onerror
        });
	}

	PatchMaterialNeedRequest(data, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
        };

        const onerror = (response) => {
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/materialneeds/${data.id}`,
            data: {
				...data,
			},
            method: 'patch',
            onsuccess,
            onerror
        });
	}

	PostMaterialNeedRequest(data, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
        };

        const onerror = (response) => {
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/materialneeds`,
            data: {
				...data,
			},
            method: 'post',
            onsuccess,
            onerror
        });
	}


	PatchActionRequest(data, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
			window.scrollTo(0, 0);
            message.success('action updated');
			this.props.history.push('/');
        };

        const onerror = (response) => {
            message.error('action failed to update');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/actions/${data.id}`,
            data,
            method: 'patch',
            onsuccess,
            onerror
        });
	}

	PostActionImage(data, token)
	{
		const { fileList } = data;

		const formData = new FormData();
		fileList && fileList.forEach((file) => {
			if (!file.url)
			{
				formData.append(file['uid'], file);
			}
		});
		for (var value of formData.entries()) {
		}

        const onsuccess = (response) => {
            const data =  response || [];
        };

        const onerror = (response) => {
            message.error('image failed to update');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/images/action_id/${data.id}`,
            data: formData,
			isFormData: true,
            method: 'post',
            onsuccess,
            onerror
        });
	}

	DeleteActionImage(id, token)
	{
        const onsuccess = (response) => {
            const data =  response || [];
        };

        const onerror = (response) => {
            message.error('image failed to delete');
        };

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/images/${id}`,
            method: 'delete',
            onsuccess,
            onerror
        });
	}


	PatchExtraRequest(data, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
        };

        const onerror = (response) => {
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/extras/${data.id}`,
            data,
            method: 'patch',
            onsuccess,
            onerror
        });
	}

	PostExtraRequest(data, token, onSuccess, onError)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
			onSuccess && onSuccess(data.lastInsertId);
        };

        const onerror = (response) => {
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/extras`,
            data,
            method: 'post',
            onsuccess,
            onerror
        });
	}


	UpdateAction(data)
	{
		const token = localStorage.getItem('token');
		const action = (Object.keys(data.actionData).length !== 0) ? this.FormatActionData(data.actionData) : undefined;
		const extra = (Object.keys(data.afterData).length !== 0) ? this.FormatExtraData(data.afterData, action) : undefined;

		//update Images
		this.PostActionImage(action, token);
		action.images && action.images.forEach(img => {
			if (!action.fileList.find(file => file.name === img.file))
			{
				this.DeleteActionImage(img.id, token);
			}
		})

		this.PatchActionRequest(action, token);
		action.materials.forEach((mat) => {
			if (mat.id)
			{
				this.PatchMaterialNeedRequest(mat, token);
			}
			else
			{
				this.PostMaterialNeedRequest({...mat, action_id: action.id}, token);
			}
		});
		action.materialNeeds && action.materialNeeds.forEach((mat) => {
            if (!action.materials.find((matNeeds) => matNeeds.id === mat.id))
            {
		        this.DeleteMaterialNeedsRequest(mat.id, token);
            }
		});

		if (this.props.extraMustBePatched)
		{
			this.PatchExtraRequest(extra, token);
			extra.materials.forEach((mat) => {
				if (mat.id)
				{
					this.PatchMaterialNeedRequest(mat, token);
				}
				else
				{
					this.PostMaterialNeedRequest({...mat, extra_id: extra.id}, token);
				}
			});
			extra.materialNeeds && extra.materialNeeds.forEach((mat) => {
                if (!extra.materials.find((matNeeds) => matNeeds.id === mat.id))
                {
		            this.DeleteMaterialNeedsRequest(mat.id, token);
                }
		    });
		}
		else
		{
			if (extra)
			{
				extra['action_id'] = action.id;
				this.PostExtraRequest(extra,
					token, (extra_id) => {
						extra.materials.forEach((mat) => {
							if (mat.id)
							{
								this.PatchMaterialNeedRequest(mat, token);
							}
							else
							{
								this.PostMaterialNeedRequest({...mat, extra_id}, token);
							}
						});
					});
			}
		}
		this.PatchLaborNeedRequest(action, token);
	}

	DeleteMaterialNeedsRequest(id, token)
	{
        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
        };

        const onerror = (response) => {
        };

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/materialNeeds/${id}`,
            method: 'delete',
            onsuccess,
            onerror
        });
	}

    onClickDone(data)
    {
        const token = localStorage.getItem('token');
        if (!token)
        {
            this.toggleModal();
        }
        else
        {
			if (this.props.mustBePatched)
			{
				this.UpdateAction(data);
			}
			else
			{
				this.PostActionRequest(data);
			}
        }
    }

	render ()
	{
		const	actionData = this.props.actionData;
		const	afterData = this.props.afterData;
		const	columns = [
			{
				key: 'needs',
				title: 'Besoins',
				dataIndex: 'needs'
			},
			{
				key: 'quantity',
				title: 'Quantite',
				dataIndex: 'quantity'
			},
			{
				key: 'unit',
				title: 'Unite',
				dataIndex: 'unit'
			},
		];

		window.scrollTo(0, 0); // Debug

		function getData(source)
		{
			let		i = -1;
			const	data = source.materials.map((elem) => {
				i += 1;
				return ({
					key: i,
					needs: elem,
					quantity: source.materialsCount[i] || 0,
					unit: source.materialsUnit[i] || 'unit'
				});
			});
			return (data.filter((elem) => elem.needs !== undefined
			));
		}


		return (
			<React.Fragment>
				<Form.Item>
					<Divider> Votre action </Divider>
				</Form.Item>
				<h2>{actionData.title}</h2>
				<p>{actionData.address_info}</p>
				<p>{actionData.city}</p>
				<p>{actionData.postalcode}</p>
				<p>{actionData.country}</p>
				<p>{actionData.datePicker.format(dateFormat)}</p>
				<p>{actionData.timePicker.format(timeFormat)}</p>
				<h3>Description : </h3>
				<p>{actionData.description}</p>
				{
					(actionData.fileList) &&
					(
						<React.Fragment>
							<p><h3>Images : </h3></p>
							<Upload
								beforeUpload={() => false}
								defaultFileList={actionData.fileList}
								onRemove={() => false}
							></Upload>
						</React.Fragment>
					)
				}
				<h3>Besoins de l'action : </h3>
				<p>Participants : {actionData.participants}</p>
				{
					actionData.financial &&
					<p>Financial : {actionData.financial.number} {actionData.financial.currency}</p>
				}
				{
					(getData(actionData).length !== 0) &&
					<Table
						columns={columns}
						dataSource={getData(actionData)}
						bordered
						title={() => 'Materiel'}
					/>
				}
			{
				(this.props.withAfter) &&
				<React.Fragment>
					<Form.Item>
						<Divider> Votre after </Divider>
					</Form.Item>
					<h2>{afterData.title}</h2>
					<p>{afterData.address_info}</p>
					<p>{afterData.city}</p>
					<p>{afterData.postalcode}</p>
					<p>{afterData.country}</p>
					<p>{actionData.datePicker.format(dateFormat)}</p>
					<p>{afterData.timePicker.format(timeFormat)}</p>
					<h3>Description : </h3>
					<p>{afterData.description}</p>
					<h3>Besoins de l'after : </h3>
					{
						afterData.financial &&
						<p>Financial : {afterData.financial.number} {afterData.financial.currency}</p>
					}
					{
						(getData(afterData).length !== 0) &&
						<Table
							columns={columns}
							dataSource={getData(afterData)}
							bordered
							title={() => 'Materiel'}
						/>
					}
				</React.Fragment>
			}
            <this.props.navButton onClickDone={() => this.onClickDone({actionData, afterData})}/>
            <Modal
                centered
                visible={this.state.modalVisible}
                onCancel={() => {this.toggleModal()}}
                onOk={() => {this.toggleModal()}}
                >
                <LoginForm
                    onsuccess = {() => {this.onLoginSuccess()}}
                    nextpage = {PAGES.create}
                    changeContentPage = {this.props.changeContentPage}
                />
            </Modal>
			</React.Fragment>
		);
	}
};

export default withRouter((props) => <CreationFinalisation {...props}/>);
