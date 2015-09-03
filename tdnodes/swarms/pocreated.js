/**
 * User: sinica
 * Date: 6/7/12
 * Time: 9:49 PM
 */
var NAVPOCREATED =
{
    meta:{
        name: "pocreated.js",
        debug :"false"
    },
    vars:{
        details: {}
    },
    start:function(){
        console.log("Po created in Microsoft NAV Event Trigger ... Attempting to update TDCentral");
        this.swarm("begin");
    },
    begin:{ //phase read po details and do something in another adapter
        node:"MicrosoftNAV",
        code : function (){
            var me = this;
            var response = NavAction.async('purchaseorder', "Read", {No: '104001'});
            (function(response){
                console.log(JSON.stringify(response));
                me.details = response;
                me.swarm("updateTDC");
            }).swait(response, function(err){
                    console.log("error \n" + err);
                    me.home("Error occured");
                });
        }
    },
    updateTDC: {//do action phase fo NAV.
        //after creating the client
        node: "TradeDepotCentral",
        code: function(){
            var po = this.details;
            console.log("Visiting Traedepot central adapter for final message processing ");
            var message = DisplayComplete(po["purchaseorder"]["Key"]);
        }
    }
};

NAVPOCREATED;