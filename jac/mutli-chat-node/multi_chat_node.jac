# jac/multi-chat-node/multi_chat_node.jac

node MultiChatNode {
    has value: int;

    can log_entry with entry {
        print(f">>> Someone entered the node: ", self);
    }
    can log_ai_walker
}

with entry {
    # Multiple nodes connect to a single node: many to one.
    first_tier = [MultiChatNode() for i in range(2)];
    second_node = MultiChatNode();
    root ++> first_tier;
    first_tier ++> second_node;
}