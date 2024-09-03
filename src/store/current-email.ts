import { map } from 'nanostores';

const initState: Email = {
  from: [],
  subject: '',
  date: '',
  html: '',
  text: '',
  headers: {
    'dkim-signature': '',
    received: undefined,
    'content-type': '',
    date: '',
    from: '',
    'mime-version': '',
    'message-id': '',
    subject: '',
    to: ''
  },
  messageId: '',
  priority: '',
  to: [],
  receivedAt: ''
}

export const currentEmail = map<Email>(initState);
export const arr = map<Email[]>([]);

export const setCurrentEmail = (props: Email) => {
  currentEmail.set(props)
}

export const getEmails = async (email: string) => {
  const response: Email[] = await fetch(`/api/email?email=${email}`)
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json()
    })

  arr.set(response)
}

export interface Email {
  html: string
  text: string
  headers: Headers
  subject: string
  messageId: string
  priority: string
  from: From[]
  to: To[]
  date: string
  receivedAt: string
  receivedDate?: string
}

export interface Headers {
  "dkim-signature": string
  received: any
  "content-type": string
  date: string
  from: string
  "mime-version": string
  "message-id": string
  subject: string
  "x-sg-eid"?: string
  "x-sg-id"?: string
  to: string
  "x-entity-id"?: string
  "x-google-dkim-signature"?: string
  "x-gm-message-state"?: string
  "x-google-smtp-source"?: string
  "x-received"?: string
}

export interface From {
  address: string
  name: string
}

export interface To {
  address: string
  name: string
}
