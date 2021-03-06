var grab = $('#list').data('grab'),
	searchKey = $('#list').data('search');

var List = React.createClass({
	UpdateListTitle: function(newData)
	{
		var data = this.state.data;
		data.title = newData.newTitle;
		data.privacy = newData.newPrivacy;

		this.setState({data: data, page: this.state.page});
	},

	fetchList: function()
	{
		var url = '/api/v1/list/'+grab;
		if(grab == 'search')
		{
			url = 'api/v1/search/'+searchKey
		}

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data, page: this.state.page});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function()
	{
		this.fetchList();
	},

	getInitialState: function()
	{
		return {
			data: null,
			page: 0
		};
	},

	componentDidUpdate: function()
	{
		$('[data-toggle="tooltip"]').tooltip()
	},

	submitDeleteUserToServer: function(profile)
	{
		$.ajax({
			url: '/api/v1/list/delete',
			dataType: 'json',
			type: 'POST',
			data: {
				_token: _token,
				_method: 'DELETE',
				list_id: this.state.data.id,
				profile_id: profile.id
			},
			success: function(data) {
				if(data.error) {
					notif.add('danger', data.error).run();
				} else {
					notif.add('success', 'User has been removed from the list!').run();
					this.setState({data: data, page: this.state.page});
				}
			}.bind(this),
				error: function(xhr, status, err) {
				notif.add('danger', err).run();
			}.bind(this)
		});
	},

	submitSubscriptionToServer: function()
	{
		$.ajax({
			url: '/api/v1/list/subscribe/' + this.state.data.id,
			dataType: 'json',
			type: 'POST',
			data: { _token: _token, },
			success: function(data) {
				if(data.error) {
					notif.add('danger', data.error).run();
				} else {
					notif.add('success', 'You have subscribed to the list!').run();
					this.setState({data: data});
				}
			}.bind(this),
				error: function(xhr, status, err) {
				notif.add('danger', err).run();
			}.bind(this)
		});

	},

	submitUnsubscriptionToServer: function()
	{
		$.ajax({
			url: '/api/v1/list/subscribe/' + this.state.data.id,
			dataType: 'json',
			type: 'POST',
			data: {
				_token: _token,
				_method: 'DELETE',
			},
			success: function(data) {
				if(data.error) {
					notif.add('danger', data.error).run();
				} else {
					notif.add('success', 'You have unsubscribed from the list!').run();
					this.setState({data: data, page: this.state.page});
				}
			}.bind(this),
				error: function(xhr, status, err) {
				notif.add('danger', err).run();
			}.bind(this)
		});
	},

	submitManyUsersToServer: function(data)
	{
		$.ajax({
			url: '/api/v1/list/add/many',
			dataType: 'json',
			type: 'POST',
			data: {
				_token: _token,
				search: data.search,
				description: data.description,
				list_id: grab
			},
			success: function(data) {
				this.setState({data: data, page: this.state.page});
			}.bind(this),
				error: function(xhr, status, err) {
				notif.add('danger', err).run();
			}.bind(this)
		});
	},

	actionChangePage: function(page)
	{
		this.setState({data: this.state.data, page: page});
	},

	render: function()
	{
		var data,
			page,
			author,
			list,
			sortedList,
			smallActionBar,
			listElement,
			showListAction,
			listExtraInfo,
			steam_64_bit_list = [];

		data = this.state.data;
		page = this.state.page;

		if(data !== null)
		{
			if(data.error)
			{
				return <h1 className="text-center">{data.error}</h1>
			}

			if(data.author)
			{
				author = <div><small>By: { data.author }</small></div>;
			}

			if(data.privacy)
			{
				var privacy, privacy_color;

				switch(data.privacy)
				{
					case "3":
					case 3:
						privacy = "Private";
						privacy_color = "danger";
						break;
					case "2":
					case 2:
						privacy = "Friends Only";
						privacy_color = "warning";
						break;
					case "1":
					case 1:
						privacy = "Public";
						privacy_color = "success";
						break;
				}

				listExtraInfo = (
					<div className="col-xs-12 col-md-6">
						<div className="list-extra-info text-right">
							<div className={"list-type text-" + privacy_color}>{ privacy } List</div>
							<div>Subscribed Users: { data.sub_count }</div>
						</div>
					</div>
				);
			}

			if(data.list !== null && data.list !== undefined)
			{
				data.list.map(function(profile, index)
				{
					steam_64_bit_list.push(profile.steam_64_bit);
				});
			}

			if(grab == "search")
			{
				var eListAction = (
					<div className="list-action-container">
						<hr className="divider" />
						<div className="row">
							<div className="col-xs-6 col-lg-12">
								<button className="btn btn-block btn-info" data-toggle="modal" data-target="#addAllUsers">Add All Users to List</button>
							</div>
						</div>
						<div id="searchUsers" className="hidden">{ steam_64_bit_list.join(" ") }</div>
					</div>
				);
				smallActionBar = (
					<div className="list-action-bar hidden-lg">
						<div className="container">
							<div className="row">
								<div className="col-xs-12">
									<a href="#" data-toggle="collapse" data-target="#list-actions"><span className="fa fa-bars"></span>&nbsp; Advanced Options</a>
									<div id="list-actions" className="list-actions collapse">
										{ eListAction }
									</div>
								</div>
							</div>
						</div>
					</div>
				)

				showListAction = (
					<div className="col-lg-3">
						<div className="list-actions visible-lg-block">
							{ eListAction }
						</div>
					</div>
				);
			}

			if(auth_check && data.author)
			{
				var eListAction = <ListAction addMany={this.submitManyUsersToServer} ListSubscribe={this.submitSubscriptionToServer} ListUnsubscribe={this.submitUnsubscriptionToServer} data={data} />;
				smallActionBar = (
					<div className="list-action-bar hidden-lg">
						<div className="container">
							<div className="row">
								<div className="col-xs-12">
									<a href="#" data-toggle="collapse" data-target="#list-actions"><span className="fa fa-bars"></span>&nbsp; Advanced Options</a>
									<div id="list-actions" className="list-actions collapse">
										{ eListAction }
									</div>
								</div>
							</div>
						</div>
					</div>
				)

				showListAction = (
					<div className="col-lg-3">
						<div className="list-actions visible-lg-block">
							{ eListAction }
						</div>
					</div>
				);
			}

			sortedList = [];
			if(data.list !== null && data.list !== undefined)
			{
				for(var y = 0; y < Math.ceil(data.list.length/20); y++)
				{
					for(var x = 0; x < 20; x++)
					{
						if(x === 0) sortedList[y] = [];

						var playerItem = data.list[(y*20)+x];
						if(playerItem === undefined) break;

						sortedList[y].push(playerItem);
					}
				}
			}

			listElement = (
				<div className="container">
					<div className="row">
						<div className={"col-xs-12" + (showListAction ? " col-lg-9": "" )}>
							<div className="row">
								<div className="col-xs-12 col-md-6">
									<h2 className="list-title">
										{ data.title } { author }
									</h2>
								</div>
								{ listExtraInfo }
							</div>

							<div className="table-responsive">
								<table className="table list-table">
									<thead>
										<tr>
											<th width="80"></th>
											<th>User</th>
											<th className="text-center" width="140">VAC / Game Ban</th>
											<th className="text-center hidden-sm" width="140">Community Ban</th>
											<th className="text-center hidden-sm" width="100">Trade Ban</th>
											<th className="text-center" width="100">Tracked By</th>
										</tr>
									</thead>
									<DisplayPage page={page} list={sortedList} myList={data.my_list} deleteUserFromList={this.submitDeleteUserToServer}/>
								</table>
							</div>

							<ListPagination listChangePage={this.actionChangePage} page={page} list={sortedList}/>
						</div>
						{ showListAction }
					</div>
				</div>
			);
		}

		return (
			<div>{ smallActionBar } { listElement } <ListHandler UpdateListTitle={this.UpdateListTitle} editData={this.state.data} /></div>
		);
	}
});

var ListAction = React.createClass({
	doSub: function()
	{
		this.props.ListSubscribe();
	},

	doUnsub: function()
	{
		this.props.ListUnsubscribe();
	},

	addMany: function(e)
	{
		e.preventDefault();

		var search = this.refs.search.getDOMNode().value.trim();
		var description = this.refs.description.getDOMNode().value.trim();

		this.props.addMany({search: search, description: description});

		this.refs.search.getDOMNode().value = '';
		this.refs.description.getDOMNode().value = '';
	},

	render: function()
	{
		var data, editList, subButton, addUsers;

		data = this.props.data;

		if(data !== null)
		{
			if(data.my_list) {
				editList = (
					<div className="col-xs-6 col-lg-12">
						<button className="btn btn-block btn-info" data-toggle="modal" data-target="#editListModal">Edit List</button>
					</div>
				);

				addUsers = (
					<div className="col-xs-6 col-lg-12"><br />
						<form onSubmit={this.addMany}>
							<div className="form-group">
								<label className="label-control">
									<strong>Add Users to List</strong>
								</label>
								<textarea ref="search" className="form-control" rows="10"
placeholder="2 ways to search: =================================
 - type in steam URL/id/profile and split them in spaces or newlines or both =================================
 - Type 'status' on console and paste the output here"></textarea>
							</div>
							<div className="form-group">
								<textarea ref="description" className="form-control" rows="3" placeholder="A little description to help remember"></textarea>
							</div>
							<button className="btn btn-block btn-primary form-control">Add Users</button>
						</form>
					</div>
				);
			}

			subButton = (
				<div className="col-xs-6 col-lg-12">
					<button className="btn btn-block" disabled="disabled">Subscribe to List</button>
					<div className="text-center">
						<small><i>Please go to settings and verify email</i></small>
					</div>
				</div>
			);

			if(data.can_sub)
			{
				subButton = (
					<div className="col-xs-6 col-lg-12">
						<button onClick={ this.doSub } className="btn btn-block btn-primary">Subscribe to List</button>
					</div>
				);

				if(data.subscription !== null) 
				{
					subButton = (
						<div className="col-xs-6 col-lg-12">
							<button onClick={ this.doUnsub } className="btn btn-block btn-danger">Unubscribe to List</button>
						</div>
					);
				}
			}

			return (
				<div className="list-action-container">
					<hr className="divider" />
					<div className="row">
						{ editList }
						{ subButton }
						{ addUsers }
					</div>
				</div>
			);
		}

		return <div></div>
	}
});

var ListPagination = React.createClass({
	changePage: function(page)
	{
		console.log(page);

		this.props.listChangePage(page);
	},

	render: function()
	{
		var list,
		page,
		pagePrev,
		pageNext,
		pageList;

		list = this.props.list;
		page = this.props.page;
		page = page <= 1 || page > list.length ? 1 : page;

		if(list.length <= 1 || list[0] === undefined) return <div></div>;

		pagePrev = (
			<li className={ page != 1 ? "" : "disabled" }>
				<a onClick={ page != 1 ? this.changePage.bind(this, page - 1) : ""}>
					<span>&laquo;</span>
				</a>
			</li>
		);

		pageNext = (
			<li className={ page < list.length ? "" : "disabled" }>
				<a onClick={ page < list.length ? this.changePage.bind(this, page + 1) : "" }>
					<span>&raquo;</span>
				</a>
			</li>
		);

		pageList = [];

		for(var p = 1; p <= list.length; p++)
		{
			pageList.push(<li key={ p } className={p == page ? "active" : "" }><a onClick={this.changePage.bind(this, p)}>{ p }</a></li>);
		}

		return (
		<nav className="pull-right">
			<ul className="pagination">
				{ pagePrev }
				{ pageList }
				{ pageNext }
			</ul>
		</nav>);
	}
});

var DisplayPage = React.createClass({

	sendDeleteUserFromList: function(profile)
	{
		this.props.deleteUserFromList(profile);
	},

	render: function()
	{
		list = this.props.list;
		page = this.props.page;
		page = page <= 1 || page > list.length ? 1 : page;

		if(list[0] === undefined) {
			return (
				<tbody>
					<tr>
						<td colSpan="6" className="text-center">
							<i>This list is empty</i>
						</td>
					</tr>
				</tbody>
			);
		}

		pagedList = list[page - 1].map(function(profile, index)
		{
			var auth, specialColors, profile_description;

			if(auth_check) {
				if(this.props.myList) {
					auth = (
						<span className="pointer userListModify open-addUserModal" onClick={this.sendDeleteUserFromList.bind(this, profile)} data-id={ profile.id }>
							<span className="fa fa-minus faText-align text-danger"></span>
						</span>
					);
				} else {
					auth = (
						<a className="userListModify open-addUserModal" href="#addUserModal" data-toggle="modal" data-id={ profile.id }>
							<span className="fa fa-plus faText-align text-primary"></span>
						</a>
					);
				}
			}

			specialColors = "";
			if(profile.beta >= 1) specialColors = "beta-name";
			if(profile.donation >= 10.0) specialColors = "donator-name";
			if(profile.site_admin >= 1) specialColors = "admin-name";

			if(profile.profile_description)
			{
				profile_description = <i className="fa fa-eye pointer" data-toggle="tooltip" data-placement="right" title={ profile.profile_description }></i>
			}

			return (
				<tr key={ profile.id }>
					<td className="user_avatar">
						{ auth }<a className={specialColors} href={"/u/" + profile.steam_64_bit} target="_blank"><img src={profile.avatar_thumb} /></a>
					</td>
					<td className="user_name">
						{ profile_description } <a className={specialColors} href={"/u/" + profile.steam_64_bit} target="_blank">{profile.display_name}</a>
					</td>
					<td className="user_vac_ban text-center">
						<span className={"text-" + (profile.vac > 0 ? "danger" : "success")}>
							{ profile.vac > 0 ? profile.vac_banned_on : <span className="fa fa-times"></span> }
						</span>
					</td>
					<td className="user_community_ban text-center hidden-sm">
						<span className={"fa fa-"+(profile.community >= 1 ? 'check' : 'times')+" text-" + (profile.community >= 1 ? 'danger' : 'success')}></span>
					</td>
					<td className="user_trade_ban text-center hidden-sm">
						<span className={"fa fa-"+(profile.trade >= 1 ? 'check' : 'times')+" text-" + (profile.trade >= 1  ? 'danger' : 'success')}></span>
					</td>	
					<td className="user_track_number text-center">
						{ profile.times_added.number }
					</td>
				</tr>
			);
		}.bind(this));

		return <tbody>{ pagedList }</tbody>;
	}
});



React.render(<List />, document.getElementById('list'));