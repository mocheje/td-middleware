/**
 * Created by c2gconsulting.
 */
//comming up only spawn clients when it is needed and shutdown client after execution.
/*
 Default MicrosoftNAV adapter.
 */
var core = require ("swarmcore");
var services = require('../services/services.json').active;
var auth = require('../services/services.json').NAV;
var _ = require("underscore");
/*
 Require soap-ntlm since we will be consuming soap based api from NAV using NTLM authentication
 */
var soap = require("soap-ntlm");
var fs = require('fs');
var httpntlm = require('httpntlm');


thisAdapter = core.createAdapter("MicrosoftNAV");
console.log("Microsoft NAV adapter running and listening and waiting for swarms method calls");
var running = [];

//create a single client for customer
startService = function(name, callback){
    if (!services.hasOwnProperty(name)){
        callback(null);
    } else {
        var url='http://52.88.88.200:7047/DynamicsNAV80/WS/CRONUS%20International%20Ltd./Page/' + name + '?wsdl';
        var username = auth.navcentral.username;
        var password = auth.navcentral.password;
        httpntlm.get({
            url: url,
            password: password,
            username: username
        }, function(err, wsdl){
            console.log("creating soap client for %s web service", name);
            var path = process.env.SWARM_PATH +'tdnodes/pages/';
            console.log(path);
            fs.writeFile(path + name + '.wsdl', wsdl.body, function(){
                soap.createClient(path + name +'.wsdl', function(err, client) {
                    if (err) {
                        console.log(err);
                        callback(null);
                    } else {
                        console.log("client %s created succesfully", name);
                        client.setSecurity(new soap.NtlmSecurity(username, password));
                        running.push({name: name, client: client});
                        console.log(running);
                        callback(null, true);
                    }
                });
            });
        });
    }


};
NavAction = function(service, action, args, callback){
    console.log("starting NAV action for %s action %s and args as %s", service,action,JSON.stringify(args));
    var position = checkService(service);
    if (typeof args == "object" && position > -1 ) {
        //process action and return response
        running[position]["client"][action](args, function(err, response){
            if(response) {
                callback(null, response);
            } else {
                console.log("nav action error " + err);
                callback(err, null);
            }

        })
    } else {
        //attempt to start up the requested NAV service
        // first check if service is configured as active
        console.log("Service not started Attempting to start service");
        startService(service, function(err, started){
            if (!started){
                //service is inactive or with error
                console.log("cannot start service or service with errors ");
                callback(err);
            } else{
                NavAction(service, action, args, callback);
            }
        });

    }

};
checkService = function(name){
    console.log("checking running service index");
    var index = _.findIndex(running, {name: name});
    console.log("index found and index value is %s", index);
   return index;
};

//startup