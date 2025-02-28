import { ChatMessage, ContextChatEngine, OpenAI } from "llamaindex";
import { getIndexFromStore } from "./vector-index";

type Props = {
  chatHistory?: ChatMessage[];
};

export const getChatEngine = async ({ chatHistory }: Props): Promise<ContextChatEngine> => {
  const chatModel = new OpenAI({
    model: "gpt-4o",
    temperature: 0.1,
    maxTokens: 8000,  
    topP: 0.1,
  });

  const index = await getIndexFromStore();
  
  const retriever = index?.asRetriever({
    similarityTopK: 20,  
  });

  const chatEngine = new ContextChatEngine({ 
    retriever: retriever!,
    chatHistory,
    chatModel, 
  });

  return chatEngine;
};

