# jac/ai-walkers/ai_walker_openai.jac

import:py from mtllm.llms, OpenAI;

node handle_conversation {

}

node enter_model {
    has value: int;

    can log_entry with entry {
        print(f">>> Together Walker entered the node: ", self);
    } 
}

glob openai = OpenAI();


obj AgentOpenAI {
    has introduction: str;
    has name: str;

    """Validates and processes agent data after initialization"""
    can post_init(self) -> None{
        self.name = self.name.lower();
        self.introduction = self.introduction.lower();
    }

    can handle_conversation(context: str) -> 'Conversation': str by openai();
    can generate_openai_message(ai_message: str) -> 'AI message': str by openai();
    can generate_openai_response(ai_message: str) -> 'AI response': str by openai();
}

walker ai_walker_openai {
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
        print("Hello I am AI agent OpenAI, I am ready for you conversation.");
        visit [-->] (`?handle_conversation);
    }

    can handle_conversation with entry {
        ai_message = print("OpenAI: ");
        context += "OpenAI: " + ai_message + "\n";

        print(ai_message = generate_openai_message(context));
        print(ai_response = generate_openai_response(context));
        print("OpenAI: " + ai_response);
        context += "OpenAI: " + ai_response + "\n";
        # visit [-->] (`?);
    }
}

with entry {
    agent = AgentOpenAI(
        introduction = "Hello I am AI Agent OpenAI. ", 
        name = "OpenAI"
    );
    ai_wlk_obj = root spawn ai_walker_openai();
    print(ai_wlk_obj,"Welcome to the AI Chat Network!");
}