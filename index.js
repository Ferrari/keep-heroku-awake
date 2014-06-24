#!/usr/bin/env node

var http = require('http');
var https = require('https');
var CronJob = require('cron').CronJob;
var config = require(__dirname + '/config.js');

var hostList = config.hostList || [];
var counter = 0;

function ping(url, cb) {
    if (url.match(/^https/)) {
        https.get(url, function(res) {
            console.log("Got response from %s: %d", url, res.statusCode);
            cb(null, res);
        });
    } else {
        http.get(url, function(res) {
            console.log("Got response from %s: %d", url, res.statusCode);
            cb(null, res);
        });
    }
}

if (!config.cronTime) process.exit(1);
var job = new CronJob({
    cronTime: config.cronTime,
    onTick: function() {
        console.log("Start at " + new Date())
        hostList.forEach(function(url) {
            ping(url, function(err) {
                if (!err) counter++;
                if (counter >= hostList.length) {
                    console.log("done!!");
                }
            });
        });
    },
    start: true
});
job.start();
