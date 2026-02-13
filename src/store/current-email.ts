import { atom, map } from "nanostores";
import { persistentAtom, persistentMap } from "@nanostores/persistent";

export type MobileView = 'list' | 'viewer';
export const mobileView = atom<MobileView>('list');
export const setMobileView = (view: MobileView) => mobileView.set(view);
export const pendingMobileNav = atom(false);

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
  lastUsed: number;
}
export const arrEmails = persistentAtom<Array<PersisEmail>>("arrEmail", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const setCurrentEmail = (props: Email) => {
  currentEmail.set(props);
};

export const removeRecentEmail = (email: string) => {
  const before = arrEmails.get();
  arrEmails.set(before.filter((item) => item.email !== email));
};

export const getEmails = async (email: string) => {
  if (!email) {
    arr.set([]);
    return;
  }

  const response: Email[] = await fetch(`/api/email.json?email=${email}@restmail.net`).then(
    (res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    }
  );

  const before = arrEmails.get();
  const current = before.find((item) => item.email === email);

  if (current) {
    current.weight++;
    current.lastUsed = Date.now();
    arrEmails.set([...before]);
  } else {
    arrEmails.set([...before, { email, weight: 0, lastUsed: Date.now() }]);
  }

  arr.set(response);
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
