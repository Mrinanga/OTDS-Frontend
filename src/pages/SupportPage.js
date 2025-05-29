import React, { useState } from 'react';
import '../styles/SupportTickets.css';

const mockTickets = [
  {
    id: 1,
    customer: 'Ankur Sharma',
    email: 'ankur@example.com',
    subject: 'Unable to generate invoice',
    status: 'Open',
    date: '2025-05-14',
    replies: [
      { from: 'Customer', text: 'I am facing issues while generating invoice.', date: '2025-05-14' },
    ],
  },
  {
    id: 2,
    customer: 'Priya Verma',
    email: 'priya@example.com',
    subject: 'Delivery zone not showing',
    status: 'In Progress',
    date: '2025-05-13',
    replies: [
      { from: 'Customer', text: 'Zone list is empty while booking courier.', date: '2025-05-13' },
      { from: 'Admin', text: 'We’re checking into this. Will update you soon.', date: '2025-05-13' },
    ],
  },
];

const SupportTickets = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const sendReply = () => {
    if (!replyText.trim()) return;

    const updated = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            replies: [
              ...ticket.replies,
              {
                from: 'Admin',
                text: replyText.trim(),
                date: new Date().toISOString().slice(0, 10),
              },
            ],
          }
        : ticket
    );
    setTickets(updated);
    setSelectedTicket({ ...selectedTicket, replies: [...selectedTicket.replies, { from: 'Admin', text: replyText.trim(), date: new Date().toISOString().slice(0, 10) }] });
    setReplyText('');
  };

  return (
    <div className="support-page">
      <aside className="ticket-sidebar">
        <h2>Tickets</h2>
        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={selectedTicket?.id === ticket.id ? 'active' : ''}
            >
              <div className="ticket-title">{ticket.subject}</div>
              <div className="ticket-meta">
                <span>{ticket.customer}</span>
                <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="ticket-detail">
        {selectedTicket ? (
          <>
            <div className="ticket-header">
              <h3>{selectedTicket.subject}</h3>
              <span className={`status-badge ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}>{selectedTicket.status}</span>
            </div>

            <div className="chat-window">
              {selectedTicket.replies.map((reply, i) => (
                <div key={i} className={`message ${reply.from === 'Admin' ? 'admin' : 'customer'}`}>
                  <div className="bubble">
                    <div className="meta">
                      <strong>{reply.from}</strong> <span>{reply.date}</span>
                    </div>
                    <p>{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reply-box">
              <textarea
                rows="2"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button onClick={sendReply}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-ticket">Select a ticket to reply</div>
        )}
      </main>
    </div>
  );
};

export default SupportTickets;
