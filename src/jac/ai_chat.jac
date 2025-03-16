# src/jac/ai_chat.jac
walker ai_introduction {
    has introduction = "I am an AI model ready to chat!";
    has response;

    root {
        std.out(introduction);
        take --> node::handle_response;
    }

    handle_response {
        response = std.input("User: ");
        if (response == "Hello") {
            std.out("AI: Hello! How can I assist you?");
        } else {
            std.out("AI: I'm not sure how to respond to that. Can you try again?");
        }
    }
}