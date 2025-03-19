package com.websocket.stomp.controller;

import com.websocket.stomp.records.Greeting;
import com.websocket.stomp.records.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.util.HtmlUtils;

@Controller
public class MessageController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting sendMessage(Message message) {
        Logger log = LoggerFactory.getLogger(MessageController.class);
//        log.info(message + " " + message.content());
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.content()) + "!");
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
