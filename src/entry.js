import Vue from 'vue';
import moment from 'moment-timezone';
import App from './components/App.vue';
import store from './store';

moment.tz.setDefault('UTC');
Object.defineProperty(Vue.prototype, '$moment', {
	get() {
		return this.$root.moment;
	},
});

export default function(events) {
	let initialState = Object.assign({}, store.state, { events });
	store.replaceState(initialState);

	return new Vue({
		// need to include moment here, otherwise it will not work!
		data: {
			moment,
		},
		components: {
			App,
		},
		store,
		// render, needed for server-side rendered apps
		render(createElement) {
			return createElement('div', { attrs: { id: 'app' } }, [
				createElement('app'),
			]);
		},
	});
}
