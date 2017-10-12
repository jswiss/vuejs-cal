import moment from 'moment-timezone';
import VueCalendar from './entry.js';
import './style.scss';

moment.tz.setDefault('UTC');

let events = window.__INITIAL_STATE__.map(e => {
	return {
		description: e.description,
		date: moment(e.date),
	};
});

VueCalendar(events).$mount('#app');
