/* ************************************************************************** */
/*                                                                            */
/*  Comments.js                                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Jun 16 10:03:26 2019                        by elhmn        */
/*   Updated: Sun Jun 23 14:22:20 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import  Config from '../../../config.js'
import	{ message, Comment, Avatar, Form, Button, List, Input } from 'antd';
import  { AppConsumer } from '../../store/AppContext';
import { JsonRequest } from '../../../utilities/DataHandler';
import moment from 'moment';

const { TextArea } = Input;

const CommentList = ({ comments }) => {
  return (<List
    dataSource={comments}
    header={comments.length + " " + (comments.length > 1 ? 'reponses' : 'reponse') }
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />);
};

const Editor = ({ onChange, onSubmit, submitting, value, toggleModal, user }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={() => {
          if (user.id) {
              onSubmit();
          }
          else {
              toggleModal();
          }
      }} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

class	Comments extends React.Component {
    constructor (props) {
        super(props);
         this.state = {
            comments: [],
            submitting: false,
            value: '',
          };
    }

	componentDidUpdate(prevProps)
	{
	    if (this.props.actionData.id !== prevProps.actionData.id) {
		    this.getComments();
	    }
	}

	getComments = () =>
    {
	    const   { toggleUserDetailModal } = this.props.store.actions;

        const onsuccess = (response) => {
			let comments = (JSON.parse(response) || []);
            comments = comments.map(elem => ({
                        author: <div style={{cursor: "pointer"}}
                            onClick={() => { toggleUserDetailModal(elem.user_id)}}>
                            {elem.firstname} {elem.lastname}
                            </div>,
                        avatar: <Avatar
                            style={{cursor: "pointer"}}
                            onClick={() => { toggleUserDetailModal(elem.user_id)}}
                            icon="user"
                            src={ elem.image && `${Config.apiDomainName}/v1/public/images/users/${elem.image[0].src}`} />,
                        content: <p>{elem.content}</p>,
                        datetime: moment(elem.creation_date).fromNow(),
					}));
			if (JSON.stringify(comments) !== JSON.stringify(this.state.comments))
			{
				this.setState({
					comments: comments,
				});
            }
       };

        const onerror = (response) => {
        };
        JsonRequest({
            url: Config.apiDomainName + '/v1/public/comments/?actionid=' + this.props.actionData.id,
            onsuccess,
            onerror
        });
    };

    sendComment = () =>
    {
        const onsuccess = (response) => {
              this.setState({
                    submitting: false,
                    value: '',
                }, () => this.getComments());
        };

        const onerror = (response) => {
            message.error("Failed to send comment !");
        };

        const data = {
            content: this.state.value,
            action_id: this.props.actionData.id,
            user_id: this.props.store.user.id,
        };

        JsonRequest({
            url: Config.apiDomainName + '/v1/public/comments',
            onsuccess,
            onerror,
            data,
            method: 'post',
        });
    };

    handleSubmit = () => {
        if (!this.state.value) {
          return;
        }

        this.setState({
          submitting: true,
        }, () => this.sendComment());

      };

      handleChange = e => {
        this.setState({
          value: e.target.value,
        });
      };

    render () {
        const { comments, submitting, value } = this.state;
        const user = {...this.props.store.user} || {};

        return (
        <div>
            {comments.length > 0 && <CommentList comments={comments} />}
            {comments.length === 0 && <div> Laissez un commentaire </div>}
             <Comment
                  avatar={
					<Avatar icon="user" src={ user.image && `${Config.apiDomainName}/v1/public/images/users/${user.image[0].src}`} />
                  }
                  content={
                    <Editor
                    toggleModal={this.props.toggleModal}
                      onChange={this.handleChange}
                      onSubmit={this.handleSubmit}
                      submitting={submitting}
                      value={value}
                      user={user}
                    />
                  }
                />
            </div>
        );
    }
}

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <Comments {...props} store={store}/>
		}
		</AppConsumer>
	);
}
