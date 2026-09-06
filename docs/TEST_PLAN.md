# Relay QA checklist

## Inbox
- [ ] Search narrows tickets by customer, subject, ticket ID and category.
- [ ] Open, Pending, Resolved and All queues return the correct tickets.
- [ ] Priority and AI-state filters work and can be cleared.
- [ ] Sort order changes between newest, oldest, priority and confidence.
- [ ] A new ticket can be created and appears in the inbox immediately.
- [ ] Status, priority and assignee changes persist after reload.

## Conversation
- [ ] Reply composer sends a message to the conversation.
- [ ] Send & resolve sends the message and resolves the ticket.
- [ ] Internal notes appear separately from customer-visible replies.
- [ ] AI draft can be inserted into the reply composer.

## Copilot
- [ ] A ticket with no draft shows Generate response.
- [ ] Generation streams status, sources and draft text.
- [ ] Tone and length controls affect the next generation.
- [ ] Low-confidence ticket shows warning state.
- [ ] Draft edits can be saved.
- [ ] Reject opens a reason flow and does not send a message.
- [ ] Low-confidence approval cannot send until the review checkbox is confirmed.
- [ ] Approved response appears as a new agent message.
- [ ] Sources can expand and open the related knowledge article.

## Customers
- [ ] Full profile opens from the ticket sidebar.
- [ ] Customer details, notes and tags can be edited.
- [ ] Customer directory search works.
- [ ] Customer changes persist after reload.

## Knowledge
- [ ] Search and collection filters work.
- [ ] Existing articles open in the side sheet.
- [ ] New article can be published.
- [ ] Article can be edited.
- [ ] New/edited content persists after reload.

## Analytics
- [ ] Metrics load from the API.
- [ ] Recent actions appear in workspace activity.
- [ ] Ticket activity links open the relevant ticket.

## Workspace
- [ ] Notification center shows unread state.
- [ ] Mark all read clears unread indicator.
- [ ] Notification links open the associated ticket/article.
- [ ] Command palette opens with Ctrl/Cmd + K.
- [ ] Command search finds tickets, customers and knowledge.
- [ ] Settings persist after reload.
- [ ] Reset data restores the original seed workspace.

## Responsive
- [ ] Desktop keeps inbox, conversation, copilot and customer context readable.
- [ ] Tablet hides the customer sidebar before compressing the conversation.
- [ ] Mobile opens a ticket as a full-screen task view.
- [ ] Mobile back returns to the inbox.
- [ ] Bottom navigation remains reachable without covering primary actions.
