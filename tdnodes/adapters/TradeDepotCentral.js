/**
 * Created by c2gconsulting.
 */
//TD central Adapter
/*
 Default MicrosoftNAV adapter.
 */
var core = require ("swarmcore");
var services = require('../services/services.json').active;
var thisAdapter = core.createAdapter("TradeDepotCentral");
console.log("Tradedepot central adapter running and waiting for swarm method calls");

/*
 */

DisplayComplete = function(string) {
    console.log("Po Created Swarm Executed successful and returned PO key as\n %s", string);
};