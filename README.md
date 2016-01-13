# Socket Designer
Socket designer is an online tool for making websocket connections by using **YAML** code.
A group of 5 developers has worked on this for 8 to 9 weeks. This project will probably be continued by another group of developers.

# Features
* An easy to use YAML code editor.
* Creates basic server and cliend side socket.io code for setting up a **realtime** websocket connection.

# Demo
[Link to our website](http://server3.tezzt.nl:13000)

# Usage
Enter YAML code, press generate, get server side and client side [Socket.IO](http://socket.io/) code. This Socket.IO code is the basic with which you can generate real time web applications.

# Getting started
Underneath is an example of YAML code you can put in the generator. It is important to use this syntax to be sure the conversion works properly.

```YAML
info:
  title: Hello Chat
  port: 8000

client:
  message1:
    parameters:
      messageName: globalMessage
      description: sends a message to all users
      data:
    serverResponse:
      to: all
      parameters:
        messageName: globalServerMessage
        data:
        description: response message to everyone

  message2:
    parameters:
      messageName: clientMessage
      description: sends a message to a specific person
      data:
    serverResponse:
      to: client
      clientname:
      parameters:
        messageName: clientServerMessage
        data:
        description: response message to a specific client
```
