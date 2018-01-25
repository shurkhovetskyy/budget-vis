import React, { Component } from 'react';

import {
	DropDown,
	ControlDescription,
	ControlBox,
	ButtonSwitch
} from './elements';

import { View, Mode, Sort, TextMapping } from '../../config/options';
import CONFIG from '../../config/settings.json';


export default class ControlPanel extends React.Component {
	constructor (props) {
		super(props);
		this.buttons = {
			view:	[
						generateDesc('view', this.props.actions, View.TIME),
						generateDesc('view', this.props.actions, View.CATS)
					],
			mode: 	[
						generateDesc('mode', this.props.actions, Mode.SPENDING),
						generateDesc('mode', this.props.actions, Mode.REVENUE),
						generateDesc('mode', this.props.actions, Mode.BAL)
					],
			sort:	[
						generateDesc('sort', this.props.actions, Sort.NUM),
						generateDesc('sort', this.props.actions, Sort.ABC)
					]
		};

		this.firstRender = true;
	}

	componentDidMount () {
		this.firstRender = false;
	}

	shouldComponentUpdate (nextProps) {
		return nextProps.mark != this.props.mark;
	}

	render () {
		const l = this.props.level;
		return (
			<div id={'controlpanel-' + l} className = 'sidediv controlpanel'>
				<ControlBox
					name = 'view'
					level = {l}
					current = {TextMapping[this.props.view]}
					opts = {this.buttons.view}
					renderer = { ButtonSwitch }
					active
				/>
				<ControlBox
					name = 'mode'
					level = {l}
					current = {TextMapping[this.props.mode]}
					opts = {this.buttons.mode}
					renderer = { ButtonSwitch }
					active
				/>
				<ControlBox
					name = 'year'
					level = { l }
					current = { this.props.year }
					opts = { CONFIG.years }
					renderer = { DropDown }
					active = {this.props.view!=View.TIME && !this.firstRender}
					press = { (y) => this.props.actions.year(y) }
				/>
				<ControlBox
					name = 'sort'
					level = {l}
					current = {this.props.sort}
					opts = {this.buttons.sort}
					renderer = { ButtonSwitch }
					active = {this.props.view!=View.TIME && !this.firstRender}
				/>
			</div>
		);
	}
}

function generateDesc (group, actions, name) {
	return	{
				id: group + name,
				press: () => actions[group](name),
				name: TextMapping[name] || name
			};
}
