import React, { Component } from 'react';
import classNames from 'classnames';

import { TooltipOpts } from '../../config/options';
import Styles from '../../config/styles';
import { Help } from '../../config/text';
import * as interaction from '../../actions/interaction';

import CONFIG from '../../config/settings.json';

export function ControlButton (props) {
	return (
		<button id = {props.id}
				onClick={() => props.press()}
				className = {props.className}>
			{props.name}
		</button>
	);
}

export function DropDown ({ current, opts, press }) {
	return (
		<div className='switch'>
			<select className = "select" value = {current}
					onChange = { (e) => press(parseInt(e.target.value)) } >
				{
					Array.from(opts).reverse().map((y, i) => (
						<option key = {i} className = "opt"> {y} </option>
					))
				}
			</select>
		</div>
	);
}

export function ControlDescription ({ name, level, dispatch }) {
	return (
		<div id={'displaydesc-' + level}
			 className='displaydesc controldesc'>
			<span id = {name + 'text-' + level}
				  className = {name + 'text controltext'}>
				{name}
			</span>
			<span id = {name + 'help-' + level}
				  className = {name + 'help controlhelp help'}
				  onClick = { () => dispatch(interaction.helpClick(
					  Styles.widthControlPanel,
					  helpY[name],
					  TooltipOpts.LEFT,
					  Help[CONFIG.lang][name],
					  level
				  )) } >
			</span>
		</div>
	);
}

export function ControlBox (props) {
	const box = props.name + 'box';
	const {name, level, ...rest } = props;
	return (
		<div id={box + '-' + level}
			className = {
				classNames({
					'controlbox': true,
					[box]: true,
					'hidden': !props.active
				})
			} >
			<ControlDescription
				name = {props.name}
				level = {level}
				dispatch = {props.dispatch}
			/>
			{ React.createElement(props.renderer, {...rest}) }
		</div>
	);
}

export function ButtonSwitch ({ current, opts }) {
	const btns = Object.values(opts);
	return (
		<div className='switch'>
			{ btns.map((btn, i) => (
				<ControlButton key = {i} {...btn}
					className = {
						classNames({
							'last': i==(btns.length-1),
							'active-button': btn.name == current
						})
					}
				/>
			))}
		</div>
	);
}

const helpY = {
	'view': 16,
	'mode': 80,
	'year': 144,
	'sort': 208
}
