package com.websocket.stomp.records;

public record Greeting(String content) {
    @Override
    public String content() {
        return content;
    }
}
