# jac/ai-walkers/ai_walker_together.jac

import:py from mtllm.llms, Together;

node enter_model {
    has entered: bool;

    can log_entry with entry {
        print(f">>> Together Walker entered the node: ", self);
    } 
}

edge start_conversation {
    has message: str;
}

node handle_conversation {

}

node exit_model {
    has exited: bool;

    can log_exit with exit {
        print(f">>> Together Walker exited the node: ", self);
    } 
}

edge end_conversation {
    has message: str;
}

node leave_conversation {

}

glob together = Together();

obj AgentTogether {
    has introduction: str;
    has name: str;

    """Validates and processes agent data after initialization"""
    can post_init(self) -> None{
        self.name = self.name.lower();
        self.introduction = self.introduction.lower();
    }

    can handle_conversation(context: str) -> 'Conversation': str by together();
    can generate_together_message(ai_message: str) -> 'AI message': str by together();
    can generate_together_response(ai_response: str) -> 'AI response': str by together();
    can leave_conversation(self) -> None{
        visit [-->] (`?leave_conversation);
    };
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

    can log_entry with enter_model entry {
        print("Entering at the beginning of walker: ", here);
        self.entry_count += 1;
    }

    can enter_model with entry {
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
        visit [-->] (`?leave_conversation);
    }

    can log_exit with exit {
        print("Exiting at the end of walker: ",here);
        self.exit_count += 1;
    }

    can log_visit with exit_model exit {
        print("Visiting node: ", here);
        self.visited_nodes.append(here);
    }

    can exit_model with exit {
        print("Hello I am AI agent Together, I am ready for you conversation.");
        visit [-->] (`?exit_model);
    }
}

with entry {
    agent = AgentTogether(
        introduction = "Hello I am AI Agent Together. ", 
        name = "Together"
    );
    ai_wlk_obj = root spawn ai_walker_together();
    print(ai_wlk_obj,"Welcome to the AI Chat Network!");
    enter_model +:start_conversation:message='Starting conversation':+> handle_conversation; # uni directional edge to start conversation
    exit_model +:end_conversation:message='Ending conversation':+> leave_conversation; # uni directional edge to end conversation
}