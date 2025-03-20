# jac/ai-walkers/ai_walker_together.jac

import:py from mtllm.llms, Together;

node multi_chat_node {

}

node enter_model {
    has value: int;

    can log_entry with entry {
        print(f">>> Together Walker entered the node: ", self);
    } 
}

glob together = Together();

obj Agent {
    has introduction: str;

    can handle_conversation()
    can generate_together_message(ai_message: str) -> 'AI message': str by together();
    can generate_together_response(ai_response: str) -> 'AI response': str by together();
}

walker ai_walker_together {
    has context: str = "";
    has ai_message: str = "";
    has ai_response: str = "";
    has exit_count: int = 0;
    has entry_count: int = 0;
    has visited_nodes: list = [];

    can traverse with `root entry {
        visit [-->] (`?enter_model);
    }

    can enter_model with entry {
        self.entry_count += 1;
        print("Hello I am AI agent Together, I am ready for you conversation.");
        visit [-->] (`?handle_conversation);
    }

    can handle_conversation with entry {
        ai_message = print("Together AI: ");
        context += "Together AI: " + ai_message + "\n";

        print(ai_message = generate_together_message(context));
        print(ai_response = generate_together_response(context));
        print("Together AI: " + ai_response);
        context += "Together AI: " + ai_response + "\n";
        visit [-->] (`?enter_model);
    }
}

with entry {
    introduction = "Hello I am Together AI,";
    introduction = Agent(introduction);
    ai_wlk_obj = root spawn ai_walker_together();
    print(ai_wlk_obj,"Welcome to the AI Chat Network!");
}