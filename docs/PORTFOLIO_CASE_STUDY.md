# Relay — Portfolio case study framing

## The problem

Support agents are expected to answer quickly, but a reliable answer often requires switching between the customer conversation, account history, policy documentation, logistics/billing context and internal notes. AI can shorten the writing step, but an opaque generated answer creates a new trust problem: the agent still has to determine whether it is grounded enough to send.

## The product idea

Relay makes the AI suggestion reviewable rather than autonomous.

The workspace brings together four things at the moment an agent needs to make a decision:

1. The complete customer conversation.
2. Customer/account context and history.
3. Retrieved support knowledge.
4. A generated response with confidence, rationale and explicit human approval.

## Core design principle

**AI proposes. The agent decides.**

A high-confidence response can be reviewed and sent quickly. A low-confidence response becomes visibly harder to approve and explains which fact is missing. The interface therefore treats uncertainty as part of the interaction design instead of hiding it behind a generic AI badge.

## Engineering decisions demonstrated

- Node.js API without framework dependencies
- Persistent local application state
- NDJSON response streaming
- Retrieval scoring over workspace knowledge
- Customer-history-aware generation
- Confidence thresholding
- Human-in-the-loop approval control
- Mutation APIs for tickets, customers, knowledge and settings
- Responsive task-based mobile behavior
- Command palette and keyboard navigation
- Accessible modal/sheet patterns and reduced-motion handling

## Useful screenshots for the portfolio

1. Inbox + high-confidence AI draft with three sources.
2. Low-confidence renewal ticket and explicit review warning.
3. Streaming generation on the address-change ticket.
4. Analytics page showing human review outcomes.
5. Knowledge library.
6. Mobile ticket view.

## Suggested case-study headline

**Relay makes AI useful in customer support by making its evidence, uncertainty and human approval part of the product—not an afterthought.**
