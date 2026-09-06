export const seedKnowledgeBase = [
  {
    id:'kb-refund-window', title:'Refunds & Returns Policy', collection:'Policies', section:'Refund eligibility', updated:'2026-08-24', owner:'CX Operations', status:'Published',
    excerpt:'Orders can be refunded within 14 days of delivery when the item is unused or materially different from the listing. Digital services are not automatically refundable once fulfilled.',
    body:'Orders can be refunded within 14 days of delivery when the item is unused or materially different from the listing. Damaged items are eligible after verification. Digital services are not automatically refundable once fulfilled. Agents should document the reason and verification method before issuing a refund.',
    tags:['refund','returns','eligibility','damaged']
  },
  {
    id:'kb-delivery-delay', title:'Delayed Delivery Playbook', collection:'Playbooks', section:'Agent resolution matrix', updated:'2026-08-29', owner:'Logistics Ops', status:'Published',
    excerpt:'For delivery delays over 48 hours beyond the promised window, agents may offer expedited replacement or a shipping-fee credit. Full refunds require cancellation or confirmed loss.',
    body:'For delivery delays over 48 hours beyond the promised window, agents may offer expedited replacement or a shipping-fee credit. If a replacement has also failed, escalate to service recovery. Full refunds require cancellation or confirmed loss. Keep the customer informed with a concrete next checkpoint.',
    tags:['delivery','delay','shipping','replacement']
  },
  {
    id:'kb-chargeback', title:'Billing Disputes & Chargebacks', collection:'Policies', section:'Before a dispute is filed', updated:'2026-08-18', owner:'Finance Support', status:'Published',
    excerpt:'When a customer disputes a charge, acknowledge the concern, summarize the transaction, pause avoidable collection activity and offer the fastest eligible review path.',
    body:'When a customer disputes a charge, acknowledge the concern and summarize the disputed transaction. If a contractual mismatch is alleged, flag the line for finance review and avoid stating that either side is correct until the contract is verified. Pause avoidable collection activity on the disputed amount where operationally supported.',
    tags:['chargeback','payment','dispute','invoice','billing']
  },
  {
    id:'kb-subscription', title:'Subscription & Renewal Terms', collection:'Policies', section:'Renewals and grace period', updated:'2026-08-31', owner:'Billing Ops', status:'Published',
    excerpt:'Annual plans renew automatically unless cancelled before the renewal date. A 72-hour goodwill reversal may be offered once when the customer has not used paid features after renewal.',
    body:'Annual plans renew automatically unless cancelled before the renewal date. A one-time 72-hour goodwill reversal may be offered when the customer has not used paid features after renewal. Agents must verify post-renewal paid usage before promising or processing the reversal.',
    tags:['subscription','renewal','cancel','refund','billing']
  },
  {
    id:'kb-address-change', title:'Shipping Address Changes', collection:'Playbooks', section:'Order already dispatched', updated:'2026-08-20', owner:'Logistics Ops', status:'Published',
    excerpt:'Addresses cannot be edited after carrier handoff. Agents should attempt carrier rerouting where supported and warn that rerouting can add 1–2 business days.',
    body:'Addresses cannot be edited after carrier handoff. Agents should attempt carrier rerouting or hold-at-location where supported. Explain that rerouting may add 1–2 business days and keep the ticket open until the carrier confirms the next delivery plan.',
    tags:['address','shipping','carrier','reroute']
  },
  {
    id:'kb-vip', title:'Priority Customer Care', collection:'Playbooks', section:'Service recovery', updated:'2026-09-01', owner:'CX Leadership', status:'Published',
    excerpt:'Priority customers with two or more service failures in 90 days may receive a one-time goodwill credit up to ₦15,000 after the agent confirms the failures in account history.',
    body:'Priority customers with two or more verified service failures in 90 days may receive a one-time goodwill credit up to ₦15,000. The agent should pair the credit with a concrete operational resolution rather than use the credit as a substitute for fixing the underlying issue.',
    tags:['vip','credit','service recovery','priority']
  },
  {
    id:'kb-account-access', title:'Account Access Recovery', collection:'Playbooks', section:'Identity & login recovery', updated:'2026-08-27', owner:'Trust & Safety', status:'Published',
    excerpt:'For login recovery, verify the account email and one secondary account fact before changing recovery details. Never request passwords or full payment card numbers.',
    body:'For login recovery, verify the account email and one secondary account fact before changing recovery details. If the customer no longer controls the email address, escalate to manual identity review. Never request passwords, one-time codes from unrelated services or full payment card numbers.',
    tags:['account','login','access','identity','password']
  },
  {
    id:'kb-cancel-order', title:'Order Cancellation Rules', collection:'Policies', section:'Cancellation after placement', updated:'2026-09-02', owner:'Order Operations', status:'Published',
    excerpt:'Orders may be cancelled before fulfilment begins. After fulfilment starts, agents should check merchant or warehouse status before promising cancellation or refund.',
    body:'Orders may be cancelled before fulfilment begins. After fulfilment starts, cancellation depends on merchant or warehouse status. Agents should check current fulfilment state before promising a refund and explain any non-refundable fulfilment cost if applicable.',
    tags:['cancel','order','fulfilment','refund']
  }
];

export const seedCustomers = {
  c1:{id:'c1',name:'Adaeze Okafor',initials:'AO',email:'adaeze.okafor@example.com',phone:'+234 803 555 0148',plan:'Priority',since:'Mar 2024',lifetimeValue:684200,satisfaction:4.8,health:'Healthy',company:'—',location:'Lagos, NG',tags:['Priority','High LTV'],notes:'Prefers clear timelines and concrete next steps.',history:[
    {date:'2026-08-11',label:'Replacement approved',note:'Damaged blender replaced after photo verification.'},{date:'2026-07-02',label:'Delivery credit',note:'₦6,000 shipping credit issued after a 3-day delay.'},{date:'2026-05-19',label:'Order completed',note:'Home office bundle · ₦146,500.'}
  ]},
  c2:{id:'c2',name:'Tobi Akinwale',initials:'TA',email:'tobi.akinwale@example.com',phone:'+234 809 440 1220',plan:'Standard',since:'Jan 2026',lifetimeValue:131800,satisfaction:4.2,health:'Watch',company:'Akinwale Studio',location:'Abuja, NG',tags:['Standard'],notes:'Annual subscription. No verified post-renewal activity is available in this workspace.',history:[
    {date:'2026-08-30',label:'Annual renewal',note:'Workspaces Pro renewed for ₦96,000.'},{date:'2026-01-14',label:'Account created',note:'Started on monthly Workspaces plan.'}
  ]},
  c3:{id:'c3',name:'Mariam Bello',initials:'MB',email:'mariam.bello@example.com',phone:'+234 805 991 7204',plan:'Standard',since:'Nov 2025',lifetimeValue:221400,satisfaction:3.9,health:'At risk',company:'—',location:'Lagos, NG',tags:['At risk'],notes:'Two recent delivery issues. Use proactive updates.',history:[
    {date:'2026-08-27',label:'Address correction requested',note:'Request arrived after dispatch; carrier reroute attempted.'},{date:'2026-06-15',label:'Late delivery',note:'Order arrived 2 days after promise window.'}
  ]},
  c4:{id:'c4',name:'Kelechi Nwosu',initials:'KN',email:'kelechi.nwosu@example.com',phone:'+234 802 880 3331',plan:'Business',since:'Sep 2023',lifetimeValue:1284000,satisfaction:4.9,health:'Healthy',company:'Northstar Advisory',location:'Lagos, NG',tags:['Business','VIP'],notes:'Finance team requires written billing references.',history:[
    {date:'2026-08-04',label:'Billing issue resolved',note:'Duplicate invoice corrected within 32 minutes.'},{date:'2026-06-18',label:'Priority replacement',note:'Courier replacement arranged same day.'},{date:'2026-04-09',label:'Service credit',note:'₦10,000 goodwill credit after repeated dispatch failure.'}
  ]},
  c5:{id:'c5',name:'Zainab Yusuf',initials:'ZY',email:'zainab.yusuf@example.com',phone:'+234 806 331 7742',plan:'Plus',since:'Feb 2025',lifetimeValue:348700,satisfaction:4.6,health:'Healthy',company:'Morrow & Co.',location:'Kano, NG',tags:['Plus'],notes:'Often contacts support through chat.',history:[
    {date:'2026-08-19',label:'Password reset',note:'Completed through verified email.'},{date:'2026-07-06',label:'Plan upgraded',note:'Moved from Standard to Plus.'}
  ]},
  c6:{id:'c6',name:'Femi Balogun',initials:'FB',email:'femi.balogun@example.com',phone:'+234 811 522 6010',plan:'Standard',since:'Jul 2026',lifetimeValue:76400,satisfaction:4.1,health:'Watch',company:'—',location:'Ibadan, NG',tags:['New customer'],notes:'First fulfilment issue on record.',history:[{date:'2026-07-18',label:'Account created',note:'Standard monthly plan activated.'}]}
};

export const seedTickets = [
  {id:'TKT-1842',customerId:'c1',subject:'My replacement order is late again',channel:'Email',priority:'Urgent',status:'Open',state:'ready',assignee:'Marvellous O.',updatedAt:'2 min ago',createdAt:'2026-09-06T16:02:00Z',sentiment:'Frustrated',category:'Delivery',tags:['repeat failure','replacement'],summary:'Priority customer reports a second delivery failure within 30 days and wants a concrete resolution today.',messages:[
    {id:'m1',from:'customer',time:'4:02 PM',text:'Hi, the replacement blender was supposed to arrive yesterday and tracking has not moved since Friday. This is the second delivery issue I have had in a month. I need this sorted today please.'},
    {id:'m2',from:'agent',time:'4:05 PM',text:'Thanks for flagging this, Adaeze. I am checking the shipment and your recent account history now.'},
    {id:'m3',from:'customer',time:'4:08 PM',text:'I appreciate that, but I really do not want another vague tracking update. Can you either get it delivered or refund me?'}],
    draft:'Adaeze, I checked the replacement shipment and your recent support history. Because this is your second service failure within 90 days, I can offer two concrete options today: we can arrange an expedited replacement at no additional cost, or cancel this replacement and issue the eligible refund. I can also add a ₦10,000 goodwill credit to your account for the repeated disruption. Reply with the option you prefer and I’ll process it immediately.',confidence:93,rationale:['Customer explicitly requested either delivery or refund.','Account history confirms multiple recent service failures.','Priority Customer Care allows a goodwill credit after verified repeat failures.'],sources:['kb-delivery-delay','kb-vip','kb-refund-window'],draftVersion:2,notes:[{id:'n1',author:'Marvellous O.',time:'4:06 PM',text:'Tracking has not moved for 72h. Customer qualifies for repeat-failure review.'}]},
  {id:'TKT-1839',customerId:'c2',subject:'I forgot to cancel before renewal',channel:'Chat',priority:'Normal',status:'Open',state:'low',assignee:'Marvellous O.',updatedAt:'8 min ago',createdAt:'2026-09-06T15:41:00Z',sentiment:'Concerned',category:'Billing',tags:['renewal','refund'],summary:'Customer wants a refund for an annual renewal that occurred yesterday. Usage after renewal is unclear.',messages:[
    {id:'m1',from:'customer',time:'3:41 PM',text:'My annual plan renewed yesterday and I meant to cancel. I have not intentionally used it since then. Can you reverse it?'},{id:'m2',from:'agent',time:'3:44 PM',text:'I can review the renewal and recent account activity for you.'}],draft:'Tobi, I can see the annual renewal happened yesterday. Our policy allows a one-time 72-hour goodwill reversal when paid features have not been used after renewal. I need to confirm your post-renewal activity before I can promise the refund. If no paid usage is recorded, I can process the reversal for you.',confidence:61,rationale:['Request is within the 72-hour goodwill window.','The policy requires confirming no paid-feature usage after renewal.','The available customer context does not confirm usage either way.'],sources:['kb-subscription'],draftVersion:1,notes:[]},
  {id:'TKT-1835',customerId:'c3',subject:'Package went to my old address',channel:'Email',priority:'High',status:'Open',state:'new',assignee:'Marvellous O.',updatedAt:'16 min ago',createdAt:'2026-09-06T15:16:00Z',sentiment:'Upset',category:'Delivery',tags:['address','carrier'],summary:'Customer says an address change was requested before delivery but after dispatch. Carrier delivery now shows attempted at the old address.',messages:[{id:'m1',from:'customer',time:'3:16 PM',text:'I messaged support to change the address and the package still went to the old one. The courier says delivery was attempted. What happens now?'},{id:'m2',from:'agent',time:'3:21 PM',text:'I’m checking the shipment timeline and the address-change request.'}],draft:'',confidence:null,rationale:[],sources:[],draftVersion:0,notes:[]},
  {id:'TKT-1827',customerId:'c4',subject:'Invoice charge does not match our contract',channel:'Email',priority:'High',status:'Pending',state:'edited',assignee:'Marvellous O.',updatedAt:'24 min ago',createdAt:'2026-09-06T14:53:00Z',sentiment:'Direct',category:'Billing',tags:['invoice','contract'],summary:'Business customer is disputing a ₦48,000 service line on the latest invoice and wants finance review before payment.',messages:[{id:'m1',from:'customer',time:'2:53 PM',text:'The new invoice includes a ₦48,000 handling line that is not in our signed pricing schedule. Please correct it before our finance team releases payment.'},{id:'m2',from:'agent',time:'3:01 PM',text:'I’m comparing the invoice with the account pricing notes now.'}],draft:'Kelechi, thanks for catching this. I’ve flagged the ₦48,000 handling line for billing review and paused collection activity on this invoice while we verify it against your contracted pricing. I’ll keep the ticket open until finance either removes the line or provides the supporting contract reference. You do not need to pay the disputed amount while the review is active.',confidence:78,rationale:['Customer identified a specific disputed invoice line.','Previous account history shows billing corrections have been handled manually.','The available knowledge does not confirm the exact contracted fee, so the draft avoids claiming the charge is definitely incorrect.'],sources:['kb-chargeback'],draftVersion:3,notes:[{id:'n1',author:'Marvellous O.',time:'3:03 PM',text:'Waiting for Finance Ops to confirm the signed pricing schedule.'}]},
  {id:'TKT-1821',customerId:'c5',subject:'I cannot sign in after changing my email',channel:'Chat',priority:'High',status:'Open',state:'new',assignee:'Daniel A.',updatedAt:'32 min ago',createdAt:'2026-09-06T14:30:00Z',sentiment:'Anxious',category:'Account',tags:['login','email change'],summary:'Customer changed account email and can no longer complete sign-in. Needs recovery steps without weakening account security.',messages:[{id:'m1',from:'customer',time:'2:30 PM',text:'I changed my email last week and now the login link keeps going to the old address. I need access for work today.'}],draft:'',confidence:null,rationale:[],sources:[],draftVersion:0,notes:[]},
  {id:'TKT-1819',customerId:'c6',subject:'Can I cancel this order before it ships?',channel:'Email',priority:'Normal',status:'Open',state:'ready',assignee:'Marvellous O.',updatedAt:'41 min ago',createdAt:'2026-09-06T14:18:00Z',sentiment:'Neutral',category:'Orders',tags:['cancellation'],summary:'Customer wants to cancel a newly placed order. Fulfilment status has not been confirmed yet.',messages:[{id:'m1',from:'customer',time:'2:18 PM',text:'I placed order #RLY-7712 about 20 minutes ago by mistake. Can you cancel it before it ships?'}],draft:'Femi, I can help with that. Orders can usually be cancelled before fulfilment begins, but I need to confirm the current warehouse status before I promise the cancellation. I’m checking order #RLY-7712 now. If fulfilment has not started, I’ll cancel it and confirm the refund path; if it has started, I’ll explain the next available option.',confidence:82,rationale:['The cancellation request was made shortly after placement.','Policy requires checking fulfilment status before promising cancellation.','The draft avoids guaranteeing a refund until warehouse status is known.'],sources:['kb-cancel-order'],draftVersion:1,notes:[]},
  {id:'TKT-1814',customerId:'c1',subject:'Refund for damaged item',channel:'Chat',priority:'Normal',status:'Resolved',state:'approved',assignee:'Marvellous O.',updatedAt:'1 hr ago',createdAt:'2026-09-06T13:12:00Z',sentiment:'Neutral',category:'Returns',tags:['damaged','refund'],summary:'Damaged accessory refund approved after verification.',messages:[{id:'m1',from:'customer',time:'1:12 PM',text:'The accessory arrived cracked. I uploaded the photo in the chat.'},{id:'m2',from:'agent',time:'1:18 PM',text:'Thanks, I verified the photo and have approved the refund. You’ll receive a confirmation shortly.'}],draft:'Thanks for sending the photo, Adaeze. I verified the damage and approved the refund under our returns policy. You’ll receive a confirmation shortly.',confidence:97,rationale:['Damage was verified by the agent.','Refund policy supports materially defective deliveries.'],sources:['kb-refund-window'],draftVersion:1,notes:[]},
  {id:'TKT-1808',customerId:'c5',subject:'Where can I download last month’s invoice?',channel:'Email',priority:'Normal',status:'Resolved',state:'approved',assignee:'Daniel A.',updatedAt:'2 hr ago',createdAt:'2026-09-06T12:06:00Z',sentiment:'Neutral',category:'Billing',tags:['invoice'],summary:'Customer needed help locating a previous invoice.',messages:[{id:'m1',from:'customer',time:'12:06 PM',text:'Can you point me to the invoice from August? I need it for reimbursement.'},{id:'m2',from:'agent',time:'12:11 PM',text:'You can download it from Billing → Invoices. I’ve also attached the August invoice to this conversation.'}],draft:'',confidence:95,rationale:[],sources:[],draftVersion:1,notes:[]}
];

export const seedTeam = [
  {id:'a1',name:'Marvellous O.',initials:'MO',role:'Support Lead',status:'Online',email:'marvellous@relay.support',tickets:5,csat:4.8},
  {id:'a2',name:'Daniel A.',initials:'DA',role:'Support Specialist',status:'Online',email:'daniel@relay.support',tickets:2,csat:4.7},
  {id:'a3',name:'Imani C.',initials:'IC',role:'Billing Specialist',status:'Away',email:'imani@relay.support',tickets:0,csat:4.9}
];

export const seedSettings = {
  reviewThreshold:70,
  requireReview:true,
  defaultTone:'Clear & warm',
  defaultLength:'Balanced',
  signature:'Marvellous\nCustomer Support',
  autoSummary:true,
  retrievalLimit:3,
  showRationale:true,
  businessHours:'09:00–18:00 WAT',
  defaultAssignee:'Marvellous O.',
  showSlaNotifications:true,
  showKnowledgeNotifications:true
};

export const seedNotifications = [
  {id:'nt1',type:'mention',title:'Imani mentioned you',text:'Finance confirmed the handling line on TKT-1827 needs review.',time:'5 min ago',read:false,ticketId:'TKT-1827'},
  {id:'nt2',type:'sla',title:'SLA risk',text:'TKT-1842 has 18 minutes left on its first-resolution target.',time:'11 min ago',read:false,ticketId:'TKT-1842'},
  {id:'nt3',type:'knowledge',title:'Knowledge updated',text:'Subscription & Renewal Terms was updated by Billing Ops.',time:'38 min ago',read:true,knowledgeId:'kb-subscription'}
];
