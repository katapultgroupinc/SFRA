$(document).ready(function () {
    var katapultApiK = $('#katapultCredentials').data('katapult-apik');
    var katapultEnv = $('#katapultCredentials').data('katapult-env');
    var katapultConfig = {
        api_key: katapultApiK,
        environment: katapultEnv
    };

    !function(e,t){e.katapult=e.katapult||{};var n,i,r;i=!1,n=document.createElement("script"),n.type="text/javascript",n.async=!0,n.src=t.environment+"/"+"plugin/js/katapult.js",n.onload=n.onreadystatechange=function(){i||this.readyState&&"complete"!=this.readyState||(i=!0,e.katapult.setConfig(t.api_key))},r=document.getElementsByTagName("script")[0],r.parentNode.insertBefore(n,r);var s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("type","text/css"),s.setAttribute("href",t.environment+"/"+"plugin/css/katapult.css");var a=document.querySelector("head");a.insertBefore(s,a.firstChild)}(window, katapultConfig);
});
