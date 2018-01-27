import React, { Component } from 'react';
import classNames from 'classnames';

import { View } from '../config/options';

const CONFIG = require('../config/settings.json');

export default function LevelHeader (props) {
	const l = props.level;
	const hide = props.view == View.TIME || props.view == null;
	return (
		<div id = {'header-left-' + l}
			className = 'headerleftcon header left' >
			<div id = {'selection-name-' + l}
				className = {
						classNames({
							'title selection-name': true,
							'hide': hide
					})}
				style = {{opacity: 0}}
			/>

			<div className = {
					classNames({
						'title level-name': true,
						'hidden': hide
				})}
				id = {'level-name-' + l} >
				{CONFIG.levels_alias[l]}
			</div>
		</div>
	);
}
