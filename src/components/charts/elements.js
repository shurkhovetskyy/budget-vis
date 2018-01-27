import React, { Component } from 'react';
import Styles from '../../config/styles';

export function Axis ({level}) {
	return (
		<g className = 'axiswrap'
			transform = {'translate(' + Styles.leftMargin + ', 0)'}>
			<g className = 'axiscon' id = {'axiscon-' + level}>
				<line className = 'zero' id = {'zero-' + level} />
			</g>
		</g>
	);
}

export function Labels ({level}) {
	return (
		<div id = {'labelsgroup-' + level}
			className = 'labelsgroup'>
			<div id = {'labelscon-bar-' + level}
				className = 'labelscon hidden'
			/>
			<div id = {'labelscon-graph-' + level}
				className = 'labelscon hidden'
			/>
		</div>
	);
}
