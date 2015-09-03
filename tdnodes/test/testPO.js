var adapterPort         = 3000;
var adapterHost         = "localhost";
globalVerbosity = false;
var util       = require("swarmcore");
var client     = util.createClient(adapterHost, adapterPort, "navClient", "ok","testTenant", "testCtor");

client.startSwarm("pocreated.js","start");