import React, { Component } from 'react';
import classNames from 'classnames';

export default function Header (props) {
	return (
		<div id='header'>
			<span className='open'>Open</span>
			<span className='budgets'>Budgets</span>
		</div>
	);
}
