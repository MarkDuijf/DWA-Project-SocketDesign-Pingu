# Socket Designer
Socket designer is an online tool for making websocket connections by using YAML code.

This project should be finished in the week of January 11.

# Features
* An easy to use YAML code editor.
* Creates basic socket.io  for setting up a websocket connection.

# Demo
[link]

# Usage
[Uitleg over wat de YAML code doet]

Enter YAML code, press generate, get server side and client side [Socket.IO](http://socket.io/) code. This Socket.IO code is the basic with which you can generate real time web applications.

# Getting started
[Hello World code]
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
