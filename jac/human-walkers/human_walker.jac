# jac/human-walkers/human_walker.jac

node handle_conversation {

}

obj HumanUserProfile {
    has introduction: str;
    has username: str;
    has email: str;

    """Validates and processes user data after initialization"""
    can post_init(self) -> None{
        self.username = self.username.lower();
        self.email = self.email.lower();
    }

    can handle_conversation()
    can generate_human_response(user_message: str) -> 'Human message': str by together();
}

walker human_walker {
    has context: str = "";
    has user_message: str = "";
    has model_choice: str = "";
    has exit_count: int = 0;
    has entry_count: int = 0;
    has visited_nodes: list = [];

    can traverse with `root entry {
        visit [-->] (`?choose_model);
    }

    can choose_model with entry {
        self.entry_count += 1;
        print("Please pick a model to begin.");
        model_choice = print("Choose a model (openai/groq/anthropic/together/ollama/huggingface): ");
        visit [-->] (`?handle_conversation);
    }

    can handle_conversation with model_choice entry {
        user_message = print("User: ");
        context += "User: " + user_message + "\n";
        
        if (model_choice == "together") {
            print(ai_response = generate_together_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }

        print("AI: " + ai_response);
        context += "AI: " + ai_response + "\n";
        visit [-->] (`?choose_model);
    }
}

with entry {
    user = HumanUserProfile(
        username = "", 
        email = ""
    );
    print(f"User: {user.username}, Email: {user.email}");
    hum_wlk_obj = root spawn human_walker();
    print(hum_wlk_obj,"Welcome to the AI Chat Network!");
}