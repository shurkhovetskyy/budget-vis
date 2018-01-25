import React, { Component } from 'react';

const CONFIG = require('../config/settings.json');

export default function LevelHeader (props) {
	const l = props.level;
	return (
		<div id = {'header-left-' + l}
			className = 'headerleftcon header left' >
			<div id = {'selection-name-' + l}
				className = 'title selection-name'
				style = {{opacity: 0}}
			/>
			<div id = {'level-name-' + l}
				className = 'title level-name' >
				{CONFIG.levels[l]}
			</div>
		</div>
	);
}
