import React, { Component } from 'react';
import classNames from 'classnames';

import {
	getItemColor,
	MoneyNum,
	MoneySign
} from '../../utils';

import StackedChart from './StackedChart';

import { TooltipOpts } from '../../config/options';

import Styles from '../../config/styles';
import * as interaction from '../../actions/interaction';

import { Messages, Help } from '../../config/text';

import CONFIG from '../../config/settings.json';

export function ListEntry (props) {
	const {dim, year, openDimensions, last} = props;
	const color = getItemColor(props.dim);
	const id = props.level + '-' + dim;
	return (
		<div id = {'dim-entry-' + id}
			onClick = {props.add}
			className = {
				classNames({
					'last': last,
					'active': openDimensions.includes(dim),
					'dim-entry': true,
					'figs-hidden': !props.figsVisible || props.first,
					'figs-hidden-delay': !props.figsVisible && props.delayHide,
					'stacks-hidden': !props.stacksVisible && !props.instantShow,
					'stacks-hidden-instant': !props.stacksVisible || props.instantShow
				})
			} >
			<ListAux id = {id} color = {color}
				helpClick = {props.callbacks.helpClick}/>
			<ListDesc {...props} id = {id} />
			<ListRemove
				onClick = {props.remove}
				openLength = {openDimensions.length}
			/>
		</div>
	);
}

export function ListAux (props) {
	const id = props.id;
	return (
		<div className = 'aux' id = {'aux-' + id}>
			<div
				className = 'dim-marker'
				id = {'dim-marker-' + id}
				style = {{backgroundColor: props.color}}
			/>
			<div
				className = 'fighelp listhelp help'
				id = {'fighelp-' + id}
				onClick = { (e) => props.helpClick(e.target, 'fig') }
			/>
			<div
				className = 'stackhelp listhelp help'
				id = {'stackhelp-' + id}
				onClick = { (e) => props.helpClick(e.target, 'stack') }
			/>
		</div>
	);
}

export function ListDesc (props) {
	let noData = false;
	if (CONFIG.hasOwnProperty("dimYears"))
		noData = !CONFIG.dimYears[props.dim].includes(props.year);

	const opacity = (!noData && props.value==0) ? 0 : 1;
	return (
		<div className = 'dim-desc' id = {'dim-desc-' + props.id} >
			<ListName {...props } />
			<ListFigure {...props}
				noData = {noData}
			/>
			<StackedChart {...props} />
		</div>
	);
}

export function ListFigure (props) {
	const id = props.id;
	return (
		<div id = {'dim-figure-' + id}
			className = {
				classNames({
					'dim-figure': true,
					'name': true,
					'hidden': (!props.figsVisible && !props.delayHide) || props.first,
					'hidden-delay': !props.figsVisible && props.delayHide
				})
			} >
			<div className = 'dim-value name'
				id = {'dim-value-' + id}
				style = {{color: props.noData ? 'gray' : 'white'}} >
				{props.noData ? (
					Messages.EN.noData
				) : (
					CONFIG.currency + MoneyNum(props.value)
				)}
			</div>
			<div className = 'dim-sign name'  id = {'dim-sign-' + id}>
				{props.noData ? ('') : (MoneySign(props.value))}
			</div>
		</div>
	);
}

export function ListName (props) {
	const id = props.id;
	return (
		<div className = 'dim-namebox' id = {'dim-namebox-' + id}>
			<div className = 'dim-name name'  id = {'dim-name-' + id}>
				{props.dim}
			</div>
			<div id = {'dim-year-' + id}
				className = {
					classNames({
						'dim-year': true,
						'name': true,
						'hidden-delay': !props.figsVisible && props.delayHide,
						'hidden': props.first
					})
				} >
				{props.year}
			</div>
		</div>
	);
}

export function ListRemove (props) {
	return (
		<div className = {
				classNames({
					'hidden': props.openLength==1,
					'dim-remove name': true
					})
				}
			id = {'dim-remove-' + props.id}
			onClick = {props.onClick}
		/>
	);
}

const helpY = {
	'fig': 16,
	'stack': 80
}
