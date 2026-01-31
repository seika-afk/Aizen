declare global {
  var chatStore: Record<string, any[]> | undefined;
}

export const chatStore =
  global.chatStore || (global.chatStore = {});


export function addChat(userId: string, message: any) {
  chatStore[userId] ||= [];
  chatStore[userId].push({ ...message, timestamp: Date.now() });
}

export function getChats(userId: string) {
  return chatStore[userId] || [];
}
