from __future__ import annotations
from jaclang import *
import typing
if typing.TYPE_CHECKING:
    from mtllm.llms import Groq
else:
    Groq, = jac_import('mtllm.llms', 'py', items={'Groq': None})
groq = Groq()

def generate_groq_response(user_message: str) -> str:
    return Jac.with_llm(file_loc=__file__, model=groq, model_params={}, scope='multi_model_chat(Module).generate_groq_response(Ability)', incl_info=[], excl_info=[], inputs=[(None, str, 'user_message', user_message)], outputs=('AI response', 'str'), action='Generate a response using Groq', _globals=globals(), _locals=locals())

class multi_model_chat(Walker):
    context: str = field('')
    user_message: str = field('')
    ai_response: str = field('')
    model_choice: str = field('')
    exit_count: int = field(0)
    entry_count: int = field(0)
    visited_nodes: list = field(gen=lambda: JacList([]))

    @with_entry
    def traverse(self, here: Root) -> None:
        self.visit(here.refs().filter(choose_model, None))

    @with_entry
    def choose_model(self, here) -> None:
        self.entry_count += 1
        print('Please pick a model to begin.')
        model_choice = print('Choose a model (openai/groq/anthropic/together/ollama/huggingface): ')
        self.visit(here.refs().filter(handle_conversation, None))

    @with_entry
    def handle_conversation(self, here: model_choice) -> None:
        user_message = print('User: ')
        context += 'User: ' + user_message + '\n'
        if model_choice == 'groq':
            print(ai_response=generate_groq_response(context))
        else:
            print(ai_response='Invalid model choice. Please choose openai, groq, anthropic, together, ollama, or huggingface.')
        print('AI: ' + ai_response)
        context += 'AI: ' + ai_response + '\n'
        self.visit(here.refs().filter(choose_model, None))
wlk_obj = root.spawn(multi_model_chat())
print(wlk_obj, 'Welcome to the AI Chat Network!')