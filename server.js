require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone');
const serialize = require('serialize-javascript');

moment.tz.setDefault('UTC');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(require('body-parser').json());

let events = [
	{
		date: moment('2017-10-05', 'YYYY-MM-DD'),
		description: 'brush teeth',
	},
	{
		date: moment('2017-10-06', 'YYYY-MM-DD'),
		description: 'walk dog',
	},
	{
		date: moment('2017-10-07', 'YYYY-MM-DD'),
		description: 'make lunch',
	},
];

let renderer;

// production changes
if (process.env.NODE_ENV === 'production') {
	const bundle = fs.readFileSync('./dist/node.bundle.js', 'utf8');
	renderer = require('vue-server-renderer').createBundleRenderer(bundle);
	app.use('/dist', express.static(path.join(__dirname, 'dist')));
}

app.get('/', (req, res) => {
	let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
	let contentMarker = '<!--APP-->';
	if (renderer) {
		renderer.renderToString({ events }, (err, html) => {
			if (err) {
				console.log(err);
			} else {
				// console.log(html);
				res.send(
					template.replace(
						contentMarker,
						// replacing content marker with initial state and html
						`<script>var __INITIAL_STATE__ = ${serialize(
							events
						)}</script>\n ${html}`
					)
				);
			}
		});
	} else {
		res.send(
			'<p>Awaiting compilation...</p> <script src="/reload/reload.js"></script>'
		);
	}
});

app.post('/add_event', (req, res) => {
	events.push(req.body);
	res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
	const reload = require('reload');
	const reloadServer = reload(server, app);
	require('./webpack-dev-middleware').init(app);
	// only required for development!
	require('./webpack-server-compiler').init(function(bundle) {
		// is the user already looking at the completed app, or the 'awaiting compilation' string?
		const needsReload = renderer === undefined;
		renderer = require('vue-server-renderer').createBundleRenderer(bundle);
		if (needsReload) reloadServer.reload();
	});
}

server.listen(process.env.PORT, function() {
	console.log(`Example app listening on port ${process.env.PORT}!`);
	if (process.env.NODE_ENV === 'development') {
		require('open')(`http://localhost:${process.env.PORT}`);
	}
});
