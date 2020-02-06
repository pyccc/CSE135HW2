window.addEventListener('DOMContentLoaded', loadHandler);
window.onload = function () {
    let reload = document.querySelector('#reload');

    // Execution starts here


    // // Change time 
    // reload.addEventListener('click', () => {
    //     window.setTimeout(() => {
    //         window.location.reload(true);
    //     }, 2000);
    //   });

    setTimeout(function () {
        //get page name to store loading time
        var path = window.location.pathname;
        var page = path.split("/").pop();
        //time
        var t = window.performance.timing;
        var initial = t.responseEnd;
        var end = t.loadEventEnd;
        var total = t.loadEventEnd - t.responseEnd;

        localStorage.setItem(page + '_initial', initial);
        localStorage.setItem(page + '_end', end);
        localStorage.setItem(page + '_total', total);
        //connection type
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        var type = connection.effectiveType;

        function updateConnectionStatus() {
            console.log("Connection type changed from " + type + " to " + connection.effectiveType);
            type = connection.effectiveType;
            localStorage.setItem('connectionType', type);
        }

        connection.addEventListener('change', updateConnectionStatus);


        // store data into localstorage
        localStorage.setItem('userAgent', navigator.userAgent);
        localStorage.setItem('userLanguage', navigator.language);
        localStorage.setItem('cookie', navigator.cookieEnabled);
        localStorage.setItem('javascript', false);
        localStorage.setItem('images', document.getElementById('testimg').complete);
        localStorage.setItem('css', window.getComputedStyle(document.getElementById('testButton')).backgroundColor == 'rgb(76, 175, 80)');
        localStorage.setItem('monitorHeight', screen.availHeight);
        localStorage.setItem('monitorWidth', screen.availWidth);
        localStorage.setItem('windowHeight', window.innerHeight);
        localStorage.setItem('windowWidth', window.innerWidth);
        localStorage.setItem('connectionType', type);
        console.log(localStorage);
    }, 0);

}

function loadHandler() {
    let el = document.querySelector('#testimg');
    let e2 = document.querySelector('#testButton');
    el.addEventListener('mouseover', mouseOnHandler);
    e2.addEventListener('click',clickHandler);
    //keystrokes(only implemented in form.html)
    if(window.location.pathname.split('/').pop()=='form.html'){
        document.querySelectorAll('input').forEach(element => {
            element.addEventListener('keydown',event =>{
                var stored_keystrokes = JSON.parse(localStorage.getItem("keystrokes"));
                if (!stored_keystrokes){
                    stored_keystrokes = []
                }
                stored_keystrokes.push("User is typing on Page " + window.location.pathname.split('/').pop()+' in textbox: '+event.target.name+' -- '+event.key);
                localStorage.setItem("keystrokes", JSON.stringify(stored_keystrokes));
            })
        });
    }
    //scroll detection
    window.addEventListener('scroll', scrollHandler);
    //Idle Time
    window.addEventListener('mousemove', idleHandler);
    window.addEventListener('click', idleHandler);
    window.addEventListener('mouseup', idleHandler);
    window.addEventListener('mousedown', idleHandler);
    window.addEventListener('keydown', idleHandler);
    window.addEventListener('keypress', idleHandler);
    window.addEventListener('keyup', idleHandler);
    window.addEventListener('change', idleHandler);
    window.addEventListener('scroll', idleHandler);
    window.addEventListener('resize', idleHandler);
    window.addEventListener('submit', idleHandler);
    window.addEventListener('mouseenter', idleHandler);
    var timer=null;
    function idleHandler() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function (t) {
            var stored_idletime = JSON.parse(localStorage.getItem("idletime"));
            if (!stored_idletime){
                stored_idletime=[];
            }
            stored_idletime.push("User has been idle on Page " + window.location.pathname.split('/').pop()+' for 2 seconds.');
            localStorage.setItem("idletime", JSON.stringify(stored_idletime));
        }, 2000);
    }

    //beforeunload
    window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        var stored_unloading = JSON.parse(localStorage.getItem("unloading"));
        if (!stored_unloading){
            stored_unloading = []
        }
        stored_unloading.push("User is leaving from Page " + window.location.pathname.split('/').pop());
        localStorage.setItem("unloading", JSON.stringify(stored_unloading));    
        // Chrome requires returnValue to be set.
        event.returnValue = '';        
      });
    // el2.addEventListener('click', removeHandler);
    // el3.addEventListener('click', onClickBrowserName);
    // el4.addEventListener('click', jsonEncode);
    // el5.addEventListener('click', jsonDecode);
    // el6.addEventListener('click', saveLocalStorage);
    // el7.addEventListener('click', getLocalStorage);
    // el8.addEventListener('click', changePara);

}

function mouseOnHandler(event) {
    alert('you have moused over a test image(only one image is test image in this page)');
    var stored_mouseon = JSON.parse(localStorage.getItem("mouse"));
    if (!stored_mouseon){
        stored_mouseon = []
    }
    stored_mouseon.push("User mouse on " + event.target.id);
    localStorage.setItem("mouse", JSON.stringify(stored_mouseon));
}

function clickHandler(event){
    var stored = JSON.parse(localStorage.getItem("click"));
    if (!stored){
        stored=[];
    }
    stored.push('User clicked "report test" button on Page '+window.location.pathname.split('/').pop());
    localStorage.setItem("click", JSON.stringify(stored));
    console.log(localStorage.getItem("click"));
}

function scrollHandler(event) {
    var stored_scroll = JSON.parse(localStorage.getItem("scroll"));
    if (!stored_scroll){
        stored_scroll = []
    }
    stored_scroll.push("User scrolled on Page " + window.location.pathname.split('/').pop());
    localStorage.setItem("scroll", JSON.stringify(stored_scroll));
    //only record once in each page, otherwise the record will be messed up
    window.removeEventListener('scroll', scrollHandler);
}