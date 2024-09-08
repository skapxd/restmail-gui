import { map } from "nanostores";
import { persistentAtom, persistentMap } from "@nanostores/persistent";

const initState: Email = {
  from: [],
  subject: "",
  date: "",
  html: "",
  text: "",
  headers: {
    "dkim-signature": "",
    received: undefined,
    "content-type": "",
    date: "",
    from: "",
    "mime-version": "",
    "message-id": "",
    subject: "",
    to: "",
  },
  messageId: "",
  priority: "",
  to: [],
  receivedAt: "",
};

export const currentEmail = map<Email>(initState);
export const arr = map<Email[]>([]);

interface PersisEmail {
  email: string;
  weight: number;
}
export const arrEmails = persistentAtom<Array<PersisEmail>>("arrEmail", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const setCurrentEmail = (props: Email) => {
  currentEmail.set(props);
};

export const getEmails = async (email: string) => {
  // const _ = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/);
  if (!email) return;

  const response: Email[] = await fetch(`/api/email.json?email=${email}@restmail.net`).then(
    (res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    }
  );

  // TODO: en caso de que exista el email en la lista, incrementar el peso

  // TODO: en caso de que no exista el email en la lista, agregarlo
  const before = arrEmails.get();
  const current = before.find((item) => item.email === email) 

  if (current) {
    current.weight++;
    arrEmails.set([...before,]);
    return arr.set(response);
  } else {
    arrEmails.set([...before, { email, weight: 0 }]);
  }
};

export interface Email {
  html: string;
  text: string;
  headers: Headers;
  subject: string;
  messageId: string;
  priority: string;
  from: From[];
  to: To[];
  date: string;
  receivedAt: string;
  receivedDate?: string;
}

export interface Headers {
  "dkim-signature": string;
  received: any;
  "content-type": string;
  date: string;
  from: string;
  "mime-version": string;
  "message-id": string;
  subject: string;
  "x-sg-eid"?: string;
  "x-sg-id"?: string;
  to: string;
  "x-entity-id"?: string;
  "x-google-dkim-signature"?: string;
  "x-gm-message-state"?: string;
  "x-google-smtp-source"?: string;
  "x-received"?: string;
}

export interface From {
  address: string;
  name: string;
}

export interface To {
  address: string;
  name: string;
}
