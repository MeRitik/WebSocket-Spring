package com.websocket.stomp.records;

public record Message(String content) {
    @Override
    public String content() {
        return content;
    }
}
