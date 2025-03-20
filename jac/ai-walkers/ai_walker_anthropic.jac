# src/jac/multi_model_chat.jac

import:py from mtllm.llms, Groq;
#*import:py from mtllm.llms, OpenAI;
import:py from mtllm.llms, Anthropic;
import:py from mtllm.llms, Together;
import:py from mtllm.llms, Ollama;
import:py from mtllm.llms, Huggingface;*#

glob groq = Groq();
#*glob openai = OpenAI();
glob anthropic = Anthropic();
glob together = Together();
glob ollama = Ollama();
glob huggingface = Huggingface();*#

can 'Generate a response using Groq'
generate_groq_response(user_message: str) -> 'AI response': str by groq();

#*can 'Generate a response using OpenAI'
generate_openai_response(user_message: str) -> 'AI response': str by openai();

can 'Generate a response using Anthropic'
generate_anthropic_response(user_message: str) -> 'AI response': str by anthropic();

can 'Generate a response using Together'
generate_together_response(user_message: str) -> 'AI response': str by together();

can 'Generate a response using Ollama'
generate_ollama_response(user_message: str) -> 'AI response': str by ollama();

can 'Generate a response using Huggingface'
generate_huggingface_response(user_message: str) -> 'AI response': str by huggingface();*#

walker multi_model_chat {
    has context: str = "";
    has user_message: str = "";
    has ai_response: str = "";
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

        if (model_choice == "groq") {
            print(ai_response = generate_groq_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }
        
        #*if (model_choice == "openai") {
            print(ai_response = generate_openai_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }
        
        if (model_choice == "anthropic") {
            print(ai_response = generate_anthropic_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }
        
        if (model_choice == "together") {
            print(ai_response = generate_together_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }
        
        if (model_choice == "ollama") {
            print(ai_response = generate_ollama_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }
        
        if (model_choice == "huggingface") {
            print(ai_response = generate_huggingface_response(context));
        } else {
            print(ai_response = "Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.");
        }*#

        print("AI: " + ai_response);
        context += "AI: " + ai_response + "\n";
        visit [-->] (`?choose_model);
    }
}

with entry {
    wlk_obj = root spawn multi_model_chat();
    print(wlk_obj,"Welcome to the AI Chat Network!");
}