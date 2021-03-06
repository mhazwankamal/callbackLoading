function waitForLoading (selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
        var targetNodes, btargetsFound,stillLoading;

        if(typeof iframeSelector == "undefined"){
            targetNodes=$(selectorTxt);
        }
        else{
            targetNodes=$(iframeSelector).contents().find (selectorTxt);
        }

        //checkLoading finisih or not
        stillLoading=targetNodes.css("display") == "flex" ? true : false
        if (targetNodes && targetNodes.length > 0 && !stillLoading) {

            btargetsFound= true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each ( function () {
                var jThis = $(this);
                var alreadyFound = jThis.data ('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction (jThis);
                    if (cancelFound){
                        btargetsFound = false;
                    }
                    else {
                        jThis.data ('alreadyFound', true);
                    }
                }
            } );
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && !stillLoading) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey]

        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    waitForLoading (selectorTxt,
                                        actionFunction,
                                        bWaitOnce,
                                        iframeSelector
                                       );
                },
                                           300
                                          );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
