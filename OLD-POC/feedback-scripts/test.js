const proginput = document.getElementById("yourcode"); 
const mypre = document.getElementById("output"); 

// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) { 
    var mypre = document.getElementById("output"); 
    mypre.innerHTML = mypre.innerHTML + text; 
} 
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function inputFunc(prompt) {
    console.log(prompt);
    //return window.prompt(prompt);
    var p = new Promise(function(resolve, reject) {
        // Pete's code
        // if($('#raw_input_holder').length > 0) {
        //     return;
        // }
        // PythonIDE.python.output('<form><div id="raw_input_holder"><label for="raw_input">' + prompt + '</label><input class="ui-widget ui-state-default ui-corner-all" type="text" name="raw_input" id="raw_input" value="" autocomplete="off"/><button id="raw_input_accept" type="submit">OK</button></div></form>');

        // var btn = $('#raw_input_accept').button().click(function() {
        //     var val = $('#raw_input').val();
        //     $('#raw_input_holder').remove();
        //     PythonIDE.python.output(prompt + ' <span class="console_input">' + val + "</span>\n");
        //     resolve(val);
        // });
        // $('#raw_input').focus();
        resolve(proginput.value)
    });
    return p;
}


// function repl(code) {
//     if(code == undefined) {
//     Sk.inputfun(">>> ").then(function(result) {
//         if(result.length > 0) {
//             repl(result);
//             repl();
//         }
//     }).catch(function (error) {console.log(error)});
// } else {
//     var outputResult = true;
//     if(code.match(/\s*import/)) {
//         outputResult = false;
//     } else {
//         code = "__result = " + code;	
//     }
//     var r = eval(Sk.compile(code, "repl", "exec", true).code)(Sk.globals);
//     var startTime = new Date().getTime();
//     while(r.$isSuspension) {
//         if(r.data.promise) {
//             r.data.promise.then(function(result) {
//                 if(outputResult) {
//                     outf(Sk.ffi.remapToJs(Sk.builtin.repr(result)));	
//                 }
//             }).catch(function (error) {console.log(error)});
//         } else {
//             r = r.resume();
//         }
//         var now = new Date().getTime();
//         if(now - startTime > 5000) {
//             //PythonIDE.showHint("Stopped after 5s to prevent browser crashing");
//             break;
//         }
//     } 
//     if(r.__result && outputResult) {
//         outf(Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)));
//     }
// }
// }

// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() { 
   const prog = proginput.value; 
   mypre.innerHTML = ''; 
   Sk.pre = "output";
   Sk.configure({
                output:outf, 
                read:builtinRead,
                __future__: Sk.python3,
                inputfun: inputFunc,
                inputfunTakesPrompt: true
            }); 
    // runAsFile(prog);
    runInteractive(prog);
}

function runInteractive(code) {
    Sk.inputfun(">>> ").then(function(result) {
        console.log(result);
        if(result.length > 0) {
            var outputResult = true;
            if(code.match(/\s*import/)) {
                outputResult = false;
            } else {
                code = "__result = " + code;	
            }
            var r = eval(Sk.compile(code, "repl", "exec", true).code)(Sk.globals);
            var startTime = new Date().getTime();
            while(r.$isSuspension) {
                if(r.data.promise) {
                    r.data.promise.then(function(result) {
                        if(outputResult) {
                            console.log("a")
                            outf(Sk.ffi.remapToJs(Sk.builtin.repr(result)));	
                        }
                    }).catch(function (error) {console.log(error)});
                } else {
                    r = r.resume();
                }
                var now = new Date().getTime();
                if(now - startTime > 5000) {
                    //PythonIDE.showHint("Stopped after 5s to prevent browser crashing");
                    break;
                }
            } 
            if(r.__result && outputResult) {
                console.log("b")
                outf(Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)));
            }
        }
    }).catch(function (error) {console.log(error)});
}

function runAsFile(code) {
    const myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, code, true);
        
    });
    myPromise.then(function(mod) {
         console.log(mod);
        console.log('success');
    },
        function(err) {
        console.log(err.toString());
    });
}

document.getElementById("run-btn").addEventListener("click", runit);

// REPL approach? From Pete's tool
/*
Sk.inputfun(">>> ").then(function(result) {
					if(result.length > 0) {
						PythonIDE.python.repl(result);
						PythonIDE.python.repl();
					}
				}).catch(PythonIDE.handleError);
*/