jQuery(function ($) {
    var socket = io.connect();
    var $messageForm = $("#send-message");
    var $messageBox = $("#message");
    var $chat = $("#chat");

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit("sendMessage", $messageBox.val());
        $messageBox.val("");
    });

    socket.on("newMessage", function (data) {
        $chat.append(data);
        $chat.append("<br/>");
    });

    socket.on('heartbeat', function (data) {
        console.log("heartbeat", data);
        document.getElementById("heartbeat").innerHTML = JSON.stringify(data);
    });

});