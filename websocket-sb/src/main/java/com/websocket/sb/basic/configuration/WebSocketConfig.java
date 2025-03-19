package com.websocket.sb.basic.configuration;

import com.websocket.sb.basic.handler.TutorialHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@EnableWebSocket
@Controller
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(tutorialHandler(), "/websocket")
                .setAllowedOrigins("*");
    }

    WebSocketHandler tutorialHandler(){
        return new TutorialHandler();
    }
}
