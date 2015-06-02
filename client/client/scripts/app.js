var app = {

  server: 'http://127.0.0.1:3000/classes/messages',
  username: 'Anony Mouse',
  rooms : [],
  friends: [],

  init: function() {
    this.username = this.getQueryVariable('username');
    setInterval (this.fetch.bind(this), 1000);
  },


  send: function(message) {
    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  updateMessages: function ( messages ) {
    var app = this;
    $('.message').remove();
    _.each (messages, function (message) {
      // this message
      var user = app.validate(message.username);
      var text = app.validate(message.message);
      var room = app.validate(message.roomname);

      if (room !== "" && app.rooms.indexOf(room) === -1) {
        app.addRoom(room);
      }
      // selected room
      var selectedRoom = $('#rooms').find('.selected')[0];
      if (selectedRoom !== undefined) {
        selectedRoom = selectedRoom.innerHTML;
      }

      // if we have a valid user and text string
      if ( user !== "" && text !== "") {
        var chatMessage = $('<p class="message">' + '<a href="#" class="username">' + user  + '</a>' + ':' +  '<br>' + text +'</p>');
        if ( app.friends.indexOf(user) !== -1 ) {
          chatMessage.addClass('friendMessage');
        } else if ( room === app.username){
          chatMessage.addClass('private');
        }
        if (selectedRoom === "Lobby" ) {
          $('#main').prepend(chatMessage);
        } else if (selectedRoom !== undefined || room === app.username) {
          // if the current message is to the selected room
          if (room === selectedRoom) {
            $('#main').prepend(chatMessage);
          }
        }
        $('#main').scrollTop($('#main')[0].scrollHeight);
      }
    });
    $('.username').on("click",  function (event) {
      event.preventDefault();
      var friend = $(this).text();
      if ( app.friends.indexOf(friend) === -1 ) {
        app.friends.push(friend);
        var thisFriend = $('<p class="friend">' + friend + '</p>');
        $('#friendsList').append(thisFriend);
      }
    });
    $('.friend').on("click",  function (event) {
      event.preventDefault();
      $('#inputRoomName').val(this.innerHTML);
      $('.friend').removeClass('selected');
      $(this).addClass('selected');
    });
  },

  fetch: function( ) {
    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        data = JSON.parse(data);
        app.updateMessages( data.results);
        //console.log('chatterbox: Messages fetched');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  validate: function( string ) {
    if ( string === undefined  || string === null) {
      return "";
    }
    if ( string.match(/[|&;$%@"<>()+,]/g, "") || string === "") {
    return "";
    }
  return string;
  },

  clearMessages: function () {
    $('.message').remove();
  },

  addMessage: function (message, roomname) {
    var postThis = {};
    postThis.username = this.username;
    postThis.message = message;
    postThis.roomname = roomname;
    app.send(postThis);
  },

  addRoom: function ( roomname ) {
    var addNewRoom = roomname;
    if ( app.rooms.indexOf(addNewRoom) === -1 ) {
      app.rooms.push(addNewRoom);
      var roomOption = $('<option value='+addNewRoom+'>'+addNewRoom+'</option>');
      $('#chatBox select').append(roomOption);
      var newRoom = $('<p class="room">' + addNewRoom + '</p>');
      $('#rooms').append(newRoom);
      $('.room').on("click",  function (event) {
        event.preventDefault();
        $('.room').removeClass('selected');
        $(this).addClass('selected');
      });
    }
  },

  getQueryVariable: function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] === variable){return pair[1];}
    }
    return(false);
  }

};

$(document).ready(function () {

  $('#submitButtonRoom').on("click",  function (event) {
    event.preventDefault();
    var addNewRoom = $('#inputRoom').val();
    app.addRoom(addNewRoom);
  });

  $('.room').on("click",  function (event) {
    event.preventDefault();
    $('.room').removeClass('selectedRoom');
    $(this).addClass('selectedRoom');
  });

  $('#chatControls').submit(function(e){
    e.preventDefault();
    return false;
  });
  $('#inputMessage').on("keyup", function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      var message = $('#inputMessage').val();
      var roomname = $('#inputRoomName').val();
      app.addMessage(message, roomname);
      $('#inputMessage').val('');
      $('#inputRoomName').val('');
    }
  });

  app.init();

});

