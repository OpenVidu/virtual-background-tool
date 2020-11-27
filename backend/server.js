var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var uuid = require('uuid').v1;
const EMAIL_FILE_NAME = 'emails.txt';


app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

var options = {
	key: fs.readFileSync('cert.key'),
	cert: fs.readFileSync('cert.crt')
};


app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.raw({type: 'application/octet-stream', limit: '50mb'}));

var secure = https.createServer(options, app);
secure.listen(5000, () => {
	console.log('......................');
	console.log('Listening in port 5000');
});


app.post('/recording', (req, res) => {
	const data = JSON.parse(req.headers.data);
	console.log('data: ', data);
	saveFile(req.body, res, data);

});


function saveFile(file, res, data) {

	var rootDir = '/opt/openvidu-virtual-background-tool/recordings/';
	var extensionPath = data.gender + '/' + data.skin + '/' + data.hair + '/';

	if(!!data.distance && !!data.behaviour && !!data.position && !!data.headphones) {
		extensionPath += data.distance + '/' + data.behaviour + '/' + data.position + '/' + data.headphones + '/';
	}else {
		extensionPath += 'backgrounds/';
	}

	try {
		prepareFiles(rootDir, extensionPath);
	} catch (error) {
		console.log("Error creating directorys. Maybe insufficient permissions");
		res.status(500).send("Error creating directorys. Maybe insufficient permissions");
		return;
	}

	if(!!data.email){
		// Saving email into a .txt
		fs.appendFileSync(rootDir + EMAIL_FILE_NAME, data.email + '\n', function (err) {
			if (err){
				console.log("Error writing email in emails file");
				res.status(500).send("Error writing email in emails file");
				return;
			}
			console.log('Email Saved!');
		  });
	}

	const timestamp = new Date().getTime();
	const email = !!data.email ? data.email : '';
	// Saving recording
	fs.open(rootDir + extensionPath + email + '-' + timestamp + '.webm', 'w', function(err, fd) {
        fs.write(fd, file, 0, file.length, null, function(err) {
            if (err){
				console.log("Error saving recording in directory: ", rootDir + extensionPath);
				res.status(500).send("Error saving recording in directory");
				return;
			}
            fs.close(fd, function() {
                console.log('File successfully saved on: ', rootDir + extensionPath);
                res.status(200).end();
            });
        });
    });
}


function prepareFiles(rootDir, extensionPath) {
	if (!fs.existsSync(rootDir + EMAIL_FILE_NAME)){
		// Create emails file
		fs.mkdirSync(rootDir, { recursive: true });
		fs.writeFileSync(rootDir + EMAIL_FILE_NAME, 'Email list: \n');
	}

	if(!fs.existsSync(rootDir + extensionPath)){
		// Create recordgins directory
		fs.mkdirSync(rootDir + extensionPath, { recursive: true });
	}
}