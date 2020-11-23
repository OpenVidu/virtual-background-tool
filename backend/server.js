var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var uuid = require('uuid').v1;
const EMAIL_FILE_NAME = 'emails.txt';


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.raw({type: 'application/octet-stream', limit: '50mb'}));

app.listen(5000, () => {
	console.log('......................');
	console.log('Listening in port 5000');
});


app.post('/recording', (req, res) => {
	const data = JSON.parse(req.headers.data);
	console.log('data: ', data);
	saveFile(req.body, res, data);

});


function saveFile(file, res, data) {

	var rootDir = '/opt/openvidu/recordings-background-tool/';
	// var rootDir = '/home/carlos/Desktop/recordings/';
	var extensionPath = data.gender + '/' + data.skin + '/' + data.hair + '/';

	if(!!data.distance && !!data.behaviour && !!data.position && !!data.headphones) {
		extensionPath += data.distance + '/' + data.behaviour + '/' + data.position + '/' + data.headphones + '/';
	}else {
		extensionPath += 'backgrounds/';
	}

	try {
		prepareFiles(rootDir, extensionPath);
	} catch (error) {
		res..status(500).send("Error creating directorys. Maybe insufficient permissions");
		return;
	}

	if(!!data.email){
		// Saving email
		fs.appendFileSync(rootDir + EMAIL_FILE_NAME, data.email + '\n', function (err) {
			if (err){
				res.status(500).send("Error writing email in emails file");
				return;
			}
			console.log('Email Saved!');
		  });
	}

	// Saving recording
	fs.open(rootDir + extensionPath + uuid() + '.webm', 'w', function(err, fd) {
        fs.write(fd, file, 0, file.length, null, function(err) {
            if (err){
				res.status(500).send("Error saving recording in directory");
				return;
			}
            fs.close(fd, function() {
                console.log('wrote the file successfully');
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